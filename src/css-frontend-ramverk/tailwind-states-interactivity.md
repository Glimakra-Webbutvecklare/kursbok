# Tailwind CSS – States och Interaktivitet

## Introduktion
Tailwind CSS gör det enkelt att hantera olika tillstånd (states) och interaktivitet i dina komponenter. Med hjälp av pseudo-klassprefix som `hover:`, `focus:`, och `active:` kan du skapa dynamiska och responsiva användarupplevelser utan att behöva skriva anpassad CSS.

---

## Vanliga pseudo-klasser i Tailwind CSS

| Pseudo-klass | Prefix      | Beskrivning                              |
|--------------|-------------|------------------------------------------|
| `hover`      | `hover:`    | När användaren hovrar över ett element  |
| `focus`      | `focus:`    | När ett element är i fokus              |
| `active`     | `active:`   | När ett element är aktivt (t.ex. klickat) |
| `disabled`   | `disabled:` | När ett element är inaktiverat          |
| `group-hover`| `group-hover:` | När en grupp är i hover-tillstånd      |

---

## Exempel: Hover-effekter
Med `hover:` kan du enkelt skapa effekter när användaren hovrar över ett element.

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Hovera över mig
</button>
```

### Förklaring:
- `hover:bg-blue-600`: Ändrar bakgrundsfärgen när användaren hovrar över knappen.

---

## Exempel: Focus-effekter
Med `focus:` kan du styla element när de är i fokus, till exempel när en användare klickar på ett formulärfält.

```html
<input class="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2" type="text" placeholder="Skriv något...">
```

### Förklaring:
- `focus:border-blue-500`: Ändrar kantfärgen när fältet är i fokus.
- `focus:outline-none`: Tar bort standardfokusramen.

---

## Exempel: Active-effekter
Med `active:` kan du styla element när de är aktiva, till exempel när en knapp trycks ned.

```html
<button class="px-4 py-2 bg-green-500 text-white rounded active:bg-green-700">
  Klicka på mig
</button>
```

### Förklaring:
- `active:bg-green-700`: Ändrar bakgrundsfärgen när knappen trycks ned.

---

## Exempel: Disabled-tillstånd
Med `disabled:` kan du styla element som är inaktiverade.

```html
<button class="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50" disabled>
  Inaktiverad knapp
</button>
```

### Förklaring:
- `disabled:opacity-50`: Sänker opaciteten för inaktiverade element.

---

## Exempel: Gruppbaserade tillstånd
Med `group-hover:` kan du skapa effekter som påverkar andra element i samma grupp.

```html
<div class="group p-4 bg-gray-100 rounded-lg">
  <h2 class="text-lg font-bold group-hover:text-blue-500">Rubrik</h2>
  <p class="text-gray-600 group-hover:text-gray-800">Text som ändras vid hover.</p>
</div>
```

### Förklaring:
- `group-hover:text-blue-500`: Ändrar textfärgen på rubriken när användaren hovrar över gruppen.
- `group-hover:text-gray-800`: Ändrar textfärgen på paragrafen vid samma tillstånd.

---

## Exempel: Interaktiva kort
Här är ett exempel på ett interaktivt kort som använder flera pseudo-klasser:

```html
<div class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <img class="w-full h-48 object-cover" src="https://via.placeholder.com/150" alt="Bild">
  <div class="p-4">
    <h2 class="text-lg font-bold text-gray-800 hover:text-blue-500">Interaktiv rubrik</h2>
    <p class="text-gray-600">Detta är ett exempel på ett interaktivt kort.</p>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
      Läs mer
    </button>
  </div>
</div>
```

### Förklaring:
- `hover:shadow-lg`: Lägger till en större skugga när användaren hovrar över kortet.
- `hover:text-blue-500`: Ändrar rubrikens färg vid hover.
- `focus:ring-2 focus:ring-blue-300`: Lägger till en ring runt knappen vid fokus.

---

## Övning: Skapa en interaktiv navigationsmeny

### Uppgift
Skapa en navigationsmeny som innehåller:
1. Flera länkar (t.ex. Hem, Om oss, Kontakt).
2. En hover-effekt som ändrar textfärgen.
3. En aktiv länk som har en annan stil (t.ex. fet text och annan färg).
4. En gruppbaserad effekt där en ikon ändras när användaren hovrar över länken.

### Krav
- Använd Tailwinds pseudo-klasser för att hantera tillstånd.
- Gör menyn responsiv så att den visas som en vertikal lista på små skärmar och en horisontell lista på större skärmar.

### Exempel på HTML-struktur
```html
<nav class="bg-gray-800 text-white p-4">
  <ul class="flex flex-col sm:flex-row sm:space-x-4">
    <li>
      <a href="#" class="block py-2 px-4 hover:text-blue-400 active:font-bold active:text-blue-500">
        Hem
      </a>
    </li>
    <li>
      <a href="#" class="block py-2 px-4 hover:text-blue-400 active:font-bold active:text-blue-500">
        Om oss
      </a>
    </li>
    <li>
      <a href="#" class="block py-2 px-4 hover:text-blue-400 active:font-bold active:text-blue-500 group">
        Kontakt
        <span class="ml-2 text-gray-400 group-hover:text-blue-400">📧</span>
      </a>
    </li>
  </ul>
</nav>
```

### Utmaning
- Lägg till en animation som gör att hover-effekten övergångar mjukt.
- Gör menyn sticky så att den alltid är synlig högst upp på sidan.

---

## Sammanfattning
- **Pseudo-klasser**: Använd `hover:`, `focus:`, `active:`, och `disabled:` för att hantera olika tillstånd.
- **Gruppbaserade effekter**: Använd `group` och `group-hover:` för att skapa interaktivitet mellan element.
- **Praktisk tillämpning**: Skapa interaktiva komponenter som förbättrar användarupplevelsen.

För mer information, besök [Tailwind CSS Dokumentation](https://tailwindcss.com/docs/hover-focus-and-other-states).