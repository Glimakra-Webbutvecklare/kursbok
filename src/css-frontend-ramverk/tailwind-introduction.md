# Tailwind CSS – Kort beskrivning och installationsguide

## Vad är Tailwind CSS?
[Tailwind CSS](https://tailwindcss.com/) är ett modernt **utility-first CSS-ramverk** som revolutionerar hur vi skriver CSS. Istället för traditionell CSS där vi skapar anpassade klasser, använder Tailwind färdiga utility-klasser direkt i HTML/JSX. Detta innebär att du kan styla dina element med klasser som:
- `flex` för flexbox-layout
- `mt-4` för margin-top
- `text-center` för text-centrering
- `bg-blue-500` för bakgrundsfärg
- `hover:scale-105` för hover-effekter

### Varför använda Tailwind CSS?
- 🚀 **Snabbare utveckling** 
  - Skriv styling direkt i HTML/JSX utan att växla mellan filer
  - Slipp hitta på klassnamn och återanvända CSS
  - Få direkt visuell feedback när du arbetar
  
- 🎨 **Konsekvent design** 
  - Fördefinierat design-system med färger, spacing och typografi
  - Enkelt att hålla en konsekvent look genom hela projektet
  - Anpassningsbart via `tailwind.config.js`

- 📱 **Effektiv responsiv design** 
  - Använd breakpoints som `sm:`, `md:`, `lg:` direkt i klasserna
  - Snabb och intuitiv mobilanpassning
  - Inga mediaqueries behövs

- 🛠️ **Optimerat för produktion** 
  - Automatisk eliminering av oanvänd CSS
  - Mindre filstorlek i produktion
  - Bättre prestanda

- 🌍 **Stark community & ekosystem**
  - Omfattande dokumentation
  - Färdiga komponentbibliotek
  - Stort urval av plugins och verktyg

---

## Installationsguide

### 1. Skapa nytt projekt
Om du inte redan har ett projekt:
```bash
npm create vite@latest my-project
cd my-project
npm install
```

### 2. Installera Tailwind CSS
Installera Tailwind och dess peer-dependencies:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Konfigurera Tailwind
Skapa eller uppdatera `tailwind.config.js`:
```javascript
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

### 4. Lägg till Tailwind i CSS
Skapa eller uppdatera din huvudsakliga CSS-fil (t.ex. `src/index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Uppdatera HTML/JSX
Nu kan du börja använda Tailwind i dina komponenter. Exempel:
```html
<div class="flex min-h-screen items-center justify-center bg-gray-100">
  <div class="rounded-lg bg-white p-8 shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800">Hello Tailwind!</h1>
    <p class="mt-2 text-gray-600">Welcome to your new project</p>
  </div>
</div>
```

### 6. Starta utvecklingsservern
```bash
npm run dev
```

### Verifiering
För att verifiera att Tailwind fungerar, kontrollera att:
1. Utility-klasserna fungerar i webbläsaren
2. Du ser Tailwind-specifik syntax-highlighting i din editor
3. Du får autocompletion för Tailwind-klasser (installera relevant editor-tillägg om det behövs)

---

## Anpassa Tailwind och lägga till ett eget tema

### Utöka standardtemat
Du kan lägga till egna färger, typsnitt eller andra designparametrar genom att uppdatera `tailwind.config.js`. Här är ett exempel på hur du lägger till egna färger och typsnitt:

```javascript
// filepath: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#3AB0FF',
          DEFAULT: '#007BFF',
          dark: '#0056B3',
        },
      },
      fontFamily: {
        custom: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Använd dina anpassningar
När du har lagt till dina egna färger och typsnitt kan du använda dem direkt i dina komponenter:
```html
<div class="p-4 bg-brand text-white font-custom">
  Detta är en komponent med anpassade färger och typsnitt.
</div>
```

### Lägg till fler anpassningar
Du kan också utöka andra delar av temat, som spacing, border-radius eller skuggor:
```javascript
extend: {
  spacing: {
    '72': '18rem',
    '84': '21rem',
    '96': '24rem',
  },
  borderRadius: {
    'xl': '1.5rem',
  },
  boxShadow: {
    'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
}
```

---

## Tips för VS Code
Installera dessa tillägg för bättre Tailwind-stöd:
- Tailwind CSS IntelliSense
- PostCSS Language Support

---

## Dokumentation
[Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)