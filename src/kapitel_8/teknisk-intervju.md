# Teknisk Intervju: Frontend-ramverk med React

Detta avsnitt innehåller vanliga tekniska intervjufrågor för React-utveckling. Frågorna täcker React fundamentals, komponenter, hooks, state management, routing och prestanda.

## Fråga 1: React Grundläggande Koncept

**Intervjuare:** "Förklara vad React är och vad Virtual DOM innebär. Visa skillnaden mellan JSX och vanlig HTML."

**Bra svar:**
```jsx
// React är ett JavaScript-bibliotek för att bygga användargränssnitt
// Virtual DOM är en representation av den riktiga DOM:en i minnet

// JSX - JavaScript XML (React syntax)
function Welcome({ name }) {
  return (
    <div className="greeting">
      <h1>Hej {name}!</h1>
      <p>Dagens datum: {new Date().toLocaleDateString()}</p>
    </div>
  );
}

// Motsvarande HTML skulle vara statisk:
// <div class="greeting">
//   <h1>Hej Anna!</h1>
//   <p>Dagens datum: 2024-01-15</p>
// </div>

// Skillnader JSX vs HTML:
// - className istället för class
// - {} för JavaScript-uttryck
// - camelCase för attribut (onClick, onChange)
// - Måste ha en parent element eller React Fragment
```

**Förklaring:** Virtual DOM gör att React kan jämföra förändringar effektivt och bara uppdatera de delar av DOM:en som ändrats. JSX tillåter JavaScript-uttryck inbäddade i markup.

## Fråga 2: Funktionella vs Class Components

**Intervjuare:** "Vad är skillnaden mellan funktionella och class components? Varför föredras funktionella komponenter idag?"

**Bra svar:**
```jsx
// Class Component (äldre sätt)
class ClassCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.incrementCount}>Increment</button>
      </div>
    );
  }
}

// Functional Component med hooks (modernt sätt)
function FunctionalCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted/updated');
  }, []);

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment</button>
    </div>
  );
}
```

**Fördelar med funktionella komponenter:**
- Enklare syntax och mindre boilerplate-kod
- Bättre prestanda med hooks
- Lättare att testa och förstå
- Modern React development standard

## Fråga 3: useState och useEffect Hooks

**Intervjuare:** "Förklara hur useState och useEffect fungerar. Visa ett exempel med API-anrop."

**Bra svar:**
```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  // useState för state management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect för side effects (API calls, subscriptions etc)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Dependency array - kör när userId ändras

  // Cleanup effect (körs när component unmounts)
  useEffect(() => {
    return () => {
      console.log('Cleanup when component unmounts');
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

**useEffect dependency arrays:**
- `[]` - körs bara en gång (componentDidMount)
- `[userId]` - körs när userId ändras
- Ingen array - körs efter varje render

## Fråga 4: Props och State Management

**Intervjuare:** "Förklara skillnaden mellan props och state. Visa hur man hanterar props drilling och Context API."

**Bra svar:**
```jsx
// Props - data som skickas från parent till child
function Parent() {
  const [theme, setTheme] = useState('light');
  
  return (
    <Child 
      theme={theme} 
      onThemeChange={setTheme}
      title="My App"
    />
  );
}

function Child({ theme, onThemeChange, title }) {
  return (
    <div className={`app ${theme}`}>
      <h1>{title}</h1>
      <button onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}

// Context API för att undvika props drilling
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Använda context
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      className={`btn btn-${theme}`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Current theme: {theme}
    </button>
  );
}

// App med Context Provider
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <ThemedButton />
    </ThemeProvider>
  );
}
```

**State vs Props:**
- **State:** Intern data som komponenten äger och kan ändra
- **Props:** Data som skickas från föräldrakomponent, read-only

## Fråga 5: Event Handling och Forms

**Intervjuare:** "Visa hur man hanterar formulär och events i React på ett kontrollerat sätt."

**Bra svar:**
```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hantera input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Rensa fel när användaren börjar skriva
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validering
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Namn är obligatoriskt';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-post är obligatoriskt';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Meddelande är obligatoriskt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hantera form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Meddelande skickat!');
        setFormData({ name: '', email: '', message: '', subscribe: false });
      } else {
        throw new Error('Något gick fel');
      }
    } catch (error) {
      alert('Fel vid sändning: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Namn:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">E-post:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="message">Meddelande:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={errors.message ? 'error' : ''}
        />
        {errors.message && <span className="error-text">{errors.message}</span>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
          />
          Prenumerera på nyhetsbrev
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Skickar...' : 'Skicka'}
      </button>
    </form>
  );
}
```

**Viktiga principer för formulär i React:**
- Kontrollerade komponenter (controlled components)
- Hantera all state i React
- Validering både på input och submit
- Förhindra default form behavior med `preventDefault()`

## Fråga 6: Lists och Keys

**Intervjuare:** "Förklara varför keys är viktiga i React lists och visa best practices."

**Bra svar:**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Handla mat', completed: false },
    { id: 2, text: 'Träna', completed: true },
    { id: 3, text: 'Studera React', completed: false }
  ]);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id} // ✅ Använd stabil, unik key
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <span onClick={() => onToggle(todo.id)}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>
        Ta bort
      </button>
    </li>
  );
}

// ❌ Dåliga exempel på keys:
// key={index} - problem vid omordning eller radering
// key={Math.random()} - skapar nya keys vid varje render
// key={todo.text} - problem om text ändras eller är duplicerad

// ✅ Bra keys:
// key={todo.id} - stabil unik identifierare
// key={`${todo.userId}-${todo.timestamp}`} - sammansatt unik key
```

**Varför keys är viktiga:**
- React använder keys för att identifiera vilka element som ändrats
- Förbättrar prestanda vid re-rendering
- Förhindrar buggar med component state

## Fråga 7: React Router Navigation

**Intervjuare:** "Implementera routing med React Router inklusive protected routes."

**Bra svar:**
```jsx
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth(); // Custom hook för auth

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Navigation Component
function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">Hem</Link>
      <Link to="/about">Om oss</Link>
      
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profil</Link>
          <button onClick={handleLogout}>Logga ut</button>
        </>
      ) : (
        <>
          <Link to="/login">Logga in</Link>
          <Link to="/register">Registrera</Link>
        </>
      )}
    </nav>
  );
}

// Main App with Router
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Dynamic routes */}
          <Route path="/users/:id" element={<UserProfile />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Component med URL parameters
function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

**React Router hooks:**
- `useNavigate()` - programmatisk navigation
- `useParams()` - hämta URL-parametrar
- `useLocation()` - få information om current location

## Fråga 8: Custom Hooks och API Integration

**Intervjuare:** "Skapa en custom hook för API-anrop med loading och error states."

**Bra svar:**
```jsx
// Custom hook för API calls
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Custom hook för forms
function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validera när användaren ändrar värde
    if (touched[name] && validationRules[name]) {
      const error = validationRules[name](value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validera när fält lämnas
    if (validationRules[name]) {
      const error = validationRules[name](values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const isValid = Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    setValues,
    setErrors
  };
}

// Användning av custom hooks
function UsersList() {
  const { data: users, loading, error, refetch } = useApi('/api/users');
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    isValid
  } = useForm(
    { name: '', email: '' },
    {
      name: (value) => !value ? 'Namn krävs' : '',
      email: (value) => !/\S+@\S+\.\S+/.test(value) ? 'Ogiltig e-post' : ''
    }
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <button onClick={refetch}>Refresh</button>
      
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <form>
        <input
          type="text"
          placeholder="Name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
        />
        {errors.name && <span>{errors.name}</span>}
        
        <input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && <span>{errors.email}</span>}
        
        <button disabled={!isValid}>Add User</button>
      </form>
    </div>
  );
}
```

**Fördelar med custom hooks:**
- Återanvändbar logik mellan komponenter
- Separation of concerns
- Lättare testning
- Renare komponentkod

## Fråga 9: Performance Optimization

**Intervjuare:** "Vilka tekniker använder du för att optimera React-applikationer?"

**Bra svar:**
```jsx
import { memo, useMemo, useCallback, lazy, Suspense } from 'react';

// 1. React.memo för att förhindra onödiga re-renders
const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  console.log('ExpensiveComponent rendered');
  
  return (
    <div>
      <h3>{data.title}</h3>
      <button onClick={onClick}>Click me</button>
    </div>
  );
});

// 2. useMemo för dyra beräkningar
function ProductList({ products, searchTerm, sortBy }) {
  const filteredAndSortedProducts = useMemo(() => {
    console.log('Calculating filtered products...');
    
    let result = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    result.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    
    return result;
  }, [products, searchTerm, sortBy]); // Bara omberäkna när dependencies ändras

  return (
    <div>
      {filteredAndSortedProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}

// 3. useCallback för att stabilisera funktionsreferenser
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  // Utan useCallback skapas en ny funktion vid varje render
  const handleToggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // Tom dependency array eftersom vi använder functional update

  const handleDeleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      ))}
    </div>
  );
}

// 4. Lazy loading med React.lazy
const LazyDashboard = lazy(() => import('./Dashboard'));
const LazyProfile = lazy(() => import('./Profile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/profile" element={<LazyProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 5. Virtualisering för stora listor
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <div>{items[index].name}</div>
    </div>
  );

  return (
    <List
      height={600} // Höjd på container
      itemCount={items.length}
      itemSize={50} // Höjd per item
    >
      {Row}
    </List>
  );
}
```

**Performance tips:**
- Använd React DevTools Profiler
- Minimera re-renders med memo/useMemo/useCallback
- Code splitting med lazy loading
- Virtualisering för stora listor
- Optimera bundle size
- Använd production builds

## Fråga 10: Error Boundaries och Error Handling

**Intervjuare:** "Implementera error boundaries och robustfehantering i React."

**Bra svar:**
```jsx
// Error Boundary Class Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Uppdatera state så nästa render visar fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Logga felet till error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Skicka till error monitoring (t.ex. Sentry)
    // errorReportingService.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Något gick fel</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.reload()}>
            Ladda om sidan
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom hook för async error handling
function useAsyncError() {
  const [, setError] = useState();
  
  return useCallback((error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// Component med error handling
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const throwAsyncError = useAsyncError();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        // Kasta error till Error Boundary
        throwAsyncError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, throwAsyncError]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// App med Error Boundaries
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <ErrorBoundary>
          <Routes>
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/dashboard" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ErrorBoundary>
  );
}
```

**Error handling best practices:**
- Använd Error Boundaries för att fånga rendering errors
- Implementera graceful degradation
- Logga fel till monitoring services
- Visa användarvänliga felmeddelanden
- Ha fallback UI för kritiska komponenter

---

## Sammanfattning

Dessa frågor täcker de viktigaste aspekterna av React-utveckling:

- **React Fundamentals:** JSX, Virtual DOM, komponenter
- **Hooks:** useState, useEffect, custom hooks
- **State Management:** Props, Context API, state lifting
- **Routing:** React Router, navigation, protected routes
- **Performance:** Memo, useMemo, useCallback, lazy loading
- **Error Handling:** Error boundaries, async errors
- **Best Practices:** Forms, API integration, testing

**Förberedelse-tips:**
1. Bygg små React-projekt för att öva praktiskt
2. Förstå React lifecycle och när olika hooks körs
3. Öva på performance-optimering med React DevTools
4. Lär dig skillnaden mellan controlled/uncontrolled components
5. Förstå när och varför du skulle använda Context vs props
