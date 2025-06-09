# Praktiska Övningar - Backend-utveckling

Nu är det dags att tillämpa allt du lärt dig! Dessa fyra projekt bygger progressivt på varandra - från grundläggande Express-applikationer till fullständiga backend-system med autentisering och databasintegration.

## Övning 1: Todo API med Express och MongoDB

**Mål**: Bygga en fullständig RESTful API för todo-hantering med MongoDB-integration.

**Vad du kommer lära dig**:
- Express routing och middleware
- MongoDB-integration med Mongoose
- CRUD-operationer
- Felhantering och validering
- API-design och -testning

### Setup och grund

```bash
mkdir todo-api
cd todo-api
npm init -y

# Installera dependencies
npm install express mongoose cors helmet morgan
npm install --save-dev nodemon
```

**package.json scripts**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Projektstruktur

```
todo-api/
├── server.js
├── config/
│   └── database.js
├── models/
│   └── Todo.js
├── controllers/
│   └── todoController.js
├── routes/
│   └── todos.js
├── middleware/
│   ├── errorHandler.js
│   └── validation.js
└── .env
```

### Implementation

**models/Todo.js**:
```javascript
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel krävs'],
    trim: true,
    maxlength: [100, 'Titel kan inte överstiga 100 tecken']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Beskrivning kan inte överstiga 500 tecken']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  category: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Uppdatera updatedAt före sparning
todoSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Virtual för att räkna ut hur många dagar kvar
todoSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Inkludera virtuals när JSON konverteras
todoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Todo', todoSchema);
```

**controllers/todoController.js**:
```javascript
const Todo = require('../models/Todo');

class TodoController {
  // GET /api/todos - Hämta alla todos med filtering och sortering
  static async getAllTodos(req, res, next) {
    try {
      const { 
        completed, 
        priority, 
        category,
        sortBy = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 10,
        search
      } = req.query;

      // Bygg filter
      const filter = {};
      if (completed !== undefined) filter.completed = completed === 'true';
      if (priority) filter.priority = priority;
      if (category) filter.category = new RegExp(category, 'i');
      if (search) {
        filter.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }

      // Bygg sortering
      const sort = {};
      sort[sortBy] = order === 'desc' ? -1 : 1;

      // Pagination
      const skip = (page - 1) * limit;

      const [todos, totalCount] = await Promise.all([
        Todo.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Todo.countDocuments(filter)
      ]);

      res.json({
        todos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        filters: { completed, priority, category, search }
      });

    } catch (error) {
      next(error);
    }
  }

  // GET /api/todos/:id - Hämta specifik todo
  static async getTodoById(req, res, next) {
    try {
      const todo = await Todo.findById(req.params.id);
      
      if (!todo) {
        return res.status(404).json({ error: 'Todo inte hittad' });
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/todos - Skapa ny todo
  static async createTodo(req, res, next) {
    try {
      const todo = new Todo(req.body);
      const savedTodo = await todo.save();

      res.status(201)
         .location(`/api/todos/${savedTodo._id}`)
         .json(savedTodo);

    } catch (error) {
      next(error);
    }
  }

  // PUT /api/todos/:id - Uppdatera todo
  static async updateTodo(req, res, next) {
    try {
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!todo) {
        return res.status(404).json({ error: 'Todo inte hittad' });
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/todos/:id/toggle - Växla completed status
  static async toggleTodo(req, res, next) {
    try {
      const todo = await Todo.findById(req.params.id);
      
      if (!todo) {
        return res.status(404).json({ error: 'Todo inte hittad' });
      }

      todo.completed = !todo.completed;
      await todo.save();

      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/todos/:id - Ta bort todo
  static async deleteTodo(req, res, next) {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);

      if (!todo) {
        return res.status(404).json({ error: 'Todo inte hittad' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // GET /api/todos/stats - Hämta statistik
  static async getTodoStats(req, res, next) {
    try {
      const stats = await Todo.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: ['$completed', 1, 0] } },
            pending: { $sum: { $cond: ['$completed', 0, 1] } },
            highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } }
          }
        }
      ]);

      const priorityStats = await Todo.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);

      res.json({
        overview: stats[0] || { total: 0, completed: 0, pending: 0, highPriority: 0 },
        byPriority: priorityStats
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
```

**server.js**:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Anslut till MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-api');

// Routes
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint finns inte' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Todo API körs på port ${PORT}`);
});
```

### Testning

**Testskript för cURL**:
```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "=== Testing Todo API ==="

# Skapa todos
echo "Creating todos..."
curl -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lär dig Node.js","priority":"high","category":"development"}'

curl -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{"title":"Handla mat","priority":"medium","category":"personal"}'

# Hämta alla todos
echo -e "\n\nFetching all todos..."
curl "$BASE_URL/todos"

# Hämta statistik
echo -e "\n\nFetching stats..."
curl "$BASE_URL/todos/stats"

# Filtrera todos
echo -e "\n\nFiltering by priority..."
curl "$BASE_URL/todos?priority=high"
```

---

## Övning 2: Blog API med JWT-autentisering

**Mål**: Utöka kunskaperna med användarautentisering, roller och skyddade routes.

**Vad du kommer lära dig**:
- JWT-implementation
- Användarhantering och roller
- Protected routes
- Middleware för autentisering
- Lösenordshashing med bcrypt

### Projektstruktur

```
blog-api/
├── server.js
├── config/
│   ├── database.js
│   └── jwt.js
├── models/
│   ├── User.js
│   └── Post.js
├── controllers/
│   ├── authController.js
│   └── postController.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── routes/
│   ├── auth.js
│   └── posts.js
└── .env
```

### Modeller

**models/User.js**:
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Användarnamn krävs'],
    unique: true,
    trim: true,
    minlength: [3, 'Användarnamn måste vara minst 3 tecken'],
    maxlength: [30, 'Användarnamn kan inte överstiga 30 tecken']
  },
  email: {
    type: String,
    required: [true, 'E-post krävs'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Ogiltig e-postadress'
    }
  },
  password: {
    type: String,
    required: [true, 'Lösenord krävs'],
    minlength: [6, 'Lösenord måste vara minst 6 tecken'],
    select: false // Inkludera inte i queries som standard
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash lösenord före sparning
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metod för att verifiera lösenord
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**models/Post.js**:
```javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel krävs'],
    trim: true,
    maxlength: [200, 'Titel kan inte överstiga 200 tecken']
  },
  content: {
    type: String,
    required: [true, 'Innehåll krävs'],
    minlength: [10, 'Innehåll måste vara minst 10 tecken']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt kan inte överstiga 300 tecken']
  },
  slug: {
    type: String,
    unique: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generera slug från titel
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Generera excerpt om det inte finns
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  
  // Sätt publishedAt när status ändras till published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', postSchema);
```

### Autentisering

**middleware/auth.js**:
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token krävs' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Ogiltig token' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token har gått ut' });
    }
    res.status(403).json({ error: 'Ogiltig token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autentisering krävs' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Otillåten åtkomst' });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignorera fel för optional auth
    next();
  }
};

module.exports = { authenticateToken, authorize, optionalAuth };
```

**controllers/authController.js**:
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password, profile } = req.body;

      const user = new User({
        username,
        email,
        password,
        profile
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'Användare registrerad framgångsrikt',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Hitta användare och inkludera lösenord
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: 'Kontot är inaktiverat' });
      }

      // Uppdatera senaste inloggning
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);

      res.json({
        message: 'Inloggning lyckades',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const allowedUpdates = ['profile.firstName', 'profile.lastName', 'profile.bio'];
      const updates = {};

      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true }
      );

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
```

---

## Övning 3: E-handel API med beställningshantering

**Mål**: Bygga en komplex e-handelsbackend med produkter, beställningar och lagerhantering.

**Projektstruktur**:
```
ecommerce-api/
├── models/
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   └── Cart.js
├── controllers/
│   ├── productController.js
│   ├── orderController.js
│   └── cartController.js
└── services/
    ├── inventoryService.js
    └── paymentService.js
```

### Produktmodell

**models/Product.js**:
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Produktnamn krävs'],
    trim: true,
    maxlength: [100, 'Produktnamn kan inte överstiga 100 tecken']
  },
  description: {
    type: String,
    required: [true, 'Beskrivning krävs'],
    maxlength: [1000, 'Beskrivning kan inte överstiga 1000 tecken']
  },
  price: {
    type: Number,
    required: [true, 'Pris krävs'],
    min: [0, 'Pris måste vara positivt']
  },
  comparePrice: {
    type: Number,
    validate: {
      validator: function(v) {
        return v == null || v > this.price;
      },
      message: 'Jämförelsepris måste vara högre än ordinarie pris'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  sku: {
    type: String,
    required: true,
    unique: true
  },
  inventory: {
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 }
  },
  attributes: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    color: String,
    size: String,
    material: String
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual för tillgänglig kvantitet
productSchema.virtual('availableQuantity').get(function() {
  return this.inventory.quantity - this.inventory.reserved;
});

// Virtual för rabatt
productSchema.virtual('discount').get(function() {
  if (!this.comparePrice) return null;
  const discount = ((this.comparePrice - this.price) / this.comparePrice) * 100;
  return Math.round(discount);
});

// Virtual för lågt lager
productSchema.virtual('isLowStock').get(function() {
  return this.availableQuantity <= this.inventory.lowStockThreshold;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
```

### Beställningshantering

**models/Order.js**:
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  shipping: {
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'Sweden' }
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'klarna'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  totals: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generera ordernummer före sparning
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    this.orderNumber = `ORD-${timestamp.slice(-8)}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

### Inventory Service

**services/inventoryService.js**:
```javascript
const Product = require('../models/Product');

class InventoryService {
  static async reserveItems(items) {
    const reservations = [];
    
    try {
      for (const item of items) {
        const product = await Product.findById(item.product);
        
        if (!product) {
          throw new Error(`Produkt ${item.product} finns inte`);
        }
        
        if (product.availableQuantity < item.quantity) {
          throw new Error(`Otillräckligt lager för ${product.name}`);
        }
        
        // Reservera lager
        product.inventory.reserved += item.quantity;
        await product.save();
        
        reservations.push({
          product: item.product,
          quantity: item.quantity
        });
      }
      
      return reservations;
      
    } catch (error) {
      // Rulla tillbaka reservationer vid fel
      await this.releaseReservations(reservations);
      throw error;
    }
  }
  
  static async releaseReservations(reservations) {
    for (const reservation of reservations) {
      await Product.findByIdAndUpdate(
        reservation.product,
        { $inc: { 'inventory.reserved': -reservation.quantity } }
      );
    }
  }
  
  static async confirmReservations(reservations) {
    for (const reservation of reservations) {
      await Product.findByIdAndUpdate(
        reservation.product,
        { 
          $inc: { 
            'inventory.quantity': -reservation.quantity,
            'inventory.reserved': -reservation.quantity 
          } 
        }
      );
    }
  }
  
  static async checkLowStock() {
    return await Product.find({
      $expr: {
        $lte: [
          { $subtract: ['$inventory.quantity', '$inventory.reserved'] },
          '$inventory.lowStockThreshold'
        ]
      },
      isActive: true
    });
  }
}

module.exports = InventoryService;
```

---

## Övning 4: Real-time Chat API med Socket.io

**Mål**: Bygga ett real-time chat-system med Socket.io, Redis och avancerad funktionalitet.

**Funktioner**:
- Real-time meddelanden
- Rum/kanaler
- Användarstatus (online/offline)
- Meddelandehistorik
- Filuppladdning
- Typing indicators

### Setup

```bash
npm install socket.io redis ioredis multer sharp
```

**server.js**:
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const redis = new Redis(process.env.REDIS_URL);

// Socket.io middleware för autentisering
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('User not found'));
    }
    
    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

class ChatService {
  static async joinRoom(socket, roomId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit('error', { message: 'Rum inte hittat' });
        return;
      }
      
      // Kontrollera behörighet
      if (room.isPrivate && !room.members.includes(socket.userId)) {
        socket.emit('error', { message: 'Ingen åtkomst till rummet' });
        return;
      }
      
      socket.join(roomId);
      
      // Lägg till användare till rum om inte redan medlem
      if (!room.members.includes(socket.userId)) {
        room.members.push(socket.userId);
        await room.save();
      }
      
      // Sätt användare som online i rummet
      await redis.sadd(`room:${roomId}:online`, socket.userId);
      
      // Hämta och skicka senaste meddelanden
      const messages = await Message.find({ room: roomId })
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(50);
      
      socket.emit('room-joined', {
        room,
        messages: messages.reverse()
      });
      
      // Meddela andra i rummet
      socket.to(roomId).emit('user-joined', {
        user: socket.user,
        timestamp: new Date()
      });
      
    } catch (error) {
      socket.emit('error', { message: 'Kunde inte gå med i rum' });
    }
  }
  
  static async sendMessage(socket, data) {
    try {
      const { roomId, content, type = 'text' } = data;
      
      const message = new Message({
        sender: socket.userId,
        room: roomId,
        content,
        type
      });
      
      await message.save();
      await message.populate('sender', 'username avatar');
      
      // Skicka till alla i rummet
      io.to(roomId).emit('new-message', message);
      
      // Uppdatera rum med senaste meddelande
      await Room.findByIdAndUpdate(roomId, {
        lastMessage: message._id,
        lastActivity: new Date()
      });
      
    } catch (error) {
      socket.emit('error', { message: 'Kunde inte skicka meddelande' });
    }
  }
  
  static async handleTyping(socket, data) {
    const { roomId, isTyping } = data;
    
    if (isTyping) {
      await redis.sadd(`room:${roomId}:typing`, socket.userId);
    } else {
      await redis.srem(`room:${roomId}:typing`, socket.userId);
    }
    
    const typingUsers = await redis.smembers(`room:${roomId}:typing`);
    socket.to(roomId).emit('typing-update', {
      typingUsers: typingUsers.filter(id => id !== socket.userId)
    });
  }
  
  static async handleDisconnect(socket) {
    // Ta bort från alla typing-listor
    const keys = await redis.keys('room:*:typing');
    for (const key of keys) {
      await redis.srem(key, socket.userId);
    }
    
    // Ta bort från online-listor
    const onlineKeys = await redis.keys('room:*:online');
    for (const key of onlineKeys) {
      await redis.srem(key, socket.userId);
      
      // Meddela andra i rummet
      const roomId = key.split(':')[1];
      socket.to(roomId).emit('user-left', {
        userId: socket.userId,
        timestamp: new Date()
      });
    }
  }
}

io.on('connection', (socket) => {
  console.log(`User ${socket.user.username} connected`);
  
  socket.on('join-room', (data) => {
    ChatService.joinRoom(socket, data.roomId);
  });
  
  socket.on('send-message', (data) => {
    ChatService.sendMessage(socket, data);
  });
  
  socket.on('typing', (data) => {
    ChatService.handleTyping(socket, data);
  });
  
  socket.on('disconnect', () => {
    ChatService.handleDisconnect(socket);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server körs på port ${PORT}`);
});
```

### Utmaningar för vidareutveckling

1. **Lägg till filuppladdning** med Multer och Sharp för bildbehandling
2. **Implementera push-notifikationer** för offline-användare  
3. **Skapa admin-panel** för moderering av rum och meddelanden
4. **Lägg till end-to-end-kryptering** för privata meddelanden
5. **Implementera voice/video calls** med WebRTC
6. **Skapa bot-funktionalitet** för automatiska svar

## Sammanfattning

Dessa fyra övningar tar dig från grundläggande Express-applikationer till avancerade real-time system. Varje projekt bygger på kunskaperna från föregående och introducerar nya koncept:

1. **Todo API**: Grundläggande CRUD, MongoDB, felhantering
2. **Blog API**: JWT-autentisering, användarsystem, behörigheter  
3. **E-handel API**: Komplex datamodellering, transaktioner, inventoriehantering
4. **Chat API**: Real-time kommunikation, Socket.io, Redis, skalbarhet

Efter att ha genomfört dessa projekt har du en solid grund i modern backend-utveckling med Node.js!

## Nästa steg

- **Testa dina API:er** med Postman eller Insomnia
- **Skriv enhetstester** med Jest eller Mocha
- **Deploiera till produktion** med Docker och cloud services
- **Implementera CI/CD** för automatisk testning och deployment
- **Lägg till monitoring** och logging för produktion
