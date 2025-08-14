# Konsumera API:er i React: Data från Backend

Modern React-applikationer separerar frontend från backend och kommunicerar via **API:er** (Application Programming Interfaces). Detta kapitel fokuserar på hur vi hämtar, skickar och hanterar data från externa tjänster.

**Mål:** Lära sig använda Fetch API, skapa custom hooks för API-anrop, implementera robust error handling och förstå bästa praxis för datahantering. (Notis: Axios är ett populärt bibliotek om du vill ha extra funktioner.)

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
    // Navigera till login via central hantering (ex. router)
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

## Notis: Axios

Axios är ett populärt bibliotek för HTTP-anrop som erbjuder interceptors och några bekvämligheter. I denna kurs använder vi web standarden Fetch för alla exempel. Om du föredrar Axios kan du enkelt översätta våra fetch-anrop till `axios.get/post/...` och använda interceptors för t.ex. token-hantering.


## Använd data från Pokemon API

Nu när vi har sett grunderna för hur man anropar ett API låt oss göra något roligare. [Pokemon API](https://pokeapi.co/) är ett öppet API som ger oss tillgång till data om alla Pokemon från spelen - perfekt för att öva på API-anrop!

### Vad är Pokemon API?

Pokemon API (PokeAPI) är ett RESTful API som innehåller information om:
- Pokemon (namn, typ, statistik, bilder)
- Moves (attacker)
- Types (typer som Fire, Water, Electric)
- Items (föremål)
- Locations (platser)

**Fördelar:**
- Helt gratis att använda
- Ingen API-nyckel krävs
- Välstrukturerad JSON-data
- Stöder CORS (fungerar direkt från webbläsaren)

### Undersök datan

Låt oss först utforska vad API:et ger oss. Öppna https://pokeapi.co/api/v2/pokemon/pikachu i webbläsaren eller testa med curl:

```bash
curl https://pokeapi.co/api/v2/pokemon/pikachu
```

**Viktiga endpoints:**
```
GET https://pokeapi.co/api/v2/pokemon/         # Lista första 20 Pokemon
GET https://pokeapi.co/api/v2/pokemon/{id}     # Specifik Pokemon (ID eller namn)
GET https://pokeapi.co/api/v2/type/{type}      # Pokemon av viss typ
```

**Exempel på data för Pikachu:**
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "types": [
    {
      "slot": 1,
      "type": {
        "name": "electric",
        "url": "https://pokeapi.co/api/v2/type/13/"
      }
    }
  ],
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png"
  },
  "stats": [
    {
      "base_stat": 35,
      "stat": {
        "name": "hp"
      }
    }
    // ... fler stats
  ]
}
```

### Bygg en Pokemon-app steg för steg

Låt oss börja enkelt och bygga upp funktionaliteten bit för bit.

#### Steg 1: Hämta och visa en Pokemon

Först - låt oss bara hämta Pikachu och visa namnet:

```jsx
function PokemonApp() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
      .then(response => response.json())
      .then(data => setPokemon(data));
  }, []);

  return (
    <div className="pokemon-app">
      <h1>Min Pokemon App</h1>
      {pokemon && <h2>{pokemon.name}</h2>}
    </div>
  );
}
```

**Testa detta först!** Öppna Network-fliken i utvecklarverktygen och se API-anropet.

#### Steg 2: Lägg till bild och grundinfo

```jsx
function PokemonApp() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
      .then(response => response.json())
      .then(data => setPokemon(data));
  }, []);

  return (
    <div className="pokemon-app">
      <h1>Min Pokemon App</h1>
      
      {pokemon && (
        <div className="pokemon-card">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Höjd: {pokemon.height / 10} m</p>
          <p>Vikt: {pokemon.weight / 10} kg</p>
        </div>
      )}
    </div>
  );
}
```


#### Steg 3: Lägg till sökfunktion

Nu gör vi det interaktivt:

```jsx
function PokemonApp() {
  const [pokemon, setPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const searchPokemon = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
      .then(response => response.json())
      .then(data => setPokemon(data));
  };

  return (
    <div className="pokemon-app">
      <h1>Pokemon Sökare</h1>
      
      <div className="search-box">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Skriv Pokemon namn..."
          className="search-input"
        />
        <button onClick={searchPokemon} className="search-button">
          Sök
        </button>
      </div>

      {pokemon && (
        <div className="pokemon-card">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Höjd: {pokemon.height / 10} m</p>
          <p>Vikt: {pokemon.weight / 10} kg</p>
          <p>Typ: {pokemon.types.map(type => type.type.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
```

**Prova att söka på:** pikachu, charizard, bulbasaur, squirtle

#### Steg 4: Hantera fel och loading

Vad händer om vi söker på något som inte finns?

```jsx
function PokemonApp() {
  const [pokemon, setPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPokemon = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Pokemon hittades inte!');
      }
      
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    }
    
    setLoading(false);
  };

  return (
    <div className="pokemon-app">
      <h1>Pokemon Sökare</h1>
      
      <div className="search-box">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Skriv Pokemon namn..."
          className="search-input"
        />
        <button 
          onClick={searchPokemon} 
          disabled={loading}
          className="search-button"
        >
          {loading ? 'Söker...' : 'Sök'}
        </button>
      </div>

      {error && <div className="error">Fel: {error}</div>}

      {pokemon && (
        <div className="pokemon-card">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Höjd: {pokemon.height / 10} m</p>
          <p>Vikt: {pokemon.weight / 10} kg</p>
          <p>Typ: {pokemon.types.map(type => type.type.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
```

**Lägg till CSS:**
```css
.search-box {
  margin: 20px 0;
}

.search-input {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin: 10px 0;
}
```

**Testa fel:** Sök på "asdfgh" och se vad som händer!

### Steg 5: Gör appen din egen! 🎯

Nu har du en fungerande Pokemon-sökare. Dags att experimentera och lägga till egna funktioner!

#### Enkla förbättringar att prova:

**Random Pokemon-knapp:**
```jsx
// Lägg till i din searchPokemon-funktion
const getRandomPokemon = () => {
  const randomId = Math.floor(Math.random() * 1010) + 1;
  setSearchTerm(randomId.toString());
  // Sedan kan du kalla searchPokemon() eller göra fetch direkt
};

// Lägg till knappen i din JSX
<button onClick={getRandomPokemon} className="random-button">
  Slumpa Pokemon
</button>
```

**Visa shiny-versionen:**
```jsx
// I din pokemon-card, lägg till:
{pokemon.sprites.front_shiny && (
  <div>
    <p>Shiny version:</p>
    <img src={pokemon.sprites.front_shiny} alt={`Shiny ${pokemon.name}`} />
  </div>
)}
```

**Visa Pokemon stats:**
```jsx
// Lägg till i pokemon-card:
<div className="stats">
  <h3>Stats:</h3>
  {pokemon.stats.map(stat => (
    <p key={stat.stat.name}>
      {stat.stat.name}: {stat.base_stat}
    </p>
  ))}
</div>
```

#### Medelsvåra utmaningar:

- **Sök med Enter:** Gör så man kan trycka Enter i sökrutan
- **Favoriter:** Spara favorit-Pokemon i `localStorage`
- **Historik:** Visa de senaste sökta Pokemon
- **Jämför Pokemon:** Visa två Pokemon sida vid sida

#### Avancerade idéer:

- **Pokemon Team Builder:** Bygg ett lag med max 6 Pokemon
- **Type effectiveness:** Visa vilka typer som är starka/svaga mot varandra
- **Evolution chain:** Visa hela evolution-kedjan
- **Moves/attacker:** Lista Pokemon:s attacker

#### Tips för utveckling:

```jsx
// Enter-tangent för sökning
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    searchPokemon();
  }
};

// Lägg till onKeyPress={handleKeyPress} på din input

// Spara i localStorage
const saveFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites.push(pokemon.name);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};
```

**Experimentera och ha kul!** Det viktigaste är att du förstår hur API-anrop fungerar. Allt annat är bonus! 🎮

## Custom Hooks för API-anrop

Custom hooks gör API‑logik återanvändbar och ren. För en komplett genomgång med många exempel (useApi, useResource, caching, retry m.m.), se fördjupningslektionen: [Custom Hooks i React](./fordjupning/custom-hooks.md).

