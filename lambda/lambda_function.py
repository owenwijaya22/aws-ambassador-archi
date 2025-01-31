import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from datetime import datetime
from boto3.dynamodb.conditions import Key

# let's initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb_table = dynamodb.Table('VisitorCounter')

# API endpoints
counter = '/counter'
visit_trends = '/trends'
add_data = '/mock'

def lambda_handler(event, context):
    response = None
    try:
        http_method = event.get('httpMethod')
        path = event.get('path')
        
        if http_method == 'GET' and path == counter:
            response = get_counter()
        elif http_method == 'POST' and path == counter:
            response = increment_counter()
        elif http_method == 'GET' and path == visit_trends:
            response = get_visit_trends()
        elif http_method == 'POST' and path == add_data:
            return add_mock_data(event)
        else:
            response = build_response(404, {'message': '404 Not Found'})
    except Exception as e:
        response = build_response(400, {'message': str(e)})
   
    return response

def get_counter():
    try:
        # Get today's date
        today_date = datetime.utcnow().strftime('%Y-%m-%d')

        # Get total visits
        response = dynamodb_table.get_item(Key={'pageId': "total"})
        total_visits = response.get('Item', {}).get('visits', 0)

        # Get today's visits
        response = dynamodb_table.get_item(Key={'pageId': today_date})
        today_visits = response.get('Item', {}).get('visits', 0)

        return build_response(200, {
            'total_visits': total_visits,
            'today_visits': today_visits
        })

    except ClientError as e:
        print('Error:', e)
        return build_response(400, {'message': e.response['Error']['Message']})
    except Exception as e:
        print("Unexpected error:", str(e))
        return build_response(400, {'message': str(e)})

def increment_counter():
    try:
        # Ensure the "total" counter exists
        response = dynamodb_table.get_item(Key={'pageId': "total"})
        if 'Item' not in response:
            print("Initializing 'total' counter...")
            dynamodb_table.update_item(
                Key={'pageId': "total"},
                UpdateExpression="SET visits = :val",
                ExpressionAttributeValues={':val': 0},
                ReturnValues="UPDATED_NEW"
            )
            print("Total counter initialized.")

        # Update the total counter with atomic increment
        response = dynamodb_table.update_item(
            Key={'pageId': "total"},
            UpdateExpression="ADD visits :inc",
            ExpressionAttributeValues={':inc': 1},
            ReturnValues="UPDATED_NEW"
        )
        total_visits = response.get('Attributes', {}).get('visits', 0)

        # Get today's date
        today_date = datetime.utcnow().strftime('%Y-%m-%d')  # e.g., "2025-01-31"
        print("Today's Date:", today_date)

        # Check if today's record exists, and initialize it if not
        response = dynamodb_table.get_item(Key={'pageId': today_date})
        if 'Item' not in response:
            print(f"Today's record for {today_date} not found. Initializing...")
            dynamodb_table.update_item(
                Key={'pageId': today_date},
                UpdateExpression="SET visits = :val",
                ExpressionAttributeValues={':val': 0},
                ReturnValues="UPDATED_NEW"
            )
            print(f"Today's record for {today_date} initialized.")

        # Update today's visits with atomic increment
        response = dynamodb_table.update_item(
            Key={'pageId': today_date},
            UpdateExpression="ADD visits :inc",
            ExpressionAttributeValues={':inc': 1},
            ReturnValues="UPDATED_NEW"
        )
        today_visits = response.get('Attributes', {}).get('visits', 0)
        print(f"Today's counter updated: {response}")

        # Return the updated total count and today's visit count
        return build_response(200, {
            'total_visits': total_visits,
            'today_visits': today_visits
        })
    except ClientError as e:
        print("DynamoDB ClientError:", e.response['Error'])
        return build_response(400, {'message': e.response['Error']['Message']})
    except Exception as e:
        print("Unexpected Error:", str(e))
        return build_response(400, {'message': str(e)})

def get_visit_trends():
    try:
        # Scan all items with `pageId` that are dates (e.g., "2025-01-31")
        response = dynamodb_table.scan(
            FilterExpression=Key('pageId').between("2020-01-01", "2099-12-31")
        )
        items = response.get('Items', [])
        
        # Sort the data by date
        sorted_items = sorted(items, key=lambda x: x['pageId'])

        # Return the historical trends
        return build_response(200, sorted_items)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, {'message': e.response['Error']['Message']})

def add_mock_data(event):
    try:
        print("Received request for /mock endpoint")
        print(f"Event: {event}")

        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        print(f"Parsed body: {body}")

        date = body.get('date')  # e.g., "2025-01-30"
        visits = body.get('visits')  # e.g., 10
        print(f"Date: {date}, Visits: {visits}")

        if not date or not visits:
            print("Validation failed: Missing 'date' or 'visits'")
            return build_response(400, {'message': 'Both "date" and "visits" are required'})

        # Validate the date format
        try:
            datetime.strptime(date, '%Y-%m-%d')  # Ensure date is in "YYYY-MM-DD" format
        except ValueError:
            print("Validation failed: Invalid date format")
            return build_response(400, {'message': 'Invalid date format. Use "YYYY-MM-DD".'})

        # Add or update the visits for the given date using atomic increment
        print(f"Updating mock data in DynamoDB for date: {date}")
        response = dynamodb_table.update_item(
            Key={'pageId': date},
            UpdateExpression="ADD visits :inc",
            ExpressionAttributeValues={':inc': Decimal(visits)},
            ReturnValues="UPDATED_NEW"
        )
        updated_visits = response.get('Attributes', {}).get('visits', 0)
        print(f"Updated visits for {date}: {updated_visits}")

        # Update the total visits counter
        print("Updating the total visits counter...")
        response = dynamodb_table.update_item(
            Key={'pageId': 'total'},
            UpdateExpression="ADD visits :inc",
            ExpressionAttributeValues={':inc': Decimal(visits)},
            ReturnValues="UPDATED_NEW"
        )
        total_visits = response.get('Attributes', {}).get('visits', 0)
        print(f"Updated total visits: {total_visits}")

        # Return the updated visits count for the date and the total
        return build_response(200, {
            'message': f'Mock data updated for {date}',
            'date': date,
            'visits': int(updated_visits),
            'total_visits': int(total_visits)
        })

    except ClientError as e:
        print(f"DynamoDB ClientError: {e.response['Error']}")
        return build_response(400, {'message': e.response['Error']['Message']})
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        return build_response(400, {'message': str(e)})

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # Check if it's an int or a float
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        # Let the base class default method raise the TypeError
        return super(DecimalEncoder, self).default(obj)

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # Add CORS headers
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }