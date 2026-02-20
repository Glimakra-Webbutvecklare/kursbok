# Introduktion till Docker

I förra lektionen installerade vi Nginx, PHP och MariaDB direkt på en server. Det fungerar – men det kräver många manuella steg och kan ge problem: "Det fungerar på min server, men inte på din." **Docker** löser detta genom att paketera applikationen och dess miljö i **containrar** (containers) – isolerade, återanvändbara enheter som körs likadant överallt.

## Vad är Docker?

**Docker** är en plattform för att bygga, leverera och köra applikationer i containrar. En container innehåller allt som behövs för att applikationen ska fungera: kod, runtime, systembibliotek och inställningar. Resultatet är att samma container körs identiskt på din dator, på en kollegas Mac, eller på en server i molnet.

```mermaid
flowchart LR
    subgraph Utan["Utan Docker"]
        A1["Utvecklare A"] --> B1["Olika miljöer"]
        A2["Utvecklare B"] --> B1
        A3["Server"] --> B1
    end
    
    subgraph Med["Med Docker"]
        C1["Samma image"] --> D1["Samma beteende överallt"]
    end
```

**Analogi:** Tänk på en container som en flyttlåda. Inuti finns allt som behövs – du behöver inte installera möbler på destinationen. Lådan kan flyttas till vilket hus som helst och innehållet fungerar likadant.

## Containrar vs virtuella maskiner

Du kanske känner till **virtuella maskiner** (VMs) – en hel "dator" som körs inuti en annan. Containrar är lättare och snabbare:

```mermaid
flowchart TB
    subgraph VM["Virtuell maskin"]
        H1["Host OS"]
        V1["Hypervisor"]
        G1["Guest OS"] --> A1["App A"]
        G2["Guest OS"] --> A2["App B"]
        V1 --> G1
        V1 --> G2
        H1 --> V1
    end
    
    subgraph Container["Docker-containrar"]
        H2["Host OS"]
        D["Docker"]
        C1["Container A"] --> A3["App A"]
        C2["Container B"] --> A4["App B"]
        D --> C1
        D --> C2
        H2 --> D
    end
```

| Aspekt | Virtuell maskin | Docker-container |
|--------|-----------------|------------------|
| **Storlek** | Gigabyte (helt OS) | Megabyte (bara app + beroenden) |
| **Starttid** | Minuter | Sekunder |
| **Resursanvändning** | Hög | Låg |
| **Isolering** | Full (helt eget OS) | Processisolering |

Containrar delar värdens kernel (Linux-kärna) men har sin egen filsystemvy och nätverk. De är tillräckligt isolerade för de flesta behov.

## Grundbegrepp: Image och Container

*   **Image (avbild):** En skrivskyddad mall – en "recept" för vad som ska finnas i containern. Bilder byggs från en `Dockerfile` eller hämtas från ett register som Docker Hub.
*   **Container:** En körande instans av en image. Du kan starta flera containrar från samma image.

```mermaid
flowchart LR
    A["Dockerfile"] -->|docker build| B["Image"]
    B -->|docker run| C["Container"]
    B -->|docker run| D["Container"]
```

**Analogi:** En image är som en byggritning. En container är det färdiga huset – du kan bygga flera hus från samma ritning.

## Installera Docker

På Ubuntu/Debian installeras Docker med följande kommandon:

```bash
apt update
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

*Terminal – installation:*

```
$ apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
Reading package lists... Done
...
Setting up docker-ce (24.0.5) ...
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service
...
$ docker --version
Docker version 24.0.5, build 24.0.5-0ubuntu1
```

På **Windows** eller **macOS** används ofta **Docker Desktop**, som inkluderar både Docker Engine och ett grafiskt gränssnitt. Ladda ner från [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).

## Grundläggande Docker-kommandon

### Köra en container från en image

Det enklaste sättet att prova Docker är att köra en färdig image från Docker Hub:

```bash
docker run hello-world
```

*Terminal – första containern:*

```
$ docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5942: Pull complete
Digest: sha256:4bd7813b1...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

### Lista körande containrar

```bash
docker ps
```

*Terminal – lista containrar:*

```
$ docker ps
CONTAINER ID   IMAGE          COMMAND       CREATED         STATUS         PORTS     NAMES
a1b2c3d4e5f6   nginx:latest   "nginx -g ..."   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   web
```

För att se *alla* containrar (även stoppade):

```bash
docker ps -a
```

### Starta en webbserver i en container

Nginx kan köras direkt från en färdig image. Flaggan `-p` mappar port 8080 på värddatorn till port 80 i containern:

```bash
docker run -d -p 8080:80 --name web nginx:latest
```

*Terminal – starta Nginx:*

```
$ docker run -d -p 8080:80 --name web nginx:latest
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
a2abf6c4d29d: Pull complete
...
a1b2c3d4e5f6
```

Öppna nu `http://localhost:8080` i webbläsaren – du ska se Nginx välkomstsida. Inga `apt install` behövdes.

| Flagga | Betydelse |
|--------|-----------|
| `-d` | Kör i bakgrunden (detached) |
| `-p 8080:80` | Mappa värdens port 8080 till containerns port 80 |
| `--name web` | Ge containern namnet "web" |

### Stoppa och ta bort en container

```bash
docker stop web
docker rm web
```

*Terminal – stoppa och ta bort:*

```
$ docker stop web
web
$ docker rm web
web
```

## Bygga en egen image med Dockerfile

En **Dockerfile** beskriver hur en image ska byggas. Varje rad är ett steg. Här är ett enkelt exempel för en PHP-app med Nginx:

```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    && docker-php-ext-install pdo pdo_mysql

COPY default.conf /etc/nginx/sites-available/default
```

*Förklaring:*
*   `FROM` – basimage att bygga vidare på (här PHP 8.2 med PHP-FPM)
*   `RUN` – kör kommandon under bygget (installerar Nginx, PHP-extensions)
*   `COPY` – kopierar filer från byggkontexten till imagen

Bygg imagen:

```bash
docker build -t min-php-app .
```

*Terminal – bygg image:*

```
$ docker build -t min-php-app .
[+] Building 45.2s (8/8) FINISHED
 => [1/4] FROM docker.io/library/php:8.2-fpm
 => [2/4] RUN apt-get update && apt-get install -y nginx
 => [3/4] COPY default.conf /etc/nginx/sites-available/default
 => [4/4] COPY app/ /var/www/html
 => exporting to image
 => => naming to docker.io/library/min-php-app:latest
```

Flaggan `-t min-php-app` ger imagen ett taggnamn. Punkten `.` anger att byggkontexten är aktuell mapp.

## Docker Compose – flera containrar tillsammans

En PHP-app behöver ofta både webbserver, PHP och databas. **Docker Compose** låter dig definiera flera tjänster i en fil och starta dem tillsammans.

Skapa en fil `docker-compose.yml`:

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./app:/var/www/html
    depends_on:
      - php

  php:
    image: php:8.2-fpm
    volumes:
      - ./app:/var/www/html

  db:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: hemligt
      MYSQL_DATABASE: min_app
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:
```

```mermaid
flowchart LR
    subgraph Compose["Docker Compose"]
        W["web (Nginx)"]
        P["php (PHP-FPM)"]
        D["db (MariaDB)"]
    end
    
    W --> P
    P --> D
```

Starta alla tjänster:

```bash
docker compose up -d
```

*Terminal – starta med Compose:*

```
$ docker compose up -d
[+] Running 4/4
 ✔ Network min-app_default    Created
 ✔ Container min-app-db-1     Started
 ✔ Container min-app-php-1    Started
 ✔ Container min-app-web-1    Started
```

Stoppa och ta bort containrarna (volymen med databasen behålls):

```bash
docker compose down
```

### Viktiga begrepp i docker-compose.yml

| Nyckel | Betydelse |
|--------|-----------|
| `services` | Lista över tjänster (containrar) |
| `image` | Vilken image som ska användas |
| `ports` | Portmappning (värd:container) |
| `volumes` | Persistens – mappar eller namngivna volymer |
| `environment` | Miljövariabler (t.ex. databaslösenord) |
| `depends_on` | Startordning – "web" väntar på "php" |

## Volymer – spara data mellan körningar

Containrar är tillfälliga. När du tar bort en container försvinner allt innehåll. För att spara data (t.ex. databasfiler) använder du **volymer**:

```mermaid
flowchart TB
    subgraph Host["Värddator"]
        V["Volume dbdata"]
    end
    
    subgraph Container["Container"]
        M["MariaDB"]
    end
    
    M -->|Läser/skriver| V
```

*   **Namngiven volym** (`dbdata`): Docker hanterar lagringsplatsen. Data överlever `docker compose down`.
*   **Bind mount** (`./app:/var/www/html`): En mapp på värddatorn mappas in i containern. Bra för utveckling – ändringar i koden syns direkt.

## Sammanfattning

### Jämförelse: Hosting utan Docker vs med Docker

I förra lektionen installerade vi Nginx, PHP-FPM och MariaDB direkt på servern med `apt install` och `systemctl`. Med Docker paketeras samma komponenter i isolerade containrar:

```mermaid
flowchart TB
    subgraph Utan["Utan Docker - Lektion 2"]
        H1["Ubuntu Server"]
        N1["Nginx"]
        P1["PHP-FPM"]
        M1["MariaDB"]
        H1 --> N1
        H1 --> P1
        H1 --> M1
    end
    
    subgraph Med["Med Docker"]
        H2["Ubuntu Server"]
        D["Docker"]
        C1["Container Nginx"]
        C2["Container PHP-FPM"]
        C3["Container MariaDB"]
        H2 --> D
        D --> C1
        D --> C2
        D --> C3
    end
```

| Aspekt | Utan Docker | Med Docker |
|--------|-------------|------------|
| **Installation** | `apt install` för varje paket | `docker compose up` – ingen installation på värd |
| **Konfiguration** | Manuella filer (nginx, php.ini) | Definieras i Dockerfile och docker-compose.yml |
| **Isolering** | Alla tjänster delar samma system | Varje tjänst i egen container |
| **Återanvändning** | Svårt att replikera exakt miljö | Samma image körs identiskt överallt |
| **Start** | `systemctl start nginx php-fpm mariadb` | `docker compose up -d` |

| Kommando | Syfte |
|----------|-------|
| `docker run -d -p 8080:80 nginx` | Starta Nginx på port 8080 |
| `docker ps` | Lista körande containrar |
| `docker stop namn` | Stoppa en container |
| `docker build -t namn .` | Bygg image från Dockerfile |
| `docker compose up -d` | Starta alla tjänster i bakgrunden |
| `docker compose down` | Stoppa och ta bort containrar |

Docker gör det möjligt att definiera hela miljön (Nginx, PHP, MariaDB) som kod. I nästa lektion använder vi detta för att hosta PHP-applikationen från lektion 2 – utan att installera något manuellt på servern.
