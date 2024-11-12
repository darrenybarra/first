#!/bin/bash

# Exit on error
set -e

ENVIRONMENT=$1
AWS_REGION="us-west-2"
APP_NAME="chatbot"

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    exit 1
fi

# Build and push Docker images
echo "Building and pushing Docker images..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker build -t $APP_NAME-frontend ./frontend
docker tag $APP_NAME-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-frontend:latest

docker build -t $APP_NAME-backend ./backend
docker tag $APP_NAME-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-backend:latest

# Apply Terraform
echo "Applying Terraform configuration..."
cd terraform
terraform init
terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
terraform apply -var-file="environments/$ENVIRONMENT/terraform.tfvars" -auto-approve 