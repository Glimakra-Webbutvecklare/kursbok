# Static Site Generators med Jekyll

## 1. Introduktion -- Vad är en Static Site Generator?

En Static Site Generator (SSG) är ett verktyg som genererar färdiga
HTML-filer från mallar och innehåll (ofta Markdown). Tänk på en SSG som en **HTML-kompilator**.

Istället för att generera HTML dynamiskt vid varje sidvisning (som ex ett CMS), bygger SSG:n alla sidor på förhand. Det betyder att webbplatsen redan är färdig innan den publiceras. Därmed upplevs webbplatsen snabb eftersom servern skickar statiska filer.

**Jekyll** är ett exempel på SSG - Static Site Generator. Jekyll baseras på programspråket Ruby - populärt för webbutveckling genom ramverket Ruby on Rails.  


<a href="https://jekyllrb.com/" target="_blank">https://jekyllrb.com/</a>



Andra exempel på SSG är **Hugo** (Go), **Gatsby** (React/Node.js) och **Next.js** (JavaScript).


------------------------------------------------------------------------

## Hur fungerar det?

``` mermaid
%%{init: {'theme': 'default'}}%%
flowchart LR
    A[Markdown Files] --> B[Jekyll Build]
    C[Layouts & Templates] --> B
    B --> D[Static HTML Files]
    D --> E[Web Server]
```

------------------------------------------------------------------------

## 2. Jekyll -- Grunder

Så här ser strukturen ut för ett projekt i Jekyll:

    my-site/
    ├── _posts/
    ├── _layouts/
    ├── _includes/
    ├── _config.yml
    ├── index.md

------------------------------------------------------------------------

## 3. Markdown och Front Matter

Markdown är ett lightweight markeringsspråk designat för att skriva innehål på ett enkelt och läsbart sätt. I Jekyll beskrivs en sida med markdown, och som därefter konverteras till HTML.

**Jämförelse med andra markeringsspråk:**

| Språk | Komplexitet | Användning |
|-------|-------------|-----------|
| **Markdown** | Låg | Innehål, dokumentation, bloggar |
| **HTML** | Hög | Webbsidor, fullständig semantik |
| **XML** | Hög | Data-utbyte, konfiguration |


**Markdown vs HTML vs XML**

Markdown är mycket enklare än HTML eftersom det använder intuitiv formatering (`**fet**` istället för `<strong>`). Det är också mer läsbart i råformat. 

HTML är mer kraftfullt men kräver mer kod. XML fokuserar på datastruktur och är lika strikt som HTML när det gäller syntaxregler. XML låter dig också definiera egna taggar för olika datatyper.


### Markdown-exempel

``` markdown
# My Title

This is a paragraph.

- Item 1
- Item 2
```

### Front Matter

**Front Matter** är metadata som placeras i början av en fil, vanligtvis omgiven av tre bindestreck 
`---` 
på både början och slut. Front Matter används för att definiera variabler och konfigurationer som påverkar hur en fil bearbetas och renderas.


Ett exempel på ett inledande kodblock med **Front Matter**: 

``` yaml
---
title: My First Post
layout: post
author: Flisa
---
```

------------------------------------------------------------------------

## 4. Layout i Jekyll

**Layout** i Jekyll är mallar som definierar den gemensamma strukturen för dina sidor. Istället för att upprepa HTML-kod på varje sida, använder du en layout-fil som innehåller den gemensamma koden (header, footer, navigation osv).

**Varför användes layout?**

- **DRY-principen** (Don't Repeat Yourself) - skriva koden en gång
- **Konsistens** - alla sidor får samma utseende och känsla
- **Enkel underhåll** - ändra layouten på ett ställe, uppdateras överallt
- **Flexibilitet** - olika sider kan använda olika layouter

**Hur fungerar det?**

Du skapar en layout-fil i mappen `_layouts/` (t.ex. `post.html`). I denna definierar du HTML-strukturen med variabeln `{{ content }}` som platshållare för sidans innehål. När Jekyll bygger, ersätter den `{{ content }}` med innehållet från din Markdown-fil.


**Exempel med variabler i layout:**

Variabler från Front Matter kan användas i layouten. Om du definierar `author` i Front Matter, kan du referera till den i layouten med `{{ page.author }}`:

``` html
<footer>
    <p>&copy; 2024 {{ page.author }}</p>
</footer>
```

När Jekyll bygger sidan, ersätts `{{ page.author }}` med värdet från Front Matter. Om Front Matter innehåller `author: Flisa`, skrivs footern som:

Du kan använda Jekylls inbyggda variabel `site.time` för att få aktuellt år dynamiskt:

``` html
<footer>
    <p>&copy; {{ site.time | date: "%Y" }} {{ page.author }}</p>
</footer>
```

Variabeln `site.time` är byggdatum, och filtret `date: "%Y"` extraherar året. Detta uppdateras automatiskt varje gång Jekyll bygger sidan.

Alternativt kan du haråkoda året i `_config.yml` och uppdatera det manuellt vid behov.


Du kan också använda andra variabler som `{{ page.date }}`, `{{ page.title }}` och egna variabler som `{{ page.category }}` - så länge de är definierade i Front Matter.


**Front Matter-konfiguration:**

I din Markdown-fil anger du vilken layout som ska användas:

``` yaml
---
title: Min Bloggpost
layout: post
---
```


``` mermaid
%%{init: {'theme': 'default'}}%%
flowchart TD
    A[Content File] --> B[Layout]
    B --> C[Default Layout]
    C --> D[Final HTML]
```

Layout-exempel:

`_layouts/post.html`

``` html
<!DOCTYPE html>
<html>
<head>
  <title>{{ page.title }}</title>
</head>
<body>

    <main>
        {{ content }}
    </main>

    <footer>
        <p>&copy; {{ site.time | date: "%Y" }} {{ page.author }}</p>
    </footer>

</body>
</html>
```

------------------------------------------------------------------------


## 5. Teman i Jekyll

**Teman** i Jekyll är fördefinierade designpaket som innehåller CSS, layouts och komponenter. De ger webbplatsen ett professionellt utseende utan att behöva skriva egen kod.

**Hur installerar man ett tema?**

Du anger temat i `_config.yml`:

``` yaml
theme: jekyll-theme-cayman
```

Sedan installeras temat automatiskt när Jekyll bygger.

**Populära teman:**

- `jekyll-theme-minimal` - enkelt och rent
- `jekyll-theme-cayman` - modernt och responsivt
- `jekyll-theme-slate` - mörkt tema



### Skapa egen CSS istället för tema

Du behöver inte använda ett tema. Istället kan du skapa egen CSS från grunden:

1. Skapa en layout-fil i `_layouts/default.html`
2. Lägg din egen CSS i `assets/css/style.css`
3. Länka CSS-filen i layouten: `<link rel="stylesheet" href="/assets/css/style.css">`

Denna metod ger fullständig kontroll över designen och du bestämmer själv all CSS.


## 6. Docker för Utveckling

**Varför Docker för Jekyll-utveckling?**

Docker skapar en isolerad utvecklingsmiljö som matchar produktionsmiljön. Det löser problemet "det fungerar på min dator" genom att alla utvecklare får samma Ruby-version, gems och systemkonfiguration. Docker gör det också enkelt att byta mellan projekt utan att installationskonflikter uppstår.

**Fördelar:**

- **Konsistens** - samma miljö för alla utvecklare
- **Isolation** - inga konflikter med systemets Ruby-installation
- **Lätt onboarding** - ny utvecklare kör bara `docker-compose up`
- **Reproducerbart** - samma setup i utveckling och produktion



### Exempelfiler


#### Dockerfile


En **Dockerfile** är en textfil som innehåller instruktioner för hur Docker ska bygga en containeravbild. Det är ett recept som definierar:

- Vilken bas-avbild som ska användas (`FROM`)
- Vilka paket som ska installeras (`RUN`)
- Vilka filer som ska kopieras in (`COPY`)
- Vilka portar som ska exponeras (`EXPOSE`)
- Vilket kommando som ska köras när containern startar (`CMD` eller `ENTRYPOINT`)

I exemplet nedan använder Dockerfile Ruby 3.2 som bas, sätter arbetskatalogen till `/site`, installerar bundler, och exponerar port 4000 för Jekyll-utvecklingsservern.


`Dockerfile`

``` dockerfile
FROM ruby:3.2

WORKDIR /site

RUN gem install bundler

EXPOSE 4000
```


#### Gemfile-exempel för Jekyll

En Gemfile specificerar Ruby-gems som ditt Jekyll-projekt behöver. Skapa en fil med namnet `Gemfile`. Här ett exempel på olika gems:

`Gemfile`

``` ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "webrick"
gem "jekyll-remote-theme"
gem "jekyll-seo-tag"
```



#### docker-compose.yml

En fil med namnet **docker-compose.yml** är en konfigurationsfil som definierar och anger funktionalitet för Docker-containrar. Den beskriver:

- **Vilka tjänster som ska köras** (t.ex. Jekyll-servern)
- **Hur containern ska byggas** (byggkontext, avbild)
- **Portar och volymmonteringar** (mappar mellan värd och container)
- **Miljövariabler och kommandon** (vad som körs när containern startar)


Med `docker-compose up` behöver du bara ett kommando för att starta hela utvecklingsmiljön — istället för att manuellt bygga och köra `docker run` med många flaggor.


`docker-compose.yml`

``` yaml
version: "3.9"

services:
  jekyll-theme:
    build: .
    container_name: jekyll-theme
    ports:
      - "4000:4000"
    volumes:
      - .:/site
      - bundle_cache:/usr/local/bundle
    command: bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0 --incremental --force_polling"

volumes:
  bundle_cache:
```

Med `docker-compose up` startar Jekyll automatiskt och är tillgänglig på `http://localhost:4000`. När en sida förändras lokalt kommer Jekyll att bygga om sidan och visa innehållet i en webbläsare.


Om sidan inte uppdateras med kommandot `docker-compose up` kan man säkerställa att bygga om sidan med följande kommandon:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```




### Versionshantera Jekyll i GitHub

När man versionshanterar ett Jekyll projekt i GitHub kan man utelämna vissa mappar och filer via `.gitignore`. Skapa en fil med namnet `.gitignore` och ange filens innehåll:


`.gitignore`

```gitignore
# Dependencies
Gemfile.lock

# Build output
_site/
.jekyll-cache/
.jekyll-metadata

# Local development
.bundle/
vendor/

```
------------------------------------------------------------------------

## 7. Deployment med GitHub Pages


### Steg-för-steg guide: Publicera Jekyll från Docker till GitHub Pages

**Förutsättningar:**
- Git installerat och konfigurerat
- Docker och Docker Compose installerat
- GitHub-konto med Repository

**Steg 1: Förbered ditt Repository**

Skapa en `.gitignore` för Jekyll:

``` 
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
Gemfile.lock
```

**Steg 2: Konfigurera `_config.yml` för GitHub Pages**

``` yaml
baseurl: "/repository-name"  # Om inte användarwebbplats
url: "https://username.github.io"
```

**Steg 3: Bygg lokalt i Docker**

``` bash
docker-compose up
```

Verifiera att webbplatsen ser korrekt ut på `http://localhost:4000`.

**Steg 4: Committa och Pusha till GitHub**

``` bash
git add .
git commit -m "Initial Jekyll setup"
git push origin main
```

**Steg 5: Aktivera GitHub Pages**

1. Gå till Repository → Settings → Pages
2. Under "Source", välj Branch: `main`
3. Välj mapp: `/ (root)` eller `/docs` beroende på konfiguration
4. GitHub bygger automatiskt med Jekyll

**Steg 6: Verifiera Deployment**

Efter några minuter är webbplatsen tillgänglig på:
- Användarwebbplats: `https://username.github.io`
- Projektwebbplats: `https://username.github.io/repository-name`

**Tips:**
- Använd `gem "github-pages"` i Gemfile för kompatibilitet
- GitHub Pages använder inte `--livereload`
- Cachebil uppdaterare på `https://username.github.io/repository-name/admin/clear-cache` (om custom domain)


Deployment-flöde:

``` mermaid
%%{init: {'theme': 'default'}}%%
flowchart LR
    A[Git Push] --> B[GitHub]
    B --> C[Build Jekyll]
    C --> D[Deploy Static Files]
    D --> E[Public Website]
```

------------------------------------------------------------------------

## Sammanfattning

-   Static Site Generators är snabba och säkra
-   Jekyll är enkel och kraftfull
-   Markdown gör innehåll enkelt
-   Docker ger stabil utvecklingsmiljö
-   GitHub Pages ger enkel hosting
