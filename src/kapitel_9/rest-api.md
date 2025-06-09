# RESTful API:er - Professionella Web-API:er

REST (Representational State Transfer) är en arkitekturstil för att designa webb-API:er som är intuitive, skalbar och enkla att använda. RESTful API:er har blivit standarden för modern webbutveckling och är fundamentala för att skapa robusta backend-tjänster.

## Vad är en RESTful API?

REST är en uppsättning designprinciper som definierar hur webb-API:er ska struktureras:

- **Stateless**: Varje request innehåller all information som behövs
- **Client-Server Architecture**: Tydlig separation mellan klient och server
- **Cacheable**: Responses kan cachas för bättre prestanda
- **Uniform Interface**: Konsekvent sätt att interagera med resurser
- **Layered System**: Arkitekturen kan ha flera lager
- **Code on Demand** (valfritt): Servern kan skicka körbar kod

### REST vs Andra API-stilar

```javascript
// REST - Resursbaserat
GET    /api/users           // Hämta alla användare
GET    /api/users/123       // Hämta specifik användare
POST   /api/users           // Skapa ny användare
PUT    /api/users/123       // Uppdatera användare
DELETE /api/users/123       // Ta bort användare

// RPC-stil (Remote Procedure Call) - Funktionsbaserat
POST /api/getUsers
POST /api/createUser
POST /api/updateUser
POST /api/deleteUser

// GraphQL - Query-baserat
POST /api/graphql
{
  query: "{ users { id name email } }"
}
```

## HTTP-metoder och deras användning

Varje HTTP-metod har ett specifikt syfte i RESTful design:

### GET - Hämta data

```javascript
// Hämta alla resurser
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta böcker' });
  }
});

// Hämta specifik resurs
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Fel vid hämtning av bok' });
  }
});

// Hämta med query parameters
app.get('/api/books', async (req, res) => {
  const { category, author, sortBy, page = 1, limit = 10 } = req.query;
  
  const filter = {};
  if (category) filter.category = category;
  if (author) filter.author = new RegExp(author, 'i');
  
  const sort = {};
  if (sortBy) {
    const [field, order] = sortBy.split(':');
    sort[field] = order === 'desc' ? -1 : 1;
  }
  
  const skip = (page - 1) * limit;
  
  try {
    const books = await Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Book.countDocuments(filter);
    
    res.json({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### POST - Skapa ny resurs

```javascript
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, category } = req.body;
    
    // Validering
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Titel och författare krävs' 
      });
    }
    
    // Kontrollera om ISBN redan finns
    if (isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(409).json({ 
          error: 'En bok med detta ISBN finns redan' 
        });
      }
    }
    
    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn,
      publishedYear,
      category
    });
    
    const savedBook = await book.save();
    
    // 201 Created med Location header
    res.status(201)
       .location(`/api/books/${savedBook._id}`)
       .json(savedBook);
       
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Valideringsfel',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Kunde inte skapa bok' });
  }
});
```

### PUT - Uppdatera hel resurs

```javascript
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, category } = req.body;
    
    // Validering av required fields
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Titel och författare krävs' 
      });
    }
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        author: author.trim(),
        isbn,
        publishedYear,
        category,
        updatedAt: new Date()
      },
      { 
        new: true, // Returnera uppdaterat dokument
        runValidators: true // Kör schemavalidering
      }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    
    res.json(updatedBook);
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Valideringsfel',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Kunde inte uppdatera bok' });
  }
});
```

### PATCH - Delvis uppdatering

```javascript
app.patch('/api/books/:id', async (req, res) => {
  try {
    const allowedUpdates = ['title', 'author', 'isbn', 'publishedYear', 'category'];
    const updates = {};
    
    // Filtrera endast tillåtna fält
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: 'Inga giltiga fält att uppdatera' 
      });
    }
    
    updates.updatedAt = new Date();
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    
    res.json(updatedBook);
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera bok' });
  }
});
```

### DELETE - Ta bort resurs

```javascript
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    if (!deletedBook) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    
    // 204 No Content - ingen body returneras
    res.status(204).send();
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort bok' });
  }
});

// Bulk delete
app.delete('/api/books', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ 
        error: 'IDs måste vara en array' 
      });
    }
    
    const result = await Book.deleteMany({ 
      _id: { $in: ids } 
    });
    
    res.json({ 
      message: `${result.deletedCount} böcker borttagna`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort böcker' });
  }
});
```

## HTTP-statuskoder

Använd rätt statuskoder för att kommunicera resultat:

```javascript
// Success codes (2xx)
res.status(200).json(data);        // OK - lyckad GET, PUT, PATCH
res.status(201).json(newResource); // Created - lyckad POST
res.status(204).send();            // No Content - lyckad DELETE

// Client error codes (4xx)
res.status(400).json({ error: 'Bad Request - fel input' });
res.status(401).json({ error: 'Unauthorized - autentisering krävs' });
res.status(403).json({ error: 'Forbidden - otillåten åtkomst' });
res.status(404).json({ error: 'Not Found - resurs finns inte' });
res.status(409).json({ error: 'Conflict - resurs finns redan' });
res.status(422).json({ error: 'Unprocessable Entity - valideringsfel' });

// Server error codes (5xx)
res.status(500).json({ error: 'Internal Server Error' });
res.status(503).json({ error: 'Service Unavailable' });

// Utility function för konsekvent felhantering
const sendError = (res, statusCode, message, details = null) => {
  const error = { error: message };
  if (details) error.details = details;
  res.status(statusCode).json(error);
};
```

## Designprinciper för RESTful API:er

### 1. Använd substantiv, inte verb

```javascript
// Bra - resursbaserat
GET    /api/users
POST   /api/users
GET    /api/users/123
PUT    /api/users/123
DELETE /api/users/123

// Dåligt - funktionsbaserat
GET /api/getUsers
POST /api/createUser
GET /api/getUserById
```

### 2. Hierarkiska resurser

```javascript
// Nested resources
GET    /api/users/123/posts          // Användarens inlägg
POST   /api/users/123/posts          // Skapa inlägg för användare
GET    /api/users/123/posts/456      // Specifikt inlägg
PUT    /api/users/123/posts/456      // Uppdatera inlägg
DELETE /api/users/123/posts/456      // Ta bort inlägg

// Implementation
app.get('/api/users/:userId/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Filtrera, sortera och paginera

```javascript
// Query parameters för flexibilitet
app.get('/api/products', async (req, res) => {
  const {
    category,        // Filtrera efter kategori
    minPrice,        // Minimum pris
    maxPrice,        // Maximum pris
    sortBy = 'name', // Sortera efter (name, price, createdAt)
    order = 'asc',   // Sorteringsordning (asc, desc)
    page = 1,        // Sidnummer
    limit = 20,      // Antal per sida
    search           // Sökterm
  } = req.query;
  
  try {
    // Bygg filter
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    // Sortering
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        category,
        priceRange: { min: minPrice, max: maxPrice },
        search
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Bygga ett RESTful API med Express

Låt oss bygga ett komplett API för en bokhandel:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// Book model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, unique: true, sparse: true },
  publishedYear: { type: Number, min: 1000, max: new Date().getFullYear() },
  category: { 
    type: String, 
    enum: ['fiction', 'non-fiction', 'science', 'history', 'biography'],
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Validation middleware
const validateBook = [
  body('title').notEmpty().trim().isLength({ min: 1, max: 200 }),
  body('author').notEmpty().trim().isLength({ min: 1, max: 100 }),
  body('isbn').optional().isISBN(),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('category').isIn(['fiction', 'non-fiction', 'science', 'history', 'biography']),
  body('price').isFloat({ min: 0 }),
  body('description').optional().isLength({ max: 1000 })
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Valideringsfel',
      details: errors.array()
    });
  }
  next();
};

// Routes
class BookController {
  // GET /api/books
  static async getAllBooks(req, res) {
    try {
      const { 
        category, 
        author, 
        minPrice, 
        maxPrice, 
        inStock,
        search,
        sortBy = 'title',
        order = 'asc',
        page = 1,
        limit = 10 
      } = req.query;
      
      const filter = {};
      if (category) filter.category = category;
      if (author) filter.author = new RegExp(author, 'i');
      if (inStock !== undefined) filter.inStock = inStock === 'true';
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      
      if (search) {
        filter.$or = [
          { title: new RegExp(search, 'i') },
          { author: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }
      
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
      const skip = (page - 1) * limit;
      
      const [books, total] = await Promise.all([
        Book.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit)),
        Book.countDocuments(filter)
      ]);
      
      res.json({
        books,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Kunde inte hämta böcker' });
    }
  }
  
  // GET /api/books/:id
  static async getBookById(req, res) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Bok inte hittad' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Kunde inte hämta bok' });
    }
  }
  
  // POST /api/books
  static async createBook(req, res) {
    try {
      const book = new Book(req.body);
      const savedBook = await book.save();
      
      res.status(201)
         .location(`/api/books/${savedBook._id}`)
         .json(savedBook);
         
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'ISBN finns redan' });
      }
      res.status(500).json({ error: 'Kunde inte skapa bok' });
    }
  }
  
  // PUT /api/books/:id
  static async updateBook(req, res) {
    try {
      req.body.updatedAt = new Date();
      
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!book) {
        return res.status(404).json({ error: 'Bok inte hittad' });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Kunde inte uppdatera bok' });
    }
  }
  
  // DELETE /api/books/:id
  static async deleteBook(req, res) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      
      if (!book) {
        return res.status(404).json({ error: 'Bok inte hittad' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Kunde inte ta bort bok' });
    }
  }
}

// API Routes
app.get('/api/books', BookController.getAllBooks);
app.get('/api/books/:id', BookController.getBookById);
app.post('/api/books', validateBook, handleValidation, BookController.createBook);
app.put('/api/books/:id', validateBook, handleValidation, BookController.updateBook);
app.delete('/api/books/:id', BookController.deleteBook);

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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Något gick fel!' });
});

module.exports = app;
```

## API-dokumentation och testning

### OpenAPI/Swagger dokumentation

```javascript
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Hämta alla böcker
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrera efter kategori
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Sidnummer för pagination
 *     responses:
 *       200:
 *         description: Lista av böcker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 */
```

### Testning med cURL

```bash
# Hämta alla böcker
curl -X GET "http://localhost:3000/api/books"

# Hämta böcker med filter
curl -X GET "http://localhost:3000/api/books?category=fiction&page=1&limit=5"

# Skapa ny bok
curl -X POST "http://localhost:3000/api/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "category": "fiction",
    "price": 199,
    "publishedYear": 1949
  }'

# Uppdatera bok
curl -X PUT "http://localhost:3000/api/books/BOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984 - Updated",
    "author": "George Orwell",
    "category": "fiction",
    "price": 249,
    "publishedYear": 1949
  }'

# Ta bort bok
curl -X DELETE "http://localhost:3000/api/books/BOOK_ID"
```

## Best Practices för RESTful API:er

### 1. Versioning

```javascript
// URL-baserad versioning
app.use('/api/v1/books', booksV1Router);
app.use('/api/v2/books', booksV2Router);

// Header-baserad versioning
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100, // Max 100 requests per IP
  message: {
    error: 'För många förfrågningar, försök igen senare'
  }
});

app.use('/api/', limiter);
```

### 3. CORS-hantering

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Säkerhet

```javascript
const helmet = require('helmet');

app.use(helmet()); // Säkerhetshuvuden
app.use(express.json({ limit: '10mb' })); // Begränsa request size
```

RESTful API:er ger dig en solid grund för att bygga skalbara och underhållbara backend-tjänster. Genom att följa REST-principerna skapar du API:er som är intuitiva för utvecklare att använda och enkla att underhålla över tid.

Nästa steg är att lära dig om autentisering och säkerhet för att skydda dina API:er!