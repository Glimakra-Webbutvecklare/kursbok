# PHP Course Material (mdBook)

This repository contains course material for learning PHP, built using `mdBook`.

## Project Goal

The primary goal is to provide a comprehensive and easy-to-follow resource for students learning Web Development.

## Technology Stack

*   **mdBook:** A utility to create online books from Markdown files. [https://rust-lang.github.io/mdBook/](https://rust-lang.github.io/mdBook/)
*   **Markdown:** The primary format for writing content.
*   **mdbook-mermaid:** A preprocessor for `mdBook` to render Mermaid diagrams. [https://github.com/badboy/mdbook-mermaid](https://github.com/badboy/mdbook-mermaid)
*   **Mermaid:** A JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions. [https://mermaid.js.org/](https://mermaid.js.org/)
*   **GitHub Actions:** Used for automatically building and deploying the book to GitHub Pages.

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
        cd boken # Or your repository directory name
        ```
    *   Initialize `mdbook-mermaid` (if not already done, checks `book.toml`):
        ```bash
        mdbook-mermaid install .
        ```

    **Using Docker:**

    *   Make sure Docker Desktop is installed, up and running. Run cmd:
        ```bash 
        docker-compose up
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
*   Use diagrams (Mermaid) to illustrate complex concepts where appropriate.
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
    The course is in Swedish but use English if it is a technical term. Provide the Swedish translation in parenthesis. E.g "Användaren skickar en HTTP request (förfrågan)".
    Make sure all variable names are written in English.

Thank you for contributing!
