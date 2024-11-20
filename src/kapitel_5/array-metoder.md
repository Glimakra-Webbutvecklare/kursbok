# Avancerade array- och objektmetoder

## map, filter, reduce
Map är en inbyggd array-metod i JavaScript som skapar en ny array genom att utföra en funktion på varje element i den ursprungliga arrayen. Den ursprungliga arrayen förblir oförändrad medan den nya arrayen innehåller de transformerade värdena. Map är särskilt användbar när du vill bearbeta data och skapa en ny version av den utan att ändra originalet.

Map tar en callback-funktion som parameter och denna funktion körs en gång för varje element. Callback-funktionen kan ta upp till tre argument: det aktuella elementet, elementets index och den ursprungliga arrayen. Det vanligaste är dock att bara använda det första argumentet.

```js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(number => number * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const names = ["anna", "bertil", "cesar"];
const capitalized = names.map(name => name.charAt(0).toUpperCase() + name.slice(1));
console.log(capitalized); // ["Anna", "Bertil", "Cesar"]

const products = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
  { name: "Tablet", price: 300 }
];
const prices = products.map(product => product.price);
console.log(prices); // [1000, 500, 300]
```


- Object destructuring
- Spread operator
- Rest parameters
