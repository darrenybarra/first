#!/bin/bash

# Exit on error
set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    exit 1
fi

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Package backend
echo "Packaging backend..."
cd backend
pip install -r requirements/prod.txt -t package/
cp -r src package/
cd package
zip -r ../deployment-package.zip .
cd ../..

# Apply Terraform
echo "Applying Terraform configuration..."
cd terraform
terraform init
terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
terraform apply -var-file="environments/${ENVIRONMENT}/terraform.tfvars" -auto-approve

# Upload frontend build to S3
BUCKET_NAME=$(terraform output -raw frontend_bucket)
aws s3 sync ../frontend/build/ s3://$BUCKET_NAME/

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"