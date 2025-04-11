# Arbeta med GitHub: Ditt Projekt i Molnet

Vi har lärt oss hur Git fungerar lokalt på vår dator för att spåra ändringar. Men den verkliga styrkan med Git, särskilt för samarbete och säkerhetskopiering, kommer när vi kopplar vårt lokala repository till en **fjärrserver** (remote repository). Den mest populära plattformen för detta är **GitHub**.

**Vad är GitHub?** GitHub är en webbaserad plattform som erbjuder hosting för Git-repositories. Det är mycket mer än bara lagring; det är en social plattform för utvecklare med funktioner för:

*   **Kodlagring och Backup:** Spara dina Git-repositories säkert i molnet.
*   **Samarbete:** Enkla verktyg för att arbeta tillsammans i team, granska kod (Pull Requests) och diskutera ändringar.
*   **Projekthantering:** Verktyg som ärendehantering (Issues), projekt-tavlor (Projects) och wikis.
*   **Versionshantering:** Ett grafiskt gränssnitt för att se historik, jämföra versioner och utforska koden.
*   **Open Source:** Hemmet för miljontals öppen källkods-projekt.

**Mål:** Förstå hur man kopplar ett lokalt Git-repository till GitHub och använder de grundläggande kommandona för att skicka (`push`) och hämta (`pull`) ändringar.

**Förutsättning:** Du har ett gratis konto på [GitHub](https://github.com/). Om inte, skapa ett nu.

## Skapa ett Fjärr-Repository på GitHub

1.  Logga in på ditt GitHub-konto.
2.  Klicka på "+"-ikonen uppe till höger och välj "New repository".
3.  Ge ditt repository ett namn (t.ex. `mitt-projekt`, samma som din lokala mapp är bra men inte nödvändigt).
4.  Lägg till en kort beskrivning (valfritt).
5.  Välj om det ska vara **Public** (synligt för alla) eller **Private** (bara synligt för dig och de du bjuder in).
6.  **VIKTIGT:** **Bocka INTE i** rutorna för "Add a README file", "Add .gitignore" eller "Choose a license" om du redan har ett lokalt repository som du vill koppla. Om du skapar ett helt nytt projekt direkt på GitHub kan du bocka i dessa.
7.  Klicka på "Create repository".

## Koppla Lokalt Repo till Fjärr-Repo

När du har skapat repositoryt på GitHub visas en sida med instruktioner. Vi är intresserade av avsnittet "…or push an existing repository from the command line".

*   **Kommando 1: `git remote add origin <URL>`**
    *   **Vad det gör:** Talar om för ditt lokala Git-repo att det finns ett fjärr-repo och var det finns. `origin` är standardnamnet (en alias) för din huvudsakliga fjärrserver. `<URL>` är den unika adressen till ditt GitHub-repository (ser ut ungefär som `https://github.com/ditt-anvandarnamn/mitt-projekt.git`).
    *   Kopiera URL:en från GitHub-sidan.
    *   Kör kommandot i din terminal (i projektmappen): `git remote add origin https://github.com/ditt-anvandarnamn/mitt-projekt.git` (byt ut URL:en!).

*   **Kommando 2: `git branch -M main`** (Kan behövas)
    *   **Vad det gör:** Byter namn på din standardbranch till `main`. Historiskt sett hette den ofta `master`, men `main` är nu den vanligaste standarden på GitHub och i Git-världen. Om din lokala branch redan heter `main` kan detta steg hoppas över eller ger ingen effekt.
    *   Kör kommandot: `git branch -M main`

*   **Kommando 3: `git push -u origin main`**
    *   **Vad det gör:** Skickar (`push`) dina lokala commits från din `main`-branch till fjärr-repositoryt (`origin`).
    *   Flaggan `-u` (står för `--set-upstream`) skapar en koppling mellan din lokala `main`-branch och `origin/main` på fjärrservern. Detta behöver bara göras *första gången* du pushar en ny branch. Nästa gång räcker det med `git push`.
    *   Kör kommandot: `git push -u origin main`
    *   Du kan behöva autentisera dig mot GitHub (antingen via en dialogruta eller genom att skriva in användarnamn och lösenord/token i terminalen, beroende på din konfiguration).

Nu ska du kunna gå till din repository-sida på GitHub och se dina filer och commit-historik där!

## Skicka Fler Ändringar: `git push`

När du har gjort fler lokala ändringar och committat dem (`git add .` följt av `git commit -m "..."`), använder du `git push` för att skicka de nya commitsen till GitHub.

*   **Kommando:** `git push`
*   **Vad det gör:** Skickar alla nya commits på din nuvarande lokala branch (`main`) till motsvarande branch (`main`) på fjärrservern (`origin`), förutsatt att du använt `-u` tidigare.

## Hämta Ändringar: `git pull`

Om någon annan (eller du själv från en annan dator) har gjort ändringar och pushat dem till GitHub, behöver du hämta dessa ändringar till ditt lokala repository.

*   **Kommando:** `git pull`
*   **Vad det gör:** Hämtar (`fetch`) ändringarna från fjärrservern (`origin`) för din nuvarande branch och försöker sedan automatiskt sammanfoga (`merge`) dem med din lokala kod.
*   Det är bra att köra `git pull` regelbundet, särskilt innan du börjar arbeta och innan du pushar dina egna ändringar, för att säkerställa att du har den senaste versionen.

## Klona ett Repository: `git clone`

Om ett projekt redan finns på GitHub (eller en annan fjärrserver) och du vill börja arbeta med det lokalt, använder du `git clone`.

*   **Kommando:** `git clone <URL>`
*   **Vad det gör:** Laddar ner hela repositoryt (alla filer och hela historiken) från den angivna URL:en till en ny mapp på din dator. Den sätter också automatiskt upp `origin` så att du direkt kan börja använda `push` och `pull`.

## Sammanfattning

GitHub är en plattform för att hosta Git-repositories i molnet, vilket möjliggör backup och samarbete. Genom att skapa ett repository på GitHub och koppla det till ditt lokala repo med `git remote add origin <URL>` kan du:

*   Skicka dina lokala ändringar till GitHub med `git push`.
*   Hämta ändringar från GitHub till din lokala dator med `git pull`.
*   Skapa en lokal kopia av ett befintligt GitHub-repo med `git clone <URL>`.

Att använda Git tillsammans med en plattform som GitHub är standardpraxis inom modern webbutveckling.

Nu är det dags att öva på dessa HTML- och Git-färdigheter!
