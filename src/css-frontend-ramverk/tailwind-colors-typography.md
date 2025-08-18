# Tailwind CSS – Färger och Typografi

## Introduktion
Tailwind CSS erbjuder ett kraftfullt och flexibelt sätt att hantera färger och typografi i dina projekt. Med hjälp av utility-klasser kan du snabbt och enkelt skapa en konsekvent design utan att behöva skriva anpassad CSS.

---

## Färger i Tailwind CSS

### Fördefinierade färger
Tailwind har ett stort urval av fördefinierade färger som är enkla att använda. Färgerna är organiserade i nyanser från `50` (ljusast) till `900` (mörkast).

### Exempel på färger
```html
<div class="p-4 bg-blue-500 text-white">Blå bakgrund</div>
<div class="p-4 bg-red-300 text-red-900">Röd bakgrund med mörk text</div>
<div class="p-4 bg-gray-100 text-gray-800">Ljusgrå bakgrund med mörkgrå text</div>
```

### Anpassa färger
Du kan anpassa färger i `tailwind.config.js`:
```javascript
// filepath: tailwind.config.js
module.exports = {
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
};
```

Använd sedan dina anpassade färger:
```html
<div class="p-4 bg-brand text-white">Anpassad färg</div>
```

---

## Typografi i Tailwind CSS

### Textstorlekar
Tailwind erbjuder fördefinierade textstorlekar som är enkla att använda:
```html
<p class="text-sm">Liten text</p>
<p class="text-lg">Stor text</p>
<p class="text-2xl font-bold">Extra stor och fet text</p>
```

### Typsnitt
Du kan använda fördefinierade typsnitt eller lägga till egna:
```html
<p class="font-sans">Sans-serif typsnitt</p>
<p class="font-serif">Serif typsnitt</p>
<p class="font-mono">Monospace typsnitt</p>
```

### Anpassa typsnitt
Lägg till egna typsnitt i `tailwind.config.js`:
```javascript
// filepath: tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        custom: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
};
```

Använd sedan det anpassade typsnittet:
```html
<p class="font-custom">Text med anpassat typsnitt</p>
```

---

## Exempel: Kombinera färger och typografi
```html
<div class="p-6 bg-gray-100 text-gray-800">
  <h1 class="text-3xl font-bold text-blue-600">Välkommen till Tailwind CSS</h1>
  <p class="mt-2 text-lg text-gray-700">
    Tailwind gör det enkelt att skapa snygga och responsiva gränssnitt.
  </p>
  <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
    Läs mer
  </button>
</div>
```

---

## Tips för responsiv design
Tailwind gör det enkelt att anpassa färger och typografi för olika skärmstorlekar:
```html
<p class="text-sm sm:text-base md:text-lg lg:text-xl">
  Textstorleken ändras beroende på skärmstorlek.
</p>
<div class="bg-red-500 sm:bg-yellow-500 md:bg-green-500 lg:bg-blue-500">
  Bakgrundsfärgen ändras beroende på skärmstorlek.
</div>
```

---

## Övning: Skapa en profilkortskomponent

### Uppgift
Skapa ett responsivt profilkort med hjälp av Tailwind CSS. Kortet ska innehålla:
1. En profilbild.
2. Ett namn och en titel.
3. En kort beskrivning.
4. En knapp för att följa användaren.

### Krav
- Använd Tailwinds färg- och typografiklasser.
- Gör kortet responsivt så att det ser bra ut på både mobil och desktop.

### Exempel på HTML-struktur
```html
<div class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
  <img class="w-full h-48 object-cover" src="https://via.placeholder.com/150" alt="Profilbild">
  <div class="p-4">
    <h2 class="text-xl font-bold text-gray-800">John Doe</h2>
    <p class="text-sm text-gray-600">Webbutvecklare</p>
    <p class="mt-2 text-gray-700">
      Passionerad utvecklare med erfarenhet av moderna ramverk som Tailwind CSS.
    </p>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Följ
    </button>
  </div>
</div>
```

### Utmaning
- Lägg till en hover-effekt på kortet (t.ex. en skugga eller ändrad bakgrundsfärg).
- Gör kortet klickbart genom att lägga till en länk runt hela kortet.

---

## Sammanfattning
- **Färger**: Använd fördefinierade eller anpassade färger för att skapa en konsekvent design.
- **Typografi**: Hantera textstorlekar, typsnitt och andra textrelaterade egenskaper med utility-klasser.
- **Responsivitet**: Anpassa färger och typografi för olika skärmstorlekar med Tailwinds breakpoints.

För mer information, besök [Tailwind CSS Dokumentation](https://tailwindcss.com/docs).