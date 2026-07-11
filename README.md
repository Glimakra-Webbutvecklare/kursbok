# Glimakra Webbutvecklare - Kursboken 
This repository contains course material for Glimakra Webbutvecklare.

## Project Goal

The primary goal is to provide a comprehensive and easy-to-follow resource for students learning Web Development.

## Technology Stack

*   **mdBook:** A utility to create online books from Markdown files. [https://rust-lang.github.io/mdBook/](https://rust-lang.github.io/mdBook/)
*   **Markdown:** The primary format for writing content.
*   **mdbook-mermaid:** A preprocessor for `mdBook` to render Mermaid diagrams. [https://github.com/badboy/mdbook-mermaid](https://github.com/badboy/mdbook-mermaid)
*   **Mermaid:** A JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions. [https://mermaid.js.org/](https://mermaid.js.org/)


## Structure

*   `book.toml`: The main configuration file for `mdBook`.
*   `src/`: Contains the source Markdown files for the book content.
    *   `SUMMARY.md`: Defines the structure and table of contents for the book.
    *   Chapters are typically organized into subdirectories within `src/` (e.g., `src/kapitel_7/`).
*   `.github/workflows/deploy.yml`: The GitHub Actions workflow for deployment.

## How to Contribute

Contributions from other teachers are welcome! Here's how you can add or modify content:

1.  **Set up your local environment:**
    *   Install `mdBook`: Follow the instructions [here](https://rust-lang.github.io/mdBook/guide/installation.html).
    *   Install `mdbook-mermaid`: 
        ```bash
        cargo install mdbook-mermaid
        ```
    *   Clone this repository:
        ```bash
        git clone <repository-url>
        cd kursbok # Or your repository directory name
        ```
    *   Initialize `mdbook-mermaid` (if not already done, checks `book.toml`):
        ```bash
        mdbook-mermaid install .
        ```

    **Using Docker:**

    *   Make sure Docker Desktop is installed, up and running. 
    
        Development mode run cmd and visit http://localhost:3000:

        ```bash 
        docker-compose up --build
        ```

        Production mode run cmd and visit http://localhost:8080:
        
        ```bash 
        docker compose -f docker-compose.prod.yml up --build
        ```

        If required - skip cache and run:

        ```bash
        docker compose down -v
        docker compose build --no-cache
        docker compose up        
        ```


2.  **Make Changes:**
    *   **Edit Existing Content:** Navigate to the relevant `.md` file within the `src/` directory and make your changes using standard Markdown syntax.
    *   **Add New Sections/Chapters:**
        *   Create a new `.md` file in the appropriate location within `src/`.
        *   Add an entry for your new file in `src/SUMMARY.md`, following the existing format to place it correctly in the table of contents.
    *   **Add Diagrams:** Use Mermaid syntax within fenced code blocks marked `mermaid`:
        ````markdown
        ```mermaid
        graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;
        ```
        ````
        You can test your Mermaid syntax using the [Mermaid Live Editor](https://mermaid.live/).

3.  **Preview Locally:**
    *   Build the book:
        ```bash
        mdbook build
        ```
        The output will be in the `book/` directory.
    *   Or, serve the book locally with live reloading:
        ```bash
        mdbook serve
        ```
        Then open your browser to `http://localhost:3000`.

4.  **Commit and Push:**
    *   Follow standard Git workflow: add your changes, commit them with a descriptive message, and push to your fork or branch.
    *   If you have push access to the main repository, push to a feature branch and create a Pull Request for review.

## Writing Style

*   Keep the language clear and concise, suitable for students.
*   Provide practical code examples.
*   Use diagrams (Mermaid) to illustrate complex concepts where appropriate. Make sure mermaid use version 11.6.
*   Explain security considerations relevant to the topics discussed.

### Lesson Structure Guideline

To maintain a consistent feel throughout the book, please try to follow these structural guidelines when writing or editing lessons, based on the approach used in Chapter 7:

1.  **Start with Motivation/Introduction:**
    *   Begin by explaining *what* the topic is and *why* it's relevant or necessary. What problem does it solve?
    *   *Example:* In `sessions.md`, the lesson starts by explaining the stateless nature of HTTP before introducing cookies and sessions as solutions. In `class.md`, the limitations of associative arrays are discussed before introducing classes.

2.  **Use Clear Sections:**
    *   Break down the topic into logical, manageable sub-sections using Markdown headings (`##`, `###`).
    *   This improves readability and allows students to navigate the material easily.
    *   *Example:* `syntax.md` is divided into sections like "Basic Syntax", "Variables", "Data Types", "Operators", etc.

3.  **Provide Code Examples:**
    *   Include simple code example that highlights the core idea
    *   Avoid the whole solution, instead hint the reader what is needed to run the code
    *   Use common naming conventions for each programming language (snake_case for php, camelCase for Js)
    *   Use fenced code blocks with language identifiers (e.g., ```php ... ```).
    *   *Example:* All lessons include code snippets. `security.md` effectively uses examples to show both vulnerable and secure code.

4.  **Explain the Code:**
    *   Don't just present code; briefly explain what it does and highlight the key parts related to the concept being taught.
    *   Use comments within code blocks sparingly; prefer explanations in the text.

5.  **Use Analogies and Simple Explanations:**
    *   For abstract or complex concepts, use analogies or simple, relatable explanations.
    *   *Example:* The "gingerbread man cutter" analogy for classes/objects in `class.md`, or the "mixer" analogy for hashing in `security.md`.

6.  **Include Visual Aids (where appropriate):**
    *   Use Mermaid diagrams to illustrate workflows, relationships, or comparisons.
    *   *Example:* The HTTP request/PHP flow in `php-intro.md`, database JOINs in `sql.md`, or salted vs. unsalted hashing in `security.md`.

7.  **Integrate Security:**
    *   Where relevant (especially for web features, database interaction, user input), explicitly discuss security implications.
    *   Explain potential vulnerabilities (like XSS, SQL Injection, CSRF) and demonstrate secure practices (using `htmlspecialchars`, prepared statements, password hashing, etc.).
    *   *Example:* `sessions.md` has a dedicated security section, and `security.md` focuses entirely on these topics.

8.  **Show Practical Use Cases:**
    *   Connect the concept to real-world applications or common programming tasks.
    *   *Example:* Using sessions for user authentication (`sessions.md`), using SQL for database operations (`sql.md`), building a full application (`crud-app.md`).

9.  **Consider Comparisons (Optional):**
    *   If students might be familiar with another language (like JavaScript), comparing concepts can be helpful.
    *   *Example:* Comparing PHP variables (`$`) to JS (`let`/`const`) in `syntax.md`.

10. **Prerequisites (For complex topics):**
    *   If a lesson builds heavily on previous ones, mention the prerequisites at the beginning.
    *   *Example:* `crud-app.md` notes that understanding sessions, SQL, and basic PHP is assumed.

11. **Use Swedish mostly**
    *   The course is in Swedish but use English if it is a technical term. 
    *   Do not create new compound swedish word if the word is not common in swedish language. The english phrase "descendant combinator" should be translated to separate words like "selektor för ättling".
    *   Provide the Swedish translation in parenthesis. E.g "Användaren skickar en HTTP request (förfrågan)".
    *   Make sure all variable names are written in English.

## Interaktiva kodexempel (Playgrounds)

Boken har stöd för **interaktiva kodexempel** där läsaren kan redigera koden och köra den direkt i webbläsaren. Detta är tänkt främst för frontend-grunderna (modul 1-3: HTML, CSS, JavaScript, DOM och localStorage), eftersom de körs helt i webbläsaren utan server eller externa tjänster.

Editorn är avsiktligt enkel (ingen autocomplete/AI), vilket passar regeln *"ej AI | autocomplete"* för de tidiga modulerna.

### Hur du skapar en playground

Markera ett kodblock med en HTML-kommentar i Markdown. Skriptet (`theme/playground/playground.js`) byter automatiskt ut det markerade kodblocket mot en redigerbar editor med knapparna **Kör** och **Återställ**.

**Ett enskilt block** (t.ex. ren JavaScript). Utskrift från `console.log` visas i en panel under editorn:

````markdown
<!-- playground -->
```js
console.log("Hej!");
```
````

**Flera block grupperade** till en gemensam förhandsvisning. Kombinera `html`, `css` och `js` - resultatet renderas i en sandboxad `<iframe>`:

````markdown
<!-- playground:start -->
```html
<button id="btn">Klicka</button>
```
```css
button { padding: 8px 16px; }
```
```js
document.querySelector('#btn').addEventListener('click', () => {
  console.log('Klickad!');
});
```
<!-- playground:end -->
````

### Tillval: `storage` (localStorage)

Förhandsvisningen körs normalt i en hårt sandboxad iframe (`sandbox="allow-scripts"`), vilket blockerar `localStorage`. För exempel som behöver `localStorage` lägger du till nyckelordet `storage` efter markören, vilket kör iframen med `allow-same-origin`:

````markdown
<!-- playground:start storage -->
```html
<input id="msg"><button id="save">Spara</button>
```
```js
document.querySelector('#save').addEventListener('click', () => {
  localStorage.setItem('msg', document.querySelector('#msg').value);
});
```
<!-- playground:end -->
````

Använd `storage` endast när det verkligen behövs, och nämn för läsaren att den extra rättigheten bara är till för det interaktiva exemplet.

### Riktlinjer för playgrounds

*   Gör exemplen **självständiga** - om din JavaScript refererar till ett element (t.ex. `#myButton`) måste motsvarande HTML finnas med i samma playground-grupp, annars blir det fel.
*   Behåll gärna det vanliga (icke-interaktiva) kodexemplet i texten för läsning och lägg den interaktiva versionen under en kort uppmaning, t.ex. *"**Prova själv:** ..."*.
*   Playgrounden körs i webbläsaren - använd den bara för HTML/CSS/JS, inte för kod som kräver en server (Node.js, databaser, m.m.).

## Interaktiva Git- och terminalövningar

HTML/CSS/JS kan köras direkt i webbläsaren, men **bash och Git** har ingen körmiljö i webbläsaren. Därför finns två särskilda verktyg (`theme/playground/terminal.js`):

### Simulerad terminal

En *guidad, deterministisk* terminal: läsaren skriver kommandona själv och får dem validerade mot ett förväntat transkript. Kommandona körs inte på riktigt - det är en övning i att lära in kommandon och se förväntad utskrift. Säg alltid till läsaren att riktig övning sker i deras egen terminal.

Markera ett kodblock som ser ut som en terminalsession. Rader som börjar med `$ ` är kommandon, raderna under (till nästa `$ `) är förväntad utskrift:

````markdown
<!-- terminal -->
```bash
$ git init
Initialized empty Git repository in /home/elev/projekt/.git/
$ git status
On branch main
...
```
````

- Text *före* första `$ ` visas som en banner.
- Tillval `prompt=...` ändrar prompten, t.ex. `<!-- terminal prompt=~/projekt -->`.
- Knappen **Tips** fyller i nästa förväntade kommando, **Återställ** börjar om. Pil upp/ner bläddrar i historiken.

### Learn Git Branching (visuell git-sandlåda)

För brancher, merge och rebase bäddas [Learn Git Branching](https://learngitbranching.js.org/) in. Ett valfritt kodblock anger kommandon som körs automatiskt vid laddning:

````markdown
<!-- learngit -->
```bash
git commit
git checkout -b feature
git commit
git checkout main
git merge feature
```
````

Widgeten visar en `<iframe>` med sandlådan plus en "Öppna i ny flik"-länk som fallback. Utan kodblock startar den tom. Den körs helt i läsarens webbläsare (ingen kostnad eller gräns per läsare).

### Senare: React, Node.js och TypeScript (år 2)

För modulerna i år 2 som kräver en riktig körmiljö (React, Node.js, Deno, TypeScript, WebSocket) rekommenderas inbäddade tjänster i stället för den självhostade playgrounden:

*   **React:** [Sandpack](https://sandpack.codesandbox.io/) (MIT-licens, paketerar i webbläsaren, inga användningsgränser).
*   **Node.js / Express / Deno / WebSocket:** inbäddade publika [StackBlitz](https://stackblitz.com/)-projekt (kör Node i webbläsaren via WebContainers).

Dessa körs i varje läsares egen webbläsare, så det finns ingen kostnad eller gräns per läsare för en kurs av vår storlek. Betaltjänster behövs bara för privata projekt, teamplatser eller för att köra container-tekniken på egen domän.

Thank you for contributing!
