- This Vite, React, Tailwind SPA is routed with Route53 custom domain registrar, exposed through CloudFront, and hosted on S3 bucket. The graph is dynamically updated!
- Automated with GitHub Actions CI/CD pipeline that builds the site, deletes existing files in s3, uploads the new builds, and invalidates the CloudFront CDN cache.
- The backend is a serverless AWS with Lambda and DynamoDB that is exposed with API Gateway to the frontend.

Architecture Explanation: [Demo Preview](https://github.com/user-attachments/assets/0d25b9c9-7f2c-4a8f-920c-f1b3064e1e57)

Live Demo: [Click Me!](https://www.simplifiedaws.com/)

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
