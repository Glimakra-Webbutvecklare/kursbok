# Funktioner i JavaScript

Funktioner är en av de viktigaste byggstenarna i JavaScript. De gör det möjligt att återanvända kod, strukturera programmet och dela upp logik i mindre, hanterbara delar.

---

## Vad är en funktion?

En **funktion** är en namngiven kodblock som kan köras (anropas) flera gånger. Du kan skicka in värden (argument) till funktionen och få tillbaka ett resultat (return-värde).

**Exempel:**
```javascript
function greet(name) {
  console.log("Hej, " + name + "!");
}

greet("Anna"); // Skriver ut: Hej, Anna!
greet("Erik"); // Skriver ut: Hej, Erik!
```

---

## Skapa och anropa funktioner

### Deklarera en funktion

```javascript
function add(a, b) {
  return a + b;
}
```

### Anropa en funktion

```javascript
let sum = add(3, 5); // sum blir 8
```

---

## Funktioner med och utan argument

- **Med argument:**  
  Funktioner kan ta emot värden (argument) som används inuti funktionen.
  ```javascript
  function square(x) {
    return x * x;
  }
  let result = square(4); // result blir 16
  ```

- **Utan argument:**  
  Funktioner kan också deklareras utan argument.
  ```javascript
  function sayHello() {
    console.log("Hej!");
  }
  sayHello();
  ```

---

## Returnera värden

En funktion kan returnera ett värde med `return`. När `return` körs avslutas funktionen och värdet skickas tillbaka till den som anropade funktionen.

```javascript
function multiply(a, b) {
  return a * b;
}
let produkt = multiply(2, 6); // produkt blir 12
```

Om inget `return` anges returnerar funktionen automatiskt `undefined`.

---

## Funktioner som variabler (funktionella uttryck)

Du kan också spara en funktion i en variabel:

```javascript
const subtract = function(a, b) {
  return a - b;
};
let diff = subtract(10, 3); // diff blir 7
```

---

## Arrow functions (funktion utan nyckelordet *function*): () => {}

Ett modernt och kortare sätt att skriva funktioner är med **arrow functions**:

```javascript
const divide = (a, b) => {
  return a / b;
};
let kvot = divide(10, 2); // kvot blir 5
```

Om funktionen bara returnerar ett värde kan du skriva ännu kortare:

```javascript
const double = x => x * 2;
let dubbelt = double(7); // dubbelt blir 14
```

---

## Funktioner och scope

Variabler som deklareras inuti en funktion är **lokala** för den funktionen och kan inte nås utanför.

```javascript
function testScope() {
  let lokal = "Jag finns bara här";
  console.log(lokal);
}
testScope();
// console.log(lokal); // Fel! lokal är inte definierad här
```

---

## Funktioner som argument (callback functions)

Funktioner kan skickas som argument till andra funktioner. Detta är vanligt i t.ex. eventhantering och array-metoder.

```javascript
function processArray(arr, callback) {
  for (let item of arr) {
    callback(item);
  }
}

processArray([1, 2, 3], function(num) {
  console.log(num * 2);
});
// Skriver ut: 2, 4, 6
```

---

## Sammanfattning

- Funktioner gör det möjligt att återanvända och strukturera kod.
- Du kan skapa funktioner med `function`-syntax eller som arrow functions.
- Funktioner kan ta emot argument och returnera värden.
- Variabler inuti funktioner är lokala (scope).
- Funktioner kan skickas som argument till andra funktioner (callback).

Att förstå och använda funktioner är avgörande för att skriva effektiv och läsbar JavaScript

