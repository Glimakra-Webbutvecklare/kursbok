# Praktiska övningar: HTML och Git

Teori är bra, men det bästa sättet att lära sig HTML och Git är att använda dem! Här är några övningar för att befästa kunskaperna från detta kapitel.

> **Mål:**  
> Praktiskt tillämpa HTML-taggar för struktur och semantik, samt använda grundläggande Git-kommandon för att spåra och spara ändringar lokalt och på GitHub.

**Förutsättningar:**  
Du har VS Code (eller annan editor), Git och en terminal installerad. Du har också ett GitHub-konto.

---

## Övning 1: Skapa en enkel "Om Mig"-sida

1. **Skapa projektmapp:**  
   Skapa en ny mapp, t.ex. `om-mig-sida`.

2. **Initiera Git:**  
   Öppna terminalen, navigera till mappen (`cd om-mig-sida`) och kör:
   ```bash
   git init
   ```

3. **Skapa HTML-fil:**  
   Skapa en fil med namnet `index.html` i mappen.

4. **Grundstruktur:**  
   Lägg till grundläggande HTML5-struktur i `index.html`:
   - `<!DOCTYPE html>`
   - `<html lang="sv">`
   - `<head>` med `<meta charset="UTF-8">` och `<title>`
   - `<body>`

   Ge sidan en passande titel, t.ex. "Om [Ditt Namn]".

5. **Lägg till innehåll i `<body>`:**
   - En huvudrubrik (`<h1>`) med ditt namn.
   - En kort paragraf (`<p>`) som introducerar dig.
   - En underrubrik (`<h2>`) för "Mina intressen".
   - En oordnad lista (`<ul>`) med några av dina intressen (`<li>`).
   - En underrubrik (`<h2>`) för "Kontakt".
   - En paragraf (`<p>`) med en länk (`<a>`) till din (påhittade eller riktiga) e-postadress (`href="mailto:din.epost@example.com"`).
   - (Valfritt) En bild (`<img>`) på dig själv eller något relaterat. Glöm inte `alt`-attributet!

6. **Första commit:**
   ```bash
   git status
   git add index.html
   git commit -m "Skapa grundläggande Om Mig-sida med innehåll"
   ```

7. **Validera (bonus):**  
   Klistra in din HTML-kod i [W3C Markup Validation Service](https://validator.w3.org/) för att kontrollera att den är korrekt.

8. **Visa i webbläsare:**  
   Öppna `index.html` i din webbläsare.

---

## Övning 2: Semantisk struktur och fler ändringar

1. **Fortsätt i samma projekt.**

2. **Lägg till semantiska element:**  
   - Omslut rubriken och introduktionen med `<header>`.
   - Omslut huvudinnehållet (intressen, kontakt) med `<main>`.
   - Lägg till en `<footer>` längst ner, t.ex. med copyright.
   - Om du har flera tydliga delar i `<main>`, omslut dem med `<section>` och ge varje sektion en egen rubrik (`<h2>`).

3. **Commit:**
   ```bash
   git status
   git add .
   git commit -m "Lägg till semantisk struktur (header, main, footer, sections)"
   ```

4. **Visa historik:**  
   ```bash
   git log --oneline
   ```

---

## Övning 3: Koppla till GitHub

1. **Skapa repo på GitHub:**  
   Skapa ett nytt, tomt repository på GitHub (utan README, .gitignore eller license).

2. **Koppla lokalt till remote:**  
   Följ instruktionerna från GitHub ("…or push an existing repository").  
   Byt ut URL:en mot den från ditt repo:
   ```bash
   git remote add origin https://github.com/ditt-anvandarnamn/om-mig-sida.git
   git branch -M main
   git push -u origin main
   ```

3. **Verifiera:**  
   Gå till din repository-sida på GitHub och kontrollera att din `index.html` och dina commits syns.

4. **Gör en liten ändring:**  
   Lägg till ytterligare ett intresse i listan i `index.html`.

5. **Commit och push:**
   ```bash
   git status
   git add .
   git commit -m "Lägg till ett till intresse"
   git push
   ```

6. **Verifiera igen:**  
   Uppdatera sidan på GitHub och kontrollera att ändringen syns.

---

## Sammanfattning och nästa steg

Genom dessa övningar har du praktiskt skapat en enkel HTML-sida, strukturerat den semantiskt och använt Git för att spåra ändringar lokalt och synkronisera dem med ett remote-repository på GitHub. Detta är grunden för arbetsflödet vi kommer använda genom resten av kursen.

I nästa kapitel introducerar vi CSS för att börja styla våra HTML-sidor och ge dem ett visuellt utseende.
