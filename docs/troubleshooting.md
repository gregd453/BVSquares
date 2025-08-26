# 🔧 Interactive Troubleshooting Guide
## Admin Approval Platform

> **🎯 Quick Start**: Use Ctrl+F to search for your specific error message or symptom.

---

## 🏁 Quick Diagnostic Flowchart

### 1. What's the Issue Category?
- **🚫 [Build/Compilation Errors](#build-errors)** → Can't build or compile
- **⚡ [Runtime Errors](#runtime-errors)** → App crashes or doesn't work 
- **🚀 [Deployment Issues](#deployment-issues)** → Can't deploy or deploy fails
- **🐌 [Performance Problems](#performance-issues)** → App is slow
- **🔒 [Security Concerns](#security-issues)** → Security vulnerabilities
- **📊 [Data/Database Issues](#database-issues)** → Data problems

---

## 🚫 Build Errors

### TypeScript Compilation Issues

#### ❌ `Cannot find module '@/components/Button'`
**🔍 Diagnostic Steps:**
1. Check if file exists: `ls src/components/Button.tsx`
2. Verify tsconfig.json path mapping
3. Check import syntax

**✅ Solutions (Try in order):**
```bash
# Solution 1: Create missing file
mkdir -p src/components
touch src/components/Button.tsx

# Solution 2: Fix tsconfig paths
# Add to tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

# Solution 3: Rebuild
rm -rf .next && npm run build
```

#### ❌ `Private methods not supported in object literals`
**🔍 Root Cause:** Using `private` keyword in service objects

**✅ Quick Fix:**
```typescript
// ❌ Don't do this:
const userService = {
  private validateUser() { ... }
}

// ✅ Do this instead:
const validateUser = () => { ... }
const userService = {
  createUser() { ... },
  updateUser() { ... }
}
```

#### ❌ `Module not found: Can't resolve '@/utils/apiClient'`
**🔍 Diagnostic Checklist:**
- [ ] File exists at `src/utils/apiClient.ts`
- [ ] File has proper exports
- [ ] Next.js config has correct webpack aliases

**✅ Auto-Fix Script:**
```bash
# Create missing apiClient
mkdir -p src/utils
cat > src/utils/apiClient.ts << 'EOF'
export const apiClient = {
  get: (url: string) => fetch(url),
  post: (url: string, data: any) => fetch(url, { method: 'POST', body: JSON.stringify(data) })
};
EOF
```

---

## ⚡ Runtime Errors

### API Connection Failures

#### ❌ `Network request failed` / `CORS error`
**🔍 Interactive Debug:**
1. **Open Browser DevTools** → Network tab
2. **Reproduce the error**
3. **Check the failed request** → Click on it

**📋 Debug Checklist:**
- [ ] API URL correct? Check `.env.local`
- [ ] CORS enabled on backend?
- [ ] Request method allowed (GET/POST/etc)?
- [ ] Proper authentication headers?

**✅ Solutions by Status Code:**
- **0 (No response)**: Network/CORS issue
  ```bash
  # Check if API is running
  curl -I ${NEXT_PUBLIC_API_URL}/health
  ```
- **401 (Unauthorized)**: Check auth token
  ```javascript
  // Add to network request
  console.log('Auth token:', localStorage.getItem('token'))
  ```
- **404 (Not Found)**: API endpoint doesn't exist
  ```bash
  # List all API routes
  grep -r "app\.get\|app\.post" src/
  ```

### Authentication Issues


#### ❌ `User is not authenticated` (Cognito)
**🔍 Step-by-Step Debug:**
1. **Check Cognito Pool:** AWS Console → Cognito → User Pools
2. **Verify JWT Token:**
   ```javascript
   // In browser console:
   const token = localStorage.getItem('CognitoIdentityServiceProvider.{poolId}.{username}.idToken')
   console.log('JWT Token:', token)
   
   // Decode token at jwt.io to check expiration
   ```
3. **Check Token Expiry:** Tokens expire after 1 hour by default

**✅ Auto-Fix Code:**
```javascript
// Add to your auth service
export const refreshTokenIfNeeded = async () => {
  const token = getCurrentToken()
  if (isTokenExpired(token)) {
    await refreshToken()
  }
}
```


---

## 🚀 Deployment Issues

### AWS SAM Deployment Failures

#### ❌ `CREATE_FAILED: Resource already exists`
**🔍 Interactive Diagnosis:**
```bash
# Check existing resources
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE

# Check what's conflicting
aws cloudformation describe-stack-events --stack-name YOUR_STACK_NAME | head -20
```

**✅ Quick Solutions:**
```bash
# Solution 1: Use unique stack name
sam deploy --stack-name my-app-$(date +%s)

# Solution 2: Delete conflicting stack
aws cloudformation delete-stack --stack-name OLD_STACK_NAME

# Solution 3: Force update
sam deploy --force-upload
```

#### ❌ `Function code size exceeds 50MB limit`
**🔍 Size Analysis:**
```bash
# Check bundle size
du -sh .aws-sam/build/*/
npm run build -- --analyze

# Find large files
find .aws-sam -size +10M -exec ls -lh {} \;
```

**✅ Size Optimization:**
```bash
# 1. Remove dev dependencies
npm prune --production

# 2. Use Lambda layers for large deps
sam build --use-container

# 3. Enable minification
# Add to next.config.js:
module.exports = {
  webpack: (config) => {
    config.optimization.minimize = true
    return config
  }
}
```

### Frontend Deployment Issues

#### ❌ `Environment variables not defined`
**🔍 Environment Debug:**
```bash
# Check what's available
printenv | grep NEXT_PUBLIC

# Test locally
echo $NEXT_PUBLIC_API_URL
```

**✅ Platform-Specific Solutions:**
```bash
# Vercel
vercel env add NEXT_PUBLIC_API_URL

# Netlify  
# Add to netlify.toml:
[build]
  environment = { NEXT_PUBLIC_API_URL = "https://api.example.com" }

# AWS Amplify
# Add in AWS Console → Environment Variables
```

---

## 🐌 Performance Issues

### Interactive Performance Audit

#### 🔍 **Step 1: Measure Performance**
```bash
# Lighthouse audit
npx lighthouse https://yourapp.com --output=html

# Bundle analysis
npm run build -- --analyze

# Core Web Vitals
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://yourapp.com" | jq '.lighthouseResult.audits'
```

#### ⚡ **Performance Checklist (Check all that apply):**
- [ ] **Images optimized?** Use `next/image`
- [ ] **Code splitting enabled?** Check dynamic imports
- [ ] **Unused JS removed?** Run tree-shaking
- [ ] **Caching configured?** Check headers
- [ ] **CDN configured?** Use AWS CloudFront

**✅ Quick Performance Fixes:**
```javascript
// 1. Lazy load components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})

// 2. Optimize images
<Image 
  src="/hero.jpg" 
  alt="Hero" 
  width={800} 
  height={400}
  priority={false}
  loading="lazy"
/>

// 3. Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

---

## 📊 Database Issues

### DynamoDB Performance Problems

#### 🔍 **Interactive Query Analysis**
```bash
# Check table metrics
aws dynamodb describe-table --table-name YOUR_TABLE | jq '.Table.BillingModeSummary'

# Monitor performance
aws logs filter-log-events --log-group-name /aws/lambda/YOUR_FUNCTION --filter-pattern "Duration"
```

#### ⚡ **Query Optimization Checklist:**
- [ ] **Using partition key efficiently?**
- [ ] **Need a GSI (Global Secondary Index)?**
- [ ] **Batch operations for multiple items?**
- [ ] **Consistent vs. eventual consistency?**

**✅ Common Fixes:**
```javascript
// 1. Batch get items
const result = await dynamodb.batchGet({
  RequestItems: {
    'YourTable': {
      Keys: items.map(id => ({ id }))
    }
  }
}).promise()

// 2. Use query instead of scan
const items = await dynamodb.query({
  TableName: 'YourTable',
  KeyConditionExpression: 'partitionKey = :pk',
  ExpressionAttributeValues: { ':pk': value }
}).promise()
```

---

## 🔒 Security Issues

### Security Audit Checklist

#### 🛡️ **Immediate Security Check:**
```bash
# 1. Scan for exposed secrets
git log --all -p | grep -E "(password|key|secret|token)" | head -20

# 2. Check open ports
nmap -sT localhost

# 3. Audit dependencies
npm audit --audit-level moderate
```

#### 🚨 **Critical Security Fixes:**
- [ ] **No secrets in client code**
- [ ] **HTTPS everywhere**
- [ ] **Input validation on all endpoints**
- [ ] **Authentication on protected routes**
- [ ] **CORS properly configured**

---

## 🆘 Emergency Procedures

### 🚨 **System Down - Quick Recovery**
```bash
# 1. Check system status
curl -I https://yourapp.com/health

# 2. Check AWS service status
open https://status.aws.amazon.com/

# 3. Quick rollback
aws cloudformation update-stack --stack-name YOUR_STACK --use-previous-template

# 4. Scale up if needed
aws application-autoscaling put-scaling-policy --policy-name scale-up
```

### 📞 **Escalation Contacts**
1. **AWS Support** (if you have a plan)
2. **Team Lead/DevOps**
3. **On-call Engineer**

---

## 🤖 Automated Diagnostics

### **Run Full System Check:**
```bash
#!/bin/bash
echo "🔍 Running system diagnostics..."

# Check build
npm run build && echo "✅ Build OK" || echo "❌ Build Failed"

# Check tests  
npm test -- --watchAll=false && echo "✅ Tests OK" || echo "❌ Tests Failed"

# Check deployment
sam validate && echo "✅ SAM Template OK" || echo "❌ SAM Template Invalid"

# Check endpoints
curl -f ${NEXT_PUBLIC_API_URL}/health && echo "✅ API OK" || echo "❌ API Down"

echo "📊 Diagnostic complete!"
```

---

## 📚 Quick Reference Links

### **Essential Commands**
```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Deployment
sam build               # Build SAM application
sam deploy              # Deploy to AWS
sam logs               # View logs

# Debugging
npm run lint           # Check code quality
npm run type-check     # Check TypeScript
npm test              # Run tests
```

### **Useful AWS CLI Commands**
```bash
# Lambda
aws lambda invoke --function-name MyFunc response.json

# DynamoDB
aws dynamodb scan --table-name MyTable --select COUNT

# CloudWatch
aws logs describe-log-groups
```

---


## 🎯 Quality Gates Checklist
**Before Deployment (Auto-generated):**
- [ ] # Pre-Build Validation Checklist
- [ ] 
- [ ] ## Critical File Structure Validation
- [ ] - [ ] All component imports use existing files (no @/components/MissingComponent)
- [ ] - [ ] TypeScript configuration allows development-time unused variables
- [ ] - [ ] Next.js config doesn't conflict with routing requirements
- [ ] - [ ] All service objects use regular methods (no private keyword)
- [ ] - [ ] Path mapping configured in both tsconfig.json and next.config.js
- [ ] 
- [ ] ## Required Files Must Exist
- [ ] - [ ] src/components/ui/BaseCard.tsx
- [ ] - [ ] src/components/ui/Button.tsx
- [ ] - [ ] src/components/ui/Modal.tsx
- [ ] - [ ] src/utils/apiClient.ts
- [ ] - [ ] src/types/index.ts


## 🧪 **Generated Test Suites Available**
- ✅ 1 Cypress E2E test suites
- ✅ 4 API integration tests
- ✅ Field binding validation for 6 fields

**Run Tests:**
```bash
# Run all generated tests
npm run test:e2e     # Cypress tests
npm run test:api     # Integration tests
npm run test:unit    # Unit tests
```



---

## 🆘 **Still Stuck?**

### **Community Resources**
- 🗣️ **AWS Developer Forums**: [forums.aws.amazon.com](https://forums.aws.amazon.com)
- 💬 **Next.js Discussions**: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- ❓ **Stack Overflow**: Use tags `nextjs`, `aws-sam`, `dynamodb`

### **Professional Support**
- 📞 **AWS Support**: Available with paid support plans
- 👥 **AWS Solutions Architects**: For architectural guidance
- 🏢 **Enterprise Support**: 24/7 support with 15-minute response time

---

**💡 Pro Tip**: Bookmark this guide and use the search function (Ctrl+F) to quickly find solutions to specific error messages!
