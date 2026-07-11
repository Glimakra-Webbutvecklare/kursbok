# Praktiska övningar: Git

Bästa sättet att lära sig Git är att använda det på riktigt. Gör övningarna nedan **i din egen terminal** på datorn – simuleringarna i lektionerna var uppvärmning, här sker det på riktigt.

Vi fortsätter med **`portfolio-site`** om du redan följt lektionerna. Annars skapar du projektet här från början.

> **Mål:**  
> Versionshantera `portfolio-site` från första committen till push på GitHub, samt öva på brancher och merge.

**Förutsättningar:** Git installerat och inställt (namn + e-post), samt ett GitHub-konto.

---

## Övning 1: Versionera portfolio-site

1. Skapa projektmappen (hoppa över om du redan har den från lektionerna):
   ```bash
   mkdir portfolio-site
   cd portfolio-site
   ```
2. Initiera Git och skapa en fil:
   ```bash
   git init
   touch index.html
   ```
3. Skriv några rader HTML i `index.html` (i din editor).
4. Kontrollera läget, lägg till filen och gör din första commit:
   ```bash
   git status
   git add index.html
   git commit -m "Lägg till startsida"
   ```
5. Gör en ändring i filen och committa igen med ett beskrivande meddelande.
6. Visa historiken:
   ```bash
   git log --oneline
   ```
   Du bör nu se minst två commits.

**Checkpoint:** `git status` visar *working tree clean* och `git log --oneline` visar dina commits.

---

## Övning 2: Öva på att ångra

1. Gör en ändring i `index.html` som du *inte* vill behålla.
2. Ångra ändringen och återställ filen:
   ```bash
   git restore index.html
   ```
3. Skapa en ny fil, lägg till den i staging och ta sedan ut den igen:
   ```bash
   touch temp.txt
   git add temp.txt
   git restore --staged temp.txt
   ```
4. Committa något, och ångra sedan committen men behåll ändringarna:
   ```bash
   git reset --soft HEAD~1
   ```
   Kontrollera med `git status` att ändringarna ligger kvar i staging.

**Checkpoint:** Du kan förklara skillnaden mellan `git restore` och `git restore --staged` med ett konkret exempel från övningen.

---

## Övning 3: Brancher och merge

1. Skapa och byt till en ny branch:
   ```bash
   git switch -c about-page
   ```
2. Skapa `about.html` (eller ändra `index.html`) och committa på branchen.
3. Byt tillbaka till `main` och slå ihop:
   ```bash
   git switch main
   git merge about-page
   ```
4. Lista historiken och se att ändringen från branchen nu finns i `main`:
   ```bash
   git log --oneline --graph
   ```

**Bonus – skapa en konflikt med flit:** Följ miniövningen i [Brancher och merge](./brancher-och-merge.md): ändra samma rad på `main` och en ny branch, merga, redigera bort konfliktmarkeringarna, och slutför med `git add` + `git commit`.

**Checkpoint:** Du har löst minst en merge-konflikt, eller kan förklara steg-för-steg hur du skulle göra det.

---

## Övning 4: Koppla till GitHub

1. Skapa ett nytt, **tomt** repository på GitHub med namnet `portfolio-site` (utan README/.gitignore/license).
2. Koppla ditt lokala repo och pusha (byt ut URL:en mot din egen):
   ```bash
   git remote add origin https://github.com/ditt-anvandarnamn/portfolio-site.git
   git branch -M main
   git push -u origin main
   ```
3. Gå till repot på GitHub och verifiera att dina filer och commits syns.
4. Gör en ny ändring lokalt, committa och pusha:
   ```bash
   git add .
   git commit -m "Uppdatera portfolio"
   git push
   ```
5. Uppdatera GitHub-sidan och kontrollera att ändringen kom upp.

**Checkpoint:** Du ser samma commits på GitHub som i `git log --oneline` lokalt.

---

## Sammanfattning

Du har nu versionshanterat `portfolio-site` lokalt, övat på att ångra, jobbat med brancher och merge, och synkroniserat med GitHub. Det här arbetsflödet kommer du använda i varje kommande projekt i kursen. Fortsätt att committa ofta och med tydliga meddelanden – det blir en vana som lönar sig.
