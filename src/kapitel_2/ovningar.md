# Praktiska Övningar: HTML och Git

Teori är bra, men det bästa sättet att lära sig HTML och Git är att använda dem! Här är några övningar för att befästa kunskaperna från detta kapitel.

**Mål:** Praktiskt tillämpa HTML-taggar för struktur och semantik, samt använda grundläggande Git-kommandon för att spåra och spara ändringar lokalt och på GitHub.

**Förutsättningar:** Du har VS Code (eller annan editor), Git och en terminal installerad. Du har också ett GitHub-konto.

## Övning 1: Skapa en Enkel "Om Mig"-Sida

1.  **Skapa Projektmapp:** Skapa en ny mapp på din dator, t.ex. `om-mig-sida`.
2.  **Initiera Git:** Öppna terminalen, navigera till mappen (`cd om-mig-sida`) och kör `git init`.
3.  **Skapa HTML-fil:** Skapa en fil med namnet `index.html` i mappen.
4.  **Grundstruktur:** Lägg till den grundläggande HTML5-strukturen i `index.html` (`<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `meta charset`, `title`). Ge sidan en passande titel (t.ex. "Om [Ditt Namn]").
5.  **Lägg till Innehåll (i `<body>`):**
    *   En huvudrubrik (`<h1>`) med ditt namn.
    *   En kort paragraf (`<p>`) som introducerar dig.
    *   En underrubrik (`<h2>`) för "Mina Intressen".
    *   En oordnad lista (`<ul>`) med några av dina intressen (`<li>`).
    *   En underrubrik (`<h2>`) för "Kontakt".
    *   En paragraf (`<p>`) med en länk (`<a>`) till din (påhittade eller riktiga) e-postadress (`href="mailto:din.epost@example.com"`).
    *   (Valfritt) En bild (`<img>`) på dig själv eller något relaterat. Glöm inte `alt`-attributet!
6.  **Första Commit:**
    *   Kör `git status` för att se din nya fil.
    *   Kör `git add index.html` (eller `git add .`).
    *   Kör `git commit -m "Skapa grundläggande Om Mig-sida med innehåll"`.
7.  **Validera (Bonus):** Kopiera din HTML-kod och klistra in den i [W3C Markup Validation Service](https://validator.w3.org/) för att se om den är korrekt.
8.  **Visa i Webbläsare:** Öppna `index.html` i din webbläsare för att se resultatet.

## Övning 2: Semantisk Struktur och Fler Ändringar

1.  **Fortsätt i samma projekt.**
2.  **Lägg till Semantiska Element:** Strukturera upp din `index.html` med semantiska taggar:
    *   Omslut rubriken och eventuell introduktion med `<header>`.
    *   Omslut huvudinnehållet (intressen, kontakt etc.) med `<main>`.
    *   Lägg till en `<footer>` längst ner med t.ex. copyright-information (`<p>&copy; [Årtal] [Ditt Namn]</p>`).
    *   Om du har flera tydliga delar i `<main>` (t.ex. intressen och kontakt), omslut dem med `<section>`-element och ge varje sektion en egen rubrik (`<h2>`).
3.  **Gör en Commit:**
    *   Kör `git status` för att se ändringarna.
    *   Kör `git add .`.
    *   Kör `git commit -m "Lägg till semantisk struktur (header, main, footer, sections)"`.
4.  **Visa Historik:** Kör `git log --oneline` för att se dina två commits.

## Övning 3: Koppla till GitHub

1.  **Skapa Repo på GitHub:** Gå till GitHub, skapa ett *nytt, tomt* repository (utan README, .gitignore eller license). Kalla det t.ex. `om-mig-sida`.
2.  **Koppla Lokalt till Fjärr:** Följ instruktionerna från GitHub ("…or push an existing repository"). Kör följande kommandon i din terminal (i projektmappen), men **byt ut URL:en** mot den från ditt GitHub-repo:
    ```bash
    git remote add origin https://github.com/ditt-anvandarnamn/om-mig-sida.git
    git branch -M main
    git push -u origin main
    ```
3.  **Verifiera:** Gå till din repository-sida på GitHub och uppdatera sidan. Du ska nu se din `index.html` och dina commits.
4.  **Gör en liten ändring:** Lägg till ytterligare ett intresse i listan i `index.html`.
5.  **Commit och Push:**
    *   `git status`
    *   `git add .`
    *   `git commit -m "Lägg till ett till intresse"`
    *   `git push` (Denna gång behövs inte `-u origin main`)
6.  **Verifiera igen:** Uppdatera sidan på GitHub. Din senaste ändring ska nu synas där.

## Sammanfattning och Nästa Steg

Genom dessa övningar har du praktiskt skapat en enkel HTML-sida, strukturerat den semantiskt, och använt Git för att spåra ändringar lokalt och synkronisera dem med ett fjärr-repository på GitHub. Detta är grunden för arbetsflödet vi kommer använda genom resten av kursen.

I nästa kapitel introducerar vi CSS för att börja styla våra HTML-sidor och ge dem ett visuellt utseende.
