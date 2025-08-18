# Tailwind CSS – Responsiv Design

## Introduktion
Responsiv design är en viktig del av modern webbutveckling. Med Tailwind CSS är det enkelt att skapa responsiva gränssnitt genom att använda dess inbyggda breakpoints och utility-klasser. Du kan snabbt anpassa layout, färger, typografi och andra stilar för olika skärmstorlekar utan att skriva egna media queries.

---

## Breakpoints i Tailwind CSS
Tailwind använder följande standard-breakpoints:

| Breakpoint | Prefix  | Beskrivning              |
|------------|---------|--------------------------|
| `sm`       | `sm:`   | För skärmar ≥ 640px      |
| `md`       | `md:`   | För skärmar ≥ 768px      |
| `lg`       | `lg:`   | För skärmar ≥ 1024px     |
| `xl`       | `xl:`   | För skärmar ≥ 1280px     |
| `2xl`      | `2xl:`  | För skärmar ≥ 1536px     |

Du kan använda dessa prefix för att applicera olika stilar beroende på skärmstorlek.

---

## Exempel: Responsiv layout
Här är ett exempel på hur du kan skapa en responsiv layout med Tailwind:

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="p-4 bg-blue-500 text-white">Kolumn 1</div>
  <div class="p-4 bg-green-500 text-white">Kolumn 2</div>
  <div class="p-4 bg-red-500 text-white">Kolumn 3</div>
</div>
```

### Förklaring:
- `grid grid-cols-1`: Skapar en grid-layout med en kolumn som standard.
- `sm:grid-cols-2`: Vid skärmar ≥ 640px visas två kolumner.
- `lg:grid-cols-3`: Vid skärmar ≥ 1024px visas tre kolumner.
- `gap-4`: Lägger till mellanrum mellan kolumnerna.

---

## Exempel: Responsiv typografi
Du kan också anpassa textstorlekar för olika skärmstorlekar:

```html
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsiv rubrik
</h1>
```

### Förklaring:
- `text-2xl`: Standardstorlek för rubriken.
- `sm:text-3xl`: Vid skärmar ≥ 640px ökas textstorleken.
- `md:text-4xl`: Vid skärmar ≥ 768px ökas textstorleken ytterligare.
- `lg:text-5xl`: Vid skärmar ≥ 1024px används den största textstorleken.

---

## Exempel: Responsiv navigationsmeny
Här är ett exempel på en navigationsmeny som ändras mellan mobil och desktop:

```html
<nav class="bg-gray-800 text-white p-4">
  <ul class="flex flex-col sm:flex-row sm:space-x-4">
    <li><a href="#" class="block py-2 sm:py-0">Hem</a></li>
    <li><a href="#" class="block py-2 sm:py-0">Om oss</a></li>
    <li><a href="#" class="block py-2 sm:py-0">Tjänster</a></li>
    <li><a href="#" class="block py-2 sm:py-0">Kontakt</a></li>
  </ul>
</nav>
```

### Förklaring:
- `flex flex-col`: Menyn visas som en vertikal lista som standard.
- `sm:flex-row`: Vid skärmar ≥ 640px ändras menyn till en horisontell lista.
- `sm:space-x-4`: Lägger till horisontellt mellanrum mellan menyalternativen på större skärmar.

---

## Övning: Skapa en responsiv produktkortskomponent

### Uppgift
Skapa en responsiv produktkortskomponent som innehåller:
1. En bild av produkten.
2. Produktens namn och pris.
3. En kort beskrivning.
4. En knapp för att lägga till produkten i varukorgen.

### Krav
- Kortet ska visas i en kolumn på små skärmar och i en rad på större skärmar.
- Använd Tailwinds breakpoints för att göra kortet responsivt.
- Lägg till en hover-effekt på knappen.

### Exempel på HTML-struktur
```html
<div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden sm:flex sm:items-center sm:space-x-4">
  <img class="w-full h-48 object-cover sm:w-32 sm:h-32" src="https://via.placeholder.com/150" alt="Produktbild">
  <div class="p-4">
    <h2 class="text-lg font-bold text-gray-800">Produktnamn</h2>
    <p class="text-gray-600">Kort beskrivning av produkten.</p>
    <p class="mt-2 text-green-500 font-semibold">Pris: 299 kr</p>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Lägg till i varukorgen
    </button>
  </div>
</div>
```

### Utmaning
- Gör kortet klickbart genom att lägga till en länk runt hela kortet.
- Lägg till en responsiv grid-layout som visar flera produktkort bredvid varandra på större skärmar.

---

## Sammanfattning
- **Breakpoints**: Använd Tailwinds inbyggda breakpoints för att skapa responsiva layouter.
- **Responsivitet**: Anpassa layout, typografi och andra stilar för olika skärmstorlekar.
- **Praktisk tillämpning**: Skapa komponenter som fungerar bra på både små och stora skärmar.

För mer information, besök [Tailwind CSS Dokumentation](https://tailwindcss.com/docs/responsive-design).