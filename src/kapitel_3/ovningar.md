# Praktiska övningar och projekt

Här får du hands-on-övningar för att träna på CSS:

- Styling av formulär
- Responsiva layouter
- Navigation och menyer
- Praktiska designutmaningar

---

# Praktiska övningar: Grundläggande CSS

Nu är det dags att applicera det vi lärt oss om CSS! Vi fortsätter med "Om Mig"-sidan från kapitel 2 och ger den stil med CSS.

> **Mål:**  
> Använda CSS för att:
> - Koppla en extern CSS-fil.
> - Använda olika selektorer (element, klass, ID).
> - Ändra färger och typografi.
> - Arbeta med box model (padding, margin, border).
> - Bygga enkla layouter med Flexbox och CSS Grid.
> - Implementera grundläggande responsivitet med Media Queries (mobile-first design).

**Förutsättningar:**  
Du har projektet `om-mig-sida` från kapitel 2, med `index.html` och Git initialiserat (och helst kopplat till GitHub).

---

## Övning 1: Koppla CSS och grundläggande styling

1. **Skapa CSS-fil:**  
   I din `om-mig-sida`-mapp, skapa en ny fil som heter `style.css`.

2. **Länka från HTML:**  
   Öppna `index.html`. Inuti `<head>`, lägg till en `<link>`-tagg för att länka till din CSS-fil:
   ```html
   <link rel="stylesheet" href="style.css">
   ```

3. **Grundläggande body-stilar (i `style.css`):**
   - Sätt ett grundtypsnitt för hela sidan med `font-family` (t.ex. `sans-serif`).
   - Lägg till `line-height` för bättre läsbarhet (t.ex. `1.6`).
   - Sätt en grundläggande textfärg (`color`) för `body` (t.ex. `#333`).
   - Lägg till `padding` på `body` (t.ex. `20px`) så att innehållet inte ligger klistrat mot kanterna på små skärmar.
   ```css
   body {
     font-family: sans-serif;
     line-height: 1.6;
     color: #333;
     padding: 20px;
   }
   ```

4. **Styla rubriker:**  
   Ge `h1` och `h2` en annan färg.
   ```css
   h1, h2 {
     color: darkcyan;
   }
   ```

5. **Commit:**
   - `git status` (Du bör se `style.css` som ny och `index.html` som ändrad).
   - `git add .`
   - `git commit -m "Lägg till CSS-fil och grundläggande body/h-styling"`

6. **Visa:**  
   Öppna `index.html` i webbläsaren. Du bör nu se att typsnitt, radavstånd, färger och padding har ändrats!

---

## Övning 2: Box model och selektorer

1. **Centrera innehåll (på större skärmar):**  
   Vi vill att innehållet ska vara centrerat och inte bli för brett på stora skärmar. Använd en container.
   - **HTML:** Omslut allt innehåll *inuti* `<body>` (utom eventuella `<script>`-taggar) med en `<div>` med klassen `container`. Om du använder `<header>`, `<main>`, `<footer>`, kan du omsluta dessa med containern eller lägga containern inuti `<main>`.
   - **CSS:** Lägg till regler för `.container`:
     ```css
     .container {
       width: 100%; /* Mobile-first: full bredd */
       max-width: 800px; /* Maximal bredd på stora skärmar */
       margin-left: auto;
       margin-right: auto;
     }
     ```
     *Tips: `margin: 0 auto;` är ett kortkommando för att centrera blockelement.*

2. **Styla länkar:**  
   Ta bort understrykningen från länkar som standard och ändra färgen.
   ```css
   a {
     color: dodgerblue;
     text-decoration: none;
   }

   a:hover {
     text-decoration: underline;
   }
   ```

3. **Styla bild (om du har en):**  
   Ge bilden en maximal bredd så att den inte blir större än sin container och lägg till lite marginal.
   ```css
   img {
     max-width: 100%;
     height: auto;
     display: block;
     margin: 20px auto;
   }
   ```

4. **Commit:**
   - `git add .`
   - `git commit -m "Centrera innehåll, styla länkar och bild"`

5. **Visa:**  
   Uppdatera webbläsaren. Se hur innehållet beter sig när du ändrar fönsterstorleken.

---

## Övning 3: Flexbox för en navigering

Skapa en liten navigering med minst tre länkar. Målet är att länkarna ska placeras i en rad med jämnt mellanrum.

1. Skapa en `<nav>` med en lista och minst tre länkar.
2. Lägg `display: flex` och `gap` på listan, inte på varje länk.
3. Ta bort listans standardpunkter och standardutfyllnad.
4. Ändra tillfälligt `flex-direction` mellan `row` och `column`. Förutsäg resultatet innan du uppdaterar webbläsaren.

<details>
<summary>Lösningsförslag</summary>

```html
<nav aria-label="Huvudmeny">
   <ul class="menu">
      <li><a href="#start">Start</a></li>
      <li><a href="#about">Om mig</a></li>
      <li><a href="#contact">Kontakt</a></li>
   </ul>
</nav>
```

```css
.menu {
   display: flex;
   gap: 1rem;
   padding: 0;
   list-style: none;
}
```

</details>

**Checkpoint:** Länkarna ligger i en rad. När du ändrar `flex-direction: column` hamnar de under varandra.

---

## Övning 4: CSS Grid för kort

Skapa fyra kort i en `<section class="card-grid">`. Använd Grid för att skapa två lika breda kolumner.

1. Sätt `display: grid` på `.card-grid`.
2. Skapa två kolumner med `grid-template-columns` och använd `gap` för mellanrummet.
3. Ändra tillfälligt den andra kolumnen till `2fr`. Vilket kort blir bredast, och varför?

<details>
<summary>Lösningsförslag</summary>

```html
<section class="card-grid">
   <article>Projekt 1</article>
   <article>Projekt 2</article>
   <article>Projekt 3</article>
   <article>Projekt 4</article>
</section>
```

```css
.card-grid {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 1rem;
}

.card-grid article {
   padding: 1rem;
   border: 1px solid #333;
}
```

</details>

**Checkpoint:** Det finns två kolumner och två rader. Med `1fr 2fr` får den andra kolumnen två delar av det lediga utrymmet.

---

## Övning 5: Felsök en layout

Korten nedan ska hamna bredvid varandra, men gör inte det. Rätta CSS:en och förklara med en mening varför ändringen fungerar.

```html
<section class="projects">
   <article class="project">Projekt A</article>
   <article class="project">Projekt B</article>
</section>
```

```css
.project {
   display: flex;
   gap: 1rem;
}
```

<details>
<summary>Lösningsförslag</summary>

```css
.projects {
   display: flex;
   gap: 1rem;
}
```

Flexbox placeras på föräldern `.projects` eftersom den styr hur dess direkta barn placeras.

</details>

**Checkpoint:** Korten hamnar bredvid varandra, och du kan peka ut vilken del av HTML som är flex container respektive flex items.

---

## Övning 6: Responsivitet med Media Query

Låt korten från föregående övning ligga i en kolumn på liten skärm och två kolumner från `768px`.

1. **Lägg till Media Query:**  
   Lägg till följande i slutet av `style.css`:
   ```css
    .card-grid {
       display: grid;
       grid-template-columns: 1fr;
       gap: 1rem;
    }

   @media (min-width: 768px) {
       .card-grid {
          grid-template-columns: 1fr 1fr;
     }
   }
   ```

2. **Commit:**
   - `git add .`
   - `git commit -m "Gör kortlayouten responsiv med CSS Grid"`

3. **Visa och testa:**  
   Öppna `index.html`. Ändra bredden på webbläsarfönstret. Kortens layout ska ändras från en till två kolumner när fönstret passerar 768 pixlars bredd.

---

## Övning 7: Logisk ordning med tangentbordet

1. Skriv HTML i ordningen: rubrik, navigering, huvudinnehåll och kontaktlänk.
2. Använd Grid eller Flexbox för att ändra den visuella layouten på bred skärm.
3. Tryck på `Tab` och kontrollera att fokus går i en begriplig ordning.
4. Använd inte CSS-egenskapen `order` för att byta plats på länkar eller viktigt innehåll.

**Checkpoint:** Sidans HTML-ordning är begriplig även utan CSS, och tangentbordsfokus följer samma ordning.

---

## Övning 8: Pusha till GitHub

Om du kopplade ditt repo till GitHub i kapitel 2, pusha dina ändringar:

1. Kör `git status` för att se om du har några lokala commits som inte är pushade.
2. Kör `git pull` (bra vana att göra innan push).
3. Kör `git push`.
4. Verifiera att dina ändringar (inklusive `style.css`) nu finns på GitHub.

---

## Sammanfattning och nästa steg

Du har nu tagit dina första steg med CSS! Du har länkat en extern stilmall, använt olika selektorer, lagt till färger och typografi, arbetat med box model, byggt layouter med Flexbox och Grid samt introducerat responsivitet med en Media Query enligt mobile-first design. Du har också fortsatt att använda Git för att spara dina framsteg.

I nästa kapitel dyker vi ner i JavaScript för att lägga till interaktivitet på våra webbsidor.
