# Tekniska intervjufrågor: Git

Frågor om Git är mycket vanliga på intervjuer för utvecklarjobb. Nedan finns exempel som testar både förståelse och praktisk kunskap. Använd dem för att repetera kapitlet och förbereda dig.

---

## Fråga 1: Grundläggande begrepp

**Fråga:** "Förklara skillnaden mellan en *commit*, en *branch* och ett *repository*. Ge ett exempel på när du använder var och en."

**Förslag till svar:**
- **Repository:** En mapp som innehåller alla filer och hela versionshistoriken för ett projekt – projektets "hem".
- **Commit:** En sparad ögonblicksbild av projektet vid en viss tidpunkt, med ett beskrivande meddelande. Som ett foto av tillståndet.
- **Branch:** En parallell utvecklingslinje där du kan arbeta utan att påverka huvudkoden.

**Exempel:** I ett repository för en webbsida skapar du en branch för en ny funktion, gör flera commits medan du utvecklar, och mergar tillbaka till `main` när du är klar.

---

## Fråga 2: Arbetsflödet

**Fråga:** "Beskriv steg för steg vad som händer när du kör `git add .`, `git commit -m "Fix bug"` och `git push`."

**Förslag till svar:**
1. **`git add .`** – lägger alla ändrade filer i staging area, förberedda för commit (men inte sparade än).
2. **`git commit -m "Fix bug"`** – sparar ändringarna från staging som en ny commit i den lokala historiken.
3. **`git push`** – skickar de nya commitsen till remote-repositoryt (t.ex. GitHub) så andra kan se dem.

---

## Fråga 3: Staging area

**Fråga:** "Varför finns staging area? Vad är skillnaden mellan working directory, staging area och repository?"

**Förslag till svar:**
Staging area låter dig välja *exakt* vilka ändringar som ska med i nästa commit, vilket ger kontroll.

- **Working directory:** Filerna du ser och redigerar.
- **Staging area:** Mellanlagret där du förbereder ändringar.
- **Repository:** Den sparade historiken i `.git`-mappen.

**Fördel:** Du kan jobba på flera saker samtidigt men committa dem separat genom att bara stagea relevanta filer.

---

## Fråga 4: Ångra ändringar

**Fråga:** "Du har råkat committa fel kod lokalt men inte pushat än. Hur ångrar du senaste committen, och vad skiljer de olika sätten?"

**Förslag till svar:**
- **`git reset --soft HEAD~1`** – ångrar committen, behåller ändringarna i staging.
- **`git reset --mixed HEAD~1`** (standard) – ångrar committen och tömmer staging, behåller filerna.
- **`git reset --hard HEAD~1`** – ångrar committen och raderar ändringarna helt (farligt!).
- **`git revert HEAD`** – skapar en ny commit som upphäver den förra (säkrast om committen redan är pushad).

**Regel:** Använd `reset` för lokala commits, `revert` för commits som redan delats med andra.

---

## Fråga 5: Merge-konflikt

**Fråga:** "Du gör `git merge` (eller `git pull`) och får 'merge conflict'. Vad har hänt och hur löser du det?"

**Förslag till svar:**
**Vad som hänt:** Två brancher har ändrat samma rader i samma fil, så Git vet inte vilken version som ska behållas.

**Lösning:**
1. Öppna den konfliktmarkerade filen.
2. Leta efter markeringarna `<<<<<<<`, `=======` och `>>>>>>>`.
3. Bestäm vilken kod som ska vara kvar (eller kombinera dem).
4. Ta bort konfliktmarkeringarna.
5. `git add` den fixade filen.
6. `git commit` för att slutföra mergen.

---

## Fråga 6: Branch och merge

**Fråga:** "Varför arbetar man med brancher? Beskriv ett typiskt flöde för att utveckla en ny funktion."

**Förslag till svar:**
Brancher låter dig utveckla nytt utan att riskera den fungerande koden i `main`, och gör det möjligt för flera personer att jobba parallellt.

**Typiskt flöde:**
```bash
git switch -c ny-funktion   # skapa och byt till branch
# ... gör ändringar och committa ...
git switch main             # gå tillbaka till main
git merge ny-funktion       # slå ihop
git branch -d ny-funktion   # ta bort branchen
```

---

## Fråga 7: .gitignore

**Fråga:** "Du märker att `node_modules`-mappen committas av misstag. Hur fixar du det och förhindrar att det händer igen?"

**Förslag till svar:**
1. Skapa en `.gitignore`-fil i projektets root.
2. Lägg till `node_modules/` i den.
3. Ta bort mappen från Git utan att radera den lokalt:
   ```bash
   git rm -r --cached node_modules/
   git commit -m "Sluta spåra node_modules"
   ```

Vanliga mönster i `.gitignore`:
```
node_modules/
.env
*.log
dist/
.DS_Store
```

`.gitignore` ska committas så hela teamet har samma regler. Detta är även en **säkerhetsfråga** – `.env` med lösenord och nycklar ska aldrig hamna i ett repo.

---

## Tips för tekniska intervjuer

- **Förklara din tankeprocess** medan du svarar.
- **Använd konkreta exempel** från egna projekt när du kan.
- **Erkänn om du inte vet** – och beskriv hur du skulle ta reda på svaret.
- **Ställ följdfrågor** för att förstå vad intervjuaren är ute efter.
