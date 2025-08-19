# Grundläggande Git-kommandon: Det dagliga arbetsflödet

Nu när vi förstår *varför* Git är användbart och känner till de grundläggande koncepten, är det dags att se hur vi använder det i praktiken. Detta görs via **kommandon** som vi skriver i terminalen (som vi installerade i kapitel 1).

> **Mål:**  
> Lära oss och förstå de vanligaste Git-kommandona för att skapa ett repository, spåra filer, spara ändringar (commits) och se status och historik.

**Förutsättning:**  
Du har Git installerat och konfigurerat (med ditt namn och e-post, se kapitel 1).

**Viktigt:**  
Alla Git-kommandon börjar med `git`. Kommandona körs i terminalen **inuti din projektmapp**.

---

## 0. Förstå hur man använder terminalen

Terminalen är ett textbaserat gränssnitt där du kör kommandon i den aktuella mappen. Här är grundkommandon du behöver:

### Grundläggande kommandon

- **pwd** – visar din nuvarande mapp (path).
  ```
  pwd
  ```

- **cd** – byt mapp (change directory).
  - `cd projekt` – gå in i mappen `projekt`
  - `cd ..` – gå upp en nivå
  - `cd ~` – gå till hemkatalogen
  - `cd -` – hoppa till föregående mapp

- **ls** – lista filer och mappar.
  - `ls` – enkel lista
  - `ls -la` – detaljerad lista, inkl. dolda filer
  - `ls -lh` – läsbar storlek

- **mkdir** – skapa mapp.
  - `mkdir ny-mapp`
  - `mkdir -p a/b/c` – skapa kedjade undermappar

- **touch** – skapa tom fil eller uppdatera tidsstämpel.
  - `touch index.html`

- **clear** – rensa terminalfönstret.
  - `clear` eller Ctrl+L

- **rm** – ta bort filer/mappar (var försiktig!).
  - `rm fil.txt`
  - `rm -r mapp/` – ta bort mapp rekursivt

- **mv** – flytta eller byta namn.
  - `mv gammalt.txt nytt.txt`
  - `mv fil.txt mapp/`

- **cp** – kopiera filer eller mappar.
  - `cp fil.txt kopia.txt`
  - `cp -r src/ backup-src/`

- **cat** – visa innehåll i en fil.
  - `cat README.md`

### Snabb övning
```bash
mkdir demo        # Skapa en ny mapp som heter 'demo'
cd demo          # Gå in i demo-mappen
pwd              # Visa nuvarande sökväg/mapp
touch index.html # Skapa en tom fil som heter 'index.html'
ls -la          # Lista alla filer (även dolda) med detaljerad information
mkdir -p src/components  # Skapa mapparna 'src' och 'components' på en gång
mv index.html src/      # Flytta index.html till src-mappen
cp -r src src-backup   # Kopiera hela src-mappen rekursivt till en backup
clear                  # Rensa terminalfönstret
```

### Windows-notis
- I Git Bash på Windows fungerar kommandona ovan som i macOS/Linux.
- I PowerShell: `ls` fungerar (alias), `pwd` fungerar, `clear` kan skrivas `cls`, `touch` kan ersättas med `New-Item filnamn`.

Tips: Använd Tab för autocompletion, pilar upp/ner för historik och Ctrl+C för att avbryta.

## 1. Skapa ett repository: `git init`

Det allra första steget för ett *nytt* projekt är att initiera ett Git-repository.

- **Kommando:**  
  `git init`
- **Vad det gör:**  
  Skapar en ny, dold undermapp `.git` i din nuvarande mapp. Denna `.git`-mapp innehåller all information och historik för ditt repository. Detta behöver bara göras *en gång* per projekt.

**Så här gör du:**
1. Skapa en ny mapp för ditt projekt (t.ex. `mitt-projekt`).
2. Navigera in i mappen i din terminal (`cd mitt-projekt`).
3. Kör kommandot:  
   ```
   git init
   ```
   Du bör se ett meddelande som liknar:  
   `Initialized empty Git repository in /path/to/your/mitt-projekt/.git/`

---

## 2. Kontrollera status: `git status`

Detta är ett av de viktigaste och mest använda kommandona. Det visar det aktuella tillståndet för ditt repository.

- **Kommando:**  
  `git status`
- **Vad det gör:**  
  Talar om:
  - Vilken branch du är på.
  - Om det finns ändringar i Working Directory som *inte* är i Staging Area.
  - Om det finns filer i Staging Area som väntar på att committas.
  - Om det finns filer som Git inte spårar alls (untracked files).

**Så här gör du:**
1. Skapa en ny fil i din projektmapp, t.ex. `index.html`.
2. Kör `git status` i terminalen.
   Du kommer se att `index.html` listas under "Untracked files", eftersom Git ser filen men inte spårar ändringar i den än.

---

## 3. Lägga till filer i Staging Area: `git add`

Innan du kan spara en ändring (committa) måste du tala om för Git *vilka* ändringar som ska inkluderas. Detta görs genom att lägga till dem i Staging Area.

- **Kommandon:**
  - `git add <filnamn>`: Lägger till en specifik fil (t.ex. `git add index.html`).
  - `git add .` : Lägger till **alla** nya och ändrade filer i den nuvarande mappen och dess undermappar till Staging Area. (Punkten `.` representerar nuvarande mapp). **Används ofta.**
- **Vad det gör:**  
  Flyttar ändringarna från Working Directory till Staging Area, redo för nästa commit.

**Så här gör du:**
1. Se till att du har skapat `index.html`.
2. Kör `git add index.html` (eller `git add .`).
3. Kör `git status` igen.
   Nu bör du se `index.html` listad under "Changes to be committed".

---

## 4. Spara ändringar: `git commit`

När du har lagt till de ändringar du vill spara i Staging Area, skapar du en commit.

- **Kommando:**  
  `git commit -m "Ditt commit-meddelande"`
- **Vad det gör:**  
  Tar en ögonblicksbild av alla filer som finns i Staging Area och sparar den permanent i `.git`-mappens historik. Varje commit måste ha ett **commit-meddelande** (efter `-m`) som kortfattat beskriver *vad* ändringen handlar om (t.ex. "Skapa grundläggande HTML-struktur", "Lägg till bildlänk").
  - **Bra commit-meddelanden är viktiga!** De ska vara korta, beskrivande och skrivna i imperativ (t.ex. "Lägg till bild..." istället för "Lade till bilden...").

**Så här gör du:**
1. Se till att du har kört `git add`.
2. Kör  
   ```
   git commit -m "Skapa tom index.html-fil"
   ```
3. Kör `git status` igen.
   Nu bör det stå något i stil med "nothing to commit, working tree clean", vilket betyder att alla spårade ändringar är sparade.

---

## 5. Visa historik: `git log`

För att se listan över alla commits som gjorts i projektet.

- **Kommando:**  
  `git log`
- **Vad det gör:**  
  Visar historiken med den senaste committen överst. För varje commit visas dess unika ID (en lång hash-sträng), författaren, datumet och commit-meddelandet.
  - Tryck `q` för att avsluta loggvisningen om den är lång.
  - `git log --oneline`: Visar en mer kompakt vy med bara commit-ID och meddelande.

**Så här gör du:**
1. Gör en ändring i `index.html` (lägg till lite text).
2. Kör `git add .`
3. Kör  
   ```
   git commit -m "Lägg till innehåll i index.html"
   ```
4. Kör `git log` (eller `git log --oneline`).
   Du bör nu se dina två commits i historiken.

---

## Sammanfattning: Det grundläggande arbetsflödet

Det typiska arbetsflödet när du arbetar med Git lokalt ser ut så här:

1. **Gör ändringar** i dina projektfiler.
2. **Kontrollera status** med `git status` för att se vilka filer som ändrats.
3. **Lägg till ändringar** i Staging Area med `git add <filnamn>` eller `git add .`.
4. **Spara ändringarna** permanent med `git commit -m "Beskrivande meddelande"`.
5. (Upprepa)

Du kan när som helst använda `git log` för att se historiken och `git status` för att se det aktuella läget.

Dessa kommandon (`init`, `status`, `add`, `commit`, `log`) utgör grunden för att arbeta med Git. I nästa avsnitt tittar vi på hur vi kan koppla vårt lokala repository till en remote server som GitHub.
