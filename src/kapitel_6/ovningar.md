# Praktiska övningar och projekt

## Docker-övningar

### Övning 1: Kör din första container

Kör `hello-world`-imagen för att verifiera att Docker fungerar på din dator.

<details>
<summary>Lösningsförslag</summary>

```bash
docker run hello-world
```

**Förklaring:** `docker run` hämtar imagen från Docker Hub (om den inte finns lokalt) och startar en container. Hello-world-imagen är minimal och skriver ut ett meddelande för att bekräfta att installationen fungerar.
</details>

---

### Övning 2: Lista containrar

Starta en Nginx-container i bakgrunden med `docker run -d nginx:latest`. Lista sedan alla körande containrar (både aktiva och stoppade).

<details>
<summary>Lösningsförslag</summary>

```bash
docker run -d nginx:latest
docker ps -a
```

**Förklaring:** `-d` kör containern i bakgrunden (detached). `docker ps` visar endast körande containrar; `-a` (all) visar även stoppade containrar.
</details>

---

### Övning 3: Portmappning

Starta Nginx så att den är tillgänglig på port **3000** på localhost. Testa sedan i webbläsaren med `http://localhost:3000`.

<details>
<summary>Lösningsförslag</summary>

```bash
docker run -d -p 3000:80 --name web nginx:latest
```

**Förklaring:** `-p 3000:80` mappar värddatorns port 3000 till containerns port 80 (där Nginx lyssnar). Formatet är alltid `värdport:containerport`.
</details>

---

### Övning 4: Volym – servera egen HTML

Skapa en mapp `min-sida` med en fil `index.html` som innehåller `<h1>Min första Docker-sida</h1>`. Starta Nginx med en volym så att denna mapp serveras som document root.

<details>
<summary>Lösningsförslag</summary>

```bash
mkdir -p min-sida
echo '<h1>Min första Docker-sida</h1>' > min-sida/index.html
docker run -d -p 8080:80 -v $(pwd)/min-sida:/usr/share/nginx/html:ro --name web nginx:latest
```

**Förklaring:** `-v $(pwd)/min-sida:/usr/share/nginx/html:ro` mappar din lokala mapp till Nginx document root. `:ro` gör volymen skrivskyddad för containern.
</details>

---

### Övning 5: Stoppa och ta bort container

Stoppa containern med namnet `web` och ta sedan bort den helt.

<details>
<summary>Lösningsförslag</summary>

```bash
docker stop web
docker rm web
```

**Förklaring:** `docker stop` skickar SIGTERM och väntar på att containern avslutas. `docker rm` tar bort containern från systemet. Du kan kombinera med `docker rm -f web` för att tvinga bort en körande container.
</details>

---

### Övning 6: Skapa en enkel Dockerfile

Skapa en Dockerfile som bygger en image baserad på `node:20-alpine`. Kopiera en fil `app.js` till `/app/` och sätt arbetskatalogen till `/app`. (Du behöver inte ha en riktig app.js – skapa en tom fil eller en enkel `console.log('Hej!')`.)

<details>
<summary>Lösningsförslag</summary>

```dockerfile
FROM node:20-alpine
COPY app.js /app/
WORKDIR /app
CMD ["node", "app.js"]
```

**Förklaring:** `FROM` anger basimagen. `COPY` kopierar filer från byggkontexten. `WORKDIR` sätter arbetskatalogen. `CMD` definierar kommandot som körs när containern startar.
</details>

---

### Övning 7: Bygg och kör egen image

Bygg imagen från övning 6 med taggnamnet `min-node-app`. Kör sedan containern.

<details>
<summary>Lösningsförslag</summary>

```bash
docker build -t min-node-app .
docker run min-node-app
```

**Förklaring:** `docker build -t min-node-app .` bygger imagen från Dockerfile i aktuell mapp (`.`) och ger den namnet `min-node-app`. Punkten anger byggkontexten – vilka filer som är tillgängliga för `COPY`.
</details>

---

### Övning 8: Docker Compose – en webbserver

Skapa en `docker-compose.yml` med en tjänst som heter `web`, använder `nginx:latest` och exponerar port 8080.

<details>
<summary>Lösningsförslag</summary>

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
```

**Förklaring:** Under `services` definierar du varje container. `image` anger vilken image som ska användas. `ports` mappar värdens port 8080 till containerns port 80.
</details>

---

### Övning 9: Docker Compose med volym

Utöka övning 8: lägg till en volym som mappar mappen `./html` till `/usr/share/nginx/html` i containern. Skapa sedan mappen och en `index.html`, starta med `docker compose up -d` och verifiera att sidan visas.

<details>
<summary>Lösningsförslag</summary>

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
```

```bash
mkdir -p html
echo '<h1>Hej från Compose!</h1>' > html/index.html
docker compose up -d
```

**Förklaring:** `volumes` med `./html:/usr/share/nginx/html` är en bind mount – din lokala mapp mappas in i containern. Ändringar i `html/` syns direkt utan att starta om.
</details>

---

### Övning 10: Stoppa Docker Compose

Du har startat tjänster med `docker compose up -d`. Stoppa nu alla containrar och ta bort dem (nätverk inkluderat). Namngivna volymer ska behållas.

<details>
<summary>Lösningsförslag</summary>

```bash
docker compose down
```

**Förklaring:** `docker compose down` stoppar och tar bort alla containrar samt det skapade nätverket. Namngivna volymer (t.ex. `dbdata`) behålls som standard. Använd `docker compose down -v` om du vill ta bort även volymerna.
</details>

---

## Markdown-övningar

Installera verktyget **marked** för att konvertera Markdown till HTML och verifiera dina lösningar:

```bash
npm install -g marked
```

Använd sedan `marked fil.md` eller `echo "din markdown" | marked` för att se den genererade HTML:en.

I varje övning får du se HTML-resultatet. Din uppgift är att skriva Markdown som ger samma HTML.

---

### Markdown 1: Enkel rubrik

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<h1>Välkommen till min sida</h1>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
# Välkommen till min sida
```

**Förklaring:** En `#` i Markdown genererar en `<h1>`-rubrik. Ju fler `#` desto mindre rubrik (h2, h3, osv.).
</details>

---

### Markdown 2: Stycke med fet text

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<p>Detta är <strong>viktig</strong> information.</p>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
Detta är **viktig** information.
```

**Förklaring:** `**text**` eller `__text__` ger fet stil (`<strong>`). Tomma rader skapar nya stycken (`<p>`).
</details>

---

### Markdown 3: Punktlista

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<ul>
<li>Äpplen</li>
<li>Bananer</li>
<li>Citroner</li>
</ul>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
- Äpplen
- Bananer
- Citroner
```

**Förklaring:** `-`, `*` eller `+` följt av mellanslag skapar en punktlista. Varje rad blir ett `<li>`-element.
</details>

---

### Markdown 4: Numrerad lista

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<ol>
<li>Koka vatten</li>
<li>Lägg i pasta</li>
<li>Vänta 10 minuter</li>
</ol>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
1. Koka vatten
2. Lägg i pasta
3. Vänta 10 minuter
```

**Förklaring:** `1.` följt av mellanslag skapar en numrerad lista. Markdown numrerar om automatiskt – du kan skriva `1.` på alla rader om du vill.
</details>

---

### Markdown 5: Länk

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<p>Besök <a href="https://github.com">GitHub</a> för mer information.</p>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
Besök [GitHub](https://github.com) för mer information.
```

**Förklaring:** Syntax för länk är `[länktext](url)`. Länktexten står inom hakparenteser, URL:en inom vanliga parenteser.
</details>

---

### Markdown 6: Bild

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<p><img src="logo.png" alt="Företagets logotyp"></p>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
![Företagets logotyp](logo.png)
```

**Förklaring:** Bildsyntax liknar länk men börjar med `!`. Format: `![alt-text](url)`. Alt-texten är viktig för tillgänglighet.
</details>

---

### Markdown 7: Inline-kod och kodblock

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<p>Använd kommandot <code>npm install</code> för att installera paket.</p>
<pre><code>function hello() {
  console.log("Hej!");
}
</code></pre>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
Använd kommandot `npm install` för att installera paket.

```
function hello() {
  console.log("Hej!");
}
```
```

**Förklaring:** Enkla backticks `` ` `` ger inline-kod (`<code>`). Tre backticks (```) skapar ett kodblock (`<pre><code>`). Du kan ange språk efter öppnande backticks, t.ex. ```javascript.
</details>

---

### Markdown 8: Citat (blockquote)

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<blockquote>
<p>Citatet är det viktigaste.</p>
</blockquote>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
> Citatet är det viktigaste.
```

**Förklaring:** `>` i början av en rad skapar ett blockquote. Flera rader med `>` blir ett längre citat.
</details>

---

### Markdown 9: Tabell

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<table>
<thead>
<tr><th>Namn</th><th>Pris</th></tr>
</thead>
<tbody>
<tr><td>Äpple</td><td>5 kr</td></tr>
<tr><td>Banan</td><td>3 kr</td></tr>
</tbody>
</table>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
| Namn  | Pris |
|-------|------|
| Äpple | 5 kr |
| Banan | 3 kr |
```

**Förklaring:** Tabeller i Markdown (GFM) använder `|` som kolumnavgränsare. Den andra raden med `---` definierar headern. Minst tre bindestreck behövs per kolumn.
</details>

---

### Markdown 10: Kombination – rubrik, lista och länk

Du ser följande HTML. Skriv Markdown som ger samma resultat.

```html
<h2>Snabbstart</h2>
<ul>
<li>Klona repot</li>
<li>Kör <code>npm install</code></li>
<li>Läs <a href="README.md">README</a></li>
</ul>
```

<details>
<summary>Lösningsförslag</summary>

```markdown
## Snabbstart

- Klona repot
- Kör `npm install`
- Läs [README](README.md)
```

**Förklaring:** Kombinera rubriker (`##`), listor (`-`) och inline-kod (`` ` ``) samt länkar (`[]()`). Tom rad mellan rubrik och lista ger tydlig struktur.
</details>

---

## Licensövningar

I varje övning beskrivs en kodbas och dess syfte. Välj vilken licens som passar bäst och motivera ditt val.

---

### Licens 1: Öppen källkodsbibliotek

Du har skapat ett JavaScript-bibliotek för datumformatering som du vill att så många som möjligt ska använda – inklusive företag med slutna produkter. Du vill ha cred (att du nämns) men inga andra krav.

**Alternativ:** A) MIT  B) GPL  C) Apache 2.0  D) Ingen licens (proprietär)

<details>
<summary>Lösningsförslag</summary>

**Svar: A) MIT** (eller C) Apache 2.0)

**Förklaring:** MIT är mycket permissiv – alla får använda, modifiera och distribuera koden, även i proprietära projekt. Enda kravet är att licensen följer med. Apache 2.0 är liknande men ger explicit patentlicens, vilket kan vara bra för företag. GPL skulle kräva att alla som använder biblioteket i sin app också gör sin app öppen källkod – det begränsar adoptionen. Proprietär licens ger ingen rätt att använda koden.
</details>

---

### Licens 2: WordPress-tema med copyleft

Du har byggt ett WordPress-tema som du vill dela öppet. Du vill att förbättringar och varianter av temat också ska vara öppen källkod – ingen får ta ditt tema, ändra det och sälja det som stängt.

**Alternativ:** A) MIT  B) GPL  C) Proprietär  D) Unlicense

<details>
<summary>Lösningsförslag</summary>

**Svar: B) GPL**

**Förklaring:** GPL är en copyleft-licens – om någon modifierar och distribuerar din kod måste de göra det under samma licens (GPL). Det säkerställer att förbättringar förblir öppna. WordPress själv använder GPL, så teman som bygger på WordPress brukar också använda GPL. MIT och Unlicense tillåter att någon tar din kod och säljer den som proprietär. Proprietär licens skulle hindra andra från att använda temat överhuvudtaget.
</details>

---

### Licens 3: Intern företagskod

Du utvecklar en webbapplikation åt ett företag. Koden är deras affärshemlighet – de vill inte att konkurrenter eller andra får tillgång till källkoden.

**Alternativ:** A) MIT  B) GPL  C) Apache 2.0  D) Ingen öppen licens

<details>
<summary>Lösningsförslag</summary>

**Svar: D) Ingen öppen licens**

**Förklaring:** När koden ska vara hemlig använder man ingen öppen källkodslicens. Koden är då "all rights reserved" – endast rättighetshavaren (företaget) har rätt att använda, kopiera och modifiera. Avtalet mellan dig och företaget reglerar vem som äger koden. Öppna licenser (MIT, GPL, Apache) ger andra rättigheter – det strider mot målet att hålla koden sluten.
</details>

---

### Licens 4: SaaS med öppen kärna

Du har byggt en projektverktyg-app som körs som SaaS (användare loggar in i webbläsaren). Du vill att kärnan ska vara öppen så att andra kan bygga vidare, men du vill att om någon hostar en klon av din app som tjänst måste de också dela sin modifierade kod.

**Alternativ:** A) MIT  B) GPL  C) AGPL  D) BSD

<details>
<summary>Lösningsförslag</summary>

**Svar: C) AGPL**

**Förklaring:** AGPL (Affero GPL) utökar GPL med ett viktigt tillägg: om du erbjuder tjänsten över nätverket (t.ex. SaaS) måste du erbjuda källkoden till användarna. Vanlig GPL täcker bara distribution av binärer/filer – någon som hostar din app som SaaS behöver inte dela koden. AGPL stänger den luckan. MIT och BSD tillåter att någon hostar en stängd klon utan att dela ändringar.
</details>

---

### Licens 5: Skolprojekt för portfolio

Du har gjort ett examensprojekt – en React-app – som du vill visa på din portfolio. Du vill att arbetsgivare ska kunna titta på koden, men du bryr dig inte om att andra använder eller bygger vidare på den.

**Alternativ:** A) MIT  B) GPL  C) CC0 (public domain)  D) Ingen licens

<details>
<summary>Lösningsförslag</summary>

**Svar: A) MIT** (eller C) CC0 om du vill vara extra generös)

**Förklaring:** MIT är enkelt och välkänt – perfekt för portfolio. Det signalerar att du kan arbeta med öppen källkod och att du inte har något emot att andra använder koden. GPL fungerar också men kan kännas "tyngre" för ett enkelt skolprojekt. CC0 (public domain) ger bort allt – bra om du vill maximera friheten. "Ingen licens" är oklart – juridisk standard är då att du behåller alla rättigheter, vilket kan göra arbetsgivare osäkra på vad de får göra med koden.
</details>

---

## Övriga projekt

- WordPress-site setup
- Custom theme development
- Jekyll blog creation
- Server deployment
