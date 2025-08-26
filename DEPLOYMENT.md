# BV Squares - Deployment Guide

## 🚀 Quick Deployment

This guide will help you deploy the BV Squares application to AWS.

## Prerequisites

1. **Node.js 18+** installed
2. **AWS CLI** configured with appropriate permissions
3. **AWS SAM CLI** installed
4. **Git** for version control

## Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 1.2 Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
# NEXT_PUBLIC_AWS_REGION=us-east-1
# NEXT_PUBLIC_API_URL=https://your-api-gateway-url/prod
# NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
# NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

## Step 2: AWS Infrastructure Deployment

### 2.1 Deploy Backend Infrastructure

```bash
# Build the SAM application
sam build

# Deploy with guided setup (first time)
sam deploy --guided

# Follow the prompts:
# Stack Name: bv-squares-prod
# AWS Region: us-east-1 (or your preferred region)
# Parameter Environment: prod
# Confirm changes before deploy: Y
# Allow SAM CLI to create IAM roles: Y
# Save parameters to samconfig.toml: Y
```

### 2.2 Get API Endpoint

After deployment, note the API Gateway URL from the outputs:

```bash
aws cloudformation describe-stacks --stack-name bv-squares-prod --query 'Stacks[0].Outputs'
```

Update your `.env.local` with the actual API URL.

## Step 3: Frontend Deployment

### 3.1 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID
vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID
vercel env add NEXT_PUBLIC_AWS_REGION

# Redeploy with environment variables
vercel --prod
```

### 3.2 Alternative: Deploy to AWS Amplify

```bash
# Connect your Git repository to AWS Amplify
# Configure build settings:
# Build command: npm run build
# Output directory: .next

# Or use Amplify CLI
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

## Step 4: Post-Deployment Setup

### 4.1 Create Admin User

Since admin accounts are created manually for security:

```bash
# Use AWS CLI to create admin user in Cognito
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@yourdomain.com \
  --temporary-password TempPassword123! \
  --message-action SUPPRESS

# Set permanent password
aws cognito-idp admin-set-user-password \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@yourdomain.com \
  --password YourSecurePassword123! \
  --permanent

# Add custom attributes if needed
aws cognito-idp admin-update-user-attributes \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@yourdomain.com \
  --user-attributes Name=custom:userType,Value=admin
```

### 4.2 Test Deployment

```bash
# Test API health
curl https://your-api-url/prod/health

# Test frontend
curl https://your-frontend-url

# Run end-to-end tests
npm run cypress:run
```

## Step 5: Monitoring & Maintenance

### 5.1 Set Up CloudWatch Alarms

```bash
# Create error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "bv-squares-error-rate" \
  --alarm-description "High error rate in BV Squares API" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=bv-squares-prod-ApiFunction
```

### 5.2 Cost Monitoring

Expected monthly costs:
- **Lambda**: $1-5 (based on requests)
- **API Gateway**: $3-10 (based on requests)
- **DynamoDB**: $1-5 (pay-per-request)
- **Cognito**: $0-3 (first 50k users free)
- **CloudWatch**: $1-3 (logs and metrics)

**Total**: $6-26/month for moderate usage

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure API Gateway CORS is configured
   - Check environment variables are set correctly

2. **Authentication Issues**
   - Verify Cognito User Pool configuration
   - Check JWT token handling in API

3. **Database Connection Issues**
   - Ensure Lambda has DynamoDB permissions
   - Check table names match in environment variables

4. **Build Failures**
   - Run `npm run type-check` to fix TypeScript errors
   - Check all dependencies are installed

### Debug Commands

```bash
# Check SAM logs
sam logs -n ApiFunction --stack-name bv-squares-prod --tail

# Test API locally
sam local start-api

# Check DynamoDB items
aws dynamodb scan --table-name bv-squares-prod-bv-squares --limit 5
```

## Rollback Procedures

### Quick Rollback

```bash
# Rollback to previous deployment
sam deploy --parameter-overrides Environment=prod --no-confirm-changeset

# Or delete stack and redeploy
aws cloudformation delete-stack --stack-name bv-squares-prod
```

### Data Backup

```bash
# Export DynamoDB data before major updates
aws dynamodb create-backup \
  --table-name bv-squares-prod-bv-squares \
  --backup-name pre-update-backup-$(date +%Y%m%d)
```

## Security Checklist

- [ ] All environment variables secured
- [ ] API Gateway throttling configured
- [ ] DynamoDB table encryption enabled
- [ ] CloudWatch logs retention set
- [ ] Admin accounts use strong passwords
- [ ] HTTPS enforced on all endpoints
- [ ] CORS configured properly

## Performance Optimization

- [ ] Lambda function memory optimized (512MB recommended)
- [ ] DynamoDB queries use indexes efficiently
- [ ] Frontend assets minified and compressed
- [ ] CDN configured for static assets
- [ ] Database queries batched where possible

## Success Criteria

✅ **Infrastructure**
- All AWS resources deployed successfully
- API Gateway responding with 200 status
- DynamoDB tables created with proper indexes
- Cognito User Pool configured

✅ **Frontend**
- Application loads without errors
- Authentication flow working
- Responsive design on mobile/tablet/desktop
- All core features accessible

✅ **Backend**
- All API endpoints responding correctly
- Database operations working
- Error handling implemented
- Logging configured

✅ **Security**
- Authentication required for protected endpoints
- CORS configured properly
- Input validation working
- Admin access restricted

The BV Squares application is now ready for production use! 🎉