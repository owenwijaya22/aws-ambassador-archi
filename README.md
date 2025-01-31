- This Vite, React, Tailwind SPA is routed with Route53 custom domain registrar, exposed through CloudFront, and hosted on S3 bucket. The graph is dynamically updated!
- Automated with GitHub Actions CI/CD pipeline that builds the site, deletes existing files in s3, uploads the new builds, and invalidates the CloudFront CDN cache.
- The backend is a serverless AWS with Lambda and DynamoDB that is exposed with API Gateway to the frontend.
![image](https://github.com/user-attachments/assets/9dac60b6-ce6e-4b84-a711-bd2200ff5714)

Follow these steps:
```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```
