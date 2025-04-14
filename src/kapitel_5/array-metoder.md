# Avancerade Array-Metoder och Objekt-Syntax

När vi arbetar med data, särskilt listor (arrayer) som vi ofta får tillbaka från API:er, behöver vi effektiva sätt att transformera, filtrera och sammanställa den datan. JavaScript erbjuder flera kraftfulla inbyggda array-metoder som hjälper oss med detta på ett deklarativt och läsbart sätt.

Vi kommer också att titta på modern syntax för att arbeta med objekt och arrayer, vilket gör koden mer koncis.

## `map()` - Transformera Element

`map` är en inbyggd array-metod som skapar en **ny** array genom att utföra en angiven funktion på *varje* element i den ursprungliga arrayen. Den ursprungliga arrayen förblir oförändrad, medan den nya arrayen innehåller de transformerade värdena. `map` är särskilt användbar när du vill bearbeta data och skapa en ny version av den utan att ändra originalet.

`map` tar en callback-funktion som parameter, och denna funktion körs en gång för varje element. Callback-funktionen kan ta upp till tre argument:

1.  `element`: Värdet på det aktuella elementet som bearbetas.
2.  `index` (valfri): Indexet för det aktuella elementet.
3.  `array` (valfri): Den ursprungliga arrayen som `map` anropades på.

Det vanligaste är dock att bara använda det första argumentet (`element`). Callback-funktionen *måste* returnera det nya värdet för elementet i den nya arrayen.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Skapa en ny array där varje nummer är dubblerat
const doubled = numbers.map(number => number * 2);
console.log(doubled); // Output: [2, 4, 6, 8, 10]
console.log(numbers); // Output: [1, 2, 3, 4, 5] (originalet är oförändrat)

const names = ["anna", "bertil", "cesar"];

// Skapa en ny array med namnen omvandlade till stor begynnelsebokstav
const capitalized = names.map(name => name.charAt(0).toUpperCase() + name.slice(1));
console.log(capitalized); // Output: ["Anna", "Bertil", "Cesar"]

const products = [
  { id: "p1", name: "Laptop", price: 12000 },
  { id: "p2", name: "Phone", price: 7500 },
  { id: "p3", name: "Tablet", price: 4000 }
];

// Skapa en ny array som bara innehåller produktpriserna
const prices = products.map(product => product.price);
console.log(prices); // Output: [12000, 7500, 4000]

// Skapa en ny array med produktobjekt som har priset inkl. moms (25%)
const productsWithVat = products.map(product => {
  return {
    ...product, // Kopiera alla befintliga egenskaper (mer om '...' senare)
    priceWithVat: product.price * 1.25
  };
});
console.log(productsWithVat);
/* Output:
[
  { id: 'p1', name: 'Laptop', price: 12000, priceWithVat: 15000 },
  { id: 'p2', name: 'Phone', price: 7500, priceWithVat: 9375 },
  { id: 'p3', name: 'Tablet', price: 4000, priceWithVat: 5000 }
]
*/
```

## `filter()` - Välja ut Element

`filter` är en annan array-metod som skapar en **ny** array. Denna nya array innehåller *endast* de element från den ursprungliga arrayen som uppfyller ett visst villkor. Den ursprungliga arrayen förblir oförändrad.

Precis som `map`, tar `filter` en callback-funktion som körs för varje element. Callback-funktionen tar samma argument (`element`, `index`, `array`). Skillnaden är att callback-funktionen här *måste* returnera ett **boolean**-värde (`true` eller `false`).

*   Om callback-funktionen returnerar `true`, inkluderas elementet i den nya arrayen.
*   Om callback-funktionen returnerar `false`, exkluderas elementet.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Skapa en ny array med endast jämna nummer
const evenNumbers = numbers.filter(number => number % 2 === 0);
console.log(evenNumbers); // Output: [2, 4, 6, 8, 10]
console.log(numbers); // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const names = ["Anna", "Bertil", "Cesar", "David", "Eva"];

// Skapa en ny array med namn som är längre än 4 bokstäver
const longNames = names.filter(name => name.length > 4);
console.log(longNames); // Output: ["Bertil", "Cesar", "David"]

const products = [
  { id: "p1", name: "Laptop", price: 12000, inStock: true },
  { id: "p2", name: "Phone", price: 7500, inStock: false },
  { id: "p3", name: "Tablet", price: 4000, inStock: true },
  { id: "p4", name: "Mouse", price: 300, inStock: true }
];

// Skapa en ny array med produkter som finns i lager
const availableProducts = products.filter(product => product.inStock);
console.log(availableProducts);
/* Output:
[
  { id: 'p1', name: 'Laptop', price: 12000, inStock: true },
  { id: 'p3', name: 'Tablet', price: 4000, inStock: true },
  { id: 'p4', name: 'Mouse', price: 300, inStock: true }
]
*/

// Kombinera filter och map: Hämta namnen på dyra produkter (pris > 5000)
const expensiveProductNames = products
  .filter(product => product.price > 5000) // Först filtrera
  .map(product => product.name);           // Sedan mappa resultatet
console.log(expensiveProductNames); // Output: ["Laptop", "Phone"]
```

## `reduce()` - Sammanställa till Ett Värde

`reduce` är kanske den mest mångsidiga, men också den mest komplexa, av de vanliga array-metoderna. Den används för att "reducera" en array till ett **enda värde** genom att iterativt applicera en funktion på elementen. Detta enda värde kan vara ett nummer (t.ex. en summa), en sträng, ett objekt, eller till och med en annan array.

`reduce` tar två argument:

1.  En **reducer-funktion** (callback). Denna funktion tar i sin tur (oftast) fyra argument:
    *   `accumulator` (ackumulator): Värdet som byggs upp och returneras från föregående iteration (eller `initialValue` vid första iterationen).
    *   `currentValue` (aktuellt värde): Värdet på det aktuella elementet som bearbetas.
    *   `currentIndex` (valfri): Indexet för det aktuella elementet.
    *   `array` (valfri): Den ursprungliga arrayen.
    Reducer-funktionen *måste* returnera det uppdaterade ackumulatorvärdet för nästa iteration.
2.  Ett `initialValue` (initialvärde, valfritt): Värdet som ackumulatorn ska starta med vid den första iterationen. Om detta utelämnas används det *första* elementet i arrayen som initialvärde, och iterationen börjar från det *andra* elementet.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Beräkna summan av alla nummer
const sum = numbers.reduce((accumulator, currentValue) => {
  console.log(`Ack: ${accumulator}, Current: ${currentValue}`);
  return accumulator + currentValue;
}, 0); // Startvärde för ackumulatorn är 0

console.log("Summa:", sum); // Output: 15
/* Logg från reduce:
Ack: 0, Current: 1
Ack: 1, Current: 2
Ack: 3, Current: 3
Ack: 6, Current: 4
Ack: 10, Current: 5
*/

// Hitta det högsta värdet
const max = numbers.reduce((maxSoFar, current) => {
  return current > maxSoFar ? current : maxSoFar;
}); // Inget initialValue, första elementet (1) används som start
console.log("Max:", max); // Output: 5

const products = [
  { id: "p1", name: "Laptop", price: 12000 },
  { id: "p2", name: "Phone", price: 7500 },
  { id: "p3", name: "Tablet", price: 4000 }
];

// Beräkna totalt lagervärde
const totalValue = products.reduce((total, product) => total + product.price, 0);
console.log("Totalt värde:", totalValue); // Output: 23500

// Gruppera produkter efter prisklass (exempel på att returnera ett objekt)
const groupedByPrice = products.reduce((groups, product) => {
  const key = product.price > 5000 ? 'expensive' : 'cheap';
  if (!groups[key]) {
    groups[key] = []; // Skapa arrayen om den inte finns
  }
  groups[key].push(product);
  return groups; // Returnera det uppdaterade objektet
}, {}); // Startvärde är ett tomt objekt

console.log("Grupperade produkter:", groupedByPrice);
/* Output:
{
  expensive: [
    { id: 'p1', name: 'Laptop', price: 12000 },
    { id: 'p2', name: 'Phone', price: 7500 }
  ],
  cheap: [ { id: 'p3', name: 'Tablet', price: 4000 } ]
}
*/
```

## Modern Objekt- och Array-Syntax

ES6 (ECMAScript 2015) och senare versioner av JavaScript har introducerat syntax som gör det smidigare att arbeta med objekt och arrayer.

### Destructuring (Destrukturering)

Destructuring låter oss "packa upp" värden från arrayer eller egenskaper från objekt till separata variabler på ett koncis sätt.

```javascript
// Array Destructuring
const coordinates = [10, 25, 5];
const [x, y, z] = coordinates;
console.log(x, y, z); // Output: 10 25 5

// Object Destructuring
const user = {
  id: "u1",
  name: "Alice",
  email: "alice@example.com",
  settings: { theme: "dark", notifications: true }
};

// Plocka ut egenskaper till variabler med samma namn
const { name, email } = user;
console.log(name, email); // Output: Alice alice@example.com

// Plocka ut och byt namn på variabeln
const { id: userId } = user;
console.log(userId); // Output: u1

// Plocka ut nästlade egenskaper
const { settings: { theme } } = user;
console.log(theme); // Output: dark

// Användbart i funktionsparametrar
function printUserName({ name }) {
  console.log(`Användarnamn: ${name}`);
}
printUserName(user); // Output: Användarnamn: Alice
```

### Spread Operator (`...`)

Spread-operatorn låter oss "sprida ut" elementen från en array eller egenskaperna från ett objekt in i en ny array eller ett nytt objekt.

```javascript
// Spread i Arrayer
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinedArr = [...arr1, 0, ...arr2]; // Sprid ut elementen från arr1 och arr2
console.log(combinedArr); // Output: [1, 2, 3, 0, 4, 5, 6]

// Skapa en kopia av en array
const arr1Copy = [...arr1];
console.log(arr1Copy); // Output: [1, 2, 3]
arr1Copy.push(4);
console.log(arr1); // Output: [1, 2, 3] (originalet oförändrat)

// Spread i Objekt (ES2018+)
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const combinedObj = { ...obj1, ...obj2 }; // Egenskaper från obj2 skriver över de från obj1 vid namnkonflikt (b)
console.log(combinedObj); // Output: { a: 1, b: 3, c: 4 }

// Skapa en kopia av ett objekt
const obj1Copy = { ...obj1 };
console.log(obj1Copy); // Output: { a: 1, b: 2 }

// Lägga till/uppdatera egenskaper på ett icke-muterande sätt (vanligt i React/Redux)
const updatedObj1 = { ...obj1, b: 100, d: 5 };
console.log(updatedObj1); // Output: { a: 1, b: 100, d: 5 }
console.log(obj1); // Output: { a: 1, b: 2 } (originalet oförändrat)
```

### Rest Parameters (`...`)

Rest-parametern ser likadan ut (`...`) men används i funktionsdefinitioner för att samla ihop ett *obestämt* antal argument till en **array**.

```javascript
// Samla alla argument till en array
function sumAll(...numbers) { // numbers blir en array
  console.log(numbers); // T.ex. [1, 2, 3] eller [10, 20]
  return numbers.reduce((sum, num) => sum + num, 0);
}

console.log(sumAll(1, 2, 3)); // Output: 6
console.log(sumAll(10, 20));   // Output: 30

// Kombinera vanliga parametrar med rest
function logMessage(level, ...messages) { // messages blir en array med resten
  console.log(`[${level.toUpperCase()}]`, ...messages); // Kan sprida ut messages igen vid loggning
}

logMessage('info', 'Användare loggade in', 'ID: 123'); // Output: [INFO] Användare loggade in ID: 123
logMessage('error', 'Databasfel');              // Output: [ERROR] Databasfel
```

Dessa metoder och syntax-förbättringar (`map`, `filter`, `reduce`, destructuring, spread/rest) är centrala i modern JavaScript och gör det möjligt att skriva mer uttrycksfull, koncis och ofta mer läsbar kod, särskilt när man hanterar datastrukturer.
