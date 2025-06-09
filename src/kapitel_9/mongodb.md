# MongoDB och Mongoose

MongoDB är en NoSQL-databas som lagrar data i JSON-liknande dokument istället för traditionella tabeller. I kombination med Mongoose - en elegant ODM (Object Document Mapping) för Node.js - blir datahantering både kraftfull och elegant.

## Introduktion till MongoDB

MongoDB är en dokumentorienterad databas som erbjuder:

- **Flexibel schema**: Dokument i samma kollektion kan ha olika strukturer
- **Skalbarhet**: Horisontell skalning genom sharding
- **High Performance**: Optimerad för snabba läs- och skrivoperationer
- **Rich Query Language**: Kraftfulla sökfunktioner och aggregations
- **JSON-native**: Data lagras i BSON (Binary JSON) format

### NoSQL vs SQL

```javascript
// SQL (relationell databas)
// Tabeller med fasta kolumner
Users Table:
| id | name     | email              | age |
|----|----------|--------------------|-----|
| 1  | Anna     | anna@example.com   | 25  |
| 2  | Erik     | erik@example.com   | 30  |

// MongoDB (dokument-databas)
// Flexibla dokument i kollektioner
{
  "_id": ObjectId("..."),
  "name": "Anna",
  "email": "anna@example.com",
  "age": 25,
  "preferences": {
    "newsletter": true,
    "theme": "dark"
  },
  "tags": ["developer", "javascript"]
}
```

## Installation och Setup

### Installera MongoDB

**macOS (med Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**
Alternativt kan du använda MongoDB Atlas för en helt hanterad cloud-lösning:
1. Skapa konto på [mongodb.com/atlas](https://mongodb.com/atlas)
2. Skapa ett kluster
3. Hämta connection string

### Installera Mongoose

```bash
npm install mongoose
```

## Grundläggande MongoDB-kommandon

### MongoDB Shell

```bash
# Anslut till MongoDB
mongosh

# Visa databaser
show dbs

# Välj/skapa databas
use minapp

# Visa kollektioner
show collections

# Skapa dokument
db.users.insertOne({
  name: "Anna",
  email: "anna@example.com",
  age: 25
})

# Hitta dokument
db.users.find()
db.users.findOne({ name: "Anna" })

# Uppdatera dokument
db.users.updateOne(
  { name: "Anna" },
  { $set: { age: 26 } }
)

# Ta bort dokument
db.users.deleteOne({ name: "Anna" })
```

## Introduktion till Mongoose

Mongoose är ett ODM-bibliotek som ger:

- **Schema definition**: Strukturera data med valideringsregler
- **Middleware support**: Hook-funktioner för före/efter operationer
- **Type casting**: Automatisk typkonvertering
- **Validation**: Inbyggd datavalidering
- **Query building**: Eleganta databasförfrågningar

### Ansluta till MongoDB

```javascript
const mongoose = require('mongoose');

// Anslut till lokala MongoDB
mongoose.connect('mongodb://localhost:27017/minapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Event handlers
mongoose.connection.on('connected', () => {
  console.log('Ansluten till MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB-fel:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Frånkopplad från MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

## Definiera scheman och modeller

Scheman definierar strukturen för dina dokument:

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Grundläggande schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Namn krävs'],
    trim: true,
    maxlength: [50, 'Namnet kan inte överstiga 50 tecken']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Ogiltig e-postadress'
    }
  },
  age: {
    type: Number,
    min: [0, 'Ålder måste vara positiv'],
    max: [120, 'Ålder måste vara realistisk']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    newsletter: { type: Boolean, default: false },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  tags: [String], // Array av strängar
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Skapa modell från schema
const User = mongoose.model('User', userSchema);

module.exports = User;
```

### Avancerade Schema-funktioner

```javascript
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // Referens till annan modell
    required: true
  },
  reviews: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  slug: String,
  inventory: {
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  }
});

// Virtual property (beräknas dynamiskt)
productSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / this.reviews.length;
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// Static methods
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId });
};

// Instance methods
productSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({ user: userId, rating, comment });
  return this.save();
};

const Product = mongoose.model('Product', productSchema);
```

## CRUD-operationer med Mongoose

### Create (Skapa)

```javascript
// Skapa enskilt dokument
const user = new User({
  name: 'Anna Andersson',
  email: 'anna@example.com',
  age: 25
});

try {
  const savedUser = await user.save();
  console.log('Användare sparad:', savedUser);
} catch (error) {
  console.error('Fel vid sparning:', error.message);
}

// Alternativ metod
const user2 = await User.create({
  name: 'Erik Eriksson',
  email: 'erik@example.com',
  age: 30
});

// Skapa flera dokument
const users = await User.insertMany([
  { name: 'Lisa', email: 'lisa@example.com', age: 28 },
  { name: 'Johan', email: 'johan@example.com', age: 32 }
]);
```

### Read (Läsa)

```javascript
// Hitta alla dokument
const allUsers = await User.find();

// Hitta med filter
const activeUsers = await User.find({ isActive: true });

// Hitta ett dokument
const user = await User.findOne({ email: 'anna@example.com' });

// Hitta med ID
const userById = await User.findById('64a7b8c9d2e3f4a5b6c7d8e9');

// Avancerade queries
const filteredUsers = await User.find({
  age: { $gte: 25, $lte: 35 }, // Ålder mellan 25-35
  isActive: true,
  tags: { $in: ['developer', 'designer'] } // Har minst en av taggarna
})
.select('name email age') // Välj specifika fält
.sort({ age: -1 }) // Sortera fallande efter ålder
.limit(10) // Max 10 resultat
.skip(0); // Hoppa över första 0 (pagination)

// Population (hämta relaterade dokument)
const products = await Product.find()
  .populate('category', 'name description')
  .populate('reviews.user', 'name email');
```

### Update (Uppdatera)

```javascript
// Uppdatera ett dokument
const updatedUser = await User.findByIdAndUpdate(
  '64a7b8c9d2e3f4a5b6c7d8e9',
  { 
    age: 26,
    'preferences.theme': 'dark'
  },
  { 
    new: true, // Returnera uppdaterat dokument
    runValidators: true // Kör schemavalidering
  }
);

// Uppdatera flera dokument
const result = await User.updateMany(
  { isActive: false },
  { isActive: true }
);
console.log(`${result.modifiedCount} användare uppdaterade`);

// Atomära operationer
await User.findByIdAndUpdate(userId, {
  $push: { tags: 'javascript' }, // Lägg till i array
  $inc: { age: 1 }, // Öka värde
  $set: { 'preferences.newsletter': true }, // Sätt värde
  $unset: { temporaryField: '' } // Ta bort fält
});
```

### Delete (Ta bort)

```javascript
// Ta bort ett dokument
const deletedUser = await User.findByIdAndDelete('64a7b8c9d2e3f4a5b6c7d8e9');

// Ta bort med villkor
await User.deleteOne({ email: 'temp@example.com' });

// Ta bort flera dokument
const result = await User.deleteMany({ isActive: false });
console.log(`${result.deletedCount} användare borttagna`);
```

## Validering och middleware i Mongoose

### Custom Validators

```javascript
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    validate: {
      validator: async function(username) {
        // Kontrollera att användarnamnet är unikt
        const user = await mongoose.model('User').findOne({ username });
        return !user || user._id.equals(this._id);
      },
      message: 'Användarnamnet är redan taget'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(password) {
        // Kräv minst 8 tecken, en stor bokstav och en siffra
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);
      },
      message: 'Lösenordet uppfyller inte säkerhetskraven'
    }
  }
});
```

### Middleware Hooks

```javascript
const bcrypt = require('bcrypt');

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hasha lösenord innan sparning
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  // Generera slug från namn
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  
  next();
});

// Post-save middleware
userSchema.post('save', function(doc) {
  console.log(`Användare ${doc.name} sparad med ID: ${doc._id}`);
});

// Pre-remove middleware
userSchema.pre('remove', async function(next) {
  // Ta bort användarens inlägg när användaren tas bort
  await mongoose.model('Post').deleteMany({ author: this._id });
  next();
});
```

## Relationshantering

### Referenser mellan modeller

```javascript
// Author schema
const authorSchema = new Schema({
  name: String,
  email: String
});

// Book schema med referens
const bookSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
});

// Användning med population
const books = await Book.find()
  .populate('author', 'name email')
  .populate('categories', 'name');

// Nested population
const bookWithDetails = await Book.findById(bookId)
  .populate({
    path: 'author',
    select: 'name email',
    populate: {
      path: 'profile',
      select: 'bio avatar'
    }
  });
```

### Embedded documents

```javascript
const orderSchema = new Schema({
  customer: {
    name: String,
    email: String,
    address: {
      street: String,
      city: String,
      zipCode: String,
      country: { type: String, default: 'Sweden' }
    }
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered'],
    default: 'pending'
  }
});

// Beräkna total automatiskt
orderSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  next();
});
```

## Praktiskt exempel: Blog-system

```javascript
// models/User.js
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// models/Post.js
const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  slug: { type: String, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [String],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  featured: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate slug och excerpt
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  
  this.updatedAt = Date.now();
  next();
});

// Statisk metod för att hitta publicerade inlägg
postSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .populate('author', 'username profile.firstName profile.lastName')
    .populate('categories', 'name slug')
    .sort({ publishedAt: -1 });
};

// Service för blog-operationer
class BlogService {
  static async createPost(postData, authorId) {
    const post = new Post({
      ...postData,
      author: authorId
    });
    
    if (post.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    
    return await post.save();
  }
  
  static async getPostsWithPagination(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, totalCount] = await Promise.all([
      Post.findPublished()
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ status: 'published' })
    ]);
    
    return {
      posts,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    };
  }
  
  static async getPostBySlug(slug) {
    return await Post.findOne({ slug, status: 'published' })
      .populate('author', 'username profile')
      .populate('categories', 'name slug');
  }
}

module.exports = { User, Post, BlogService };
```

MongoDB och Mongoose ger dig kraftfulla verktyg för modern datalagring. Dess flexibilitet gör det perfekt för webapplikationer där datakrav utvecklas över tid, medan Mongoose tillhandahåller struktur och säkerhet genom scheman och validering.

Nästa steg är att lära dig hur du bygger RESTful API:er som effektivt använder denna datalagring!