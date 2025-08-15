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

## Övning 3: Responsivitet med Media Query

Låt oss göra så att bakgrundsfärgen på `body` ändras på lite större skärmar.

1. **Lägg till Media Query:**  
   Lägg till följande i slutet av `style.css`:
   ```css
   @media (min-width: 768px) {
     body {
       background-color: #f0f8ff; /* AliceBlue */
       font-size: 18px;
     }
     /* Lägg till fler regler här som bara ska gälla på större skärmar */
   }
   ```

2. **Commit:**
   - `git add .`
   - `git commit -m "Gör sidan responsiv: ändra bakgrund och font på bredare skärm"`

3. **Visa och testa:**  
   Öppna `index.html`. Ändra bredden på webbläsarfönstret. Ser du hur bakgrundsfärgen och textstorleken ändras när fönstret passerar 768 pixlars bredd?

---

## Övning 4: Pusha till GitHub

Om du kopplade ditt repo till GitHub i kapitel 2, pusha dina ändringar:

1. Kör `git status` för att se om du har några lokala commits som inte är pushade.
2. Kör `git pull` (bra vana att göra innan push).
3. Kör `git push`.
4. Verifiera att dina ändringar (inklusive `style.css`) nu finns på GitHub.

---

## Sammanfattning och nästa steg

Du har nu tagit dina första steg med CSS! Du har länkat en extern stilmall, använt olika selektorer, lagt till färger och typografi, arbetat med box model och introducerat responsivitet med en Media Query enligt mobile-first design. Du har också fortsatt att använda Git för att spara dina framsteg.

I nästa kapitel dyker vi ner i JavaScript för att lägga till interaktivitet på våra webbsidor.
