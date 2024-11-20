# Kontrollstrukturer och loopar

## if/else statements
If/else-satser används för att skapa villkorsstyrd kod. Koden körs endast om ett specifikt villkor är uppfyllt.

```js
let ålder = 18;

if (ålder >= 18) {
    console.log("Du är myndig!");
} else {
    console.log("Du är inte myndig än.");
}
```

Man kan också använda else if för flera villkor:

```js
let poäng = 75;

if (poäng >= 90) {
    console.log("Du fick betyg A");
} else if (poäng >= 80) {
    console.log("Du fick betyg B");
} else if (poäng >= 70) {
    console.log("Du fick betyg C");
} else {
    console.log("Du behöver plugga mer");
}
```

## switch
Switch-satser är användbara när man har flera olika fall att hantera:

```js
let dag = "måndag";

switch(dag) {
    case "måndag":
        console.log("Början på veckan");
        break;
    case "fredag":
        console.log("Äntligen helg!");
        break;
    default:
        console.log("En vanlig dag");
}
```

## for-loopar
For-loopar används när man vill upprepa kod ett bestämt antal gånger:

```js
// Klassisk for-loop
for (let i = 0; i < 5; i++) {
    console.log(`Iteration nummer ${i}`);
}

// For...of loop för arrayer
let frukter = ["äpple", "banan", "päron"];
for (let frukt of frukter) {
    console.log(frukt);
}
```

## while och do-while
While-loopar används när man vill upprepa kod så länge ett villkor är sant:

```js
// While-loop
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// Do-while loop (körs minst en gång)
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 5);
```

## forEach och map
Dessa är moderna array-metoder som förenklar iteration och transformation av data:

```js
// forEach för iteration
let nummer = [1, 2, 3, 4, 5];
nummer.forEach(num => {
    console.log(num * 2);
});

// map för att skapa en ny array
let dubblade = nummer.map(num => num * 2);
console.log(dubblade); // [2, 4, 6, 8, 10]

// Praktiskt exempel
let personer = [
    { namn: "Anna", ålder: 25 },
    { namn: "Erik", ålder: 30 },
    { namn: "Maria", ålder: 28 }
];

personer.forEach(person => {
    console.log(`${person.namn} är ${person.ålder} år gammal`);
});

let namn = personer.map(person => person.namn);
console.log(namn); // ["Anna", "Erik", "Maria"]
```
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