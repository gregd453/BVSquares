# API Documentation
## Admin Approval Platform REST API

### Base URL
- **Development**: `https://dev-api-url/dev`
- **Production**: `https://prod-api-url/prod`

### Authentication

**Type**: Bearer Token (JWT)
**Header**: `Authorization: Bearer <token>`

**Authentication Endpoints**:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout


### Core API Endpoints

#### Admin Panel

**List Admin Panel**
```
GET /api/admin-panel
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create admin pane**
```
POST /api/admin-panel
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get admin pane**
```
GET /api/admin-panel/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update admin pane**
```
PUT /api/admin-panel/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete admin pane**
```
DELETE /api/admin-panel/:id
```

Response:
```json
{
  "success": true,
  "message": "admin pane deleted successfully"
}
```


#### Mobile Responsive Design

**List Mobile Responsive Design**
```
GET /api/mobile-responsive-design
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create mobile responsive desig**
```
POST /api/mobile-responsive-design
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get mobile responsive desig**
```
GET /api/mobile-responsive-design/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update mobile responsive desig**
```
PUT /api/mobile-responsive-design/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete mobile responsive desig**
```
DELETE /api/mobile-responsive-design/:id
```

Response:
```json
{
  "success": true,
  "message": "mobile responsive desig deleted successfully"
}
```


#### Authentication

**List Authentication**
```
GET /api/authentication
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create authenticatio**
```
POST /api/authentication
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get authenticatio**
```
GET /api/authentication/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update authenticatio**
```
PUT /api/authentication/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete authenticatio**
```
DELETE /api/authentication/:id
```

Response:
```json
{
  "success": true,
  "message": "authenticatio deleted successfully"
}
```


#### User Management

**List User Management**
```
GET /api/user-management
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create user managemen**
```
POST /api/user-management
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get user managemen**
```
GET /api/user-management/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update user managemen**
```
PUT /api/user-management/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete user managemen**
```
DELETE /api/user-management/:id
```

Response:
```json
{
  "success": true,
  "message": "user managemen deleted successfully"
}
```


#### Dashboard

**List Dashboard**
```
GET /api/dashboard
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create dashboar**
```
POST /api/dashboard
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get dashboar**
```
GET /api/dashboard/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update dashboar**
```
PUT /api/dashboard/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete dashboar**
```
DELETE /api/dashboard/:id
```

Response:
```json
{
  "success": true,
  "message": "dashboar deleted successfully"
}
```


#### Game Management

**List Game Management**
```
GET /api/game-management
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create game managemen**
```
POST /api/game-management
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get game managemen**
```
GET /api/game-management/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update game managemen**
```
PUT /api/game-management/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete game managemen**
```
DELETE /api/game-management/:id
```

Response:
```json
{
  "success": true,
  "message": "game managemen deleted successfully"
}
```


#### Square Management

**List Square Management**
```
GET /api/square-management
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create square managemen**
```
POST /api/square-management
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get square managemen**
```
GET /api/square-management/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update square managemen**
```
PUT /api/square-management/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete square managemen**
```
DELETE /api/square-management/:id
```

Response:
```json
{
  "success": true,
  "message": "square managemen deleted successfully"
}
```


#### Admin Management

**List Admin Management**
```
GET /api/admin-management
```

Query Parameters:
- `limit` (number, optional): Maximum number of items to return (default: 20)
- `cursor` (string, optional): Pagination cursor for next page
- `filter` (string, optional): Filter criteria

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "status": "active|inactive",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "nextCursor": "string|null",
    "count": "number"
  }
}
```

**Create admin managemen**
```
POST /api/admin-management
```

Request Body:
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "active|inactive (optional, default: active)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Get admin managemen**
```
GET /api/admin-management/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|inactive",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
```

**Update admin managemen**
```
PUT /api/admin-management/:id
```

Request Body:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|inactive (optional)"
}
```

**Delete admin managemen**
```
DELETE /api/admin-management/:id
```

Response:
```json
{
  "success": true,
  "message": "admin managemen deleted successfully"
}
```


### Error Responses

All endpoints return consistent error responses:

**400 Bad Request**
```json
{
  "success": false,
  "error": "Validation error message",
  "details": {
    "field": "Specific field error"
  }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

### Rate Limiting
- **Requests per minute**: 1000
- **Burst limit**: 2000
- **Headers**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### CORS Configuration
- **Allowed Origins**: Configured per environment
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

### Data Formats
- **Request/Response**: JSON
- **Date Format**: ISO 8601 (e.g., "2023-12-01T10:30:00Z")
- **Character Encoding**: UTF-8
