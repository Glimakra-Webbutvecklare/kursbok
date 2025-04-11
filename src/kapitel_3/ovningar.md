# Praktiska övningar och projekt

Hands-on övningar för att träna CSS:
- Styling av formulär
- Responsiva layouts
- Navigation och menyer
- Praktiska designutmaningar

# Praktiska Övningar: Grundläggande CSS

Nu är det dags att applicera det vi lärt oss om CSS! Vi kommer att fortsätta med "Om Mig"-sidan vi skapade i kapitel 2 och ge den lite stil.

**Mål:** Använda CSS för att:
*   Koppla en extern CSS-fil.
*   Använda olika selektorer (element, klass, ID).
*   Ändra färger och typografi.
*   Arbeta med boxmodellen (padding, margin, border).
*   Implementera grundläggande responsivitet med Media Queries (Mobile-First).

**Förutsättningar:** Du har projektet `om-mig-sida` från kapitel 2, med `index.html` och Git initialiserat (och helst kopplat till GitHub).

## Övning 1: Koppla CSS och Grundläggande Styling

1.  **Skapa CSS-fil:** I din `om-mig-sida`-mapp, skapa en ny fil som heter `style.css`.
2.  **Länka från HTML:** Öppna `index.html`. Inuti `<head>`-elementet, lägg till en `<link>`-tagg för att länka till din nya CSS-fil:
    ```html
    <link rel="stylesheet" href="style.css">
    ```
3.  **Grundläggande Body-stilar (i `style.css`):**
    *   Sätt ett grundtypsnitt för hela sidan med `font-family` (t.ex. `sans-serif`).
    *   Lägg till lite `line-height` för bättre läsbarhet (t.ex. `1.6`).
    *   Sätt en grundläggande textfärg (`color`) för `body` (t.ex. `#333`).
    *   Lägg till lite `padding` på `body` (t.ex. `20px`) så att innehållet inte ligger klistrat mot kanterna på små skärmar.
    ```css
    /* style.css */
    body {
      font-family: sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
    }
    ```
4.  **Styla Rubriker:** Ge `h1` och `h2` en annan färg.
    ```css
    h1, h2 {
      color: darkcyan; /* Eller välj en egen färg */
    }
    ```
5.  **Commit:**
    *   `git status` (Du bör se `style.css` som ny och `index.html` som ändrad).
    *   `git add .`
    *   `git commit -m "Lägg till CSS-fil och grundläggande body/h-styling"`.
6.  **Visa:** Öppna `index.html` i webbläsaren. Du bör nu se att typsnitt, radavstånd, färger och padding har ändrats!

## Övning 2: Boxmodell och Selektorer

1.  **Centrera Innehåll (på större skärmar):** Vi vill att innehållet ska vara centrerat och inte bli *för* brett på stora skärmar. Vi kan använda en container.
    *   **HTML:** Omslut allt innehåll *inuti* `<body>` (utom eventuella `<script>`-taggar) med en `<div>` som du ger klassen `container`. (Tips: om du använde `<header>`, `<main>`, `<footer>`, kan du antingen omsluta alla dessa med containern, eller lägga containern inuti `<main>` om du bara vill centrera huvudinnehållet).
    *   **CSS:** Lägg till regler för `.container`:
        ```css
        .container {
          width: 100%; /* Starta med full bredd (mobile first) */
          max-width: 800px; /* Maximal bredd på stora skärmar */
          margin-left: auto; /* Auto-marginaler centrerar block-element */
          margin-right: auto;
        }
        ```
        *(Notera: `margin: 0 auto;` är ett kortkommando för `margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: auto;`)*
2.  **Styla Länkar:** Ta bort understrykningen från länkar som standard och ändra färgen.
    ```css
    a {
      color: dodgerblue;
      text-decoration: none;
    }

    a:hover { /* Stil när muspekaren är över länken */
      text-decoration: underline;
    }
    ```
3.  **Styla Bild (om du har en):** Ge bilden en maximal bredd så att den inte blir större än sin container och lägg till lite marginal.
    ```css
    img {
      max-width: 100%; /* Skalar ner bilden om den är för bred */
      height: auto; /* Behåller proportionerna */
      display: block; /* Gör att margin auto fungerar för centrering */
      margin: 20px auto; /* Centrera bilden med marginal */
    }
    ```
4.  **Commit:**
    *   `git add .`
    *   `git commit -m "Centrera innehåll, styla länkar och bild"`.
5.  **Visa:** Uppdatera webbläsaren. Se hur innehållet beter sig när du ändrar fönsterstorleken.

## Övning 3: Responsivitet med Media Query

Låt oss göra så att bakgrundsfärgen på `body` ändras på lite större skärmar.

1.  **Lägg till Media Query:** Lägg till följande i slutet av `style.css`:
    ```css
    /* Stilar för skärmar som är 768px eller bredare */
    @media (min-width: 768px) {
      body {
        background-color: #f0f8ff; /* AliceBlue */
        font-size: 18px; /* Lite större text */
      }

      /* Du kan lägga till fler regler här som bara ska gälla
         på större skärmar, t.ex. ändra layouten */
    }
    ```
2.  **Commit:**
    *   `git add .`
    *   `git commit -m "Gör sidan responsiv: ändra bakgrund och font på bredare skärm"`.
3.  **Visa och Testa:** Öppna `index.html`. Ändra bredden på webbläsarfönstret. Ser du hur bakgrundsfärgen och textstorleken ändras när fönstret passerar 768 pixlars bredd?

## Övning 4: Pusha till GitHub

Om du kopplade ditt repo till GitHub i kapitel 2, pusha dina ändringar:

1.  Kör `git status` för att se om du har några lokala commits som inte är pushade.
2.  Kör `git pull` (bra vana att göra innan push, även om du är ensam).
3.  Kör `git push`.
4.  Verifiera att dina ändringar (inklusive `style.css`) nu finns på GitHub.

## Sammanfattning och Nästa Steg

Du har nu tagit dina första steg med CSS! Du har länkat en extern stilmall, använt olika selektorer, lagt till färger och typografi, arbetat med boxmodellen och introducerat responsivitet med en Media Query enligt Mobile-First-principen. Du har också fortsatt att använda Git för att spara dina framsteg.

I nästa kapitel dyker vi ner i JavaScript för att lägga till interaktivitet på våra webbsidor.
