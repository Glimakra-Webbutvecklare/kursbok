# Arbeta med GitHub: Ditt projekt i molnet

Vi har lärt oss hur Git fungerar lokalt på vår dator för att spåra ändringar. Men den verkliga styrkan med Git, särskilt för samarbete och säkerhetskopiering, kommer när vi kopplar vårt lokala repository till en **remoteserver**. Den mest populära plattformen för detta är **GitHub**.

> **Mål:**  
> Förstå hur du kopplar ett lokalt Git-repository till GitHub och använder de grundläggande kommandona för att skicka (`push`) och hämta (`pull`) ändringar.

**Förutsättning:**  
Du har ett gratis konto på [GitHub](https://github.com/). Om inte, skapa ett nu.

---

## Vad är GitHub?

GitHub är en webbaserad plattform för att lagra och hantera Git-repositories i molnet. Utöver lagring erbjuder GitHub:

- **Kodbackup:** Säkert lagra dina projekt online.
- **Samarbete:** Arbeta tillsammans i team, granska kod (Pull Requests) och diskutera ändringar.
- **Projekthantering:** Hantera ärenden (Issues), projekt-tavlor (Projects) och wikis.
- **Versionshantering:** Grafiskt gränssnitt för att se historik, jämföra versioner och utforska koden.
- **Open Source:** Hem för miljontals öppen källkods-projekt.

---

## Skapa ett Remote-repository på GitHub

1. Logga in på ditt GitHub-konto.
2. Klicka på "+"-ikonen uppe till höger och välj **New repository**.
3. Ge repositoryt ett namn (t.ex. `mitt-projekt`). Det är praktiskt om det matchar din lokala mapp, men det är inget krav.
4. Lägg till en kort beskrivning (valfritt).
5. Välj om det ska vara **Public** (synligt för alla) eller **Private** (endast för dig och inbjudna).
6. **Viktigt:** Om du redan har ett lokalt repository, **bocka INTE i** rutorna för "Add a README file", "Add .gitignore" eller "Choose a license". Om du skapar ett helt nytt projekt direkt på GitHub kan du bocka i dessa.
7. Klicka på **Create repository**.

---

## Koppla ditt lokala repo till GitHub

När du har skapat repositoryt på GitHub visas instruktioner. Leta efter avsnittet "…or push an existing repository from the command line".

### Steg 1: Lägg till remote-repository

```bash
git remote add origin https://github.com/ditt-anvandarnamn/mitt-projekt.git
```
- `origin` är standardnamnet för din remoteserver.
- Byt ut URL:en mot den du får från GitHub.

### Steg 2: Byt namn på huvudbranch (om nödvändigt)

```bash
git branch -M main
```
- Byter namn på din huvudbranch till `main` (standard på GitHub).

### Steg 3: Skicka upp din kod

```bash
git push -u origin main
```
- Skickar dina commits till GitHub.
- `-u` kopplar din lokala branch till remote-branchen, så att du senare kan använda bara `git push` och `git pull`.

Du kan behöva logga in eller autentisera dig mot GitHub (t.ex. med en personlig access token).

---

## Skicka fler ändringar: `git push`

När du gjort nya ändringar och committat dem:

```bash
git push
```
- Skickar alla nya commits på din nuvarande branch till GitHub.

---

## Hämta ändringar: `git pull`

Om någon annan (eller du själv från en annan dator) har pushat ändringar till GitHub, hämta dem så här:

```bash
git pull
```
- Hämtar och försöker automatiskt sammanfoga (`merge`) ändringarna från GitHub till din lokala kod.
- Kör gärna `git pull` innan du börjar arbeta och innan du pushar egna ändringar.

---

## Klona ett repository: `git clone`

Om du vill börja arbeta med ett projekt som redan finns på GitHub:

```bash
git clone https://github.com/anvandarnamn/projekt.git
```
- Laddar ner hela repositoryt (alla filer och historik) till en ny mapp på din dator.
- Sätter automatiskt upp `origin` så att du kan använda `git push` och `git pull`.

---

## Sammanfattning

GitHub är en plattform för att lagra och samarbeta kring Git-repositories i molnet. Genom att koppla ditt lokala repo till GitHub kan du:

- Skicka ändringar till GitHub med `git push`.
- Hämta ändringar från GitHub med `git pull`.
- Klona befintliga projekt med `git clone`.

Att använda Git tillsammans med GitHub är standard inom modern webbutveckling och gör det enkelt att samarbeta, säkerhetskopiera och visa upp dina projekt.

Nu är det dags att öva på dessa HTML- och Git-färdigheter!
