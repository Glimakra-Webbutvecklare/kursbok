# Tailwind CSS – Konfigurering och Anpassning

## Introduktion
Tailwind CSS är mycket flexibelt och kan enkelt anpassas för att passa dina projektbehov. Genom att använda `tailwind.config.js` kan du:
- Lägga till egna färger, typsnitt och spacing.
- Skräddarsy breakpoints och andra designparametrar.
- Utöka eller skriva över standardinställningarna.

I denna lektion går vi igenom hur du konfigurerar och anpassar Tailwind CSS, samt hur du kan skapa ett eget tema.

---

## Skapa och konfigurera `tailwind.config.js`
När du installerar Tailwind CSS genereras en konfigurationsfil med kommandot:
```bash
npx tailwindcss init
```

Denna fil (`tailwind.config.js`) används för att anpassa Tailwind. Här är ett exempel på en grundläggande konfigurationsfil:
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

### Viktiga delar av konfigurationsfilen:
1. **`content`**: Här anger du vilka filer Tailwind ska genomsöka för att hitta klasser. Detta är viktigt för att Tailwind ska kunna ta bort oanvänd CSS i produktion.
2. **`theme`**: Här kan du anpassa eller utöka standardtemat.
3. **`plugins`**: Här kan du lägga till Tailwind-plugins för extra funktionalitet.

---

## Anpassa färger
Du kan lägga till egna färger eller skriva över standardfärgerna i `theme.extend.colors`:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        light: '#3AB0FF',
        DEFAULT: '#007BFF',
        dark: '#0056B3',
      },
    },
  },
},
```

### Användning:
```html
<div class="bg-brand text-white p-4">
  Detta är en komponent med anpassad färg.
</div>
```

---

## Anpassa typsnitt
Lägg till egna typsnitt i `theme.extend.fontFamily`:

```javascript
theme: {
  extend: {
    fontFamily: {
      custom: ['"Open Sans"', 'sans-serif'],
    },
  },
},
```

### Användning:
```html
<p class="font-custom text-lg">
  Detta är text med ett anpassat typsnitt.
</p>
```

---

## Anpassa spacing
Du kan lägga till egna spacing-värden (t.ex. padding och margin):

```javascript
theme: {
  extend: {
    spacing: {
      '72': '18rem',
      '84': '21rem',
      '96': '24rem',
    },
  },
},
```

### Användning:
```html
<div class="p-72 bg-gray-200">
  Detta element har 18rem padding.
</div>
```

---

## Anpassa breakpoints
Om du vill ändra standard-breakpoints kan du göra det i `theme.screens`:

```javascript
theme: {
  screens: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
},
```

---

## Lägg till plugins
Tailwind har ett stort ekosystem av plugins. Du kan lägga till plugins som `@tailwindcss/forms` för att förbättra formulärstilar:

```bash
npm install @tailwindcss/forms
```

Lägg sedan till pluginet i `tailwind.config.js`:
```javascript
plugins: [
  require('@tailwindcss/forms'),
],
```

---

## Exempel: Skapa ett anpassat tema
Här är ett exempel på en komplett konfigurationsfil med ett anpassat tema:

```javascript
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
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

---

## Övning: Skapa ett anpassat kort med eget tema

### Uppgift
Skapa ett kort som använder ett anpassat tema. Kortet ska innehålla:
1. En rubrik med ett anpassat typsnitt.
2. En bakgrundsfärg från det anpassade färgschemat.
3. Padding och margin från de anpassade spacing-värdena.
4. En knapp med en hover-effekt som använder det anpassade färgschemat.

### Exempel på HTML-struktur
```html
<div class="max-w-md mx-auto bg-brand-light text-white p-72 rounded-lg shadow-lg">
  <h2 class="text-2xl font-custom">Anpassat kort</h2>
  <p class="mt-4">
    Detta kort använder ett anpassat tema med egna färger, typsnitt och spacing.
  </p>
  <button class="mt-6 px-4 py-2 bg-brand hover:bg-brand-dark rounded">
    Klicka här
  </button>
</div>
```

### Krav
- Lägg till de anpassade färgerna, typsnitten och spacing-värdena i `tailwind.config.js`.
- Använd Tailwinds utility-klasser för att bygga kortet.

### Utmaning
- Lägg till en responsiv design så att kortet ändrar storlek på olika skärmstorlekar.
- Lägg till en animation som gör att hover-effekten övergångar mjukt.

---

## Sammanfattning
- **Konfiguration**: Använd `tailwind.config.js` för att anpassa Tailwind CSS.
- **Anpassningar**: Lägg till egna färger, typsnitt, spacing och breakpoints.
- **Plugins**: Utöka funktionaliteten med Tailwind-plugins.
- **Praktisk tillämpning**: Skapa komponenter som använder ditt anpassade tema.

För mer information, besök [Tailwind CSS Dokumentation](https://tailwindcss.com/docs/configuration).

