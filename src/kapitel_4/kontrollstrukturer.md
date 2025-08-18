# Kontrollstrukturer i JavaScript

Kontrollstrukturer är byggstenarna som styr **flödet** i ett program. Med hjälp av dessa kan vi bestämma *vilken kod* som ska köras, *när* och *hur många gånger*. De vanligaste kontrollstrukturerna är **villkorssatser** (if/else) och **loopar** (for, while).

---

## Villkorssatser (if, else if, else)

Med villkorssatser kan vi utföra olika kod beroende på om ett visst villkor är sant eller falskt.

**Syntax:**
```javascript
if (villkor) {
  // kod som körs om villkoret är sant
} else if (annatVillkor) {
  // kod som körs om det andra villkoret är sant
} else {
  // kod som körs om inget av villkoren ovan är sant
}
```

**Exempel:**
```javascript
let age = 18;

if (age >= 18) {
  console.log("Du är myndig.");
} else {
  console.log("Du är inte myndig.");
}
```

---

## Jämförelseoperatorer

För att skapa villkor använder vi jämförelseoperatorer:

- `===`  lika med (värde och typ)
- `!==`  inte lika med (värde och typ)
- `==`   lika med (bara värde, undvik i modern JS)
- `!=`   inte lika med (bara värde, undvik i modern JS)
- `>`    större än
- `<`    mindre än
- `>=`   större än eller lika med
- `<=`   mindre än eller lika med

**Exempel:**
```javascript
let x = 5;
if (x !== 10) {
  console.log("x är inte 10");
}
```

---

## Logiska operatorer

Kombinera flera villkor med logiska operatorer:

- `&&`  och (båda villkoren måste vara sanna)
- `||`  eller (minst ett villkor måste vara sant)
- `!`   inte (vänder på sant/falskt)

**Exempel:**
```javascript
let temp = 20;
if (temp > 15 && temp < 25) {
  console.log("Lagom varmt!");
}
```

---

## Switch-sats

När du har många möjliga värden att jämföra mot kan `switch` vara tydligare än många `if/else`.

**Syntax:**
```javascript
switch (uttryck) {
  case värde1:
    // kod
    break;
  case värde2:
    // kod
    break;
  default:
    // kod om inget matchar
}
```

**Exempel:**
```javascript
let day = "tisdag";
switch (day) {
  case "måndag":
    console.log("Ny vecka!");
    break;
  case "tisdag":
    console.log("Andra dagen.");
    break;
  default:
    console.log("Någon annan dag.");
}
```

---

## Loopar

Loopar används för att upprepa kod flera gånger.

### For-loop

**Syntax:**
```javascript
for (start; villkor; steg) {
  // kod som upprepas
}
```

**Exempel:**
```javascript
for (let i = 0; i < 5; i++) {
  console.log("i är nu: " + i);
}
```

### While-loop

**Syntax:**
```javascript
while (villkor) {
  // kod som upprepas så länge villkoret är sant
}
```

**Exempel:**
```javascript
let count = 0;
while (count < 3) {
  console.log("Räknare: " + count);
  count++;
}
```

---

## Break och continue

- `break` – Avbryter loopen direkt.
- `continue` – Hoppar över resten av koden i loopen och går till nästa varv.

**Exempel:**
```javascript
for (let i = 0; i < 5; i++) {
  if (i === 3) break;      // Avbryter loopen när i är 3
  if (i === 1) continue;   // Hoppar över när i är 1
  console.log(i);
}
// Skriver ut: 0, 2
```

---

## Sammanfattning

- Kontrollstrukturer styr flödet i programmet.
- Använd `if`, `else if`, `else` och `switch` för att fatta beslut.
- Använd `for` och `while` för att upprepa kod.
- Jämförelse- och logiska operatorer hjälper dig att skapa villkor.
- `break` och `continue` ger extra kontroll i loopar.

Att behärska kontrollstrukturer är avgörande för att kunna skriva logisk och flexibel kod. I nästa avsnitt ska vi se hur JavaScript kan interagera med själva HTML-sidan.

## Övningar

### 1. While-loop
Skriv en while-loop som räknar ner från 10 till 0 och skriver ut varje tal.

```js
let count = 10;
// fortsätt med din lösning
```

### 2. Array-transformation
Skapa en array med temperaturer i Celsius och använd map för att konvertera dem till Fahrenheit.
(Formel: F = C * 9/5 + 32)

```js
// array med celsius temperaturer
let celsiusTemp = [0, 10, 20, 30, 40];
// fortsätt med din lösning
```

### 3. Filtrering med forEach
Använd forEach för att skriva ut alla jämna tal i en array.

```js
// array siffror
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// fortsätt med din lösning
```

### Lösningsförslag

#### Övning 1
```js
let count = 10;
while (count >= 0) {
    console.log(count);
    count--;
}
// Utskrift: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
```

#### Övning 2
```js
let celsiusTemp = [0, 10, 20, 30, 40];
let fahrenheitTemp = celsiusTemp.map(temp => temp * 9/5 + 32);
console.log(fahrenheitTemp);
// Utskrift: [32, 50, 68, 86, 104]
```

#### Övning 3
```js
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
numbers.forEach(num => {
    if (num % 2 === 0) {
        console.log(num);
    }
});
// Utskrift: 2, 4, 6, 8, 10
```