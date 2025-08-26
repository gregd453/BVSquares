const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const TABLE_NAME = process.env.TABLE_NAME;
const REGION = process.env.AWS_REGION || 'us-east-1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': true
};

// Response helper
const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

// Error response helper
const errorResponse = (statusCode, message, details = {}) => {
  console.error(`Error ${statusCode}: ${message}`, details);
  return response(statusCode, {
    success: false,
    error: message,
    details
  });
};

// Success response helper
const successResponse = (data, message) => response(200, {
  success: true,
  data,
  message
});

// Get current timestamp
const now = () => new Date().toISOString();

// Parse JWT token (basic implementation - in production use proper JWT library)
const parseToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authenticate user
const authenticate = (event) => {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required');
  }
  
  const token = authHeader.substring(7);
  return parseToken(token);
};

// DynamoDB operations
const dbOperations = {
  // Create user
  async createUser(user) {
    const item = {
      PK: `USER#${user.id}`,
      SK: `PROFILE`,
      GSI1PK: `USER#${user.userType}`,
      GSI1SK: now(),
      email: user.email,
      displayName: user.displayName,
      ...user,
      createdAt: now(),
      updatedAt: now()
    };
    
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: 'attribute_not_exists(PK)'
    }).promise();
    
    return user;
  },

  // Get user by ID
  async getUserById(userId) {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE'
      }
    }).promise();
    
    return result.Item;
  },

  // Get user by email
  async getUserByEmail(email) {
    const result = await dynamodb.query({
      TableName: TABLE_NAME,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();
    
    return result.Items[0];
  },

  // Check if display name exists
  async displayNameExists(displayName) {
    const result = await dynamodb.query({
      TableName: TABLE_NAME,
      IndexName: 'DisplayNameIndex',
      KeyConditionExpression: 'displayName = :displayName',
      ExpressionAttributeValues: {
        ':displayName': displayName
      }
    }).promise();
    
    return result.Items.length > 0;
  },

  // Create game
  async createGame(game) {
    const gameId = uuidv4();
    const item = {
      PK: `GAME#${gameId}`,
      SK: 'DETAILS',
      GSI1PK: `GAME#${game.status || 'setup'}`,
      GSI1SK: game.gameDate,
      ...game,
      id: gameId,
      createdAt: now(),
      updatedAt: now()
    };
    
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();
    
    // Initialize 100 squares for the game
    const squares = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        squares.push({
          PK: `GAME#${gameId}`,
          SK: `SQUARE#${row}#${col}`,
          GSI1PK: `SQUARE#available`,
          GSI1SK: now(),
          id: `${gameId}-${row}-${col}`,
          gameId,
          row,
          col,
          status: 'available',
          createdAt: now()
        });
      }
    }
    
    // Batch write squares
    const batches = [];
    for (let i = 0; i < squares.length; i += 25) {
      batches.push(squares.slice(i, i + 25));
    }
    
    for (const batch of batches) {
      const params = {
        RequestItems: {
          [TABLE_NAME]: batch.map(square => ({
            PutRequest: { Item: square }
          }))
        }
      };
      await dynamodb.batchWrite(params).promise();
    }
    
    return { ...game, id: gameId };
  },

  // Get games
  async getGames(filters = {}) {
    const { status, limit = 20, cursor } = filters;
    
    let params = {
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': status ? `GAME#${status}` : 'GAME#setup'
      },
      Limit: limit,
      ScanIndexForward: false
    };
    
    if (cursor) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(cursor, 'base64').toString());
    }
    
    const result = await dynamodb.query(params).promise();
    
    return {
      items: result.Items,
      nextCursor: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') : null,
      count: result.Count
    };
  },

  // Get game by ID
  async getGameById(gameId) {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `GAME#${gameId}`,
        SK: 'DETAILS'
      }
    }).promise();
    
    return result.Item;
  },

  // Get game squares
  async getGameSquares(gameId) {
    const result = await dynamodb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `GAME#${gameId}`,
        ':sk': 'SQUARE#'
      }
    }).promise();
    
    return result.Items;
  },

  // Create square request
  async createSquareRequest(request) {
    const requestId = uuidv4();
    const item = {
      PK: `GAME#${request.gameId}`,
      SK: `REQUEST#${requestId}`,
      GSI1PK: `REQUEST#pending`,
      GSI1SK: now(),
      ...request,
      id: requestId,
      status: 'pending',
      requestedAt: now()
    };
    
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();
    
    // Update square to requested status
    await dynamodb.update({
      TableName: TABLE_NAME,
      Key: {
        PK: `GAME#${request.gameId}`,
        SK: `SQUARE#${request.row}#${request.col}`
      },
      UpdateExpression: 'SET #status = :status, playerId = :playerId, playerDisplayName = :displayName, requestedAt = :requestedAt, GSI1PK = :gsi1pk',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'requested',
        ':playerId': request.playerId,
        ':displayName': request.playerDisplayName,
        ':requestedAt': now(),
        ':gsi1pk': 'SQUARE#requested'
      }
    }).promise();
    
    return { ...request, id: requestId };
  },

  // Approve square request
  async approveSquareRequest(requestId, gameId) {
    // Update request status
    await dynamodb.update({
      TableName: TABLE_NAME,
      Key: {
        PK: `GAME#${gameId}`,
        SK: `REQUEST#${requestId}`
      },
      UpdateExpression: 'SET #status = :status, processedAt = :processedAt, GSI1PK = :gsi1pk',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'approved',
        ':processedAt': now(),
        ':gsi1pk': 'REQUEST#approved'
      }
    }).promise();
    
    // Get request details to update square
    const requestResult = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `GAME#${gameId}`,
        SK: `REQUEST#${requestId}`
      }
    }).promise();
    
    const request = requestResult.Item;
    
    // Update square to approved status
    await dynamodb.update({
      TableName: TABLE_NAME,
      Key: {
        PK: `GAME#${gameId}`,
        SK: `SQUARE#${request.row}#${request.col}`
      },
      UpdateExpression: 'SET #status = :status, approvedAt = :approvedAt, GSI1PK = :gsi1pk',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'approved',
        ':approvedAt': now(),
        ':gsi1pk': 'SQUARE#approved'
      }
    }).promise();
  }
};

// Route handlers
const handlers = {
  // Health check
  'GET /health': async () => {
    return successResponse({ status: 'healthy', timestamp: now() });
  },

  // Authentication endpoints
  'POST /auth/register': async (event) => {
    const { username, email, displayName, password } = JSON.parse(event.body);
    
    // Validate required fields
    if (!username || !email || !displayName || !password) {
      return errorResponse(400, 'Missing required fields');
    }
    
    // Check if email already exists
    const existingUser = await dbOperations.getUserByEmail(email);
    if (existingUser) {
      return errorResponse(400, 'Email already registered');
    }
    
    // Check if display name already exists
    const displayNameExists = await dbOperations.displayNameExists(displayName);
    if (displayNameExists) {
      return errorResponse(400, 'Display name already taken');
    }
    
    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      username,
      email,
      displayName,
      userType: 'player',
      createdAt: now(),
      updatedAt: now()
    };
    
    await dbOperations.createUser(user);
    
    return successResponse({ user }, 'User created successfully');
  },

  // Game endpoints
  'GET /games': async (event) => {
    const { status, limit, cursor } = event.queryStringParameters || {};
    const games = await dbOperations.getGames({ status, limit, cursor });
    return successResponse(games);
  },

  'GET /games/:id': async (event) => {
    const gameId = event.pathParameters.id;
    const game = await dbOperations.getGameById(gameId);
    
    if (!game) {
      return errorResponse(404, 'Game not found');
    }
    
    return successResponse(game);
  },

  'POST /games': async (event) => {
    try {
      authenticate(event);
    } catch (error) {
      return errorResponse(401, error.message);
    }
    
    const gameData = JSON.parse(event.body);
    const game = await dbOperations.createGame(gameData);
    return successResponse(game, 'Game created successfully');
  },

  'GET /games/:id/squares': async (event) => {
    const gameId = event.pathParameters.id;
    const squares = await dbOperations.getGameSquares(gameId);
    return successResponse(squares);
  },

  'POST /games/:id/squares/request': async (event) => {
    try {
      const user = authenticate(event);
      const gameId = event.pathParameters.id;
      const { row, col } = JSON.parse(event.body);
      
      const request = {
        gameId,
        row,
        col,
        playerId: user.sub || user.id,
        playerDisplayName: user.displayName
      };
      
      const createdRequest = await dbOperations.createSquareRequest(request);
      return successResponse(createdRequest, 'Square request created');
    } catch (error) {
      return errorResponse(401, error.message);
    }
  },

  // Admin endpoints
  'POST /requests/:id/approve': async (event) => {
    try {
      authenticate(event);
      const requestId = event.pathParameters.id;
      
      // Note: In production, you'd need to extract gameId from the request
      // For now, this is a simplified implementation
      await dbOperations.approveSquareRequest(requestId, 'gameId');
      return successResponse({}, 'Request approved');
    } catch (error) {
      return errorResponse(401, error.message);
    }
  }
};

// Main handler
exports.api = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return response(200, {});
    }
    
    // Build route key
    const routeKey = `${event.httpMethod} ${event.path}`;
    console.log('Route Key:', routeKey);
    
    // Check for exact match first
    if (handlers[routeKey]) {
      return await handlers[routeKey](event);
    }
    
    // Check for parameterized routes
    for (const [pattern, handler] of Object.entries(handlers)) {
      const [method, path] = pattern.split(' ');
      if (method !== event.httpMethod) continue;
      
      const pathRegex = new RegExp('^' + path.replace(/:([^/]+)/g, '([^/]+)') + '$');
      const match = event.path.match(pathRegex);
      
      if (match) {
        const paramNames = (path.match(/:([^/]+)/g) || []).map(p => p.substring(1));
        const pathParameters = {};
        paramNames.forEach((name, index) => {
          pathParameters[name] = match[index + 1];
        });
        
        event.pathParameters = pathParameters;
        return await handler(event);
      }
    }
    
    return errorResponse(404, 'Route not found');
    
  } catch (error) {
    console.error('Handler error:', error);
    return errorResponse(500, 'Internal server error', { message: error.message });
  }
};