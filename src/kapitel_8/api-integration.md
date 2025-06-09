# Konsumera API:er i React: Data från Backend

Modern React-applikationer separerar frontend från backend och kommunicerar via **API:er** (Application Programming Interfaces). Detta kapitel fokuserar på hur vi hämtar, skickar och hanterar data från externa tjänster.

**Mål:** Lära sig använda Fetch API och Axios, skapa custom hooks för API-anrop, implementera robust error handling och förstå bästa praxis för datahantering.

## Fetch API: Webbstandardens Sätt

**Fetch API** är den moderna standarden för att göra HTTP-requests i JavaScript. Det är inbyggt i alla moderna webbläsare och behöver inga externa bibliotek.

### Grundläggande Fetch-exempel

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/users');
        
        // Kontrollera om request lyckades
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setUsers(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Laddar användare...</div>;
  if (error) return <div>Fel: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

### HTTP-metoder med Fetch

```jsx
// GET (standard)
const getUsers = async () => {
  const response = await fetch('/api/users');
  return response.json();
};

// POST - Skapa ny användare
const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};

// PUT - Uppdatera användare
const updateUser = async (userId, userData) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

// DELETE - Ta bort användare
const deleteUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.ok;
};
```

### Autentisering med Headers

```jsx
// Token-baserad autentisering
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Hantera unauthorized
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

// Användning
const getProtectedData = async () => {
  const response = await fetchWithAuth('/api/protected-data');
  return response.json();
};
```

## Axios: Kraftfullare HTTP-klient

**Axios** är ett populärt HTTP-bibliotek som erbjuder mer funktionalitet och bättre error handling än Fetch.

### Installation och Setup

```bash
npm install axios
```

```jsx
import axios from 'axios';

// Grundkonfiguration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors för automatisk token-hantering
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor för error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Axios API-anrop

```jsx
import api from '../services/api';

// GET
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// POST
const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

// Simultana requests
const getInitialData = async () => {
  try {
    const [usersResponse, productsResponse] = await Promise.all([
      api.get('/users'),
      api.get('/products')
    ]);

    return {
      users: usersResponse.data,
      products: productsResponse.data
    };
  } catch (error) {
    throw new Error('Failed to fetch initial data');
  }
};
```

## Custom Hooks för API-anrop

Custom hooks abstraherar API-logik och gör den återanvändbar mellan komponenter.

### useApi Hook

```jsx
import { useState, useEffect, useCallback } from 'react';

function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => execute(), [execute]);

  return { data, loading, error, refetch, execute };
}

// Användning
function UserList() {
  const { data: users, loading, error, refetch } = useApi(getUsers);

  if (loading) return <div>Laddar...</div>;
  if (error) return <div>Fel: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Uppdatera</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useResource Hook för CRUD-operationer

```jsx
function useResource(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET - Hämta alla
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // POST - Skapa ny
  const create = useCallback(async (newItem) => {
    try {
      const response = await api.post(endpoint, newItem);
      setData(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [endpoint]);

  // PUT - Uppdatera
  const update = useCallback(async (id, updatedItem) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, updatedItem);
      setData(prev => 
        prev.map(item => item.id === id ? response.data : item)
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [endpoint]);

  // DELETE - Ta bort
  const remove = useCallback(async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [endpoint]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refetch: fetchAll
  };
}

// Användning
function ProductManager() {
  const { data: products, loading, error, create, update, remove } = useResource('/products');

  const handleCreate = async (productData) => {
    try {
      await create(productData);
      alert('Produkt skapad!');
    } catch (error) {
      alert('Fel vid skapande: ' + error.message);
    }
  };

  return (
    <div>
      {loading && <div>Laddar...</div>}
      {error && <div>Fel: {error}</div>}
      
      <ProductForm onSubmit={handleCreate} />
      
      <div className="products">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={(data) => update(product.id, data)}
            onDelete={() => remove(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

## Avancerad Error Handling

```mermaid
graph TD
    A[API Request] --> B{Response OK?}
    B -->|Yes| C[Success State]
    B -->|No| D[Error Analysis]
    
    D --> E{Error Type}
    E -->|Network| F[Network Error UI]
    E -->|401| G[Redirect to Login]
    E -->|403| H[Access Denied UI]
    E -->|404| I[Not Found UI]
    E -->|500| J[Server Error UI]
    E -->|Other| K[Generic Error UI]
    
    F --> L[Retry Option]
    J --> L
    K --> L
    
    style C fill:#98fb98
    style F fill:#ffa07a
    style G fill:#ffa07a
    style H fill:#ffa07a
    style I fill:#ffa07a
    style J fill:#ffa07a
    style K fill:#ffa07a
```

### Error Boundary för API-fel

```jsx
class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error:', error, errorInfo);
    // Skicka till error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="api-error">
          <h2>Något gick fel</h2>
          <p>Vi har problem med att hämta data just nu.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Försök igen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Global Error Handler

```jsx
// utils/errorHandler.js
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server svarade med error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new ApiError('Felaktig förfrågan', status, data);
      case 401:
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new ApiError('Du måste logga in', status, data);
      case 403:
        throw new ApiError('Du har inte behörighet', status, data);
      case 404:
        throw new ApiError('Resursen hittades inte', status, data);
      case 500:
        throw new ApiError('Serverfel, försök igen senare', status, data);
      default:
        throw new ApiError(
          data?.message || 'Något gick fel', 
          status, 
          data
        );
    }
  } else if (error.request) {
    // Network error
    throw new ApiError('Nätverksfel, kontrollera din anslutning');
  } else {
    // Annan typ av fel
    throw new ApiError(error.message);
  }
};
```

### Retry Logic och Exponential Backoff

```jsx
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage
const fetchUserWithRetry = async (userId) => {
  return retryWithBackoff(
    () => api.get(`/users/${userId}`),
    3, // Max 3 försök
    1000 // Start med 1 sekund
  );
};
```

## Caching och Performance

### Simple In-Memory Cache

```jsx
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minuter default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

const apiCache = new ApiCache();

// Cached API hook
function useCachedApi(key, apiFunction, dependencies = []) {
  const [data, setData] = useState(() => apiCache.get(key));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cached = apiCache.get(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        apiCache.set(key, result);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, ...dependencies]);

  return { data, loading, error };
}
```

### Request Deduplication

```jsx
// Förhindra duplicerade requests
const pendingRequests = new Map();

const deduplicatedFetch = async (url, options) => {
  const requestKey = `${url}:${JSON.stringify(options)}`;
  
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const promise = fetch(url, options).finally(() => {
    pendingRequests.delete(requestKey);
  });

  pendingRequests.set(requestKey, promise);
  return promise;
};
```

## Real-time Data med WebSockets

```jsx
function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setConnectionStatus('Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLastMessage(message);
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { lastMessage, connectionStatus, sendMessage };
}

// Usage
function ChatComponent() {
  const { lastMessage, connectionStatus, sendMessage } = useWebSocket('ws://localhost:8080');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [...prev, lastMessage]);
    }
  }, [lastMessage]);

  return (
    <div>
      <div>Status: {connectionStatus}</div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage({ text: e.target.value });
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

## Best Practices

### 1. Environment Configuration

```jsx
// config/api.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000
  },
  production: {
    baseURL: 'https://api.myapp.com',
    timeout: 10000
  },
  test: {
    baseURL: 'http://test-api.myapp.com',
    timeout: 3000
  }
};

const currentConfig = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;

export default currentConfig;
```

### 2. Type Safety med TypeScript

```typescript
// types/api.ts
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// services/userService.ts
const getUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data.data;
};
```

### 3. Loading States och Optimistic Updates

```jsx
function useOptimisticUpdate() {
  const [optimisticData, setOptimisticData] = useState(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const performOptimisticUpdate = async (optimisticValue, apiCall) => {
    setOptimisticData(optimisticValue);
    setIsOptimistic(true);

    try {
      const result = await apiCall();
      setOptimisticData(result);
      return result;
    } catch (error) {
      setOptimisticData(null);
      throw error;
    } finally {
      setIsOptimistic(false);
    }
  };

  return { optimisticData, isOptimistic, performOptimisticUpdate };
}
```

## Sammanfattning

API-integration är grundläggande för moderna React-applikationer:

*   **Fetch API** är webstandarden för HTTP-requests
*   **Axios** erbjuder mer funktionalitet och bättre error handling
*   **Custom hooks** abstraherar API-logik för återanvändning
*   **Error handling** är kritiskt för bra användarupplevelse
*   **Caching** förbättrar prestanda och minskar server-belastning
*   **WebSockets** möjliggör real-time kommunikation

Nästa steg är att bygga kompletta applikationer med praktiska övningar.
