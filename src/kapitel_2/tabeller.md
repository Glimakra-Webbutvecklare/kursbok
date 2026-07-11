# Tabeller: data i rader och kolumner

En HTML-tabell visar information som hör ihop i **rader och kolumner**. Exempel är ett busschema, en prislista eller resultat från en turnering.

> **Mål:** Kunna avgöra när en tabell passar och skapa en enkel tabell med rubriker och data.

## När passar en tabell?

Använd en tabell när läsaren behöver jämföra värden i två riktningar, till exempel produkt och pris.

| Produkt | Pris |
|---|---:|
| Äpple | 5 kr |
| Banan | 4 kr |

En tabell är **inte** till för att placera meny, text och bilder bredvid varandra.

> **Förr i tiden:** Innan CSS blev välanvänt användes tabeller ofta som ett hack för sidlayout. Det gjorde koden svår att ändra och mindre tillgänglig. I dag använder vi semantisk HTML för innehåll och CSS för layout.

## Tabellens delar

En enkel tabell har:

- `<table>` – hela tabellen.
- `<tr>` (*table row*) – en rad.
- `<th>` (*table header*) – en rubrikcell.
- `<td>` (*table data*) – en vanlig datacell.

```html
<table>
  <tr>
    <th>Produkt</th>
    <th>Pris</th>
  </tr>
  <tr>
    <td>Äpple</td>
    <td>5 kr</td>
  </tr>
</table>
```

**Resultat:** Lägg märke till att HTML ger tabellen struktur, men nästan ingen formgivning ännu.

<!-- playground -->
```html
<table>
  <tr>
    <th>Produkt</th>
    <th>Pris</th>
  </tr>
  <tr>
    <td>Äpple</td>
    <td>5 kr</td>
  </tr>
  <tr>
    <td>Banan</td>
    <td>4 kr</td>
  </tr>
</table>
```

## En tydligare tabell

För en större tabell grupperar vi rubriker och data med `<thead>` och `<tbody>`. Attributet `scope="col"` kopplar varje rubrik till sin kolumn. Det hjälper bland annat personer som använder skärmläsare.

```html
<table>
  <thead>
    <tr>
      <th scope="col">Kurs</th>
      <th scope="col">Dag</th>
      <th scope="col">Starttid</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML</td>
      <td>Måndag</td>
      <td>09.00</td>
    </tr>
    <tr>
      <td>CSS</td>
      <td>Onsdag</td>
      <td>09.00</td>
    </tr>
  </tbody>
</table>
```

**Prova själv:** Lägg till en rad för JavaScript. Vilka värden behöver du lägga i varje `<td>`?

<!-- playground -->
```html
<table>
  <thead>
    <tr>
      <th scope="col">Kurs</th>
      <th scope="col">Dag</th>
      <th scope="col">Starttid</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML</td>
      <td>Måndag</td>
      <td>09.00</td>
    </tr>
    <tr>
      <td>CSS</td>
      <td>Onsdag</td>
      <td>09.00</td>
    </tr>
  </tbody>
</table>
```

## Sammanfattning

- Använd tabeller för data som jämförs i rader och kolumner.
- Använd inte tabeller för sidlayout; CSS löser layout.
- Använd `<th>` för rubriker och `<td>` för data.
- I större tabeller gör `<thead>`, `<tbody>` och `scope` informationen tydligare och mer tillgänglig.

I nästa avsnitt lär du dig samla in information från en besökare med formulär.
