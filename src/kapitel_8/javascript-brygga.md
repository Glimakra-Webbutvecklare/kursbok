# JavaScript-brygga inför React

React använder vanlig JavaScript. Om `map`, destructuring eller `async/await` känns osäkert blir React-koden onödigt svår. Därför repeterar du här bara de delar som Kulturverkstan behöver.

Du kan köra exemplen i webbläsarens Console eller i en `.js`-fil. Skriv koden själv och ändra ett värde efter varje exempel.

## Mål

Efter lektionen ska du kunna:

1. Läsa funktioner, moduler, destructuring och spread syntax.
2. skapa nya listor med `map` och `filter`, hitta med `find` och summera med `reduce`.
3. Läsa en enkel asynkron funktion med `fetch` och `async/await`.

## Snabbtest: vad behöver du öva på?

Försök förutsäga resultatet utan att köra koden:

```js
const workshops = [
  { id: "keramik", title: "Keramik för nybörjare", priceSek: 350 },
  { id: "foto", title: "Fotopromenad i byn", priceSek: 200 },
];

const titles = workshops.map((workshop) => workshop.title);
const selected = workshops.find((workshop) => workshop.id === "foto");

console.log(titles);
console.log(selected.priceSek);
```

Kör sedan koden. Om du förutsåg `['Keramik för nybörjare', 'Fotopromenad i byn']` och `200` kan du gå snabbare genom listdelen. Om inte, stanna och skriv exemplen själv.

## 1. Funktioner och callback-funktioner

En funktion samlar kod som ska kunna köras flera gånger.

```js
function formatPrice(priceSek) {
  return `${priceSek} kr`;
}

console.log(formatPrice(250));
```

Samma funktion kan skrivas som en arrow function:

```js
const formatPrice = (priceSek) => `${priceSek} kr`;
```

En **callback** är en funktion som skickas till en annan funktion. Här körs callbacken en gång för varje workshop:

```js
const titles = workshops.map((workshop) => workshop.title);
```

### Se → förutsäg → kör → ändra

1. Förutsäg vad `formatPrice(400)` returnerar.
2. Kör anropet.
3. Ändra funktionen så att resultatet blir `Pris: 400 kr`.
4. Förklara skillnaden mellan parametern `priceSek` och argumentet `400`.

## 2. Import och export

React-projekt delas upp i filer. `export` gör något tillgängligt för andra filer och `import` hämtar det.

```js
// formatters.js
export function formatPrice(priceSek) {
  return `${priceSek} kr`;
}
```

```js
// workshop.js
import { formatPrice } from "./formatters.js";

console.log(formatPrice(250));
```

En `default export` importeras utan klamrar. Namngivna exports importeras med klamrar. I React kommer komponentfilerna ofta använda `export default`.

> **Fyll i:** `import { __________ } from "./formatters.js";`

Svaret är namnet som exporterades: `formatPrice`.

## 3. Objekt, destructuring och spread

Ett objekt samlar värden med namn:

```js
const workshop = {
  id: "keramik",
  title: "Keramik för nybörjare",
  category: "Hantverk",
  priceSek: 350,
};

console.log(workshop.title);
```

Destructuring plockar ut värden i variabler:

```js
const { title, priceSek } = workshop;
console.log(title);
console.log(priceSek);
```

Spread syntax skapar ett nytt objekt med de gamla värdena och en ändring:

```js
const discountedWorkshop = {
  ...workshop,
  priceSek: 200,
};

console.log(workshop.priceSek);           // 350
console.log(discountedWorkshop.priceSek); // 200
```

Originalet ändras inte. Det är viktigt senare när React uppdaterar state.

### Fyll i

Skapa ett nytt objekt där kategorin är `Design`, utan att ändra `workshop`:

```js
const designWorkshop = {
  __________,
  category: "Design",
};
```

<details>
<summary>Visa lösningen</summary>

Skriv `...workshop` på den tomma raden.

</details>

## 4. Arrayer: map, filter, find och reduce

Vi använder samma lista genom resten av övningen:

```js
const workshops = [
  { id: "keramik", title: "Keramik för nybörjare", category: "Hantverk", priceSek: 350 },
  { id: "vavning", title: "Väv din första provbit", category: "Textil", priceSek: 425 },
  { id: "foto", title: "Fotopromenad i byn", category: "Foto", priceSek: 200 },
];
```

### `map` omvandlar varje värde

```js
const titles = workshops.map((workshop) => workshop.title);
console.log(titles);
```

`titles` är en ny array med tre titlar. I React använder vi `map` för att skapa ett komponentkort per workshop.

### `filter` väljer flera värden

```js
const craftWorkshops = workshops.filter(
  (workshop) => workshop.category === "Hantverk",
);
console.log(craftWorkshops);
```

`filter` returnerar alltid en array, även om ingen workshop matchar.

### `find` hittar ett värde

```js
const selectedWorkshop = workshops.find(
  (workshop) => workshop.id === "foto",
);
console.log(selectedWorkshop);
```

`find` returnerar den första träffen. Om inget matchar blir resultatet `undefined`.

### Gör själv

1. Använd `map` för att skapa en array med alla priser.
2. Använd `filter` för att välja workshops som kostar högst 350 kr.
3. Använd `find` för att hitta workshopen med id `vavning`.
4. Förklara varför du använder `find`, inte `filter`, när ett id ska ge en workshop.

### `reduce` summerar flera värden

`reduce` går igenom arrayen och bär med sig ett resultat. Här börjar `total`
på `0` och varje pris läggs till:

```js
const totalPrice = workshops.reduce(
  (total, workshop) => total + workshop.priceSek,
  0,
);
```

Förutsäg summan och kör sedan koden. I komponentlektionen använder du samma
mönster för att summera lediga platser.

## 5. Uppdatera en array utan att ändra originalet

Spread kan också skapa en ny array:

```js
const newWorkshop = {
  id: "maleri",
  title: "Måla med akryl",
  category: "Konst",
  priceSek: 225,
};

const updatedWorkshops = [...workshops, newWorkshop];
```

`workshops` har fortfarande tre objekt. `updatedWorkshops` har fyra. Senare använder vi samma princip för state.

> **Kontrollera:** Logga båda arrayernas `.length`. Du ska få `3` och `4`.

## 6. Async/await och fetch

Ett nätverksanrop tar tid. En `async` funktion kan vänta på resultatet med `await`.

```js
async function loadWorkshops() {
  const response = await fetch("/workshops.json");

  if (!response.ok) {
    throw new Error("Kunde inte hämta workshops");
  }

  const data = await response.json();
  return data;
}
```

Läs funktionen uppifrån och ner:

1. `fetch` startar anropet.
2. Första `await` väntar på svaret.
3. `response.ok` kontrollerar om HTTP-svaret lyckades.
4. Andra `await` läser JSON-datan.
5. `return` skickar tillbaka datan.

Du behöver inte köra exemplet ännu eftersom filen `/workshops.json` skapas senare. Målet nu är att kunna läsa flödet.

### Förutsäg och förklara

- Vilket felmeddelande skapas om `response.ok` är falskt?
- Varför behövs `await` framför både `fetch(...)` och `response.json()`?
- Vilken variabel innehåller den färdiga JavaScript-datan?

## Första hjälpen

| Problem | Kontrollera först |
| --- | --- |
| `workshops is not defined` | Kör kodblocket som skapar arrayen före koden som använder den. |
| `Cannot read properties of undefined` | Gav `find` ingen träff? Kontrollera id och stavning. |
| `map is not a function` | Är värdet verkligen en array? Logga det före `map`. |
| Importen hittas inte | Kontrollera `./`, filnamn och om exporten är named eller default. |
| `await is only valid...` | Ligger `await` inuti en funktion som börjar med `async`? |
| Originalet ändrades | Använd spread, `map` eller `filter` i stället för att skriva över objektet/arrayen. |

## Checkpoint

Du är klar när du kan:

- skapa en ny prislista med `map`, filtrera på kategori, hitta med `find` och summera med `reduce`,
- använda destructuring och spread utan att ändra originalet,
- beskriva ordningen i funktionen `loadWorkshops`.

> **Commit-förslag:** Om du sparade exemplen i ditt eget övningsrepo:
>
> ```bash
> git add .
> git commit -m "Repetera JavaScript inför React"
> ```

Nästa steg är [Starta Kulturverkstan med React och Vite](./react-intro.md).
