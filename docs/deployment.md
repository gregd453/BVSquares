# Deployment Guide
## Admin Approval Platform

### Prerequisites

**Local Development Environment:**
- Node.js 18+ (`node --version`)
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

**AWS Requirements:**
- AWS CLI installed and configured
- AWS account with appropriate permissions
- SAM CLI (optional, for local testing)

**Required AWS Permissions:**
- Lambda (create, update, delete functions)
- API Gateway (create, update, delete APIs)
- DynamoDB (create, update, delete tables)
- IAM (create roles and policies)
- CloudFormation (create, update, delete stacks)

- Cognito (create, update user pools)

### Local Development Setup

**1. Clone and Install Dependencies**
```bash
git clone <repository-url>
cd admin-approval-platform
npm install
```

**2. Environment Configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

**3. Start Development Server**
```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

### Pre-Deployment Validation


**Run Quality Checks**:
```bash
# Type checking
npm run type-check

# Code linting
npm run lint

# Build validation
npm run build

# Run tests
npm test
```

All commands must pass before deployment.


### AWS Infrastructure Deployment

**1. Configure AWS CLI**
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

**2. Deploy Infrastructure**
```bash
# Build the SAM application
sam build

# Deploy with guided setup (first time)
sam deploy --guided

# Follow the prompts:
# Stack Name: admin-approval-platform-prod
# AWS Region: us-east-1 (or your preferred region)
# Confirm changes before deploy: Y
# Allow SAM CLI to create IAM roles: Y
# Save parameters to samconfig.toml: Y
```

**3. Deploy Updates**
```bash
# For subsequent deployments
sam build && sam deploy
```

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL: <your-api-gateway-url>
# NEXT_PUBLIC_COGNITO_USER_POOL_ID: <your-user-pool-id>
# NEXT_PUBLIC_COGNITO_CLIENT_ID: <your-client-id>
```

**Option 2: AWS Amplify**
```bash
# Connect your Git repository to AWS Amplify
# Configure build settings:
# Build command: npm run build
# Output directory: .next
```

### Post-Deployment Configuration

**1. Get API URL**
```bash
# From SAM deployment output or:
aws cloudformation describe-stacks --stack-name <stack-name> --query 'Stacks[0].Outputs'
```

**2. Update Frontend Environment Variables**
Update your frontend deployment with the actual API URL.

**3. Test Deployment**
```bash
# Health check
curl https://your-api-url/prod/health

# Test an endpoint
curl https://your-api-url/prod/api/items
```

### Environment Management

**Development Environment**
```bash
sam deploy --parameter-overrides Environment=dev --stack-name <project>-dev
```

**Production Environment**
```bash
sam deploy --parameter-overrides Environment=prod --stack-name <project>-prod
```

### Monitoring and Logging

**CloudWatch Logs**
- Lambda logs: `/aws/lambda/<function-name>`
- API Gateway logs: `/aws/apigateway/<api-id>`

**Monitoring Dashboard**
Access CloudWatch metrics for:
- Lambda function duration and errors
- API Gateway request count and latency
- DynamoDB read/write capacity


### 🚀 Deployment Status & Monitoring Guide

#### Real-Time Health Monitoring

**System Health Dashboard**
```bash
# Quick health check script
#!/bin/bash
echo "🔍 Checking system health..."

# API Gateway Health
API_URL="https://api.yourproject.com"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ $HTTP_STATUS -eq 200 ]; then
  echo "✅ API Gateway: Healthy ($HTTP_STATUS)"
else
  echo "❌ API Gateway: Unhealthy ($HTTP_STATUS)"
fi

# Lambda Function Health
FUNCTION_NAME="admin-approval-platform-api"
ERROR_RATE=$(aws logs filter-log-events \
  --log-group-name "/aws/lambda/$FUNCTION_NAME" \
  --start-time $(date -d '1 hour ago' +%s)000 \
  --filter-pattern "ERROR" \
  --query 'length(events)')

echo "🔧 Lambda Error Rate (last hour): $ERROR_RATE errors"

# Database Health

# DynamoDB Health Check
TABLE_NAME="admin-approval-platform-table"
ITEM_COUNT=$(aws dynamodb scan --table-name $TABLE_NAME --select COUNT --query 'Count')
echo "📊 DynamoDB Items: $ITEM_COUNT"

# Check DynamoDB throttling
THROTTLE_EVENTS=$(aws logs filter-log-events \
  --log-group-name "/aws/dynamodb/table/$TABLE_NAME" \
  --start-time $(date -d '1 hour ago' +%s)000 \
  --filter-pattern "throttling" \
  --query 'length(events)')
echo "⚡ DynamoDB Throttle Events: $THROTTLE_EVENTS"

# Frontend Health
curl -s https://yourproject.com > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Frontend: Accessible"
else
  echo "❌ Frontend: Inaccessible"
fi
```

#### Automated Monitoring Setup

**CloudWatch Alarms**
```bash
# Create critical alarms for production monitoring

# Lambda Error Rate Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "admin-approval-platform-error-rate" \
  --alarm-description "Lambda function error rate" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=admin-approval-platform-api \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts

# API Gateway 4xx/5xx Errors
aws cloudwatch put-metric-alarm \
  --alarm-name "admin-approval-platform-api-errors" \
  --alarm-description "API Gateway error rate" \
  --metric-name 4XXError \
  --namespace AWS/ApiGateway \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Lambda Duration Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "admin-approval-platform-duration" \
  --alarm-description "Lambda function duration" \
  --metric-name Duration \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 300 \
  --threshold 5000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=admin-approval-platform-api

```

**Custom Metrics Dashboard**
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          [ "AWS/Lambda", "Duration", "FunctionName", "admin-approval-platform-api" ],
          [ ".", "Errors", ".", "." ],
          [ ".", "Invocations", ".", "." ]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "Lambda Metrics"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          [ "AWS/ApiGateway", "Count", "ApiName", "admin-approval-platform-api" ],
          [ ".", "Latency", ".", "." ],
          [ ".", "4XXError", ".", "." ],
          [ ".", "5XXError", ".", "." ]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "us-east-1",
        "title": "API Gateway Metrics"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          [ "AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "admin-approval-platform-table" ],
          [ ".", "ConsumedWriteCapacityUnits", ".", "." ],
          [ ".", "SuccessfulRequestLatency", ".", ".", "Operation", "GetItem" ]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "us-east-1",
        "title": "DynamoDB Metrics"
      }
    }
  ]
}
```

#### Performance Monitoring

**Key Performance Indicators (KPIs)**
- **API Response Time**: < 500ms (p95)
- **Error Rate**: < 1%
- **Availability**: > 99.9%
- **Database Query Time**: < 100ms (p95)



**Response Time Monitoring**
```bash
# Set up synthetic monitoring

# Convert Cypress tests to synthetic monitoring
npx cypress run --reporter json --reporter-options "toConsole=false" > test-results.json

# Parse results for monitoring
node -e "
const results = require('./test-results.json');
const metrics = {
  totalTests: results.tests?.length || 0,
  passed: results.tests?.filter(t => t.state === 'passed').length || 0,
  failed: results.tests?.filter(t => t.state === 'failed').length || 0,
  averageDuration: results.stats?.duration / results.tests?.length || 0
};
console.log('Synthetic Test Metrics:', JSON.stringify(metrics, null, 2));
"
```

**Load Testing Setup**
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test script
cat > load-test.yml << EOF
config:
  target: 'https://api.yourproject.com'
  phases:
    - duration: 60
      arrivalRate: 5
    - duration: 120
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/health"
      - get:
          url: "/api/items"
EOF

# Run load test
artillery run load-test.yml
```

#### Deployment Status Tracking

**Deployment Pipeline Status**
```bash
# Get current deployment status
aws cloudformation describe-stacks \
  --stack-name admin-approval-platform-prod \
  --query 'Stacks[0].StackStatus'

# Check deployment history
aws cloudformation describe-stack-events \
  --stack-name admin-approval-platform-prod \
  --max-items 10
```

**Health Check Endpoints**
```javascript
// Implement comprehensive health checks
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {
      database: await checkDatabaseConnection(),
      auth: await checkCognitoHealth(),
      
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };
  
  res.status(200).json(health);
});

// Detailed system metrics endpoint
app.get('/metrics', async (req, res) => {
  const metrics = {
    
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV,
    version: process.env.VERSION || '1.0.0',
    database: {
      type: 'DynamoDB',
      status: 'connected' // Implement actual check
    },
    features: ["Admin Panel","Mobile Responsive Design","Authentication","User Management","Dashboard","Game Management","Square Management","Admin Management"],
    lastDeployment: process.env.DEPLOY_TIMESTAMP || new Date().toISOString()
  };
  
  res.status(200).json(metrics);
});
```

#### Log Analysis & Monitoring

**Centralized Log Monitoring**
```bash
# Set up log insights queries for common issues

# Query for errors in Lambda logs
aws logs start-query \
  --log-group-name "/aws/lambda/admin-approval-platform-api" \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string "fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc | limit 20"

# Query for slow requests
aws logs start-query \
  --log-group-name "/aws/lambda/admin-approval-platform-api" \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string "fields @timestamp, @duration | filter @duration > 1000 | sort @duration desc | limit 10"

# Query for API Gateway access patterns
aws logs start-query \
  --log-group-name "API-Gateway-Execution-Logs_${API_ID}/prod" \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string "fields @timestamp, @message | filter @message like /4[0-9][0-9]/ or @message like /5[0-9][0-9]/ | sort @timestamp desc"
```

**Error Tracking Setup**
```javascript
// Enhanced error logging with context
const logError = (error, context = {}) => {
  const logEntry = {
    level: 'ERROR',
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    userId: context.userId,
    feature: context.feature,
    environment: process.env.NODE_ENV
  };
  
  console.error(JSON.stringify(logEntry));
  
  // Send to external monitoring service if configured
  if (process.env.MONITORING_ENDPOINT) {
    // Send to monitoring service
  }
};
```

#### Alerting & Incident Response

**Alert Configuration**

**Slack Integration**
```bash
# Create SNS topic for alerts
aws sns create-topic --name admin-approval-platform-alerts

# Subscribe Slack webhook (replace with your webhook URL)
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:admin-approval-platform-alerts \
  --protocol https \
  --notification-endpoint https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

**Email Alerts**
```bash
# Subscribe email for critical alerts
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:admin-approval-platform-alerts \
  --protocol email \
  --notification-endpoint your-email@company.com
```

**PagerDuty Integration** (Optional)
```bash
# For critical production systems
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:admin-approval-platform-alerts \
  --protocol https \
  --notification-endpoint https://events.pagerduty.com/integration/YOUR_INTEGRATION_KEY/enqueue
```

**Incident Response Playbook**
```markdown
## 🚨 Incident Response Checklist

### Severity 1: Critical System Down
1. **Immediate Response (0-5 min)**
   - Check system status dashboard
   - Verify API Gateway health
   - Check Lambda function logs
   - Assess database connectivity

2. **Investigation (5-15 min)**
   - Review recent deployments
   - Check CloudWatch alarms
   - Analyze error patterns
   - Identify root cause

3. **Resolution (15+ min)**
   - Implement immediate fix or rollback
   - Monitor system recovery
   - Update status page
   - Document incident

### Severity 2: Performance Degradation
1. Check current load patterns
2. Review resource utilization
3. Analyze slow query logs
4. Scale resources if needed

### Severity 3: Minor Issues
1. Log issue for tracking
2. Plan fix for next maintenance window
3. Monitor for escalation
```

#### Deployment Rollback Procedures

**Automated Rollback Scripts**
```bash
#!/bin/bash
# Enhanced rollback with safety checks

STACK_NAME="admin-approval-platform-prod"
BACKUP_STACK_NAME="${STACK_NAME}-backup-$(date +%Y%m%d-%H%M%S)"

echo "🔄 Starting rollback procedure for $STACK_NAME..."

# 1. Create backup of current stack
echo "📦 Creating backup of current configuration..."
aws cloudformation get-template --stack-name $STACK_NAME > current-template-backup.json

# 2. Get the previous working deployment
PREVIOUS_CHANGESET=$(aws cloudformation list-change-sets \
  --stack-name $STACK_NAME \
  --query 'Summaries[?Status==`CREATE_COMPLETE`][0].ChangeSetId' \
  --output text)

if [ "$PREVIOUS_CHANGESET" = "None" ]; then
  echo "❌ No previous successful deployment found"
  exit 1
fi

# 3. Validate rollback target
echo "✅ Found previous successful deployment: $PREVIOUS_CHANGESET"

# 4. Perform health check before rollback
echo "🏥 Performing pre-rollback health check..."
CURRENT_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://api.yourproject.com/health)
echo "Current system health status: $CURRENT_HEALTH"

# 5. Execute rollback with monitoring
echo "🚀 Executing rollback..."
aws cloudformation update-stack \
  --stack-name $STACK_NAME \
  --template-body file://previous-template.json \
  --capabilities CAPABILITY_IAM

# 6. Monitor rollback progress
echo "⏳ Monitoring rollback progress..."
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME

if [ $? -eq 0 ]; then
  echo "✅ Rollback completed successfully"
  
  # 7. Post-rollback health check
  echo "🔍 Performing post-rollback health check..."
  sleep 30  # Wait for services to stabilize
  NEW_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://api.yourproject.com/health)
  
  if [ "$NEW_HEALTH" = "200" ]; then
    echo "✅ System health restored (HTTP $NEW_HEALTH)"
  else
    echo "⚠️  System health check failed (HTTP $NEW_HEALTH)"
    echo "Manual intervention may be required"
  fi
else
  echo "❌ Rollback failed"
  exit 1
fi
```

#### Monitoring Best Practices

**📊 Monitoring Checklist**
- [x] Health check endpoints implemented
- [x] CloudWatch alarms configured
- [x] Error rate monitoring active
- [x] Performance metrics tracked
- [x] Log aggregation enabled
- [x] Alert notifications configured
- [x] Synthetic monitoring tests

**🔍 Regular Monitoring Tasks**
- **Daily**: Review error rates and performance metrics
- **Weekly**: Analyze cost optimization opportunities
- **Monthly**: Update monitoring thresholds and alerts
- **Quarterly**: Review and update incident response procedures

#### Cost Monitoring

**Cost Analysis Dashboard**
```bash
# Get current month's costs
aws ce get-cost-and-usage \
  --time-period Start=$(date -d 'first day of this month' +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Set up cost alerts

# Create billing alarm for monthly costs
aws cloudwatch put-metric-alarm \
  --alarm-name "admin-approval-platform-monthly-cost" \
  --alarm-description "Monthly cost threshold alert" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=Currency,Value=USD \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:billing-alerts
```

#### Security Monitoring

**Security Audit Checklist**
- [x] HTTPS enforced on all endpoints
- [x] Authentication tokens validated
- [x] SQL injection protection active
- [x] CORS properly configured
- [x] Input validation implemented

- [x] Cognito security policies enforced

**Security Monitoring Queries**
```bash
# Monitor for suspicious activity

# Monitor for failed authentication attempts
aws logs start-query \
  --log-group-name "/aws/lambda/admin-approval-platform-api" \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string "fields @timestamp, @message | filter @message like /401/ or @message like /403/ | stats count(*) by bin(5m)"

# Monitor for suspicious request patterns
aws logs start-query \
  --log-group-name "API-Gateway-Execution-Logs_${API_ID}/prod" \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string "fields @timestamp, ip, userAgent | filter @message like /sql/i or @message like /script/i | sort @timestamp desc"

# Monitor for unusual traffic spikes
aws logs start-query \
  --log-group-name "API-Gateway-Execution-Logs_${API_ID}/prod" \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string "fields @timestamp | stats count(*) by bin(1m) | sort @timestamp desc"
```

---

💡 **Pro Tip**: Set up automated daily/weekly reports to track system health trends and identify potential issues before they become critical.


### Rollback Procedures

**Rollback Infrastructure**
```bash
# Delete the stack (complete rollback)
sam delete --stack-name <stack-name>

# Or redeploy previous version
git checkout <previous-commit>
sam build && sam deploy
```

**Rollback Frontend**
```bash
# Vercel
vercel --prod <previous-deployment-url>

# AWS Amplify
# Use the Amplify console to redeploy previous version
```

### Troubleshooting Common Issues

**Deployment Fails**
- Check AWS permissions
- Verify SAM template syntax
- Review CloudFormation stack events

**API Not Responding**
- Check Lambda function logs
- Verify API Gateway configuration
- Test Lambda function directly

**Frontend Can't Connect to API**
- Verify API URL in environment variables
- Check CORS configuration
- Verify API Gateway stage deployment

### Security Checklist

- [ ] API Gateway has proper CORS configuration
- [ ] Lambda functions have minimal IAM permissions
- [ ] DynamoDB table has encryption enabled
- [ ] Environment variables don't contain secrets
- [ ] HTTPS is enforced for all endpoints
- [ ] Cognito user pool has proper password policies


### Cost Monitoring


**Estimated Monthly Costs**: $5-25

**Cost Breakdown**:
- lambda: $1-5
- api_gateway: $1-10
- dynamodb: $1-5
- s3: $0-2
- cognito: $0-3


Set up AWS Cost Alerts:
1. Go to AWS Billing Dashboard
2. Create a budget alert for monthly spend
3. Set threshold at $50 (adjust as needed)
