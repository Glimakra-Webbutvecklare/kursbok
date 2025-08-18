# Variabler i JavaScript

Variabler är en grundläggande del av programmering. De används för att lagra och hantera data som kan ändras under programmets gång. I JavaScript kan du spara allt från siffror och text till objekt och listor i variabler.

---

## Vad är en variabel?

En **variabel** är ett namn som pekar på ett värde i datorns minne. Du kan använda variabeln för att läsa, ändra eller använda värdet senare i programmet.

---

## Namngivning av variabler

När du skapar variabler i JavaScript är det viktigt att använda tydliga och beskrivande namn. Det rekommenderas att skriva variabelnamn på **engelska**, eftersom det är standard inom programmering och gör koden lättare att förstå för andra utvecklare.

JavaScript använder vanligtvis **camelCase** för variabelnamn. Det innebär att det första ordet skrivs med små bokstäver och varje nytt ord börjar med stor bokstav, till exempel `userName`, `totalAmount` eller `isActive`.

Att vara **konsekvent** med namngivningen gör koden mer lättläst och underlättar samarbeten. Undvik att blanda språk eller olika stilar i samma projekt.

**Exempel på bra variabelnamn:**
```javascript
let userEmail = "anna@example.com";
let itemCount = 5;
let isLoggedIn = false;
```

**Exempel på mindre bra variabelnamn:**
```javascript
let användareNamn = "Anna"; // Blanda inte språk
let Item_count = 10;        // Undvik underscore och stor bokstav i början
let x = true;               // För kort och otydligt
```



## Deklarera variabler

I modern JavaScript används oftast `let` och `const` för att skapa variabler. Äldre kod kan använda `var`, men det rekommenderas inte längre.

- **`let`** – Skapar en variabel som kan ändras (reassignas).
- **`const`** – Skapar en variabel som *inte* kan ändras (konstant). Värdet måste sättas direkt.

**Exempel:**
```javascript
let name = "Anna";
let age = 25;

const pi = 3.14159;
```

---

## Ändra värdet på en variabel

Variabler skapade med `let` kan få nya värden:

```javascript
let score = 10;
score = 15; // score är nu 15
```

Variabler skapade med `const` kan *inte* ändras:

```javascript
const maxUsers = 100;
// maxUsers = 200; // Fel! Går inte att ändra en const-variabel
```

---

## Datatyper

Variabler kan innehålla olika typer av data:

- **String** (text): `"Hello"`, `'JavaScript'`
- **Number** (tal): `42`, `3.14`
- **Boolean** (sant/falskt): `true`, `false`
- **Array** (lista): `[1, 2, 3]`
- **Object** (objekt): `{ name: "Anna", age: 25 }`
- **Null** (avsaknad av värde): `null`
- **Undefined** (ej tilldelat värde): `undefined`

**Exempel:**
```javascript
let text = "Hello!";
let number = 123;
let isActive = true;
let list = [1, 2, 3];
let person = { name: "Anna", age: 25 };
let emptyValue = null;
let unknown;
```

---

## Namnge variabler

- Variabelnamn får innehålla bokstäver, siffror, `_` och `$`, men får **inte** börja med en siffra.
- Använd beskrivande namn (t.ex. `userName` istället för `x`).
- JavaScript är **case sensitive**: `name` och `Name` är olika variabler.

---

## Utskrift och användning

Du kan använda variabler i uttryck och skriva ut dem med `console.log`:

```javascript
let firstName = "Sara";
console.log("Hello, " + firstName + "!");
```

---

## Sammanfattning

- Variabler används för att lagra och hantera data i JavaScript.
- Använd `let` för variabler som kan ändras, `const` för konstanter.
- Variabler kan innehålla olika datatyper: text, tal, boolean, listor, objekt m.m.
- Välj tydliga och beskrivande variabelnamn på engelska.
- Variabler är grunden för att kunna skapa dynamiska och flexibla program.

Att förstå och använda variabler är ett av de första stegen mot att bli en skicklig programmerare