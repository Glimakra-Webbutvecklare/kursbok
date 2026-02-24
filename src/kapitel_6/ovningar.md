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

## Övriga projekt

- WordPress-site setup
- Custom theme development
- Jekyll blog creation
- Server deployment
