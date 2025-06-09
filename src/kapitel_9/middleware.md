# Middleware och Autentisering

Middleware är hjärtat i Express-applikationer - funktioner som utförs mellan en HTTP-förfrågan och svaret. De möjliggör modulär hantering av allt från loggning och autentisering till felhantering och säkerhet. I detta avsnitt ska vi utforska hur man bygger robusta autentiseringssystem med JWT.

## Vad är Middleware?

Middleware är funktioner som har åtkomst till request-objektet (req), response-objektet (res) och nästa middleware-funktion i applikationens request-response-cykel. De kan:

- **Exekvera kod** under request-cykeln
- **Modifiera request och response** objekt
- **Avsluta request-response** cykeln
- **Anropa nästa middleware** i stacken med `next()`

```javascript
// Grundläggande middleware-struktur
const middleware = (req, res, next) => {
  // Utför någon operation
  console.log('Middleware körs!');
  
  // Anropa next() för att fortsätta till nästa middleware
  next();
};

// Eller avsluta request-cykeln
const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Ingen token' });
  }
  next();
};
```

```mermaid
flowchart LR
    A[HTTP Request] --> B[Middleware 1<br/>Logger]
    B --> C[Middleware 2<br/>Auth]
    C --> D[Middleware 3<br/>Validation]
    D --> E[Route Handler]
    E --> F[HTTP Response]
    
    B -.->|Error| G[Error Handler]
    C -.->|Error| G
    D -.->|Error| G
    E -.->|Error| G
```

## Inbyggd och tredjeparts-middleware

Express kommer med inbyggd middleware och det finns tusentals tredjepartsmoduler:

### Inbyggd Express Middleware

```javascript
const express = require('express');
const app = express();

// Parsa JSON requests
app.use(express.json({ limit: '10mb' }));

// Parsa URL-encoded data (formulär)
app.use(express.urlencoded({ extended: true }));

// Servera statiska filer
app.use(express.static('public'));

// Kombinera med sökväg
app.use('/uploads', express.static('uploads'));
```

### Populär Tredjeparts-middleware

```javascript
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Säkerhetshuvuden
app.use(helmet());

// HTTP request logging
app.use(morgan('combined'));

// Gzip compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100, // Max antal requests per IP
  message: 'För många förfrågningar från denna IP'
});
app.use('/api/', limiter);
```

## Skapa egen middleware

### Logging Middleware

```javascript
// Enkel logging middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent');
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  next();
};

// Avancerad logging med request time
const advancedLogger = (req, res, next) => {
  const start = Date.now();
  
  // Hook into response.end för att mäta tid
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    originalEnd.apply(this, args);
  };
  
  next();
};

app.use(logger);
```

### Request Validation Middleware

```javascript
const { body, validationResult } = require('express-validator');

// Validation rules
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2, max: 50 })
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Valideringsfel',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Användning
app.post('/api/users', validateUser, handleValidationErrors, (req, res) => {
  // Skapar användare - data är redan validerad
});
```

### Error Handling Middleware

```javascript
// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler (måste ha 4 parametrar)
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = { message: 'Resurs inte hittad', statusCode: 404 };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = { message: `${field} finns redan`, statusCode: 409 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Ogiltig token', statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token har gått ut', statusCode: 401 };
  }

  console.error(err);

  res.status(error.statusCode || 500).json({
    error: error.message || 'Serverfel',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Använd error handler sist
app.use(errorHandler);
```

## Autentisering vs Auktorisation

**Autentisering** (Authentication) svarar på frågan "Vem är du?" - verifierar användarens identitet.

**Auktorisation** (Authorization) svarar på frågan "Vad får du göra?" - kontrollerar användarens behörigheter.

```javascript
// Autentisering: Verifiera att användaren är inloggad
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token krävs' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Ogiltig token' });
  }
};

// Auktorisation: Kontrollera att användaren har rätt behörigheter
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Inte autentiserad' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Otillåten åtkomst' });
    }
    
    next();
  };
};

// Användning
app.get('/api/profile', authenticate, (req, res) => {
  // Alla inloggade användare
});

app.delete('/api/users/:id', authenticate, authorize(['admin']), (req, res) => {
  // Endast admins
});
```

## JSON Web Tokens (JWT)

JWT är en öppen standard för att säkert överföra information mellan parter som JSON-objekt.

### JWT-struktur

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
```

**Header**: Algoritm och typ
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**: Data (claims)
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Signature**: Signatur för att verifiera integritet

### Implementera JWT-autentisering

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthController {
  // Registrera användare
  static async register(req, res) {
    try {
      const { username, email, password, role = 'user' } = req.body;
      
      // Kontrollera om användaren redan finns
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Användare med denna e-post eller användarnamn finns redan' 
        });
      }
      
      // Hasha lösenord
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Skapa användare
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role
      });
      
      await user.save();
      
      // Skapa JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      // Skicka response utan lösenord
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      res.status(201).json({
        message: 'Användare skapad framgångsrikt',
        token,
        user: userResponse
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Kunde inte registrera användare' });
    }
  }
  
  // Logga in användare
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Hitta användare (inkludera lösenord för verifiering)
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' });
      }
      
      // Kontrollera lösenord
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' });
      }
      
      // Kontrollera om kontot är aktivt
      if (!user.isActive) {
        return res.status(401).json({ error: 'Kontot är inaktiverat' });
      }
      
      // Uppdatera senaste inloggning
      user.lastLogin = new Date();
      await user.save();
      
      // Skapa JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      res.json({
        message: 'Inloggning lyckades',
        token,
        user: userResponse
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Kunde inte logga in' });
    }
  }
  
  // Hämta användarens profil
  static async getProfile(req, res) {
    try {
      // req.user kommer från auth middleware
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'Användare inte hittad' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Kunde inte hämta profil' });
    }
  }
  
  // Uppdatera lösenord
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user.id).select('+password');
      
      // Verifiera nuvarande lösenord
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Felaktigt nuvarande lösenord' });
      }
      
      // Hasha nytt lösenord
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      
      await user.save();
      
      res.json({ message: 'Lösenord uppdaterat framgångsrikt' });
      
    } catch (error) {
      res.status(500).json({ error: 'Kunde inte uppdatera lösenord' });
    }
  }
}

module.exports = AuthController;
```

## Hashing och säkerhet

### Säker lösenordshantering

```javascript
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PasswordUtils {
  // Hash lösenord med bcrypt
  static async hashPassword(password) {
    const saltRounds = 12; // Högt antal för säkerhet
    return await bcrypt.hash(password, saltRounds);
  }
  
  // Verifiera lösenord
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  // Generera säkert random lösenord
  static generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }
  
  // Validera lösenordsstyrka
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Lösenord måste vara minst ${minLength} tecken`);
    }
    if (!hasUpperCase) {
      errors.push('Lösenord måste innehålla minst en stor bokstav');
    }
    if (!hasLowerCase) {
      errors.push('Lösenord måste innehålla minst en liten bokstav');
    }
    if (!hasNumbers) {
      errors.push('Lösenord måste innehålla minst en siffra');
    }
    if (!hasSpecialChars) {
      errors.push('Lösenord måste innehålla minst ett specialtecken');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### JWT Security Best Practices

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTUtils {
  // Skapa token med custom claims
  static createToken(payload, options = {}) {
    const defaultOptions = {
      expiresIn: '15m', // Kort livslängd för access tokens
      issuer: 'myapp',
      audience: 'myapp-users'
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
      ...defaultOptions,
      ...options
    });
  }
  
  // Skapa refresh token
  static createRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }
  
  // Verifiera token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Ogiltig eller utgången token');
    }
  }
  
  // Blacklist för utloggade tokens
  static tokenBlacklist = new Set();
  
  static blacklistToken(token) {
    this.tokenBlacklist.add(token);
  }
  
  static isTokenBlacklisted(token) {
    return this.tokenBlacklist.has(token);
  }
}

// Förbättrat auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token krävs' });
  }
  
  // Kontrollera blacklist
  if (JWTUtils.isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token är ogiltig' });
  }
  
  try {
    const decoded = JWTUtils.verifyToken(token);
    req.user = decoded;
    req.token = token; // Spara för möjlig blacklisting
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
```

## Fullständigt autentiseringssystem

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Publika routes
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Skyddade routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);
router.post('/logout', authenticateToken, AuthController.logout);

// Admin routes
router.get('/users', authenticateToken, authorize(['admin']), AuthController.getAllUsers);
router.put('/users/:id/role', authenticateToken, authorize(['admin']), AuthController.updateUserRole);

module.exports = router;

// app.js
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

Middleware och autentisering är grundpelare i säker webbutveckling. Genom att förstå och implementera dessa koncept kan du bygga applikationer som skyddar användardata och säkerställer att endast auktoriserade användare får åtkomst till känslig funktionalitet.

Nästa steg är att lära sig om sessionshantering och cookies för mer avancerad användarhantering!