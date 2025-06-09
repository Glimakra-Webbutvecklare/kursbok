# Teknisk Intervju: Backend-utveckling med Node.js

Detta avsnitt innehåller vanliga tekniska intervjufrågor för backend-utveckling med Node.js. Frågorna täcker Node.js grundläggande, Express.js, REST API:er, MongoDB, autentisering och fullstack-utveckling.

## Fråga 1: Node.js Grundläggande och Event Loop

**Intervjuare:** "Förklara vad Node.js är och hur Event Loop fungerar. Visa skillnaden mellan synkron och asynkron kod."

**Bra svar:**
```javascript
// Node.js är en JavaScript runtime byggd på Chrome's V8-motor
// Event Loop hanterar asynkrona operationer utan att blockera

// Synkron kod (blockerar)
const fs = require('fs');
try {
  const data = fs.readFileSync('file.txt', 'utf8');
  console.log('Synkron:', data);
} catch (err) {
  console.error(err);
}

// Asynkron kod (blockerar inte)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('Asynkron callback:', data);
});

// Modern asynkron med Promises
const fsPromises = require('fs').promises;
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log('Async/await:', data);
  } catch (err) {
    console.error(err);
  }
}
```

**Förklaring:** Node.js använder single-threaded Event Loop som hanterar I/O-operationer asynkront. Detta gör Node.js perfekt för I/O-intensiva applikationer men mindre lämplig för CPU-intensiva uppgifter.

## Fråga 2: Express.js och Middleware

**Intervjuare:** "Skapa en Express-server med custom middleware för loggning och felhantering."

**Bra svar:**
```javascript
const express = require('express');
const app = express();

// Custom logging middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next(); // Viktigt att anropa next()
};

// Body parser middleware
app.use(express.json());
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/error', (req, res, next) => {
  // Simulera ett fel
  const error = new Error('Något gick fel!');
  error.status = 500;
  next(error); // Skicka fel till error handler
});

// Global error handling middleware (måste vara sist)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Förklaring:** Middleware körs i ordning och kan modifiera request/response eller avsluta request-response cykeln. Error middleware måste ha 4 parametrar.

## Fråga 3: RESTful API Design och HTTP-metoder

**Intervjuare:** "Designa ett RESTful API för en produktkatalog och förklara HTTP-metoderna."

**Bra svar:**
```javascript
const express = require('express');
const app = express();
app.use(express.json());

// In-memory data (i verkligheten skulle detta vara en databas)
let products = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
  { id: 2, name: 'Book', price: 19, category: 'Education' }
];

// GET /api/products - Hämta alla produkter
app.get('/api/products', (req, res) => {
  const { category, minPrice } = req.query;
  let filtered = products;
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(minPrice));
  }
  
  res.json(filtered);
});

// GET /api/products/:id - Hämta specifik produkt
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products - Skapa ny produkt
app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;
  
  // Validering
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Uppdatera produkt
app.put('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, price, category } = req.body;
  products[productIndex] = { 
    id: parseInt(req.params.id), 
    name, 
    price: parseFloat(price), 
    category 
  };
  
  res.json(products[productIndex]);
});

// DELETE /api/products/:id - Ta bort produkt
app.delete('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  res.status(204).send(); // No content
});
```

**HTTP-metoder:**
- GET: Hämta data (idempotent)
- POST: Skapa ny resurs
- PUT: Uppdatera/ersätt resurs (idempotent)
- DELETE: Ta bort resurs (idempotent)

## Fråga 4: MongoDB och Mongoose

**Intervjuare:** "Skapa Mongoose-modeller med validering och visa CRUD-operationer."

**Bra svar:**
```javascript
const mongoose = require('mongoose');

// Anslut till MongoDB
mongoose.connect('mongodb://localhost:27017/webshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Product Schema med validering
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual property (beräknad egenskap)
productSchema.virtual('discountedPrice').get(function() {
  return this.price * 0.9; // 10% rabatt
});

// Middleware - körs innan sparning
productSchema.pre('save', function(next) {
  console.log(`Saving product: ${this.name}`);
  next();
});

const Product = mongoose.model('Product', productSchema);

// CRUD Operations med async/await
class ProductService {
  // Create
  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }
  
  // Read
  static async getAllProducts(filters = {}) {
    try {
      const query = {};
      if (filters.category) query.category = filters.category;
      if (filters.inStock !== undefined) query.inStock = filters.inStock;
      
      return await Product.find(query)
        .sort({ createdAt: -1 })
        .limit(10);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }
  
  static async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }
  
  // Update
  static async updateProduct(id, updateData) {
    try {
      const product = await Product.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete
  static async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }
}

// Användning i Express routes
app.post('/api/products', async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Förklaring:** Mongoose ger schemavalidering, middleware hooks och elegant syntax för MongoDB-operationer.

## Fråga 5: JWT-autentisering och Authorization

**Intervjuare:** "Implementera JWT-baserad autentisering med middleware för skyddade routes."

**Bra svar:**
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Kontrollera om användare redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hasha lösenord
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Skapa användare
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Skapa JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username, email }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hitta användare
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verifiera lösenord
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Skapa JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // Lägg till användardatun till request
    next();
  });
};

// Authorization middleware för admin
const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Skyddade routes
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only route
app.delete('/api/admin/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Förklaring:** JWT innehåller användardata och är självsignerande. Autentisering verifierar vem du är, auktorisation kontrollerar vad du får göra.

## Fråga 6: Felhantering och Validering

**Intervjuare:** "Visa hur du implementerar robust felhantering och input-validering i en Express-app."

**Bra svar:**
```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');

// Custom Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation middleware
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1-50 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('category')
    .isIn(['Electronics', 'Clothing', 'Books'])
    .withMessage('Invalid category')
];

// Check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errorMessages 
    });
  }
  next();
};

// Route med validering
app.post('/api/products', 
  validateProduct, 
  handleValidationErrors, 
  async (req, res, next) => {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error); // Skicka till error handler
    }
  }
);

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Användning av async handler
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json(product);
}));

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  // Log error (i produktion skicka till logging service)
  console.error(err);

  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    ...(process.NODE_ENV === 'development' && { stack: err.stack })
  });
};

app.use(globalErrorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
```

**Förklaring:** Strukturerad felhantering med custom error klasser, validering med express-validator och global error middleware för konsekvent felhantering.

## Fråga 7: Environment Variables och Configuration

**Intervjuare:** "Hur hanterar du konfiguration och miljövariabler i en Node.js-applikation?"

**Bra svar:**
```javascript
// .env fil (aldrig commit till git)
/*
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
REDIS_URL=redis://localhost:6379
*/

// config/config.js
require('dotenv').config();

const config = {
  development: {
    port: process.env.PORT || 3000,
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp-dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    bcrypt: {
      rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  production: {
    port: process.env.PORT || 8080,
    mongodb: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    },
    bcrypt: {
      rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
    }
  },
  test: {
    port: 4000,
    mongodb: {
      uri: 'mongodb://localhost:27017/myapp-test'
    },
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h'
    }
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];

// Användning i applikationen
const config = require('./config/config');
const mongoose = require('mongoose');

// Validera required miljövariabler
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Anslut till databas med config
mongoose.connect(config.mongodb.uri, config.mongodb.options)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Server setup
const app = express();
app.listen(config.port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${config.port}`);
});
```

**Best Practices:**
- Använd dotenv för development
- Validera required miljövariabler vid start
- Olika konfigurationer för olika miljöer
- Aldrig commit .env-filer till version control

## Fråga 8: Prestanda och Caching

**Intervjuare:** "Hur optimerar du prestanda i en Node.js-applikation med caching?"

**Bra svar:**
```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache middleware
const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        console.log('Cache hit');
        return res.json(JSON.parse(cached));
      }
      
      // Modifiera res.json för att spara till cache
      const originalJson = res.json;
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next(); // Fortsätt utan cache vid fel
    }
  };
};

// Database query optimization
class ProductService {
  static async getProductsWithPagination(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    // Bygg query med index
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.priceRange) {
      query.price = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max
      };
    }
    
    // Parallel queries för bättre prestanda
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .select('name price category') // Välj endast nödvändiga fält
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Returnera plain JavaScript objects
      Product.countDocuments(query)
    ]);
    
    return {
      products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    };
  }
  
  // Batch operations för bättre prestanda
  static async createMultipleProducts(productsData) {
    return await Product.insertMany(productsData, {
      ordered: false, // Fortsätt även om några misslyckas
      rawResult: true
    });
  }
}

// Routes med cache och prestanda-optimering
app.get('/api/products', cache(300), async (req, res) => {
  try {
    const { page, limit, category, minPrice, maxPrice } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? parseFloat(minPrice) : 0,
        max: maxPrice ? parseFloat(maxPrice) : Number.MAX_VALUE
      };
    }
    
    const result = await ProductService.getProductsWithPagination(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      filters
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compression middleware för mindre responses
const compression = require('compression');
app.use(compression());

// Rate limiting för skydd mot överbelastning
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100, // Max 100 requests per IP
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Connection pooling för databas
const mongoose = require('mongoose');
mongoose.connect(config.mongodb.uri, {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0 // Disable mongoose buffering
});
```

**Prestandaoptimering:**
- Redis för caching
- Database indexing och query optimization
- Connection pooling
- Compression och rate limiting
- Pagination för stora datasets

## Fråga 9: Testing i Node.js

**Intervjuare:** "Hur testar du en Node.js/Express-applikation? Visa unit tests och integration tests."

**Bra svar:**
```javascript
// package.json
/*
{
  "scripts": {
    "test": "NODE_ENV=test mocha --recursive --timeout 10000",
    "test:watch": "npm test -- --watch",
    "test:coverage": "nyc npm test"
  },
  "devDependencies": {
    "mocha": "^9.0.0",
    "chai": "^4.3.0",
    "chai-http": "^4.3.0",
    "sinon": "^11.1.0",
    "nyc": "^15.1.0"
  }
}
*/

// test/setup.js
const mongoose = require('mongoose');

before(async function() {
  this.timeout(10000);
  // Anslut till test-databas
  await mongoose.connect('mongodb://localhost:27017/myapp-test');
});

beforeEach(async function() {
  // Rensa databas innan varje test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

after(async function() {
  await mongoose.connection.close();
});

// test/unit/productService.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const ProductService = require('../../services/ProductService');
const Product = require('../../models/Product');

describe('ProductService', () => {
  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        category: 'Electronics'
      };
      
      // Mock Product.save
      const mockSave = sinon.stub(Product.prototype, 'save');
      mockSave.resolves({ _id: '123', ...productData });
      
      const result = await ProductService.createProduct(productData);
      
      expect(result).to.have.property('_id');
      expect(result.name).to.equal(productData.name);
      expect(mockSave.calledOnce).to.be.true;
      
      mockSave.restore();
    });
    
    it('should throw error for invalid product data', async () => {
      const invalidData = { name: '', price: -10 };
      
      try {
        await ProductService.createProduct(invalidData);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('validation');
      }
    });
  });
});

// test/integration/products.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const Product = require('../../models/Product');

chai.use(chaiHttp);
const { expect } = chai;

describe('Products API', () => {
  let authToken;
  
  before(async () => {
    // Skapa test-användare och få token
    const user = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send(user);
    
    authToken = res.body.token;
  });
  
  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Skapa test data
      await Product.create([
        { name: 'Product 1', price: 100, category: 'Electronics' },
        { name: 'Product 2', price: 200, category: 'Clothing' }
      ]);
    });
    
    it('should get all products', async () => {
      const res = await chai.request(app)
        .get('/api/products')
        .expect(200);
      
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0]).to.have.property('name');
      expect(res.body[0]).to.have.property('price');
    });
    
    it('should filter products by category', async () => {
      const res = await chai.request(app)
        .get('/api/products?category=Electronics')
        .expect(200);
      
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].category).to.equal('Electronics');
    });
  });
  
  describe('POST /api/products', () => {
    it('should create a new product with valid auth', async () => {
      const newProduct = {
        name: 'New Product',
        price: 150,
        category: 'Electronics'
      };
      
      const res = await chai.request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct)
        .expect(201);
      
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal(newProduct.name);
      
      // Verifiera i databas
      const productInDb = await Product.findById(res.body._id);
      expect(productInDb).to.not.be.null;
    });
    
    it('should return 401 without auth token', async () => {
      const newProduct = {
        name: 'Unauthorized Product',
        price: 150,
        category: 'Electronics'
      };
      
      await chai.request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(401);
    });
    
    it('should return 400 for invalid data', async () => {
      const invalidProduct = {
        name: '', // Tomt namn
        price: -50 // Negativt pris
      };
      
      const res = await chai.request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProduct)
        .expect(400);
      
      expect(res.body).to.have.property('error');
    });
  });
});

// test/middleware/auth.test.js  
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });
  
  it('should pass with valid token', () => {
    const token = jwt.sign({ userId: '123' }, 'test-secret');
    req.headers.authorization = `Bearer ${token}`;
    
    const jwtStub = sinon.stub(jwt, 'verify');
    jwtStub.yields(null, { userId: '123' });
    
    authenticateToken(req, res, next);
    
    expect(next.calledOnce).to.be.true;
    expect(req.user).to.deep.equal({ userId: '123' });
    
    jwtStub.restore();
  });
  
  it('should return 401 without token', () => {
    authenticateToken(req, res, next);
    
    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });
});
```

**Testing Best Practices:**
- Separata test-databas
- Mock externa dependencies
- Test både lyckade och misslyckade scenarier
- Integration tests för API endpoints
- Code coverage för att mäta test-täckning

## Fråga 10: Deployment och DevOps

**Intervjuare:** "Hur deployar du en Node.js-applikation och vilka verktyg använder du för CI/CD?"

**Bra svar:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
      redis:
        image: redis:6
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test
      env:
        NODE_ENV: test
        MONGODB_URI: mongodb://localhost:27017/test
        JWT_SECRET: test-secret
    
    - name: Run security audit
      run: npm audit
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

```dockerfile
# Dockerfile
FROM node:16-alpine

# Skapa app directory
WORKDIR /usr/src/app

# Kopiera package files
COPY package*.json ./

# Installera dependencies
RUN npm ci --only=production

# Kopiera app source
COPY . .

# Skapa non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Ändra ownership
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Exponera port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Starta app
CMD ["node", "server.js"]
```

```javascript
// healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped
  
  mongo:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped
  
  redis:
    image: redis:6-alpine
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
```

**Deployment Best Practices:**
- Automated testing och linting
- Security scanning och dependency audit
- Health checks och monitoring
- Load balancing med nginx
- SSL certificates och HTTPS
- Environment-specific configurations

---

**Sammanfattning av viktiga Node.js-koncept:**
- Event Loop och asynkron programmering
- Express middleware och routing
- MongoDB/Mongoose för datalagring
- JWT-autentisering och säkerhet
- RESTful API design
- Testing och deployment strategies
- Prestanda-optimering och caching
- Error handling och validering
