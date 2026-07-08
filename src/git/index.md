# Git och versionshantering

Föreställ dig att du arbetar på ett projekt i flera veckor. En dag råkar du ändra något som förstör halva sidan – men du minns inte vad det var, och din enda sparade version är den trasiga. Eller så vill du prova en ny idé utan att riskera det som redan fungerar. Eller så ska ni vara tre personer som jobbar i samma kod samtidigt.

Alla dessa problem löser **Git** – verktyget som låter dig spara, återställa och samarbeta kring kod på ett säkert och strukturerat sätt. Git är en av de mest grundläggande färdigheterna för en webbutvecklare, och det används på i princip alla arbetsplatser i branschen.

> **Så här lär du dig Git i den här boken**  
> Varje lektion innehåller en **simulerad terminal** där du skriver kommandona själv och ser vad de förväntas göra. Efter varje övning finns en uppmaning att **köra samma sak i din riktiga terminal** – det är där kunskapen fastnar. Simuleringen är uppvärmning, inte slutmålet.

---

## Vårt exempelprojekt: `portfolio-site`

Genom hela kapitlet följer vi samma tänkta projekt: en enkel portfoliosida med filer som `index.html` och `about.html`. Du behöver inte bygga sidan på riktigt – det viktiga är att du versionshanterar *samma* mapp steg för steg, så att kommandona hänger ihop.

---

## Vad du kommer att lära dig

- **Vad är Git?** – grundbegreppen (repository, commit, branch, staging) och hur du installerar och ställer in Git.
- **Dina första commits** – terminalens grunder och kärnflödet `init → status → add → commit → log`.
- **Ångra och rätta till** – hur du tar tillbaka misstag på ett säkert sätt.
- **Brancher och merge** – arbeta parallellt och slå ihop ändringar, med en visuell sandlåda.
- **Git och GitHub** – koppla ditt projekt till molnet och dela det med andra.
- **Övningar och intervjufrågor** – för att befästa kunskaperna.

Vi börjar lugnt med *vad* Git är och *varför* det behövs, innan vi skriver det första kommandot.
