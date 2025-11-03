# Praktiska Övningar - Backend-utveckling

Nu är det dags att tillämpa allt du lärt dig! Dessa fyra projekt bygger progressivt på varandra - från grundläggande Express-applikationer till fullständiga backend-system med autentisering och databasintegration.

## Övning 1: Todo API med Express och MongoDB

**Mål**: Bygga en fullständig RESTful API för todo-hantering med MongoDB-integration.

**Vad du kommer lära dig**:
- Express routing och middleware
- MongoDB-integration med Mongoose
- CRUD-operationer med testning
- Felhantering och validering
- API-design och automatiserad testning med Jest

### Steg 1: Projekt-setup

Börja med att skapa projektet och installera alla dependencies (beroenden) du behöver.

```bash
mkdir todo-api
cd todo-api
npm init -y
```

**Din uppgift**: Installera dependencies. Tänk på:
- Express för servern
- Mongoose för MongoDB
- Middleware: cors, helmet, morgan
- dotenv för miljövariabler
- Jest och supertest för testning (som utvecklingsberoenden)
- nodemon för automatisk omstart (som utvecklingsberoende)

<details>
<summary>Visa lösning</summary>

```bash
npm install express mongoose cors helmet morgan dotenv
npm install --save-dev jest supertest nodemon
```
</details>

Nu behöver du konfigurera `package.json` för ES6-moduler och lägga till scripts.

**Din uppgift**: Uppdatera `package.json`:
1. Lägg till `"type": "module"` för att aktivera ES6-moduler
2. Lägg till scripts för `start`, `dev` och `test`
3. För test-scriptet, använd flaggan `--experimental-vm-modules` (se `testning.md`)

<details>
<summary>Visa lösning</summary>

```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.0.0",
    "nodemon": "^2.0.0"
  }
}
```
</details>

Skapa projektstrukturen:

```
todo-api/
├── server.js
├── models/
│   └── Todo.js
├── controllers/
│   └── todoController.js
├── routes/
│   └── todos.js
├── middleware/
│   └── errorHandler.js
└── .env
```

### Steg 2: Skapa Todo-modellen

Skapa filen `models/Todo.js`. Börja med grundläggande schema-definition:

```javascript
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel krävs'],
    trim: true
    // TODO: Lägg till maxlength-validering (100 tecken)
  },
  // TODO: Lägg till fält för description, completed, priority
});
```

**Din uppgift**: 
1. Komplettera schemat med:
   - `description`: String, trim, maxlength 500 tecken
   - `completed`: Boolean med default `false`
   - `priority`: String, enum ['low', 'medium', 'high'], default 'medium'
   - `dueDate`: Date (valfritt)
   - `category`: String, trim (valfritt)
   - `createdAt`: Date med default `Date.now`
   - `updatedAt`: Date med default `Date.now`
2. Lägg till maxlength-validering för title (100 tecken)

<details>
<summary>Visa lösning</summary>

```javascript
import mongoose from 'mongoose';

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

export default mongoose.model('Todo', todoSchema);
```
</details>

Nu lägger vi till pre-hook (krok) för att automatiskt uppdatera `updatedAt`:

**Din uppgift**: Lägg till en `pre('save')` hook som uppdaterar `updatedAt` när dokumentet modifieras (men inte när det skapas första gången).

Tips: Använd `this.isModified()` och `this.isNew` för att kontrollera.

<details>
<summary>Visa lösning</summary>

```javascript
// Uppdatera updatedAt före sparning
todoSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});
```
</details>

Lägg till en virtual (beräknat fält) för att räkna ut antal dagar kvar till `dueDate`:

**Din uppgift**: Skapa en virtual `daysUntilDue` som:
- Returnerar `null` om `dueDate` saknas
- Annars räknar ut antal dagar (kan vara negativt om datumet har passerat)
- Inkludera virtuals när JSON konverteras med `todoSchema.set('toJSON', { virtuals: true })`

<details>
<summary>Visa lösning</summary>

```javascript
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
```
</details>

### Steg 3: Testa Todo-modellen

Innan vi bygger API:et ska vi testa modellen direkt. Skapa `models/Todo.test.js`:

```javascript
import mongoose from 'mongoose';
import Todo from './Todo.js';

// Anslut till testdatabas
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/todo-api-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Todo Model', () => {
  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  test('skapar todo med required fields', async () => {
    // TODO: Skapa en todo med endast title
    // TODO: Verifiera att den sparades korrekt
    // TODO: Verifiera att completed är false (default)
    // TODO: Verifiera att priority är 'medium' (default)
  });
});
```

**Din uppgift**: 
1. Skriv testet som skapar en todo med endast `title` och verifierar att den sparades korrekt med defaults
2. Lägg till test som verifierar att `title` är required (förväntat fel när du försöker spara utan title)
3. Lägg till test som verifierar maxlength för title (försök spara med för lång title)
4. Lägg till test som verifierar att `daysUntilDue` virtual fungerar

<details>
<summary>Visa lösning</summary>

```javascript
import mongoose from 'mongoose';
import Todo from './Todo.js';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/todo-api-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Todo Model', () => {
  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  test('skapar todo med required fields', async () => {
    const todo = new Todo({ title: 'Test todo' });
    const savedTodo = await todo.save();
    
    expect(savedTodo.title).toBe('Test todo');
    expect(savedTodo.completed).toBe(false);
    expect(savedTodo.priority).toBe('medium');
    expect(savedTodo).toHaveProperty('createdAt');
    expect(savedTodo).toHaveProperty('_id');
  });

  test('kräver title', async () => {
    const todo = new Todo({});
    await expect(todo.save()).rejects.toThrow();
  });

  test('validerar maxlength för title', async () => {
    const longTitle = 'a'.repeat(101);
    const todo = new Todo({ title: longTitle });
    await expect(todo.save()).rejects.toThrow();
  });

  test('beräknar daysUntilDue korrekt', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todo = new Todo({ 
      title: 'Test',
      dueDate: tomorrow 
    });
    const savedTodo = await todo.save();
    
    expect(savedTodo.daysUntilDue).toBe(1);
  });
});
```
</details>

### Steg 4: Skapa Todo Controller - Grundläggande CRUD

Börja med `controllers/todoController.js`. Vi bygger metod för metod och testar varje.

```javascript
import Todo from '../models/Todo.js';

class TodoController {
  // TODO: Implementera getAllTodos
  static async getAllTodos(req, res, next) {
    try {
      // TODO: Hämta alla todos med Todo.find()
      // TODO: Skicka tillbaka som JSON
    } catch (error) {
      next(error);
    }
  }

  // TODO: Implementera getTodoById
  static async getTodoById(req, res, next) {
    try {
      // TODO: Hitta todo med Todo.findById(req.params.id)
      // TODO: Returnera 404 om inte hittad
      // TODO: Returnera todo som JSON
    } catch (error) {
      next(error);
    }
  }
}

export default TodoController;
```

**Din uppgift**: 
1. Implementera `getAllTodos` som hämtar alla todos
2. Implementera `getTodoById` som:
   - Hämtar todo med `req.params.id`
   - Returnerar 404 med felmeddelande om den inte finns
   - Returnerar todo som JSON om den finns

<details>
<summary>Visa lösning</summary>

```javascript
import Todo from '../models/Todo.js';

class TodoController {
  static async getAllTodos(req, res, next) {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  }

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
}

export default TodoController;
```
</details>

Nu lägger vi till `createTodo`:

**Din uppgift**: Implementera `createTodo` som:
- Skapar ny todo från `req.body`
- Sparar den
- Returnerar 201 status med Location-header och todo som JSON

<details>
<summary>Visa lösning</summary>

```javascript
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
```
</details>

Lägg till `updateTodo` och `deleteTodo`:

**Din uppgift**: 
1. Implementera `updateTodo` med `findByIdAndUpdate` (använd `{ new: true, runValidators: true }`)
2. Implementera `deleteTodo` med `findByIdAndDelete`
3. Båda ska returnera 404 om todo inte finns
4. `deleteTodo` ska returnera 204 status (inget innehåll)

<details>
<summary>Visa lösning</summary>

```javascript
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
```
</details>

### Steg 5: Testa Controller med Supertest

Skapa `controllers/todoController.test.js`. Börja med att sätta upp testmiljön:

```javascript
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import TodoController from './todoController.js';

const app = express();
app.use(express.json());

// Routes - vi lägger till dessa senare, för nu testar vi direkt
// app.use('/api/todos', todoRoutes);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/todo-api-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('TodoController', () => {
  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  // TODO: Skriv tester här
});
```

**Din uppgift**: Skriv tester för:
1. `createTodo` - verifiera att todo skapas korrekt
2. `getAllTodos` - verifiera att alla todos returneras
3. `getTodoById` - verifiera att specifik todo returneras och 404 om inte hittad
4. `updateTodo` - verifiera att todo uppdateras
5. `deleteTodo` - verifiera att todo tas bort

Tips: Du behöver skapa routes först för att testa. Vi gör det i nästa steg, men du kan testa controller-metoderna direkt också.

<details>
<summary>Visa lösning</summary>

För att testa controllers behöver vi routes. Vi gör en enkel route-fil först:

```javascript
// routes/todos.js (temporär för tester)
import express from 'express';
import TodoController from '../controllers/todoController.js';

const router = express.Router();

router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

export default router;
```

```javascript
// controllers/todoController.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import todosRouter from '../routes/todos.js';

const app = express();
app.use(express.json());
app.use('/api/todos', todosRouter);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/todo-api-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('TodoController', () => {
  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  describe('POST /api/todos', () => {
    test('skapar ny todo', async () => {
      const newTodo = {
        title: 'Test todo',
        description: 'Test description',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body.title).toBe('Test todo');
      expect(response.body.priority).toBe('high');
      expect(response.body).toHaveProperty('_id');
    });
  });

  describe('GET /api/todos', () => {
    test('returnerar alla todos', async () => {
      await Todo.create([
        { title: 'Todo 1' },
        { title: 'Todo 2' }
      ]);

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/todos/:id', () => {
    test('returnerar specifik todo', async () => {
      const created = await Todo.create({ title: 'Test todo' });

      const response = await request(app)
        .get(`/api/todos/${created._id}`)
        .expect(200);

      expect(response.body.title).toBe('Test todo');
    });

    test('returnerar 404 om todo inte finns', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/todos/${fakeId}`)
        .expect(404);
    });
  });
});
```
</details>

### Steg 6: Avancerade Controller-funktioner

Nu lägger vi till filtering, sortering och pagination i `getAllTodos`:

**Din uppgift**: Utöka `getAllTodos` för att hantera query-parametrar:
- `completed` - filtrera på completed status
- `priority` - filtrera på priority
- `sortBy` - sortera på fält (default 'createdAt')
- `order` - 'asc' eller 'desc' (default 'desc')
- `page` - sidnummer för pagination (default 1)
- `limit` - antal per sida (default 10)

<details>
<summary>Visa lösning</summary>

```javascript
static async getAllTodos(req, res, next) {
  try {
    const { 
      completed, 
      priority, 
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Bygg filter
    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;

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
      }
    });

  } catch (error) {
    next(error);
  }
}
```
</details>

Lägg till search-funktionalitet:

**Din uppgift**: Utöka `getAllTodos` med `search` query-parameter som söker i `title` och `description` med case-insensitive matchning.

<details>
<summary>Visa lösning</summary>

```javascript
// I filter-delen, lägg till:
if (search) {
  filter.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') }
  ];
}
```
</details>

Lägg till `toggleTodo`-metod:

**Din uppgift**: Implementera `toggleTodo` som växlar `completed` status för en todo.

<details>
<summary>Visa lösning</summary>

```javascript
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
```
</details>

### Steg 7: Routes och Server

Skapa `routes/todos.js`:

**Din uppgift**: Skapa router med routes för alla controller-metoder:
- GET `/` - getAllTodos
- GET `/:id` - getTodoById
- POST `/` - createTodo
- PUT `/:id` - updateTodo
- PATCH `/:id/toggle` - toggleTodo
- DELETE `/:id` - deleteTodo

<details>
<summary>Visa lösning</summary>

```javascript
import express from 'express';
import TodoController from '../controllers/todoController.js';

const router = express.Router();

router.get('/', TodoController.getAllTodos);
router.get('/stats', TodoController.getTodoStats);
router.get('/:id', TodoController.getTodoById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.patch('/:id/toggle', TodoController.toggleTodo);
router.delete('/:id', TodoController.deleteTodo);

export default router;
```
</details>

Skapa `middleware/errorHandler.js`:

**Din uppgift**: Skapa en error handler middleware som:
- Hanterar Mongoose validation errors
- Hanterar Mongoose cast errors (ogiltigt ID)
- Returnerar lämpliga status codes och felmeddelanden

<details>
<summary>Visa lösning</summary>

```javascript
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Ogiltigt ID-format' });
  }

  res.status(500).json({ 
    error: err.message || 'Serverfel' 
  });
};

export default errorHandler;
```
</details>

Skapa `server.js`:

**Din uppgift**: Skapa Express-server som:
- Importerar routes och middleware
- Ansluter till MongoDB (använd `MONGODB_URI` från `.env` eller default)
- Lägger till middleware: helmet, cors, morgan, express.json
- Lägger till routes under `/api/todos`
- Har health check endpoint `/api/health`
- Hanterar 404 för `/api/*`
- Använder error handler

<details>
<summary>Visa lösning</summary>

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import todosRouter from './routes/todos.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Anslut till MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-api');

// Routes
app.use('/api/todos', todosRouter);

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
</details>

### Steg 8: Utmaning - Statistik-endpoint

**Din uppgift**: Implementera `getTodoStats` i controller som använder MongoDB aggregation för att räkna:
- Totalt antal todos
- Antal completed
- Antal pending
- Antal high priority
- Fördelning per priority (low/medium/high)

Tips: Använd `Todo.aggregate()` med `$group` för att räkna.

<details>
<summary>Visa lösning</summary>

```javascript
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
```
</details>

### Steg 9: Testa hela API:et

Skapa ett testskript eller använd Postman/Insomnia för att testa alla endpoints manuellt.

**Alternativt - Testa med cURL**:

```bash
# Starta servern först
npm run dev

# I ett annat terminalfönster:
BASE_URL="http://localhost:3000/api"

# Skapa todos
curl -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lär dig Node.js","priority":"high","category":"development"}'

curl -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{"title":"Handla mat","priority":"medium","category":"personal"}'

# Hämta alla todos
curl "$BASE_URL/todos"

# Hämta statistik
curl "$BASE_URL/todos/stats"

# Filtrera todos
curl "$BASE_URL/todos?priority=high"
```

Grattis! Du har nu byggt en komplett REST API med testning. I nästa övning lägger vi till autentisering.

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

## Sammanfattning

Dessa fyra övningar tar dig från grundläggande Express-applikationer till avancerade real-time system. Varje projekt bygger på kunskaperna från föregående och introducerar nya koncept:

1. **Todo API**: Grundläggande CRUD, MongoDB, felhantering
2. **Blog API**: JWT-autentisering, användarsystem, behörigheter  
3. **E-handel API**: Komplex datamodellering, transaktioner, inventoriehantering

Efter att ha genomfört dessa projekt har du en solid grund i modern backend-utveckling med Node.js!

## Nästa steg

- **Deploiera till produktion** med Docker och cloud services
- **Implementera CI/CD** för automatisk testning och deployment
- **Lägg till monitoring** och logging för produktion
