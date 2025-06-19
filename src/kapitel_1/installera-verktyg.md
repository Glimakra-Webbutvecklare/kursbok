# Installera och Konfigurera Verktyg

Nu när vi har en översikt över vad webbutveckling är och vilka verktyg som används, är det dags att sätta upp vår egen grundläggande utvecklingsmiljö. Vi behöver några centrala verktyg för att kunna skriva kod, spara dess historik och köra kommandon.

**Mål:** I detta avsnitt ser vi till att du har följande installerat och redo att användas:

1.  **Visual Studio Code (VS Code):** En modern och kraftfull texteditor.
2.  **Git:** För versionshantering av vår kod.
3.  **En Terminal:** För att interagera med datorn via kommandon.

## 1. Visual Studio Code (VS Code)

VS Code är en gratis, populär och mycket utbyggbar kod-editor från Microsoft. Den fungerar på Windows, macOS och Linux.

*   **Varför VS Code?** Den har inbyggt stöd för många språk (inklusive HTML, CSS, JavaScript, PHP), bra integration med Git, en stor marknadsplats för tillägg (extensions) och är relativt resurssnål.

*   **Installation:**
    1.  Gå till den officiella webbplatsen: [https://code.visualstudio.com/](https://code.visualstudio.com/)
    2.  Ladda ner installationsprogrammet för ditt operativsystem (Windows, macOS, Linux).
    3.  Kör installationsprogrammet och följ instruktionerna. Acceptera standardinställningarna om du är osäker.

*   **Grundläggande konfiguration:**
    *   **Svenskt språkpaket (ej rekommenderat):** Engleska är det universala språket inom programmering. Majoriteten av arbetsplatser använder språket för all kommunikation. Men om du bara vill komma igång med programmering och Svenska fungerar mycket bättre. Öppna VS Code. Tryck på `Ctrl+Shift+P` (eller `Cmd+Shift+P` på Mac) för att öppna kommandopaletten. Skriv `Configure Display Language`, välj det och sedan `Install additional languages...`. Sök efter `Swedish Language Pack for Visual Studio Code` och installera det. Starta om VS Code när du uppmanas.
    *   **Utforska tillägg (Extensions):** Klicka på ikonen för tillägg i sidopanelen (ser ut som fyra rutor, en separerad). Här kan du söka efter och installera tillägg som kan underlätta ditt arbete. Några populära för webbutveckling är:
        *   `Prettier - Code formatter`: Formaterar din kod automatiskt.
        *   `Live Server`: Startar en lokal utvecklingsserver med live-reload för statiska sidor.
        *   `PHP Intelephense`: Ger bättre kodkomplettering och analys för PHP. (Kan göras senare)

## 2. Git

Git är ett distribuerat versionshanteringssystem. Det låter dig spara ögonblicksbilder (commits) av din kod, gå tillbaka till tidigare versioner, skapa olika utvecklingsgrenar (branches) och samarbeta med andra.

*   **Varför Git?** Det är industristandard och en fundamental färdighet för alla utvecklare. Det hjälper dig att:
    *   Hålla ordning på ändringar.
    *   Undvika att förlora arbete.
    *   Experimentera säkert med ny kod.
    *   Samarbeta på projekt (ofta via plattformar som GitHub).

*   **Installation:**
    *   **Windows:** Ladda ner och installera *Git for Windows* från [https://git-scm.com/download/win](https://git-scm.com/download/win). Under installationen, välj de rekommenderade inställningarna om du är osäker. Se till att Git kan användas från kommandotolken (ofta standardvalet). `Git Bash` kommer också installeras, vilket ger dig en bra terminalmiljö.
    *   **macOS:** Git är ofta förinstallerat. Öppna Terminalen (Program > Verktygsprogram > Terminal) och skriv `git --version`. Om du får ett versionsnummer är det installerat. Annars kan du installera det via Xcode Command Line Tools (kör `xcode-select --install` i Terminalen) eller ladda ner det från [https://git-scm.com/download/mac](https://git-scm.com/download/mac).
    *   **Linux (Debian/Ubuntu):** Öppna terminalen och kör: `sudo apt update && sudo apt install git`
    *   **Linux (Fedora):** Öppna terminalen och kör: `sudo dnf install git`

*   **Grundläggande konfiguration (Gör detta efter installation!):**
    Öppna din terminal (Terminal på Mac/Linux, Git Bash eller Kommandotolken/PowerShell på Windows) och kör följande kommandon, men byt ut namnet och e-postadressen mot dina egna. Dessa används för att identifiera vem som gjort ändringarna i Git.
    ```bash
    git config --global user.name "Ditt Namn"
    git config --global user.email "din.epost@example.com"
    ```

## 3. Terminalen / Kommandotolken

Terminalen (även kallad kommandotolk, shell, command line) är ett textbaserat gränssnitt där du kan skriva kommandon för att interagera med ditt operativsystem och olika program (som Git).

*   **Varför Terminalen?** Många utvecklingsverktyg och processer (som att köra Git-kommandon, installera paket, starta servrar) hanteras effektivt via terminalen. Det är ett kraftfullt verktyg att bli bekväm med.

*   **Vilken ska jag använda?**
    *   **macOS:** Använd den inbyggda `Terminal`-appen (finns i `/Applications/Utilities/` eller `/Program/Verktygsprogram/`).
    *   **Linux:** Använd den terminalemulator som följer med din distribution (t.ex. GNOME Terminal, Konsole).
    *   **Windows:**
        *   **Git Bash:** Installeras med Git for Windows och ger en Unix-liknande miljö, vilket ofta är att föredra för webbutveckling.
        *   **Windows Terminal:** En modern terminalapp från Microsoft som kan köra PowerShell, Kommandotolken (cmd) och WSL. Rekommenderas om du vill ha en mer modern Windows-upplevelse. Kan installeras från Microsoft Store.
        *   **WSL (Windows Subsystem for Linux):** Låter dig köra en riktig Linux-miljö direkt på Windows. Lite mer avancerat att sätta upp, men väldigt kraftfullt för webbutveckling. (Se [Microsofts WSL-dokumentation](https://learn.microsoft.com/en-us/windows/wsl/install) för installationsguide).

*   **Testa:** Öppna din valda terminal och prova att skriva `git --version`. Om du ser ett versionsnummer fungerar både terminalen och Git-installationen!

## Sammanfattning

Du bör nu ha installerat och grundkonfigurerat **Visual Studio Code** för att skriva kod, **Git** för att hantera kodens historik, och ha tillgång till en **Terminal** för att köra kommandon. Dessa tre verktyg utgör grunden i vår utvecklingsmiljö för denna kurs.

I nästa kapitel börjar vi använda dessa verktyg när vi dyker ner i HTML och lär oss grunderna i Git.
