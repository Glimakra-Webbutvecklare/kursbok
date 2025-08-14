# Custom Hooks i React

## Inledning: Ett vanligt problem

Du bygger en lista över användare och en annan vy som visar senaste beställningar. I båda komponenterna skriver du samma kod: hämta data (fetch), visa `loading`, hantera `error`, och en knapp för att ladda om. Koden kopieras, divergerar och blir svår att underhålla.

```jsx
// UsersPage.jsx
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/users');
      setUsers(await res.json());
    } catch (e) {
      setError('Kunde inte hämta användare');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ... renderar loading/error/lista
}

// OrdersPage.jsx (nästan identisk logik)
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders');
      setOrders(await res.json());
    } catch (e) {
      setError('Kunde inte hämta beställningar');
    } finally {
      setLoading(false);
    }
  };// UsersPage.jsx
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/users');
      setUsers(await res.json());
    } catch (e) {
      setError('Kunde inte hämta användare');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ... renderar loading/error/lista
}

  useEffect(() => { load(); }, []);

  // ... renderar loading/error/lista
}
```

Problemet: samma mönster upprepas i flera komponenter. Varje liten ändring (t.ex. bättre felmeddelanden) måste göras överallt.

## Lösningen: Skapa en custom hook

En custom hook (egen hook) kapslar in den upprepade logiken i en funktion som kan återanvändas.

```jsx
// useResource.js
import { useEffect, useState } from 'react';

export function useResource(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoint);
      setData(await res.json());
    } catch (e) {
      setError('Kunde inte hämta resurser');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, refetch: load };
}

// Användning i komponenter
function UsersPage() {
  const { data, loading, error, refetch } = useResource('/api/users');
  // ... enkel render, ingen duplicerad logik
}

function OrdersPage() {
  const { data, loading, error, refetch } = useResource('/api/orders');
  // ... enkel render, ingen duplicerad logik
}
```

Vinst: Komponenterna blir tunnare, logiken bor på ett ställe och kan förbättras centralt.

## Varför Custom Hooks?

- Återanvändning: dela logik mellan komponenter utan duplicering.
- Separation: håll komponenter tunna; flytta komplexitet till hooks.
- Testbarhet: testa logik isolerat från UI.
- Inkapsling: göm implementation (fetch, timers, events) bakom enkel API.
- Komposition: kombinera flera hooks till kraftfulla mönster.

## Regler för Hooks

- Anropa hooks högst upp i funktionen, inte i loopar/if/switch.
- Anropa hooks endast från React‑funktioner (komponenter eller andra hooks).
- Följ namngivningen `useNamn` så ESLint kan verifiera reglerna.

## Bästa praxis

- Namn: beskriv vad hooken gör (`useDebounce`, `useLocalStorage`).
- API: returnera värden/funktioner i ett objekt för läsbarhet, eller en array när ordningen är viktig (som `useState`).
- Stabilitet: använd `useCallback`/`useMemo` för att exponera stabila funktioner/objekt.
- Fel: exponera `error` och `loading` när det är relevant (t.ex. data‑hooks).
- Beroenden: ta in parametrar istället för att hårdkoda (endpoint, initial values, TTL etc.).

## Exempel: Små, generella hooks

Enkla hooks löser vardagliga behov och gör din kod renare. Här är tre du ofta har nytta av — med varför de hjälper och hur de används.

### useToggle — slå av/på ett boolean‑värde

Varför: perfekt för att öppna/stänga modaler, toggla dark mode eller visa/dölja element.

```jsx
import { useState } from 'react';

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  return { value, toggle, setTrue: () => setValue(true), setFalse: () => setValue(false) };
}

// Användning
function Menu() {
  const { value: open, toggle } = useToggle();
  return (
    <div>
      <button onClick={toggle}>Meny</button>
      {open && <nav>…</nav>}
    </div>
  );
}
```

### useCounter — enkel räknare

Varför: vanligen för pagination, mängd i varukorg eller steg i en wizard.

```jsx
import { useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const inc = (step = 1) => setCount(c => c + step);
  const dec = (step = 1) => setCount(c => Math.max(0, c - step));
  const reset = () => setCount(initial);
  return { count, inc, dec, reset };
}

// Användning
function CartItem() {
  const { count, inc, dec } = useCounter(1);
  return (
    <div>
      <button onClick={() => dec()}>-</button>
      <span>{count}</span>
      <button onClick={() => inc()}>+</button>
    </div>
  );
}
```

### useLocalStorage — spara enkel state över sidladdningar

Varför: behåll användarens val (tema, språk) mellan besök.

```jsx
import { useState } from 'react';

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    try { window.localStorage.setItem(key, JSON.stringify(newValue)); } catch {}
  };

  return [value, setStoredValue];
}

// Användning
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Växla tema (nu: {theme})
    </button>
  );
}
```

## Exempel: Data‑hooks för API

### useApi

```jsx
import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFunction, dependencies = []) {
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
      setError(err.message || 'Request failed');
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
// const { data, loading, error, refetch } = useApi(() => fetch('/api/users').then(r => r.json()));
```

### useResource (CRUD)

```jsx
import { useState, useCallback, useEffect } from 'react';

export function useResource(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new Error(json?.message || res.statusText || 'Request failed');
    }
    return json;
  };

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchJson(endpoint);
      setData(Array.isArray(result) ? result : (result?.data ?? []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const create = useCallback(async (newItem) => {
    try {
      const result = await fetchJson(endpoint, {
        method: 'POST',
        body: JSON.stringify(newItem)
      });
      setData(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [endpoint]);

  const update = useCallback(async (id, updatedItem) => {
    try {
      const result = await fetchJson(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedItem)
      });
      setData(prev => prev.map(item => item.id === id ? result : item));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [endpoint]);

  const remove = useCallback(async (id) => {
    try {
      await fetchJson(`${endpoint}/${id}`, { method: 'DELETE' });
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [endpoint]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, create, update, remove, refetch: fetchAll };
}
```

### Caching i en hook

```jsx
import { useEffect, useState } from 'react';

class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 min
    this.cache = new Map();
    this.ttl = ttl;
  }
  set(key, data) { this.cache.set(key, { data, timestamp: Date.now() }); }
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.ttl) { this.cache.delete(key); return null; }
    return item.data;
  }
  clear() { this.cache.clear(); }
}

const apiCache = new ApiCache();

export function useCachedApi(key, apiFunction, dependencies = []) {
  const [data, setData] = useState(() => apiCache.get(key));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cached = apiCache.get(key);
      if (cached) { setData(cached); setLoading(false); return; }
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

### Retry med exponential backoff

```jsx
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### useWebSocket (realtid)

```jsx
import { useEffect, useState } from 'react';

export function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => { setConnectionStatus('Connected'); setSocket(ws); };
    ws.onmessage = (event) => setLastMessage(JSON.parse(event.data));
    ws.onclose = () => { setConnectionStatus('Disconnected'); setSocket(null); };
    ws.onerror = () => setConnectionStatus('Error');
    return () => ws.close();
  }, [url]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { lastMessage, connectionStatus, sendMessage };
}
```

## Säkerhet och robusthet

- Tokens i `localStorage` kan stjälas via XSS. För skyddade sessioner: `httpOnly`‑cookies + CSRF‑skydd (SameSite/CSRF‑token).
- Rensa resurser i `useEffect`‑cleanup (event listeners, WebSocket, timers) för att undvika minnesläckor.
- Visa tydliga felmeddelanden och ge möjlighet till retry.

## Kompositionsexempel

```jsx
function SearchUsers() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);
  const { data, loading, error } = useCachedApi(
    `users:${debounced}`,
    () => fetch(`/api/users?q=${encodeURIComponent(debounced)}`).then(r => r.json()),
    [debounced]
  );

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Sök användare" />
      {loading && <p>Laddar…</p>}
      {error && <p>Fel: {error}</p>}
      <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}
```

## Vanliga fallgropar

- Oklara beroenden i `useEffect` leder till oväntade anrop. Håll API:et rent och stabilt.
- Läckande timers/sockets om cleanup saknas.
- För breda hooks som gör “allt”. Håll dem fokuserade.

## Kort om testning

- Isolera nätverk: mocka `fetch`/API‑funktioner.
- Testa brancher: loading, success, error och retry.

## Vidare läsning

- React docs: Rules of Hooks och Building Your Own Hooks.
- Se även Fördjupning: [Data: caching, retry och realtid](./data-advanced.md).
