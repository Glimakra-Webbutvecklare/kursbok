# Starta Kulturverkstan med React och Vite

Nu skapar du en riktig React-app och gör en synlig ändring direkt. Först när appen fungerar tittar vi på vad filerna och JSX-koden betyder.

> **Förkunskap:** Gör [JavaScript-bryggan](./javascript-brygga.md) först. Kontrollera också att `node --version` visar minst `v22.12.0` och att `npm --version` skriver ut ett versionsnummer.

## Mål

Efter lektionen ska du kunna:

1. Skapa, starta och stoppa en React-app med Vite.
2. Ändra markup i `App.jsx` och se resultatet i webbläsaren.
3. Använda de viktigaste JSX-reglerna och läsa ett enkelt felmeddelande.

## Följ med: få något på skärmen

Öppna terminalen i den mapp där du brukar spara projekt. Kör:

```bash
npm create vite@8.2.1 kulturverkstan -- --template react
cd kulturverkstan
npm install
npm run dev
```

Skapa också filen `.nvmrc` i projektroten med innehållet `22`. Den gör det
tydligt vilken Node-huvudversion projektet använder.

Terminalen visar en lokal adress, ofta `http://localhost:5173`. Öppna adressen i webbläsaren. Nu ska Vites startsida synas.

> **Stanna här och kontrollera:** Fortsätt inte förrän sidan syns i webbläsaren. Om den inte syns, använd tabellen **Första hjälpen** längre ner.

Utvecklingsservern fortsätter köra medan du arbetar. Stoppa den med `Ctrl+C` i terminalen. Starta den igen med:

```bash
npm run dev
```

## Gör den första synliga ändringen

Öppna `src/App.jsx`. Ersätt allt i filen med:

```jsx
function App() {
  return (
    <main>
      <h1>Kulturverkstan</h1>
      <p>Hitta en workshop och boka din plats.</p>
    </main>
  );
}

export default App;
```

Spara filen. Webbläsaren ska nu visa rubriken **Kulturverkstan** och en kort text. Vite uppdaterar sidan automatiskt när du sparar.

### Se → förutsäg → kör → ändra

1. **Se:** Leta upp texten inuti `<p>`.
2. **Förutsäg:** Vad händer om du byter `Hitta` mot `Välj`?
3. **Kör:** Gör ändringen och spara.
4. **Kontrollera:** Ändrades bara stycket i webbläsaren?
5. **Förklara:** Berätta för en klasskamrat hur koden och resultatet hör ihop.

## Vad skapade Vite?

Du behöver inte kunna alla filer. Börja med dessa:

```text
kulturverkstan/
├── src/
│   ├── App.jsx       # appens första komponent
│   └── main.jsx      # startar React och visar App
├── index.html        # HTML-dokumentet som appen monteras i
├── package.json      # scripts och paket
└── vite.config.js    # Vites inställningar
```

- `main.jsx` kopplar React till HTML-sidan och renderar `<App />`.
- `App.jsx` beskriver vad appen visar just nu.
- `package.json` innehåller bland annat scriptet som körs av `npm run dev`.

Öppna `src/main.jsx` och hitta `<App />`. Ändra inget där ännu.

> **Kontrollfråga:** Vilken fil ändrar du för appens innehåll just nu? Svaret är `src/App.jsx`.

## En komponent är en funktion

Studera samma kod igen:

<!-- react-playground -->
```jsx
function App() {
  return (
    <main>
      <h1>Kulturverkstan</h1>
      <p>Hitta en workshop och boka din plats.</p>
    </main>
  );
}

export default App;
```

`App` är en **komponent**:

- Den är en JavaScript-funktion.
- Namnet börjar med stor bokstav.
- Den returnerar JSX som React visar i webbläsaren.
- `export default` gör att `main.jsx` kan importera komponenten.

`<App />` ser ut som en HTML-tagg, men det är din egen komponent. Vanliga HTML-element börjar med liten bokstav, till exempel `<main>` och `<p>`.

## JSX: markup i JavaScript

JSX liknar HTML, men skrivs i en JavaScript-fil. React omvandlar JSX till instruktioner som webbläsaren kan använda.

Tre regler räcker långt i början.

### Regel 1: returnera ett gemensamt ytterelement

Detta fungerar eftersom `<main>` omsluter allt:

```jsx
return (
  <main>
    <h1>Kulturverkstan</h1>
    <p>Välj en workshop.</p>
  </main>
);
```

Två element bredvid varandra utan ett gemensamt ytterelement ger fel. Du kan också använda ett tomt fragment, `<>...</>`.

### Regel 2: stäng alla taggar

Element utan innehåll måste också stängas:

```jsx
<img src="/workshop.jpg" alt="Händer som arbetar med lera" />
```

### Regel 3: använd JavaScript inuti klamrar

Lägg till variabler över `return` och visa dem med `{}`:

```jsx
function App() {
  const title = "Kulturverkstan";
  const openPlaces = 4;

  return (
    <main>
      <h1>{title}</h1>
      <p>{openPlaces} platser kvar</p>
    </main>
  );
}

export default App;
```

Klamrar betyder ungefär: ”tolka detta som JavaScript”. Skriv inte citattecken runt variabeln, för då visas ordet `title` i stället för variabelns värde.

## Fyll i: visa den första workshopen

Ersätt `App.jsx` med koden och fyll i de tre luckorna:

```jsx
function App() {
  const workshop = {
    title: "Prova keramik",
    category: "Hantverk",
    priceSek: 250,
  };

  return (
    <main>
      <h1>Kulturverkstan</h1>
      <article>
        <h2>{workshop.________}</h2>
        <p>Kategori: {workshop.________}</p>
        <p>Pris: {workshop.________} kr</p>
      </article>
    </main>
  );
}

export default App;
```

Förväntat resultat är **Prova keramik**, **Kategori: Hantverk** och **Pris: 250 kr**. Jämför med objektets egenskaper om du fastnar.

<details>
<summary>Visa lösningen</summary>

Luckorna är `title`, `category` och `priceSek`, i den ordningen.

</details>

## Attribut ser nästan ut som i HTML

Många attribut är likadana i HTML och JSX. Några har andra namn eftersom JSX är JavaScript:

- `class` blir `className`.
- `for` på en label blir `htmlFor`.
- JavaScript-värden skrivs med klamrar, till exempel `participants={2}`.

```jsx
<article className="workshop-card">
  <h2>Prova keramik</h2>
</article>
```

Vi använder `htmlFor` när vi bygger bokningsformuläret senare.

## Gör själv: ändra kortet

Utgå från den fungerande koden ovan.

1. Lägg till `durationMinutes: 90` i objektet.
2. Visa texten `Längd: 90 minuter` i kortet.
3. Byt titel, kategori, pris och längd till en workshop du själv hittar på.
4. Förklara varför `{workshop.durationMinutes}` har klamrar men texten `Längd:` inte har det.

**Klar när:** alla fyra värden syns, inga fel visas i Console och sidan uppdateras när du ändrar objektet.

## Lär dig läsa fel

Fel är en normal del av programmering. Skapa ett litet fel med flit:

1. Ta bort sluttaggen `</article>`.
2. Spara filen.
3. Läs felmeddelandet i webbläsaren eller terminalen.
4. Sätt tillbaka taggen och kontrollera att sidan fungerar.

Läs först den översta delen av felmeddelandet. Leta sedan efter filnamnet `App.jsx` och ett radnummer. Börja undersöka där.

## Första hjälpen

| Problem | Trolig orsak | Prova detta |
| --- | --- | --- |
| `npm` hittas inte | Node.js är inte installerat eller terminalen är gammal | Installera/aktivera Node.js LTS och öppna en ny terminal |
| Terminalen visar fel mapp | `npm run dev` körs utanför projektet | Kör `pwd`, `ls` och sedan `cd kulturverkstan` |
| Sidan kan inte öppnas | Utvecklingsservern kör inte | Kör `npm run dev` och använd adressen terminalen visar |
| Tom sida efter en ändring | JSX har ett syntaxfel | Läs första felet och kontrollera taggar, parenteser och `return` |
| Texten ändras inte | Filen är inte sparad eller fel fil är öppen | Spara `src/App.jsx` och kontrollera terminalen |
| `workshop is not defined` | Variabeln saknas eller har annat namn | Kontrollera stavningen och att objektet ligger inne i `App` |

## Checkpoint

Du är klar när:

- Vites utvecklingsserver startar med `npm run dev`,
- Kulturverkstan visar ditt workshopkort från data i ett objekt,
- du kan förklara vad `App`, `return`, JSX och `{}` gör.

> **Commit-förslag:**
>
> ```bash
> git add .
> git commit -m "Starta Kulturverkstan med Vite"
> ```

I nästa lektion delar du upp appen i flera komponenter och visar flera workshops från en lista.
