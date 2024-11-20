# Intro till Variabler, datatyper och operatorer

I denna guide kommer vi att gå igenom grunderna i JavaScript, inklusive hur man deklarerar variabler med let, const och var, de primitiva datatyperna, hur man använder objekt och arrayer, samt operatorer och uttryck. Syftet är att ge en tydlig och pedagogisk introduktion med exempel och resultat.

## let, const och var

### var

`var` är den äldre metoden för att deklarera variabler i JavaScript. Variabler deklarerade med `var` har funktionsscope, vilket innebär att de är tillgängliga inom hela funktionen de är deklarerade i, eller globalt om de deklareras utanför en funktion.
```js
var namn = "Alice";
console.log(namn); // Output: Alice
```
Exempel på funktionsscope med var:
```js
function greet() {
    var greeting = "Hej";
    console.log(greeting);
}
greet(); // Output: Hej
console.log(greeting); // Error: greeting is not defined
```
#### let

`let` introducerades i ES6 och har blockscope, vilket innebär att variabeln endast är tillgänglig inom det block {} där den är deklarerad.
```js
let ålder = 30;
if (true) {
    let ålder = 25;
    console.log(ålder); // Output: 25
}
console.log(ålder); // Output: 30
```
__Förklaring__: Inuti if-blocket deklareras en ny ålder-variabel som endast existerar inom blocket.

#### const

`const` används för att deklarera konstanter, dvs. variabler vars värde inte kan ändras efter tilldelning. Precis som let har const blockscope.
```js
const PI = 3.14;
console.log(PI); // Output: 3.14

// Försök att ändra värdet
// PI = 3.1415; // Error: Assignment to constant variable.
```
__Obs__: Även om själva variabeln är konstant, kan egenskaperna hos ett objekt ändras.
```js
const person = { namn: "Bob" };
person.namn = "Eva";
console.log(person.namn); // Output: Eva
```
### Primitiva datatyper

JavaScript har sju primitiva datatyper som används för olika ändamål:

1. __String (Text)__
```js
let text = "Hej världen";
let name = 'Anna';
let template = `Välkommen ${name}`;
```
Strings används för all texthantering - användarnamn, meddelanden, HTML-innehåll etc. Kan skapas med enkelfnuttar, dubbelfnuttar eller backticks (för template strings).

2. __Number (Numeriska värden)__
```js
let heltal = 42;
let decimal = 3.14;
let negativt = -17;
```
Numbers används för alla numeriska beräkningar - priser, åldrar, matematiska uträkningar, animationer etc. JavaScript har bara en numbertyp som hanterar både heltal och decimaler.

3. __Boolean (sant/falskt)__
```js
let isLoggedIn = true;
let isApproved = false;
```
Booleans används för logiska kontroller - användarstatus, formulärvalidering, villkor i if-satser etc. Har endast två möjliga värden: true eller false.

4. __Undefined__
```js
let odefinierad;
let person = {namn: "Anna"};
console.log(odefinierad); // undefined
console.log(person.age); // undefined
console.log(person.namn); // "Anna"
```
Undefined är standardvärdet för variabler som deklarerats men inte tilldelats något värde. Används ofta för att kontrollera om en variabel eller objektegenskap har initialiserats.

5. __Null__
```js
let ingenData = null;
```
`null` används när man explicit vill ange att något saknar värde - t.ex. när en databassökning inte ger några träffar eller när man vill återställa en variabel.

6. __Symbol__
```js
let uniktId = Symbol('id');
let annatId = Symbol('id');
console.log(uniktId === annatId); // false
```
Symbols skapar garanterat unika identifierare. Används främst i objektegenskaper när man behöver säkerställa att nycklar är unika, särskilt i bibliotek och ramverk.

7. __BigInt__
```js
let enormtTal = BigInt(9007199254740991);
let binartTal = BigInt("0b11111111111111111");
```
BigInt används när man behöver arbeta med heltal större än 2^53-1. Vanligt vid kryptografi, tidsstämplar i millisekunder eller andra beräkningar med mycket stora tal.



### Typkontroll
Du kan alltid kontrollera en variabels datatyp med typeof:
```js
let name = "Erik";
let age = 25;
let isHappy = true;
console.log(typeof name);  // "string"
console.log(typeof age); // "number"
console.log(typeof ishappy); // "boolean"

```

### Specialfall med typeof

JavaScript har några intressanta specialfall när det gäller `typeof`-operatorn:

```js
console.log(typeof []); // "object"
console.log(typeof {}); // "object" 
console.log(typeof null); // "object"
```
Detta kan vara förvirrande eftersom Arrays, Object och null alla är tekniskt sett objekt i JavaScript, därför returnerar `typeof []` `"object"`. För att specifikt kolla om något är en array används istället:
```js
Array.isArray([]); // true
Array.isArray({}); // false
```
Att typeof null returnerar "object" är ett historiskt misstag i JavaScript som har behållits för bakåtkompatibilitet. För att kolla om något är null används istället direkt jämförelse:
```js
let test = null;
console.log(test === null);
```

### Objekt

Ett objekt är en samling egenskaper, där varje egenskap består av ett nyckel-värde-par.
```js
let student = {
    namn: "Karin",
    ålder: 22,
    program: "Datavetenskap"
};

console.log(student.namn); // Output: Karin
```
Åtkomst av egenskaper:
- Punktnotation: `objekt.egenskap`
- Hakparentesnotation: `objekt["egenskap"]`

### Metod - Funktion kopplad till objekt 
Man kan tilldela en funktion till ett objekt. Då kallas det en metod.
```js
let student = {
    name: "Karin",
    age: 22,
    program: "Datavetenskap"
    present: function() {
        console.log(`Hi, my name is ${this.name}. I am ${this.age} years old. I study ${this.program}.`);
    }
};

student.present(); // Output: Hi, my name is Karin. I am 22 years old. I study Datavetenskap.
```

### Klass - mall för att skapa objekt
Ofta vill man ha flera objekt av samma typ. I vårt fall flera studenter. Varje student ska ha egenskaperna `name`, `age`, `program` och `present`. 
Det enda som ska ändras är värdet på egenskapen. Då kan beskriva en mall hur objektet ska se om man skapar en ny.
Denna mallen kallas en `Class`.

```js
class Student {
    // En speciell funktion som beskriver hur argumenten ska kopplas till objektet
    __contructor(name, age, program) {
        this.name = name;
        this.age = age;
        this.program = program;
    }

    // metod till objektet
    present() {
        console.log(`Hi, my name is ${this.name}. I am ${this.age} years old. I study ${this.program}.`);
    }
}

let student1 = new Student("Karin", 22, "Datavetenskap");
let student2 = new Student("Jimmie", 25, "Biologi");

student1.present(); // Output: Hi, my name is Karin. I am 22 years old. I study Datavetenskap.
student2.present(); // Output: Hi, my name is Jimmie. I am 25 years old. I study Biologi.
```

### Arrayer

En array är en ordnad lista över värden, som kan innehålla olika datatyper.
```js
let colors = ["Röd", "Grön", "Blå"];
console.log(colors[0]); // Output: Röd
console.log(colors[1]); // Output: Grön
console.log(colors[2]); // Output: Blå
console.log(colors[3]); // Output: Undefined
```
Vanliga arraymetoder:
- push() - Lägg till element i slutet.
```js
colors.push("Gul");
```

- pop() - Ta bort det sista elementet.
```js
colors.pop();
```

- length - Ger antalet element i arrayen.
```js
console.log(colors.length); // Output: 3
```


### Operatorer och uttryck

Aritmetiska operatorer för värden med datatyp `number`

- Addition (+): Lägger ihop två värden.
```js
let summa = 5 + 3; // Output: 8
```

- Subtraktion (-): Drar ett värde från ett annat.
```js
let skillnad = 10 - 2; // Output: 8
```

- Multiplikation (*): Multiplicerar två värden.
```js
let produkt = 4 * 2; // Output: 8
```

- Division (/): Dividerar ett värde med ett annat.
```js
let kvot = 16 / 2; // Output: 8
```

- Modulus (%): Ger resten av en division.
```js
let rest = 17 % 3; // Output: 2
```


### Tilldelningsoperatorer

- Enkel tilldelning (=):
```js
let x = 10;
```

- Additionstilldelning (+=):
```js
x += 5; // Samma som x = x + 5
```

- Subtraktionstilldelning (-=):
```js
x -= 3; // Samma som x = x - 3
```


### Jämförelseoperatorer

- Lika med (==): Jämför värden, oavsett datatyp.
```js
console.log(5 == "5"); // Output: true
```

- Strikt lika med (===): Jämför både värde och datatyp.
```js
console.log(5 === "5"); // Output: false
```

- Inte lika med (!=):
```js
console.log(5 != "5"); // Output: false
```

- Strikt inte lika med (!==):
```js
console.log(5 !== "5"); // Output: true
```


### Logiska operatorer

- Och (&&): Båda uttrycken måste vara sanna.
```js
console.log(true && false); // Output: false
```

- Eller (||): Minst ett uttryck måste vara sant.
```js
console.log(true || false); // Output: true
```

- Icke (!): Vänder på sanningsvärdet.
```js
console.log(!true); // Output: false
```


Exempel på användning i villkor:
```js
let ålder = 18;
if (ålder >= 18 && ålder < 65) {
    console.log("Vuxen");
} else {
    console.log("Inte vuxen");
}
// Output: Vuxen
```
### Strängoperator

- Konkatenation (+): Slår ihop strängar.
```js
let hälsning = "Hej" + " " + "världen!";
console.log(hälsning); // Output: Hej världen!
```


### Övriga operatorer

- Ternär operator (?:): Kortform för if...else.
```js
let resultat = (ålder >= 18) ? "Myndig" : "Underårig";
```

- typeof: Returnerar datatypen för en variabel.
```js
console.log(typeof 42); // Output: number
console.log(typeof "Hej"); // Output: string
```

## Övningar

För att befästa din förståelse, försök lösa följande övningar:
1.	__Variabler och scope__:
- a) Deklarera en variabel `x` med värdet 10 utanför en funktion.
- b) Inuti en funktion, deklarera en variabel `x` med värdet 20 med hjälp av var.
- c) Logga värdet av `x` både inuti och utanför funktionen. Vad blir resultatet och varför?
2.	__Primitiva datatyper__:
- a) Skapa en variabel av varje primitiv datatyp och logga deras typer med typeof.
- b) Förklara skillnaden mellan null och undefined.
3.	__Objekt och arrayer__:
- a) Skapa ett objekt bil med egenskaperna märke, modell och år.
- b) Lägg till en metod beskrivning som returnerar en sträng med bilens detaljer.
- c) Skapa en array garage som innehåller flera bil-objekt.
- d) Iterera över garage och logga beskrivningen av varje bil.
4.	__Operatorer och uttryck__:
- a) Skriv en funktion som tar två tal som argument och returnerar det större talet utan att använda if...else (använd en ternär operator).
- b) Förklara vad som händer när du jämför en sträng och ett tal med == respektive ===.

## Lösningsförslag
1. __Variabler och scope__:
```js
// a)
var x = 10;

function test() {
    // b)
    var x = 20;
    // c)
    console.log("Inuti funktionen:", x); // Output: Inuti funktionen: 20
}

test();
console.log("Utanför funktionen:", x); // Output: Utanför funktionen: 10
```
__Förklaring__: Variabeln `x` inuti funktionen är lokal på grund av funktionsscope med var. Den påverkar inte den globala `x`.

2. __Primitiva datatyper__:
```js
// a)
let str = "Hej";
let nummer = 42;
let boolean = true;
let odefinierad;
let tom = null;
let symbol = Symbol("unik");
let stortTal = BigInt(9007199254740991);

console.log(typeof str);    // Output: string
console.log(typeof nummer);    // Output: number
console.log(typeof boolean);   // Output: boolean
console.log(typeof odefinierad); // Output: undefined
console.log(typeof tom);       // Output: object (detta är ett känt "bugg")
console.log(typeof symbol);    // Output: symbol
console.log(typeof stortTal);  // Output: bigint
```
undefined betyder att en variabel är deklarerad men inte har tilldelats ett värde. null är ett explicit inget värde.

3. __Objekt och arrayer__:
```js
// a)
function Bil(brand, modell, year) {
    this.brand = brand;
    this.modell = modell;
    this.year = year;
    // b)
    this.beskrivning = function() {
        return `${this.brand} ${this.modell} från ${this.year}`;
    };
}

let bil1 = new Bil("Volvo", "XC60", 2020);
let bil2 = new Bil("Tesla", "Model S", 2021);
let bil3 = new Bil("Audi", "A4", 2019);

// c)
let garage = [bil1, bil2, bil3];

// d)
for (let bil of garage) {
    console.log(bil.beskrivning());
}
/*
Output:
Volvo XC60 från 2020
Tesla Model S från 2021
Audi A4 från 2019
*/
```

4. __Operatorer och uttryck__
```js
// a)
function max(a, b) {
    return (a > b) ? a : b;
}

console.log(max(5, 10)); // Output: 10

// b)
console.log(5 == "5");  // Output: true (jämför värde, typkonvertering sker)
console.log(5 === "5"); // Output: false (jämför både värde och typ)
```

__Förklaring__: Med == sker typkonvertering innan jämförelsen, medan === jämför både värde och datatyp utan typkonvertering.

## Sammanfattning

Vi har nu gått igenom grunderna i JavaScript:
- Variabler: Hur man deklarerar dem med let, const och var.
- Datatyper: De primitiva typerna som string, number, boolean, etc.
- Objekt och arrayer: Hur man strukturerar data i nyckel-värde-par och listor.
- Operatorer och uttryck: Hur man utför beräkningar och jämförelser.

Dessa fundamentala koncept är avgörande för att förstå och skriva effektiv JavaScript-kod. Fortsätt att öva genom att skriva egen kod och experimentera med olika exempel.