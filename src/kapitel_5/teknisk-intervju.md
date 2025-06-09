# Tekniska Intervjufrågor: Avancerad JavaScript och Asynkron Programmering

Detta avsnitt innehåller exempel på tekniska intervjufrågor som kan dyka upp gällande avancerad JavaScript, asynkron programmering och datahantering. Frågorna är utformade för att testa både teoretisk förståelse och praktisk kunskap.

Använd dessa frågor för att testa din kunskap och förbereda dig för tekniska intervjuer.

---

## Fråga 1: Asynkron JavaScript och Event Loop

**Fråga:** "JavaScript är single-threaded. Förklara hur JavaScript kan hantera asynkrona operationer. Vad skrivs ut i följande kod och i vilken ordning?"
```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timer 1");
}, 0);

console.log("Middle");

setTimeout(() => {
  console.log("Timer 2");
}, 0);

console.log("End");
```

**Förslag till svar:**
**JavaScript är single-threaded men använder Event Loop:**
- **Call Stack:** Kör synkron kod
- **Web APIs:** Hanterar asynkrona operationer (setTimeout, fetch, DOM events)
- **Callback Queue:** Köar färdiga callbacks
- **Event Loop:** Flyttar callbacks från queue till call stack när stack är tom

**Utskrift:**
```
Start
Middle  
End
Timer 1
Timer 2
```

**Förklaring:** Synkron kod körs först (Start, Middle, End). `setTimeout` callbacks, även med 0ms delay, placeras i Web APIs och sedan Callback Queue. Event Loop flyttar dem till Call Stack först när all synkron kod är klar.

---

## Fråga 2: Callbacks och Callback Hell

**Fråga:** "Vad är 'Callback Hell' och hur kan det undvikas? Visa ett exempel och förklara problemen."

**Förslag till svar:**
**Callback Hell** uppstår när flera asynkrona operationer behöver köras i sekvens:

```javascript
// Callback Hell exempel
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      getFinalData(c, function(d) {
        // Djupt nästlad kod...
        console.log(d);
      });
    });
  });
});
```

**Problem:**
- **Låg läsbarhet:** Svårt att följa kodflödet
- **Svår felhantering:** Fel måste hanteras på varje nivå
- **Svårt att underhålla:** Ändringar blir komplexa

**Lösningar:**
1. **Promises:** `getData().then().then().catch()`
2. **Async/Await:** Gör asynkron kod synkron-liknande
3. **Namngivna funktioner:** Istället för anonyma callbacks

---

## Fråga 3: Promises och Promise States

**Fråga:** "Förklara Promise lifecycle. Vad är skillnaden mellan `.then()`, `.catch()` och `.finally()`? Skriv kod som visar alla tre."

**Förslag till svar:**
**Promise States:**
- **Pending:** Initial state, varken fulfilled eller rejected
- **Fulfilled:** Operation lyckades, har ett värde
- **Rejected:** Operation misslyckades, har en anledning (error)
- **Settled:** Antingen fulfilled eller rejected (kan ej ändras)

```javascript
function asyncOperation(shouldSucceed) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("Success data");
      } else {
        reject(new Error("Operation failed"));
      }
    }, 1000);
  });
}

asyncOperation(true)
  .then(result => {
    console.log("Success:", result); // Körs vid fulfilled
    return result.toUpperCase();     // Kan returnera värde för kedja
  })
  .then(upperResult => {
    console.log("Processed:", upperResult);
  })
  .catch(error => {
    console.error("Error:", error.message); // Körs vid rejected
  })
  .finally(() => {
    console.log("Operation completed"); // Körs alltid
  });
```

**Viktigt:** `.then()` returnerar ett nytt Promise, möjliggör kedja.

---

## Fråga 4: Async/Await vs Promises

**Fråga:** "Skriv om denna Promise-kod till async/await. Vad är fördelarna och nackdelarna med varje approach?"

```javascript
// Promise version
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => fetch(`/api/posts?userId=${user.id}`))
    .then(response => response.json())
    .then(posts => ({ user, posts }))
    .catch(error => console.error("Error:", error));
}
```

**Förslag till svar:**
```javascript
// Async/Await version
async function fetchUserData(userId) {
  try {
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();
    
    const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
    const posts = await postsResponse.json();
    
    return { user, posts };
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**Jämförelse:**
- **Async/Await fördelar:** Mer läsbar, lättare att debugga, använder try/catch
- **Async/Await nackdelar:** Kan vara långsammare vid parallella operationer
- **Promises fördelar:** Bra för parallell execution, funktionell stil
- **Promises nackdelar:** Kan bli svårläst med komplexa kedjor

---

## Fråga 5: Fetch API och Error Handling

**Fråga:** "Skriv en funktion som hämtar data med Fetch API. Hantera både nätverksfel och HTTP-fel (4xx, 5xx). Varför kastar inte fetch() automatiskt fel för HTTP-fel?"

**Förslag till svar:**
```javascript
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // Fetch kastar INTE fel för HTTP status codes som 404, 500
    if (!response.ok) {
      // Försök läsa felmeddelande från server
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Om response inte är JSON, använd standardmeddelande
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    // Hantera både nätverksfel och HTTP-fel
    if (error.name === 'TypeError') {
      throw new Error("Network error - check connection");
    }
    throw error; // Re-throw HTTP errors
  }
}

// Användning
safeFetch('/api/users/123')
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Failed:', error.message));
```

**Varför fetch() inte kastar fel för HTTP-fel:**
- Fetch anser att få ett svar (även 404/500) är "success" - nätverksanropet lyckades
- Bara nätverksfel (ingen internet, server ej tillgänglig) kastas som fel
- `response.ok` kontrollerar om status är 200-299

---

## Fråga 6: JSON och Data Transformation

**Fråga:** "Förklara skillnaden mellan `JSON.stringify()` och `JSON.parse()`. Vad händer med funktioner och `undefined` värden? Skriv kod som demonstrerar detta."

**Förslag till svar:**
```javascript
const jsObject = {
  name: "Alice",
  age: 30,
  active: true,
  address: null,
  hobbies: ["reading", "coding"],
  greet: function() { return "Hello!"; }, // Funktion
  secret: undefined,                       // undefined
  id: Symbol('user')                      // Symbol
};

// JavaScript till JSON-sträng
const jsonString = JSON.stringify(jsObject);
console.log("JSON:", jsonString);
// Output: {"name":"Alice","age":30,"active":true,"address":null,"hobbies":["reading","coding"]}
// Notera: greet, secret och id försvinner!

// JSON-sträng till JavaScript
const parsedObject = JSON.parse(jsonString);
console.log("Parsed:", parsedObject);

// Felhantering vid parsning
try {
  const invalidJson = '{"name": "Alice", "age": 30,}'; // Avslutande komma
  JSON.parse(invalidJson);
} catch (error) {
  console.error("Parse error:", error.message);
}

// Pretty printing
const prettyJson = JSON.stringify(jsObject, null, 2);
console.log("Pretty:\n", prettyJson);
```

**Viktiga regler:**
- **Ignoreras:** functions, undefined, Symbol
- **Konverteras:** Date → string, NaN/Infinity → null
- **Kräver dubbla citattecken:** för strings och keys
- **Felhantering:** Alltid wrappa `JSON.parse()` i try/catch

---

## Fråga 7: Array.map() och Transformation

**Fråga:** "Förklara `map()` metoden. Hur skiljer den sig från en for-loop? Transformera denna data för att skapa en ny struktur:"

```javascript
const users = [
  { id: 1, firstName: "Anna", lastName: "Svensson", age: 25 },
  { id: 2, firstName: "Erik", lastName: "Johansson", age: 30 },
  { id: 3, firstName: "Maria", lastName: "Andersson", age: 28 }
];
// Skapa array med format: "Anna S. (25 år)"
```

**Förslag till svar:**
```javascript
// Med map() - REKOMMENDERAT
const formattedUsers = users.map(user => {
  const lastInitial = user.lastName.charAt(0);
  return `${user.firstName} ${lastInitial}. (${user.age} år)`;
});

// Med traditional for-loop
const formattedUsersLoop = [];
for (let i = 0; i < users.length; i++) {
  const user = users[i];
  const lastInitial = user.lastName.charAt(0);
  formattedUsersLoop.push(`${user.firstName} ${lastInitial}. (${user.age} år)`);
}

console.log(formattedUsers);
// Output: ["Anna S. (25 år)", "Erik J. (30 år)", "Maria A. (28 år)"]
```

**Skillnader:**
- **map():** Returnerar ny array, original oförändrad, funktionell stil
- **for-loop:** Imperativ, måste hantera ny array manuellt
- **map() fördelar:** Kortare, mer läsbar, mindre risk för buggar
- **for-loop fördelar:** Mer kontroll, kan break/continue

**Viktigt:** map() returnerar alltid en array med samma längd som originalet.

---

## Fråga 8: Array.filter() och Conditional Logic

**Fråga:** "Använd `filter()` för att lösa denna uppgift: Från en array med produkter, hitta alla produkter som kostar mellan 100-500 kr OCH som finns i lager."

```javascript
const products = [
  { name: "Laptop", price: 8999, inStock: true },
  { name: "Mouse", price: 299, inStock: true },
  { name: "Keyboard", price: 150, inStock: false },
  { name: "Monitor", price: 2500, inStock: true },
  { name: "Cable", price: 89, inStock: true },
  { name: "Headphones", price: 450, inStock: true }
];
```

**Förslag till svar:**
```javascript
// Med filter()
const affordableInStock = products.filter(product => {
  return product.price >= 100 && 
         product.price <= 500 && 
         product.inStock === true;
});

// Kortare version
const affordableInStock2 = products.filter(p => 
  p.price >= 100 && p.price <= 500 && p.inStock
);

console.log(affordableInStock);
// Output: [
//   { name: "Mouse", price: 299, inStock: true },
//   { name: "Headphones", price: 450, inStock: true }
// ]

// Kedja filter med map för att bara få namnen
const productNames = products
  .filter(p => p.price >= 100 && p.price <= 500 && p.inStock)
  .map(p => p.name);

console.log(productNames); // ["Mouse", "Headphones"]
```

**Viktigt:** 
- filter() returnerar ny array med element som passar villkoret
- Callback-funktionen måste returnera true/false
- Kan kedjas med andra array-metoder

---

## Fråga 9: Array.reduce() och Aggregation

**Fråga:** "Använd `reduce()` för att beräkna totala lagervärdet från denna produktdata. Förklara varje del av reduce-anropet."

```javascript
const inventory = [
  { name: "Laptop", price: 8999, quantity: 5 },
  { name: "Mouse", price: 299, quantity: 20 },
  { name: "Monitor", price: 2500, quantity: 8 }
];
```

**Förslag till svar:**
```javascript
const totalValue = inventory.reduce((accumulator, product) => {
  const productValue = product.price * product.quantity;
  console.log(`${product.name}: ${productValue} kr (Total så far: ${accumulator + productValue})`);
  return accumulator + productValue;
}, 0);

console.log("Totalt lagervärde:", totalValue, "kr");

// Output:
// Laptop: 44995 kr (Total så far: 44995)
// Mouse: 5980 kr (Total så far: 50975)  
// Monitor: 20000 kr (Total så far: 70975)
// Totalt lagervärde: 70975 kr
```

**Reduce-delar förklarade:**
- **Callback-funktion:** `(accumulator, product) => { ... }`
  - `accumulator`: Ackumulerat värde från tidigare iterationer
  - `product`: Nuvarande element som bearbetas
- **Initial värde:** `0` - startvärdet för accumulator
- **Return:** Måste returnera uppdaterat accumulator-värde

**Annan reduce-användning - gruppering:**
```javascript
// Gruppera produkter efter prisklass
const priceGroups = inventory.reduce((groups, product) => {
  const key = product.price > 1000 ? 'expensive' : 'affordable';
  if (!groups[key]) groups[key] = [];
  groups[key].push(product);
  return groups;
}, {});
```

---

## Fråga 10: Destructuring och Spread Operator

**Fråga:** "Förklara destructuring och spread operator. Skriv kod som visar båda för arrays och objekt."

**Förslag till svar:**
```javascript
// Array Destructuring
const coordinates = [10, 20, 30];
const [x, y, z] = coordinates;
console.log(x, y, z); // 10 20 30

// Med rest operator
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2  
console.log(rest);   // [3, 4, 5]

// Object Destructuring
const user = {
  id: 1,
  name: "Alice", 
  email: "alice@example.com",
  settings: { theme: "dark", notifications: true }
};

const { name, email } = user;
console.log(name, email); // Alice alice@example.com

// Rename och nested destructuring
const { id: userId, settings: { theme } } = user;
console.log(userId, theme); // 1 dark

// Spread Operator - Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, 0, ...arr2];
console.log(combined); // [1, 2, 3, 0, 4, 5, 6]

// Spread Operator - Objects
const basicInfo = { name: "Bob", age: 25 };
const extendedInfo = { 
  ...basicInfo, 
  email: "bob@example.com",
  age: 26  // Överskriver age från basicInfo
};
console.log(extendedInfo);
// { name: "Bob", age: 26, email: "bob@example.com" }

// Function parameters
function greetUser({ name, age = 'unknown' }) {
  console.log(`Hello ${name}, age: ${age}`);
}
greetUser(user); // Hello Alice, age: unknown
```

**Användningsfall:**
- **Destructuring:** Clean parameter extraction, multiple returns
- **Spread:** Copying arrays/objects, combining data, function arguments

---

## Fråga 11: Parallell vs Sekventiell Asynkron Kod

**Fråga:** "Förklara skillnaden mellan dessa två kod-exempel. När skulle du använda vilken approach?"

```javascript
// Version A
async function fetchDataA() {
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  const comments = await fetch('/api/comments').then(r => r.json());
  return { user, posts, comments };
}

// Version B  
async function fetchDataB() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  return { user, posts, comments };
}
```

**Förslag till svar:**
**Version A - Sekventiell:**
- Kör requests **en efter en**
- Total tid: Sum av alla requests
- Används när requests **beror på varandra**

**Version B - Parallell:**
- Kör requests **samtidigt**
- Total tid: Längsta request
- Används när requests är **oberoende**

```javascript
// Tidsexempel (om varje request tar 1s):
// Version A: 3 sekunder total
// Version B: 1 sekund total

// Promise.all() alternativ och felhantering
async function robustFetch() {
  try {
    // Promise.all - misslyckas om EN request misslyckas
    const results = await Promise.all([...]);
    
    // Promise.allSettled - fortsätter även om några misslyckas
    const results2 = await Promise.allSettled([...]);
    results2.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Request ${index}:`, result.value);
      } else {
        console.error(`Request ${index} failed:`, result.reason);
      }
    });
    
  } catch (error) {
    console.error("At least one request failed:", error);
  }
}
```

**Välj baserat på:**
- **Sekventiell:** När data behövs från tidigare request
- **Parallell:** När requests är oberoende, för bättre prestanda

---

## Fråga 12: Praktisk Debugging och Felhantering

**Fråga:** "Du får detta fel i konsolen: 'TypeError: Cannot read property 'map' of undefined'. Hur skulle du debugga och fixa problemet i denna kod?"

```javascript
async function displayUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    
    const userList = data.users.map(user => `<li>${user.name}</li>`);
    document.getElementById('user-list').innerHTML = userList.join('');
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**Förslag till svar:**
**Problemanalys:**
- `data.users` är `undefined` när `.map()` anropas
- API:et kanske returnerar olika struktur än förväntat
- Nätverksfel kan ge oväntad response

**Debug-teknik:**
```javascript
async function displayUsers() {
  try {
    const response = await fetch('/api/users');
    
    // Debug 1: Kontrollera response status
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Debug 2: Logga faktisk data-struktur  
    console.log('Received data:', data);
    console.log('Data type:', typeof data);
    console.log('Has users property:', 'users' in data);
    
    // Defensive programming - kontrollera innan map
    if (!data || !Array.isArray(data.users)) {
      console.warn('Unexpected data structure:', data);
      // Fallback för olika API-strukturer
      const users = Array.isArray(data) ? data : [];
      return displayUsersFallback(users);
    }
    
    const userList = data.users.map(user => {
      // Debug 3: Kontrollera varje user-objekt
      if (!user || !user.name) {
        console.warn('Invalid user object:', user);
        return '<li>Unknown user</li>';
      }
      return `<li>${user.name}</li>`;
    });
    
    const listElement = document.getElementById('user-list');
    if (listElement) {
      listElement.innerHTML = userList.join('');
    } else {
      console.error('Element with id "user-list" not found');
    }
    
  } catch (error) {
    console.error("Error in displayUsers:", error);
    
    // Visa user-friendly meddelande
    const listElement = document.getElementById('user-list');
    if (listElement) {
      listElement.innerHTML = '<li>Failed to load users</li>';
    }
  }
}

function displayUsersFallback(users) {
  // Hantera alternativ data-struktur
  console.log('Using fallback for users:', users);
}
```

**Best Practices:**
- **Logga intermediate steps** för att förstå data-flöde
- **Defensive programming** - kontrollera data-typer
- **Graceful degradation** - visa fallback vid fel
- **User-friendly error messages** - inte bara console.error

---

## Tips för Tekniska Intervjuer

- **Tänk högt** - förklara ditt approach innan du kodar
- **Börja enkelt** - implementera basic funktionalitet först  
- **Hantera edge cases** - vad händer med fel, null, undefined?
- **Diskutera performance** - när är olika metoder lämpliga?
- **Visa modern syntax** - men förklara varför du väljer det
- **Fråga om krav** - behövs felhantering? Browser-support?
