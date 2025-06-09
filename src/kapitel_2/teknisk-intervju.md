# Tekniska Intervjufrågor: Git och Versionshantering

Detta avsnitt innehåller exempel på tekniska intervjufrågor som kan dyka upp gällande Git och versionshantering. Frågorna är utformade för att testa både teoretisk förståelse och praktisk kunskap.

Använd dessa frågor för att testa din kunskap och förbereda dig för tekniska intervjuer.

---

## Fråga 1: Grundläggande Git-koncept

**Fråga:** "Förklara skillnaden mellan en 'commit', en 'branch' och ett 'repository' i Git. Ge ett praktiskt exempel på när du skulle använda var och en."

**Förslag till svar:**
- **Repository:** En mapp som innehåller alla filer och hela versionshistoriken för ett projekt. Det är som projektets "hem" med all information Git behöver.
- **Commit:** En sparad ögonblicksbild av projektet vid en specifik tidpunkt, med ett meddelande som beskriver vad som ändrats. Som att ta ett foto av projektets tillstånd.
- **Branch:** En parallell utvecklingslinje som låter dig arbeta på nya funktioner utan att påverka huvudkoden. Som att skapa en kopia att experimentera på.

**Exempel:** Du har ett repository för en webbsida. Du skapar en branch för att lägga till en ny funktion, gör flera commits medan du utvecklar, och när du är klar mergar du tillbaka till huvudbranchen.

---

## Fråga 2: Git-arbetsflöde

**Fråga:** "Beskriv steg-för-steg vad som händer när du kör kommandona: `git add .`, `git commit -m "Fix bug"`, och `git push origin main`."

**Förslag till svar:**
1. **`git add .`:** Lägger till alla ändrade filer till staging area (mellanlagret). Filerna är nu förberedda för commit men inte än sparade.
2. **`git commit -m "Fix bug"`:** Skapar en ny commit med meddelandet "Fix bug" som innehåller alla filer från staging area. Ändringarna är nu sparade i lokal versionshistorik.
3. **`git push origin main`:** Skickar den nya commiten från din lokala main-branch till remote repository (t.ex. GitHub) så andra kan se dina ändringar.

---

## Fråga 3: Staging Area

**Fråga:** "Varför finns staging area i Git? Vad är skillnaden mellan working directory, staging area och repository?"

**Förslag till svar:**
Staging area låter dig välja exakt vilka ändringar som ska inkluderas i nästa commit. Detta ger kontroll och flexibilitet.

- **Working Directory:** Filerna du ser och redigerar i din projektmapp
- **Staging Area:** Mellanlagret där du förbereder ändringar för commit
- **Repository:** Den sparade versionshistoriken i .git-mappen

**Fördel:** Du kan arbeta på flera funktioner samtidigt men committa dem separat genom att bara lägga till relevanta filer till staging area.

---

## Fråga 4: Konflikthantering

**Fråga:** "Du försöker göra en `git pull` men får meddelandet 'merge conflict'. Vad har hänt och hur löser du det?"

**Förslag till svar:**
**Vad som hänt:** Någon annan har ändrat samma rader i samma fil som du också ändrat. Git vet inte vilken version som ska behållas.

**Lösning:**
1. Öppna den konfliktmarkerade filen
2. Leta efter `<<<<<<<`, `=======`, och `>>>>>>>` markeringar
3. Bestäm vilken kod som ska behållas (eller kombinera)
4. Ta bort konfliktmarkeringarna
5. `git add` den fixade filen
6. `git commit` för att slutföra merge

---

## Fråga 5: Git Log och Historik

**Fråga:** "Du behöver hitta när en specifik bug introducerades i koden. Vilka Git-kommandon skulle du använda och varför?"

**Förslag till svar:**
1. **`git log --oneline`:** Se en översikt av alla commits
2. **`git log --grep="keyword"`:** Sök i commit-meddelanden
3. **`git blame filename`:** Se vem som ändrade varje rad och när
4. **`git bisect`:** Binärsökning för att hitta exakt vilken commit som introducerade buggen
5. **`git show commitID`:** Se exakt vad som ändrades i en specifik commit

**Git bisect** är särskilt kraftfullt för att hitta när buggar introducerades.

---

## Fråga 6: Ångra ändringar

**Fråga:** "Du har råkat commita fel kod till din lokala repository men inte pushat än. Hur kan du ångra den senaste commiten och vad är skillnaden mellan de olika sätten?"

**Förslag till svar:**
1. **`git reset --soft HEAD~1`:** Ångrar commiten men behåller ändringarna i staging area
2. **`git reset --mixed HEAD~1`:** (default) Ångrar commiten och tar bort från staging, men behåller ändringarna i working directory
3. **`git reset --hard HEAD~1`:** Ångrar commiten och tar bort alla ändringar helt
4. **`git revert HEAD`:** Skapar en ny commit som ångrar den senaste commiten (säkrare om redan pushat)

**Regel:** Använd reset bara för lokala commits, revert för commits som redan är pushade.

---

## Fråga 7: .gitignore

**Fråga:** "Du arbetar på ett Node.js-projekt och märker att `node_modules`-mappen committas av misstag. Hur fixar du detta och förhindrar att det händer igen?"

**Förslag till svar:**
**För att fixa:**
1. Skapa `.gitignore`-fil i projektets root
2. Lägg till `node_modules/` i filen
3. `git rm -r --cached node_modules/` (tar bort från Git utan att radera lokalt)
4. `git commit -m "Remove node_modules and add to gitignore"`

**Andra vanliga ignore-patterns:**
```
node_modules/
.env
*.log
dist/
.DS_Store
```

**.gitignore** ska committas så hela teamet har samma ignore-regler.

---

## Fråga 8: HTML5 Grundstruktur

**Fråga:** "Förklara vad varje del gör i denna HTML5-struktur och varför de är viktiga:"
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Min Sida</title>
</head>
<body>
    <h1>Välkommen</h1>
</body>
</html>
```

**Förslag till svar:**
- **`<!DOCTYPE html>`:** Deklarerar att dokumentet använder HTML5-standarden. Måste vara först.
- **`<html lang="sv">`:** Rotelementet som omsluter allt innehåll. `lang="sv"` anger svenska som huvudspråk för tillgänglighet och SEO.
- **`<head>`:** Innehåller metadata som inte visas direkt - information för webbläsaren och sökmotorer.
- **`<meta charset="UTF-8">`:** Anger teckenkodning för att stödja internationella tecken (å, ä, ö). Kritiskt viktigt!
- **`<title>`:** Titeln som visas i webbläsarens flik och används av sökmotorer.
- **`<body>`:** Allt synligt innehåll på sidan.

---

## Fråga 9: HTML-Element och Attribut

**Fråga:** "Förklara skillnaden mellan element, taggar och attribut. Ge exempel på när du skulle använda `<a>`, `<img>` och `<ul>` elementen."

**Förslag till svar:**
- **Taggar:** Koder inom `< >` som markerar början (`<p>`) och slut (`</p>`) på element
- **Element:** Kompletta konstruktioner med starttagg, innehåll och sluttagg: `<p>Text</p>`
- **Attribut:** Extra information i starttaggen: `<a href="länk">text</a>`

**Exempel:**
- **`<a href="https://google.com">Sök</a>`:** För att skapa klickbara länkar till andra sidor
- **`<img src="bild.jpg" alt="Beskrivning">`:** För att visa bilder (tomt element, ingen sluttagg)
- **`<ul><li>Punkt 1</li><li>Punkt 2</li></ul>`:** För punktlistor där ordningen inte spelar roll

---

## Fråga 10: Semantisk HTML vs Generiska Element

**Fråga:** "Vad är skillnaden mellan dessa två kodexempel och varför är det ena bättre än det andra?"

```html
<!-- Exempel A -->
<div id="header">
    <div class="navigation">Meny</div>
</div>
<div class="content">Innehåll</div>

<!-- Exempel B -->
<header>
    <nav>Meny</nav>
</header>
<main>Innehåll</main>
```

**Förslag till svar:**
**Exempel B är bättre** eftersom det använder semantiska HTML5-element:

**Fördelar med semantisk HTML:**
- **Tillgänglighet:** Skärmläsare kan navigera bättre med `<nav>`, `<main>` etc.
- **SEO:** Sökmotorer förstår innehållets struktur och syfte
- **Läsbarhet:** Kod blir självförklarande utan att behöva läsa `id`/`class`-attribut
- **Framtidssäker:** Webbstandarder föredrar semantiska element

**`<div>` ska bara användas för styling/layout när inget semantiskt element passar.**

---

## Fråga 11: HTML5 Semantiska Element

**Fråga:** "Du ska bygga en bloggsida. Förklara hur du skulle använda `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>` och `<footer>` för att strukturera sidan."

**Förslag till svar:**
```html
<header>
    <h1>Min Blogg</h1>
    <nav>
        <ul>
            <li><a href="/">Hem</a></li>
            <li><a href="/om">Om</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h2>Blogginläggets titel</h2>
        <p>Innehållet i blogginlägget...</p>
    </article>
    
    <aside>
        <h3>Populära inlägg</h3>
        <ul>Relaterade länkar...</ul>
    </aside>
</main>

<footer>
    <p>&copy; 2024 Min Blogg</p>
</footer>
```

**Varför denna struktur:**
- **`<header>`:** Sidans topp med titel och huvudnavigering
- **`<main>`:** Huvudinnehållet (bara ett per sida)
- **`<article>`:** Fristående innehåll som kan distribueras separat
- **`<aside>`:** Kompletterande information vid sidan av huvudinnehållet
- **`<footer>`:** Sidfot med copyright och kontaktinfo

---

## Fråga 12: Tillgänglighet och SEO

**Fråga:** "Varför är `alt`-attributet viktigt för bilder och hur påverkar semantisk HTML sökmotoroptimering?"

**Förslag till svar:**
**`alt`-attributet för bilder:**
- **Tillgänglighet:** Skärmläsare läser upp alt-texten för synskadade användare
- **Fallback:** Visas om bilden inte kan laddas (långsam anslutning, fel URL)
- **SEO:** Hjälper sökmotorer förstå bildinnehållet

```html
<img src="produktbild.jpg" alt="Röd t-shirt i bomull, storlek M">
```

**Semantisk HTML för SEO:**
- **`<h1>`-`<h6>`:** Hjälper sökmotorer förstå innehållshierarki
- **`<article>`:** Identifierar huvudinnehåll som är värt att indexera
- **`<nav>`:** Visar sidans navigationsstuktur
- **Strukturerad data:** Semantiska element gör det lättare för sökmotorer att tolka sidan korrekt

**Resultat:** Bättre ranking i sökresultat och ökad tillgänglighet.

---

## Tips för Tekniska Intervjuer

- **Förklara din tankeprocess** medan du svarar
- **Använd konkreta exempel** från egna projekt när möjligt  
- **Erkänn om du inte vet** och förklara hur du skulle ta reda på svaret
- **Ställ följdfrågor** för att förtydliga vad intervjuaren söker
