# Arbeta med Tailwind CSS och React med Vite

## Introduktion
Att använda Tailwind CSS tillsammans med React och Vite är ett effektivt sätt att bygga moderna och responsiva webbapplikationer. Vite är ett snabbt byggverktyg som gör utvecklingsprocessen smidig, medan Tailwind CSS erbjuder utility-first-klasser för att snabbt styla komponenter.

I denna lektion går vi igenom:
1. Hur du installerar och konfigurerar Tailwind CSS i ett React-projekt med Vite.
2. Hur du använder Tailwind CSS i React-komponenter.
3. Best practices för att arbeta med Tailwind och React.

---

## Steg 1: Skapa ett React-projekt med Vite

### Skapa ett nytt projekt
Skapa ett nytt React-projekt med Vite:
```bash
npm create vite@latest my-app --template react
cd my-app
npm install
```

### Installera Tailwind CSS
Installera Tailwind CSS och dess beroenden:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Konfigurera Tailwind
Uppdatera `tailwind.config.js` för att inkludera alla filer där du använder Tailwind-klasser:
```javascript
// filepath: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Lägg till Tailwind i din CSS
Skapa eller uppdatera filen `src/index.css` och inkludera Tailwinds direktiv:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Starta projektet
Starta utvecklingsservern för att verifiera att Tailwind fungerar:
```bash
npm run dev
```

---

## Steg 2: Använda Tailwind CSS i React-komponenter

### Exempel: Skapa en knappkomponent
Här är ett exempel på en enkel knappkomponent som använder Tailwind CSS:

```jsx
// filepath: src/components/Button.jsx
export default function Button({ text, onClick }) {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
```

### Exempel: Skapa en kortkomponent
Här är ett exempel på en kortkomponent som använder Tailwind CSS:

```jsx
// filepath: src/components/Card.jsx
export default function Card({ title, description }) {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
```

### Använd komponenterna i din app
Importera och använd komponenterna i din `App.jsx`:
```jsx
// filepath: src/App.jsx
import Button from "./components/Button";
import Card from "./components/Card";

function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Välkommen till min app</h1>
      <Card
        title="Korttitel"
        description="Detta är en beskrivning av kortet."
      />
      <Button text="Klicka här" onClick={() => alert("Knappen klickades!")} />
    </div>
  );
}

export default App;
```

---

## Best Practices för Tailwind CSS och React

### 1. **Håll komponenterna små och återanvändbara**
- Dela upp din kod i små, återanvändbara komponenter.
- Exempel: Skapa separata komponenter för knappar, kort, formulärfält, etc.

### 2. **Använd Tailwinds konfigurationsfil**
- Anpassa Tailwind i `tailwind.config.js` för att skapa ett konsekvent design-system.
- Lägg till egna färger, typsnitt och spacing.

### 3. **Använd conditional classnames**
- Använd bibliotek som `clsx` eller `classnames` för att hantera dynamiska klasser i React:
```bash
npm install clsx
```

Exempel:
```jsx
import clsx from "clsx";

export default function Button({ isPrimary }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded",
        isPrimary ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
      )}
    >
      Klicka här
    </button>
  );
}
```

### 4. **Använd Tailwinds plugins**
- Dra nytta av Tailwinds plugins för att utöka funktionaliteten, t.ex.:
  - `@tailwindcss/forms` för formulärstilar.
  - `@tailwindcss/typography` för bättre textformatering.

### 5. **Håll HTML-strukturen ren**
- Undvik att lägga för många klasser direkt i JSX. Använd komponentklasser eller utility-klasser strategiskt.

---

## Övning: Bygg en enkel profilkomponent

### Uppgift
Skapa en profilkomponent som innehåller:
1. En profilbild.
2. Ett namn och en titel.
3. En knapp för att följa användaren.

### Krav
- Använd Tailwinds utility-klasser för styling.
- Gör komponenten responsiv så att den ser bra ut på både mobil och desktop.

### Exempel på HTML-struktur
```jsx
// filepath: src/components/ProfileCard.jsx
export default function ProfileCard({ name, title, image }) {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-48 object-cover" src={image} alt={name} />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{name}</h2>
        <p className="text-gray-600">{title}</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Följ
        </button>
      </div>
    </div>
  );
}
```

### Använd komponenten
Importera och använd komponenten i din app:
```jsx
// filepath: src/App.jsx
import ProfileCard from "./components/ProfileCard";

function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ProfileCard
        name="John Doe"
        title="Webbutvecklare"
        image="https://via.placeholder.com/150"
      />
    </div>
  );
}

export default App;
```

---

## Sammanfattning
- **Installation**: Installera och konfigurera Tailwind CSS i ditt React-projekt med Vite.
- **Komponenter**: Använd Tailwind CSS för att snabbt styla React-komponenter.
- **Best Practices**: Håll komponenterna små och återanvändbara, använd conditional classnames och dra nytta av Tailwinds plugins.

För mer information, besök [Tailwind CSS Dokumentation](https://tailwindcss.com/docs) och [React Dokumentation](https://reactjs.org/).