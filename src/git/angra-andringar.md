# Ångra och rätta till

Alla gör misstag – ändrar fel fil, glömmer något i en commit, eller skriver fel commit-meddelande. Det fina med Git är att nästan allt går att rätta till. Vi fortsätter i **`portfolio-site`** och tittar på de vanligaste och tryggaste sätten att ångra.

> **Mål:**  
> Kunna ångra ändringar på fyra nivåer: i arbetsmappen, i staging, i senaste committen, och i ett commit-meddelande.

**Förutsättning:** Du kan kärnflödet `add`/`commit` från [Dina första commits](./forsta-commits.md) och har minst en commit i `portfolio-site`.

---

## Fyra vanliga "oj"-situationer

| Situation | Kommando | Var ändringen rullas tillbaka |
| --- | --- | --- |
| Ändrade en fil men vill ha tillbaka senast sparade version | `git restore <fil>` | Working directory |
| Lade till en fil i staging av misstag | `git restore --staged <fil>` | Staging area |
| Committade för tidigt, vill lägga till mer | `git reset --soft HEAD~1` | Senaste committen |
| Skrev fel i commit-meddelandet | `git commit --amend -m "..."` | Commit-meddelandet |

Vi går igenom dem en i taget.

---

## 1. Ångra ändringar i en fil – `git restore`

Du har redigerat `index.html` men ångrar dig och vill ha tillbaka den senast committade versionen.

```bash
git restore index.html
```

Detta kastar dina *osparade* ändringar i den filen och återställer den till hur den såg ut i senaste committen.

> **Lägeskollen efter `git restore index.html`:**
>
> | Working directory | Staging area | Historik |
> | --- | --- | --- |
> | Filen matchar senaste commit | Oförändrad | Oförändrad |

> **Varning:** Ändringar du kastar med `git restore` är borta – de fanns aldrig i någon commit, så Git kan inte få tillbaka dem. Använd bara när du är säker.

<!-- terminal -->
```bash
$ git status
On branch main
Changes not staged for commit:
  modified:   index.html
$ git restore index.html
$ git status
On branch main
nothing to commit, working tree clean
```

> **Kör nu i din riktiga terminal:** Ändra något i `index.html` utan att committa. Kör `git restore index.html` och öppna filen – ändringen ska vara borta.

---

## 2. Ta bort en fil från staging – `git restore --staged`

Du körde `git add` men inser att filen inte borde vara med i nästa commit. Du vill ta ut den ur staging – men *behålla* dina ändringar i filen.

```bash
git restore --staged secret.txt
```

Filen ligger nu kvar i din arbetsmapp precis som den var, men är inte längre förberedd för commit. Inga ändringar går förlorade.

> **Lägeskollen efter `git restore --staged secret.txt`:**
>
> | Working directory | Staging area | Historik |
> | --- | --- | --- |
> | `secret.txt` finns kvar | Filen borttagen härifrån | Oförändrad |

**Prova själv:** Lägg till två filer, ångra den ena ur staging, och se hur statusen ändras.

<!-- terminal -->
```bash
$ git add index.html secret.txt
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   index.html
        new file:   secret.txt
$ git restore --staged secret.txt
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   index.html

Untracked files:
        secret.txt
```

> **Kör nu i din riktiga terminal:** Skapa en fil `temp.txt`, kör `git add temp.txt`, sedan `git restore --staged temp.txt`. Kör `git status` – filen ska finnas kvar men inte ligga i staging.

> **Vanliga misstag**
>
> - **Blandar ihop `git restore` och `git restore --staged`** → den ena raderar filändringar, den andra tar bara bort från staging. Läs tabellen i början av lektionen innan du kör.
> - **Committar en hemlig fil av misstag** → t.ex. `.env` eller lösenord. Åtgärd: ta bort från staging med `git restore --staged` *innan* du committar. Har du redan committat lokalt: `git reset --soft HEAD~1` och lägg till filen i `.gitignore`.

---

## 3. Ångra senaste committen men behåll arbetet – `git reset --soft`

Du committade men inser att du glömde `about.html`, eller vill dela upp committen. `git reset --soft HEAD~1` tar bort den *senaste* committen men låter alla ändringar ligga kvar i staging, redo att committas om.

```bash
git reset --soft HEAD~1
```

- `HEAD` betyder "den commit du står på just nu". `HEAD~1` betyder "en commit bakåt".
- `--soft` rör inte dina filer – bara själva committen tas bort.

> **Lägeskollen efter `git reset --soft HEAD~1`:**
>
> | Working directory | Staging area | Historik |
> | --- | --- | --- |
> | Oförändrad | Allt från committen ligger kvar här | Senaste committen borttagen |

**Prova själv:** Ångra senaste committen, lägg till en till fil och committa allt på nytt.

<!-- terminal -->
```bash
$ git reset --soft HEAD~1
$ git add about.html
$ git commit -m "Lägg till startsida och om-sida"
[main e5f6a7b] Lägg till startsida och om-sida
 2 files changed, 10 insertions(+)
```

> **Kör nu i din riktiga terminal:** Committa något i `portfolio-site`, kör `git reset --soft HEAD~1`, och kontrollera med `git status` att ändringarna fortfarande ligger i staging.

### De tre reset-lägena (kort)

`git reset` finns i tre varianter. Skillnaden är *hur långt* tillbaka ändringarna rullas:

- **`--soft`** – tar bort committen, **behåller** staging och filer. (Tryggast.)
- **`--mixed`** (standard) – tar bort committen och tömmer staging, men **behåller** dina filer.
- **`--hard`** – tar bort committen **och raderar** alla ändringar i filerna.

> **⚠️ Säkerhet – `--hard` raderar arbete permanent:**  
> `git reset --hard` kastar dina ändringar utan att fråga, och osparat arbete går då inte att få tillbaka. Som nybörjare ska du i princip alltid använda `--soft` eller `--mixed`. Rör bara `--hard` när du är *helt* säker på att du vill slänga allt.

---

## 4. Rätta commit-meddelandet – `git commit --amend`

Du råkade stava fel i ditt senaste commit-meddelande. Så länge du **inte har pushat** committen kan du skriva om den:

```bash
git commit --amend -m "Lägg till startsida"
```

Detta ersätter den senaste committen med en ny som har rätt meddelande.

> **Viktigt:** Ändra bara commits som du *inte* har delat med andra (pushat till GitHub). Att skriva om historik som andra redan hämtat skapar förvirring. Mer om det i [Git och GitHub](./github.md).

> **Kör nu i din riktiga terminal:** Gör en commit med ett medvetet dåligt meddelande (t.ex. "asdf"). Kör `git commit --amend -m "Bättre meddelande"` och kontrollera med `git log --oneline` att det uppdaterades.

---

## 5. Ångra en commit som redan är pushad – `git revert`

Har en commit redan skickats till GitHub och andra kan ha hämtat den? Skriv då **inte** om historiken med `reset` eller `--amend`. Använd `git revert` i stället. Kommandot skapar en ny commit som tar tillbaka ändringen, utan att ändra den delade historiken.

```bash
git revert HEAD
```

`HEAD` betyder den senaste committen. Git öppnar normalt en editor för ett commit-meddelande; spara meddelandet för att slutföra.

<!-- terminal -->
```bash
$ git log --oneline -2
b2c3d4e Lägg till röd bakgrund
a1b2c3d Skapa startsida
$ git revert HEAD
[main c3d4e5f] Revert "Lägg till röd bakgrund"
 1 file changed, 1 insertion(+), 1 deletion(-)
$ git log --oneline -3
c3d4e5f Revert "Lägg till röd bakgrund"
b2c3d4e Lägg till röd bakgrund
a1b2c3d Skapa startsida
```

> **Regel:** Använd `reset` och `--amend` för lokala commits som inte är pushade. Använd `revert` för commits som redan är delade.

---

## Checkpoint

Innan du går vidare, kontrollera att du kan:

- [ ] Förklara skillnaden mellan `git restore` och `git restore --staged`.
- [ ] Ta bort en fil ur staging utan att radera filen.
- [ ] Ångra en lokal commit med `--soft` och committa om med fler filer.
- [ ] Rätta ett commit-meddelande med `--amend` (utan att ha pushat).
- [ ] Förklara varför `git revert` är säkert för en commit som redan är pushad.

---

## Sammanfattning

Git ger dig flera trygga sätt att ångra: `git restore` tar tillbaka filer, `git restore --staged` tömmer staging, `git reset --soft` ångrar en lokal commit men behåller arbetet, `git commit --amend` rättar senaste lokala meddelandet och `git revert` ångrar en delad commit med en ny commit. Det enda kommandot du behöver vara rädd för är `git reset --hard` – det raderar arbete på riktigt. I nästa lektion lär vi oss arbeta parallellt med **brancher** (grenar) och **merge** (sammanfogning).
