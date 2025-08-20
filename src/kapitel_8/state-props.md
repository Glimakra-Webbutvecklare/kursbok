# Lägga till Interaktivitet: Props, State och Events

Komponenter behöver ofta interagera med varandra och reagera på användarinteraktion. React använder **props** för att skicka data och **state** för att komma ihåg saker. Tillsammans gör de dina komponenter interaktiva!

**Mål:** Lära sig skicka data med props, hantera användarinteraktion med events och ge komponenter minne med state.

## Skicka Data med Props

React-komponenter använder **props** för att kommunicera med varandra. Varje föräldrakomponent kan skicka information till sina barnkomponenter genom att ge dem props.

### Grundläggande Props

```jsx
// Komponent som tar emot props
function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={person.imageUrl}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

// Föräldrakomponent som skickar props
function Profile() {
  return (
    <Avatar
      size={100}
      person={{ 
        name: 'Katsuko Saruhashi', 
        imageUrl: 'https://i.imgur.com/YfeOqp2s.jpg' 
      }}
    />
  );
}
```

### Props kan vara vilken datatyp som helst

```jsx
function Card({ title, children, isHighlighted, tags, onClose }) {
  return (
    <div className={`card ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="card-header">
        <h3>{title}</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="card-body">
        {children}
      </div>
      <div className="card-footer">
        {tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// Användning - skicka olika datatyper som props
function App() {
  return (
    <Card
      title="Min artikel"                    // string
      isHighlighted={true}                   // boolean
      tags={['react', 'javascript', 'web']} // array
      onClose={() => alert('Stänger!')}     // function
    >
      <p>Detta är innehållet i kortet.</p>   {/* children */}
    </Card>
  );
}
```

## Reagera på Events

Du kan reagera på events genom att deklarera **event handler**-funktioner inuti dina komponenter:

```jsx
function Button() {
  function handleClick() {
    alert('Du klickade på mig!');
  }

  return (
    <button onClick={handleClick}>
      Klicka mig
    </button>
  );
}
```

Observera att `onClick={handleClick}` inte har parenteser i slutet! Anropa inte event handler-funktionen: du behöver bara **skicka den nedåt**. React kommer att anropa din event handler när användaren klickar på knappen.

### Event Handlers kan vara inline

```jsx
function Button() {
  return (
    <button onClick={() => alert('Du klickade på mig!')}>
      Klicka mig
    </button>
  );
}
```

### Skicka Event Handlers som Props

Ofta vill du att föräldrakomponenten ska specificera en barnkomponents event handler:

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Spelar ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Spela "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Laddar upp!')}>
      Ladda upp bild
    </Button>
  );
}
```

## State: En Komponents Minne

Komponenter behöver ofta ändra vad som visas på skärmen som resultat av interaktion. Att skriva i formuläret bör uppdatera input-fältet, att klicka på "nästa" i en bildkarusell bör ändra vilken bild som visas, att klicka på "köp" bör lägga en produkt i kundvagnen. Komponenter behöver "komma ihåg" saker: det aktuella input-värdet, den aktuella bilden, kundvagnen. I React kallas denna typ av komponentspecifikt minne **state**.

### Lägga till State i en Komponent

För att lägga till state i en komponent, importera `useState` från React:

```jsx
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Klickad {count} gånger
    </button>
  );
}
```

`useState` returnerar två saker:
1. **Det aktuella state-värdet** (`count`)
2. **En funktion för att uppdatera det** (`setCount`)

Du kan ge dem vilka namn du vill, men konventionen är att skriva `[something, setSomething]`.

### State är isolerat och privat

State är lokalt för en komponentinstans på skärmen. Med andra ord, **om du renderar samma komponent två gånger får varje kopia sin egen state**:

```jsx
function MyApp() {
  return (
    <div>
      <h1>Räknare som uppdateras oberoende</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}
```

Observera hur varje knapp "kommer ihåg" sin egen `count`-state och inte påverkar den andra.

### Olika Typer av State

State kan innehålla vilken typ av JavaScript-värde som helst:

```jsx
import { useState } from 'react';

function Form() {
  // Olika typer av state
  const [name, setName] = useState('');           // string
  const [age, setAge] = useState(0);              // number  
  const [isSubscribed, setIsSubscribed] = useState(false); // boolean
  const [hobbies, setHobbies] = useState([]);     // array
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ditt namn"
      />
      <p>Hej {name}!</p>
      
      <input 
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Din ålder"
      />
      <p>Du är {age} år gammal.</p>
      
      <label>
        <input 
          type="checkbox"
          checked={isSubscribed}
          onChange={(e) => setIsSubscribed(e.target.checked)}
        />
        Prenumerera på nyhetsbrev
      </label>
      <p>{isSubscribed ? 'Du är prenumerant!' : 'Du är inte prenumerant.'}</p>
    </div>
  );
}
```

### State och Props Tillsammans

Ofta använder du state och props tillsammans. Här är ett exempel där en föräldrakomponent håller state och skickar det till barnkomponenter via props:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    setCount(count + 1);
  }

  return (
    <div>
      <h2>Räknare</h2>
      <CounterDisplay count={count} />
      <CounterButton onClick={handleIncrement} />
    </div>
  );
}

function CounterDisplay({ count }) {
  return <p>Aktuellt värde: {count}</p>;
}

function CounterButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Öka med 1
    </button>
  );
}
```

I detta exempel:
- `Counter` äger state (`count`)
- `CounterDisplay` får `count` via props
- `CounterButton` får `onClick` funktionen via props
- När knappen klickas uppdateras state, vilket orsakar en re-render

### State Batching och Funktionella Updates

```jsx
function AdvancedCounter() {
  const [count, setCount] = useState(0);

  // ❌ Problematiskt - baserat på nuvarande värde
  const incrementTwice = () => {
    setCount(count + 1);
    setCount(count + 1); // Fortfarande baserat på samma värde!
  };

  // ✅ Bättre - funktionell update
  const incrementTwiceProperly = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // Använder uppdaterat värde
  };

  // ✅ Batch updates automatiskt
  const handleMultipleUpdates = () => {
    setCount(prev => prev + 1);
    // React batchar dessa tillsammans
    console.log('This will run after all updates');
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementTwice}>+2 (Fel)</button>
      <button onClick={incrementTwiceProperly}>+2 (Rätt)</button>
    </div>
  );
}
```

## useEffect Hook: Side Effects och Lifecycle

`useEffect` hanterar "side effects" - allt som inte är direkt kopplat till rendering.

### Grundläggande useEffect Patterns

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pattern 1: Kör efter varje render
  useEffect(() => {
    console.log('Component rendered');
  });

  // Pattern 2: Kör bara en gång (componentDidMount)
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Tom dependency array

  // Pattern 3: Kör när specifika värden ändras (med AbortController)
  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${userId}`, { signal });
        if (!response.ok) throw new Error('Användare hittades inte');
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [userId]); // Kör när userId ändras

  // Pattern 4: Cleanup (componentWillUnmount)
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
      console.log('Timer cleared');
    };
  }, []);

  if (loading) return <div>Laddar...</div>;
  if (error) return <div>Fel: {error}</div>;
  if (!user) return <div>Ingen användare vald</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### useEffect Best Practices

```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Undvik onödiga API-anrop
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    // Cleanup - avbryt föregående timer
    return () => clearTimeout(searchTimer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök..."
      />
      
      {loading && <p>Söker...</p>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

Observera: aktivera ESLint-regeln `react-hooks/exhaustive-deps` för att fånga saknade beroenden i hooks och undvika subtila buggar.

## Props Drilling: Problem och Lösningar

**Props drilling** uppstår när data behöver passas genom många komponentnivåer.

```jsx
// ❌ Props drilling problem
function App() {
  const [user, setUser] = useState({ name: 'Anna', theme: 'dark' });
  
  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Main user={user} setUser={setUser} />
    </div>
  );
}

function Header({ user, setUser }) {
  return (
    <header>
      <Logo />
      <Navigation user={user} setUser={setUser} />
    </header>
  );
}

function Navigation({ user, setUser }) {
  return (
    <nav>
      <UserMenu user={user} setUser={setUser} />
    </nav>
  );
}

function UserMenu({ user, setUser }) {
  const toggleTheme = () => {
    setUser(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <div>
      <span>Hej {user.name}!</span>
      <button onClick={toggleTheme}>
        Tema: {user.theme}
      </button>
    </div>
  );
}
```

## Context API: Global State Management

Context API löser props drilling genom att skapa en "global" state som komponenter kan accessa direkt.

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Skapa Context
const UserContext = createContext();

// 2. Skapa Provider Component
function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Anna',
    theme: 'light',
    isAuthenticated: false
  });

  const login = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData,
      isAuthenticated: true
    }));
  };

  const logout = () => {
    setUser({
      name: '',
      theme: 'light',
      isAuthenticated: false
    });
  };

  const toggleTheme = () => {
    setUser(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const value = {
    user,
    login,
    logout,
    toggleTheme
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Custom hook för att använda context
function useUser() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  
  return context;
}

// 4. Använd Context i komponenter
function App() {
  return (
    <UserProvider>
      <div className="app">
        <Header />
        <Main />
        <Footer />
      </div>
    </UserProvider>
  );
}

function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
    </header>
  );
}

// Ingen props drilling längre!
function Navigation() {
  const { user, toggleTheme, logout } = useUser();

  return (
    <nav>
      <span>Hej {user.name}!</span>
      <button onClick={toggleTheme}>
        Tema: {user.theme}
      </button>
      {user.isAuthenticated && (
        <button onClick={logout}>
          Logga ut
        </button>
      )}
    </nav>
  );
}

function Main() {
  const { user } = useUser();
  
  return (
    <main className={`theme-${user.theme}`}>
      {user.isAuthenticated ? (
        <Dashboard />
      ) : (
        <LoginForm />
      )}
    </main>
  );
}

function LoginForm() {
  const { login } = useUser();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Namn"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="E-post"
      />
      <button type="submit">Logga in</button>
    </form>
  );
}
```

## Avancerade State Patterns

### Custom Hooks för State Logic

```jsx
// Custom hook för formulärhantering
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Rensa fel när användaren rättar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    setValue,
    setError,
    reset
  };
}

// Custom hook för localStorage
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}

// Användning av custom hooks
function UserPreferences() {
  const { values, setValue, errors, setError } = useForm({
    theme: 'light',
    language: 'sv',
    notifications: true
  });

  const [settings, setSettings] = useLocalStorage('userSettings', values);

  const handleSave = () => {
    if (!values.language) {
      setError('language', 'Språk är obligatoriskt');
      return;
    }

    setSettings(values);
    alert('Inställningar sparade!');
  };

  return (
    <div>
      <h2>Användarinställningar</h2>
      
      <select
        value={values.theme}
        onChange={(e) => setValue('theme', e.target.value)}
      >
        <option value="light">Ljust tema</option>
        <option value="dark">Mörkt tema</option>
      </select>

      <select
        value={values.language}
        onChange={(e) => setValue('language', e.target.value)}
      >
        <option value="">Välj språk</option>
        <option value="sv">Svenska</option>
        <option value="en">Engelska</option>
      </select>
      {errors.language && <span className="error">{errors.language}</span>}

      <label>
        <input
          type="checkbox"
          checked={values.notifications}
          onChange={(e) => setValue('notifications', e.target.checked)}
        />
        Aktivera notifikationer
      </label>

      <button onClick={handleSave}>Spara inställningar</button>
    </div>
  );
}
```

## Best Practices för State Management

### 1. Håll State så Lokalt som Möjligt

```jsx
// ❌ Onödig global state
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  
  return (
    <div>
      <Header />
      <Main modalOpen={modalOpen} setModalOpen={setModalOpen} />
      {modalOpen && <Modal content={modalContent} />}
    </div>
  );
}

// ✅ Lokal state där den behövs
function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Dölj' : 'Visa'} detaljer
      </button>
      {showDetails && <ProductDetails product={product} />}
    </div>
  );
}
```

### 2. Normalisera Komplex State

```jsx
// ❌ Nested state structure
const [state, setState] = useState({
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 1, name: 'Anna' },
      comments: [
        { id: 1, text: 'Bra inlägg!', author: { id: 2, name: 'Erik' } }
      ]
    }
  ]
});

// ✅ Normalized state structure
const [state, setState] = useState({
  posts: { 1: { id: 1, title: 'Post 1', authorId: 1, commentIds: [1] } },
  authors: { 1: { id: 1, name: 'Anna' }, 2: { id: 2, name: 'Erik' } },
  comments: { 1: { id: 1, text: 'Bra inlägg!', authorId: 2 } }
});
```

## Sammanfattning

Nu kan du skapa interaktiva React-komponenter:

*   **Props** skickar data från föräldra- till barnkomponenter
*   **Event handlers** låter komponenter reagera på användarinteraktion  
*   **State** ger komponenter minne med `useState`
*   **State är privat** - varje komponentinstans har sin egen state
*   **State + Props** skapar dataflöde mellan komponenter

## Vad händer härnäst?

Nu när dina komponenter kan ta emot data och reagera på interaktion är det dags att bygga riktiga applikationer! I nästa avsnitt lär du dig:

* **Formulär** - hantera användarinput på ett kontrollerat sätt
* **API-integration** - hämta data från servrar
* **Routing** - navigera mellan olika vyer
* **Deployment** - publicera din app på internet

**Redo för nästa steg?** Gå vidare till **Formulär i React** för att lära dig hantera användarinput!

---

## Fördjupning: Avancerade State-patterns

*Denna sektion täcker mer avancerade ämnen som du kan hoppa över först och komma tillbaka till senare.*
