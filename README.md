# Admin Approval Platform

A modern sports betting platform application built with Next.js, React, TypeScript, and AWS serverless infrastructure.

## 🚀 Features

- **Admin Panel**: Full CRUD operations with real-time updates
- **Mobile Responsive Design**: Full CRUD operations with real-time updates
- **Authentication**: Full CRUD operations with real-time updates
- **User Management**: Full CRUD operations with real-time updates
- **Dashboard**: Full CRUD operations with real-time updates
- **Game Management**: Full CRUD operations with real-time updates
- **Square Management**: Full CRUD operations with real-time updates
- **Admin Management**: Full CRUD operations with real-time updates

## 🛠 Technology Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) - React framework with SSR and SSG
- [React 18](https://reactjs.org/) - UI library with hooks and context
- [TypeScript](https://typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Custom design system with accessibility compliance

**Backend:**
- [AWS Lambda](https://aws.amazon.com/lambda/) - Serverless compute
- [API Gateway](https://aws.amazon.com/api-gateway/) - RESTful API management
- [DynamoDB](https://aws.amazon.com/dynamodb/) - NoSQL database
- [AWS Cognito](https://aws.amazon.com/cognito/) - Authentication and user management

**Infrastructure:**
- [AWS SAM](https://aws.amazon.com/serverless/sam/) - Infrastructure as Code
- [CloudFormation](https://aws.amazon.com/cloudformation/) - Resource management


## 📋 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured
- AWS account with appropriate permissions

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-approval-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

1. **Deploy AWS infrastructure**
   ```bash
   sam build
   sam deploy --guided
   ```

2. **Deploy frontend**
   ```bash
   # Using Vercel (recommended)
   npm install -g vercel
   vercel
   ```

3. **Configure environment variables**
   Set the API URL in your frontend deployment platform.

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── pages/          # Page-specific components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API integration
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── template.yaml           # SAM infrastructure template
├── samconfig.toml         # SAM configuration
└── docs/                  # Documentation
```

## 🎨 Design System


### Color Palette
- **Primary**: #3B82F6, #1D4ED8, #1E40AF
- **Secondary**: #8B5CF6, #7C3AED, #6D28D9
- **Semantic**: Success, Warning, Error, Info

### Typography
- **Font Family**: Inter, sans-serif
- **Responsive Scale**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Components
- Consistent button variants and sizing
- Form components with validation
- Responsive layout system
- Accessibility-first approach (WCAG AA)


## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```


**Coverage Targets:**
- Lines: 50%
- Functions: 50%
- Branches: 50%


## 📊 Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build validation
npm run build
```

## 📚 API Documentation

Base URL: `https://your-api-url/prod`

### Authentication
JWT Bearer token required for protected endpoints.

### Endpoints
- `GET /api/admin-panel` - List all items
- `POST /api/admin-panel` - Create new item
- `PUT /api/admin-panel/:id` - Update item
- `DELETE /api/admin-panel/:id` - Delete item
- `GET /api/mobile-responsive-design` - List all items
- `POST /api/mobile-responsive-design` - Create new item
- `PUT /api/mobile-responsive-design/:id` - Update item
- `DELETE /api/mobile-responsive-design/:id` - Delete item
- `GET /api/authentication` - List all items
- `POST /api/authentication` - Create new item
- `PUT /api/authentication/:id` - Update item
- `DELETE /api/authentication/:id` - Delete item

[View complete API documentation →](./docs/api.md)

## 🚀 Deployment

### AWS Infrastructure
- **Estimated Cost**: $5-25 for basic usage
- **Scaling**: Automatic with serverless architecture
- **Monitoring**: CloudWatch logs and metrics

### Frontend Hosting
- **Vercel**: Recommended for Next.js applications
- **AWS Amplify**: Alternative AWS-native option
- **Netlify**: Another popular option

## 🔧 Configuration

### Environment Variables

**Development (`.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

**Production:**
```
NEXT_PUBLIC_API_URL=https://your-api-gateway-url/prod
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-production-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-production-client-id
```

## 📖 Documentation

- [Technical Documentation](./docs/technical.md) - Detailed technical specifications
- [API Documentation](./docs/api.md) - Complete API reference
- [Deployment Guide](./docs/deployment.md) - Step-by-step deployment instructions
- [Troubleshooting Guide](./docs/troubleshooting.md) - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage above 50%
- Use conventional commit messages
- Ensure accessibility compliance (WCAG AA)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Next.js App  │───▶│ API Gateway  │───▶│  Lambda + DynamoDB  │
│  (Frontend)     │    │  (REST API)  │    │   (Backend)     │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │                    │
         ▼                       ▼                    ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│     Vercel      │    │ CloudWatch   │    │  AWS Cognito  │
│   (Hosting)     │    │ (Monitoring) │    │     (Auth)      │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

---

**Built with ❤️ using the Claude Development Pipeline**
