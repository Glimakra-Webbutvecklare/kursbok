# Funktioner och scope

Funktioner är en av de mest grundläggande byggstenarna i JavaScript. De låter dig kapsla in kod som kan återanvändas, vilket gör ditt program mer modulärt och lättare att underhålla. I detta avsnitt kommer vi att utforska hur man deklarerar och använder funktioner samt förstå begreppet scope (variabelns räckvidd) i JavaScript.

## Vad är en funktion?

En funktion är ett block av kod som utför en specifik uppgift. Den kan ta emot indata (parametrar), bearbeta dem och returnera ett resultat.

Syntax för att deklarera en funktion:
```javascript,editable 
function funktionNamn(parameter1, parameter2) {
    // Kod som ska utföras
    return resultat;
}
```
Exempel:
```javascript,editable 
function addera(a, b) {
    return a + b;
}

let summa = addera(5, 3);
console.log(summa); // Output: 8
```
## Parametrar och Argument

- Parametrar är variabler som anges i funktionsdefinitionen.
- Argument är de faktiska värden som skickas till funktionen när den anropas.

Exempel:
```javascript,editable 
function greet(namn) {
    console.log("Hej, " + namn + "!");
}

greet("Alice"); // Output: Hej, Alice!
```
Här är `namn` en parameter, och `"Alice"` är ett argument.

## Anonyma Funktioner och Funktionsuttryck

Förutom att deklarera funktioner med function-nyckelordet kan du också skapa anonyma funktioner (funktioner utan namn) och lagra dem i variabler.

Exempel:
```javascript,editable 
let multiplicera = function(a, b) {
    return a * b;
};

console.log(multiplicera(4, 5)); // Output: 20
```
## Arrow Functions (Pilfunktioner)

Introducerade i ES6, arrow functions ger ett kortare syntax för att skriva funktioner.

Syntax:
```javascript,editable 
let funktionNamn = (parameter1, parameter2) => {
    // Kod som ska utföras
    return resultat;
};
```
Exempel:
```javascript,editable 
let kvadrera = x => x * x;

console.log(kvadrera(5)); // Output: 25
```
Om funktionen endast har en parameter och ett returvärde kan syntaxen förenklas ytterligare.

## Scope (Omfång)

Scope refererar till den del av koden där en variabel är tillgänglig.

Det finns huvudsakligen två typer av scope i JavaScript:
1.	Global Scope
2.	Lokalt Scope

### Global Scope

Variabler deklarerade utanför några funktioner eller block har globalt scope och kan nås från vilken plats som helst i koden.

Exempel:
```javascript,editable 
var globalVariabel = "Jag är global";

function visaGlobal() {
    console.log(globalVariabel);
}

visaGlobal(); // Output: Jag är global
console.log(globalVariabel); // Output: Jag är global
```
### Lokalt Scope

Variabler deklarerade inom en funktion är lokala och kan endast nås inom den funktionen.

Exempel:
```javascript,editable 
function minFunktion() {
    var lokalVariabel = "Jag är lokal";
    console.log(lokalVariabel);
}

minFunktion(); // Output: Jag är lokal
console.log(lokalVariabel); // Fel: lokalVariabel är inte definierad
```
## Block Scope med let och const

Med introduktionen av let och const i ES6 har JavaScript fått stöd för block scope. Det betyder att variabler deklarerade med let eller const endast är tillgängliga inom det block där de deklarerades (mellan {}).

Exempel:
```javascript,editable 
if (true) {
    let blockVariabel = "Inne i blocket";
    console.log(blockVariabel); // Output: Inne i blocket
}
console.log(blockVariabel); // Fel: blockVariabel är inte definierad
```

## Hoisting

Hoisting är JavaScripts defaultbeteende där variabel- och funktionsdeklarationer flyttas till toppen av deras scope innan koden exekveras.

Exempel med funktion hoisting:
```javascript,editable 
greet("Bob");

function greet(namn) {
    console.log("Hej, " + namn + "!");
}

// Output: Hej, Bob!
```
Funktionen kan anropas innan den definieras på grund av hoisting.

Exempel med variabel hoisting:
```javascript,editable 
console.log(mittNamn); // Output: undefined
var mittNamn = "Eva";
console.log(mittNamn); // Output: Eva
```

Variabeldeklarationen flyttas upp, men inte tilldelningen. Därför är värdet undefined innan tilldelningen.

## Parameterar med Standardvärden

Du kan ange standardvärden för parametrar i funktioner, vilket används om inget argument ges vid funktionsanropet.

Exempel:
```javascript,editable 
function greet(namn = "Gäst") {
    console.log("Hej, " + namn + "!");
}

greet(); // Output: Hej, Gäst!
greet("Carl"); // Output: Hej, Carl!
```
## Rekursiva Funktioner

En rekursiv funktion är en funktion som anropar sig själv tills ett basfall uppnås.

Exempel: Beräkna fakultet
```javascript,editable 
function fakultet(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * fakultet(n - 1);
    }
}

console.log(fakultet(5)); // Output: 120
```
Fördelar med Funktioner

- Återanvändbarhet: Minska duplicering av kod genom att återanvända funktioner.
- Modularitet: Dela upp koden i mindre, hanterbara delar.
- Enkelhet: Gör koden lättare att läsa och underhålla.
- Testbarhet: Funktioner kan enkelt testas individuellt.

## Praktiska Övningar

1. ### Skapa en Kalkylatorfunktion

Skapa en funktion kalkylator som tar tre parametrar: två tal och en operator (+, -, *, /). Funktionen ska utföra operationen och returnera resultatet.

```javascript,editable 
function kalkylator(a, b, operator) {
    // Implementera funktionen
}

console.log(kalkylator(10, 5, '+')); // Output: 15
console.log(kalkylator(10, 5, '/')); // Output: 2
```
2. ### Omvandla till Arrow Function

Skriv om följande funktion till en arrow function:
```javascript,editable 
function kvadrat(x) { // Skriv om mig
    return x * x;
}

console.log(kvadrat(6)); // Output: 36
```


3. ### Utforska Scope

Vad kommer följande kod att skriva ut?

```javascript,editable 
var x = 10;

function foo() {
    var x = 20;
    console.log(x);
}
foo(); // Output: ?
console.log(x); // Output: ?
```
4. ### Rekursiv Funktion för Fibonacci-serien

Skapa en rekursiv funktion `fibonacci(n)` som returnerar det n:te numret i Fibonacci-serien.

```javascript,editable 
function fibonacci(n) {
    // Implementera funktionen
}

console.log(fibonacci(6)); // Output: 8
```

## Lösningsförslag
1. Skapa en Kalkylatorfunktion
```javascript,editable 
function kalkylator(a, b, operator) {
    switch(operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        default:
            return "Ogiltig operator";
    }
}
```

2. Omvanlda till Arrow Function
```javascript,editable 
const kvadrat = x => x * x;
```
3. Utforska Scope
```javascript,editable 
foo(); // Output: 20
console.log(x); // Output: 10
```
Förklaring:
- Inuti funktionen foo deklareras en lokal variabel x med värdet 20. Denna variabel är endast tillgänglig inom funktionen.
- Utanför funktionen är x fortfarande 10, eftersom den globala variabeln inte påverkas av den lokala.

4. Rekursiv Funktion för Fibonacci-serien
```javascript,editable 
function fibonacci(n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}
```
## Reflektionsfrågor

1.	Varför är det viktigt att förstå skillnaden mellan globalt och lokalt scope?
Att förstå scope hjälper dig att kontrollera variabelns livslängd och tillgänglighet, vilket minskar risken för namnkonflikter och oväntade beteenden.
2.	Hur kan användningen av funktioner förbättra läsbarheten i din kod?
Funktioner gör koden mer organiserad genom att dela upp den i logiska delar. Detta gör det lättare att förstå och underhålla.
3.	Vad är skillnaden mellan var, let och const när det gäller scope?
	- `var` har funktionellt scope och är hoisted.
	- `let` och `const` har block scope och är inte tillgängliga innan de deklareras.
	- `const` används för konstanter och kan inte reasigneras.

## Tips och Bästa Praxis

- Använd `let` och `const` istället för `var`: För att undvika problem med hoisting och för att bättre kontrollera scope.
- Namnge funktioner och variabler tydligt: Detta förbättrar koden läsbarhet och underlättar underhåll.
- Undvik globala variabler: De kan leda till svårspårade buggar.
- Bryt ner stora funktioner: Om en funktion gör för mycket, dela upp den i mindre funktioner.

## Sammanfattning
- Funktioner är essentiella för att skapa strukturerad och återanvändbar kod i JavaScript.
- Scope bestämmer variablernas tillgänglighet och är viktigt för att undvika konflikter.
- Användning av let och const ger bättre kontroll över variablernas scope och kan förebygga fel.
- Genom att förstå och korrekt använda funktioner och scope kan du skriva effektivare och mer pålitlig kod.

**Nästa steg**: Fortsätt att öva på att skriva egna funktioner och experimentera med scope för att befästa din förståelse. Prova att skapa små program där du medvetet använder olika typer av variabler och observera hur scope påverkar deras tillgänglighet.

