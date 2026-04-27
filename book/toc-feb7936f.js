// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_1/index.html"><strong aria-hidden="true">1.</strong> Introduktion till Webbutveckling</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_1/vad-ar-webbutveckling.html"><strong aria-hidden="true">1.1.</strong> Vad är webbutveckling?</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_1/webbens-historia-och-framtid.html"><strong aria-hidden="true">1.2.</strong> Webbens historia och framtid</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_1/webbutvecklarens-verktygslada.html"><strong aria-hidden="true">1.3.</strong> Översikt över webbutvecklarens verktygslåda</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_1/installera-verktyg.html"><strong aria-hidden="true">1.4.</strong> Installera och konfigurera verktyg</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/index.html"><strong aria-hidden="true">2.</strong> HTML och Git</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/html5-grunder.html"><strong aria-hidden="true">2.1.</strong> Grunderna i HTML5</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/struktur-och-semantik.html"><strong aria-hidden="true">2.2.</strong> Strukturera och semantisera webbinnehåll</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/tillganglighet.html"><strong aria-hidden="true">2.3.</strong> HTML-element för tillgänglighet</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/git-intro.html"><strong aria-hidden="true">2.4.</strong> Introduktion till Git</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/git-kommandon.html"><strong aria-hidden="true">2.5.</strong> Grundläggande Git-kommandon</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/github.html"><strong aria-hidden="true">2.6.</strong> Arbeta med GitHub</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/mer-git-kommandon.html"><strong aria-hidden="true">2.7.</strong> Mer Git kommandon</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/ovningar.html"><strong aria-hidden="true">2.8.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_2/teknisk-intervju.html"><strong aria-hidden="true">2.9.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/index.html"><strong aria-hidden="true">3.</strong> Grundläggande CSS</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/css-intro.html"><strong aria-hidden="true">3.1.</strong> Introduktion till CSS</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/selektorer.html"><strong aria-hidden="true">3.2.</strong> Selektorer, färger och typografi</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/css-units.html"><strong aria-hidden="true">3.3.</strong> CSS-enheter: Absoluta och relativa mått</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/boxmodellen.html"><strong aria-hidden="true">3.4.</strong> Boxmodellen och layoutprinciper</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/responsiv-design.html"><strong aria-hidden="true">3.5.</strong> Responsiv design</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/mobile-first.html"><strong aria-hidden="true">3.6.</strong> Mobile-first design</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/ovningar.html"><strong aria-hidden="true">3.7.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_3/teknisk-intervju.html"><strong aria-hidden="true">3.8.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/index.html"><strong aria-hidden="true">4.</strong> Grundläggande JavaScript</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/js-intro.html"><strong aria-hidden="true">4.1.</strong> Introduktion till JavaScript</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/variabler.html"><strong aria-hidden="true">4.2.</strong> Variabler och datatyper</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/funktioner.html"><strong aria-hidden="true">4.3.</strong> Funktioner och scope</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/kontrollstrukturer.html"><strong aria-hidden="true">4.4.</strong> Kontrollstrukturer och loopar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/dom-manipulation-events.html"><strong aria-hidden="true">4.5.</strong> DOM-manipulation och Events</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/ovningar.html"><strong aria-hidden="true">4.6.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_4/teknisk-intervju.html"><strong aria-hidden="true">4.7.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/index.html"><strong aria-hidden="true">5.</strong> Fortsättning JavaScript</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/asynkron.html"><strong aria-hidden="true">5.1.</strong> Asynkron programmering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/promises.html"><strong aria-hidden="true">5.2.</strong> Promises och async/await</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/fetch.html"><strong aria-hidden="true">5.3.</strong> Fetch API</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/data-format.html"><strong aria-hidden="true">5.4.</strong> Hantera data</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/array-metoder.html"><strong aria-hidden="true">5.5.</strong> Array- och objektmetoder</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/ovningar.html"><strong aria-hidden="true">5.6.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_5/teknisk-intervju.html"><strong aria-hidden="true">5.7.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/index.html"><strong aria-hidden="true">6.</strong> Hosting, CMS och WordPress</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/vad-ar-hosting.html"><strong aria-hidden="true">6.1.</strong> Vad är hosting?</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/hosta-applikation.html"><strong aria-hidden="true">6.2.</strong> Att hosta en applikation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/docker-intro.html"><strong aria-hidden="true">6.3.</strong> Introduktion till Docker</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/domaner.html"><strong aria-hidden="true">6.4.</strong> Domänhantering och DNS</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/cms-intro.html"><strong aria-hidden="true">6.5.</strong> Introduktion till CMS</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress.html"><strong aria-hidden="true">6.6.</strong> WordPress</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-uppbyggt.html"><strong aria-hidden="true">6.6.1.</strong> Hur wordpress är uppbyggt</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-local.html"><strong aria-hidden="true">6.6.2.</strong> Installation med Local by Flywheel</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-admin.html"><strong aria-hidden="true">6.6.3.</strong> WordPress adminpanel</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-teman.html"><strong aria-hidden="true">6.6.4.</strong> WordPress teman</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-theme.html"><strong aria-hidden="true">6.6.5.</strong> Skapa eget tema med Underscores</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-plugins.html"><strong aria-hidden="true">6.6.6.</strong> WordPress plugins</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-eget-plugin-slider.html"><strong aria-hidden="true">6.6.7.</strong> Skapa eget plugin: Content Slider</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-shortcodes.html"><strong aria-hidden="true">6.6.8.</strong> WordPress shortcodes</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-custom-post-type.html"><strong aria-hidden="true">6.6.9.</strong> Egen post type: Portfolio</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-page-builders.html"><strong aria-hidden="true">6.6.10.</strong> WordPress page builders</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/wordpress-posts-vs-pages.html"><strong aria-hidden="true">6.6.11.</strong> Skillnaden mellan Posts och Pages</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/markdown-dokumentation.html"><strong aria-hidden="true">6.7.</strong> Markdown och dokumentation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/jekyll.html"><strong aria-hidden="true">6.8.</strong> Static Site Generators</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/ovningar.html"><strong aria-hidden="true">6.9.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_6/teknisk-intervju.html"><strong aria-hidden="true">6.10.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/index.html"><strong aria-hidden="true">7.</strong> PHP Fullstack</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/php-intro.html"><strong aria-hidden="true">7.1.</strong> Introduktion till PHP</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/syntax.html"><strong aria-hidden="true">7.2.</strong> PHP Syntax och funktioner</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/array-loop.html"><strong aria-hidden="true">7.3.</strong> PHP arrayer och loopar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/funktionell-php.html"><strong aria-hidden="true">7.4.</strong> Funktionell PHP</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/class.html"><strong aria-hidden="true">7.5.</strong> PHP klasser</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/sql.html"><strong aria-hidden="true">7.6.</strong> MySQL och databaser</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/crud-app.html"><strong aria-hidden="true">7.7.</strong> CRUD-applikationer</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/crud-app-1-setup.html"><strong aria-hidden="true">7.7.1.</strong> Del 1: Setup och databas</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/crud-app-2-autentisering.html"><strong aria-hidden="true">7.7.2.</strong> Del 2: Autentisering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/crud-app-3-create-read.html"><strong aria-hidden="true">7.7.3.</strong> Del 3: Skapa och läsa inlägg</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/crud-app-4-update-delete.html"><strong aria-hidden="true">7.7.4.</strong> Del 4: Uppdatera och radera</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/crud-app-5-refaktorering.html"><strong aria-hidden="true">7.7.5.</strong> Del 5: Refaktorering</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/laravel-crud.html"><strong aria-hidden="true">7.8.</strong> CRUD-applikation med Laravel</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/laravel-intro.html"><strong aria-hidden="true">7.8.1.</strong> Del 1: Varför ett ramverk?</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/laravel-komma-igang.html"><strong aria-hidden="true">7.8.2.</strong> Del 2: Komma igång</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/laravel-crud-3-setup.html"><strong aria-hidden="true">7.8.3.</strong> Del 3: Setup och autentisering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/laravel-crud-4-create-read.html"><strong aria-hidden="true">7.8.4.</strong> Del 4: Skapa och läsa inlägg</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/laravel-crud-5-update-delete.html"><strong aria-hidden="true">7.8.5.</strong> Del 5: Uppdatera och radera</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/sessions.html"><strong aria-hidden="true">7.9.</strong> Sessioner och cookies</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/security.html"><strong aria-hidden="true">7.10.</strong> Säkerhet</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/ovningar.html"><strong aria-hidden="true">7.11.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_7/teknisk-intervju.html"><strong aria-hidden="true">7.12.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/index.html"><strong aria-hidden="true">8.</strong> Frontend-ramverk med React</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/react-intro.html"><strong aria-hidden="true">8.1.</strong> Introduktion till React</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/komponenter.html"><strong aria-hidden="true">8.2.</strong> Komponentbaserad arkitektur</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/state-props.html"><strong aria-hidden="true">8.3.</strong> State och Props</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/routing.html"><strong aria-hidden="true">8.4.</strong> React Router</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/forms.html"><strong aria-hidden="true">8.5.</strong> Formulär</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/api-integration.html"><strong aria-hidden="true">8.6.</strong> API Integration</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/hosta-react-app.html"><strong aria-hidden="true">8.7.</strong> Hosta React med Dokploy</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/spa.html"><strong aria-hidden="true">8.8.</strong> Single Page Application</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/ovningar.html"><strong aria-hidden="true">8.9.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/teknisk-intervju.html"><strong aria-hidden="true">8.10.</strong> Teknisk Intervju</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/index.html"><strong aria-hidden="true">8.11.</strong> Fördjupning: React</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/routing-fordjupning.html"><strong aria-hidden="true">8.11.1.</strong> Routing: skydd och data</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/state-fordjupning.html"><strong aria-hidden="true">8.11.2.</strong> State: reducer, Context, normalisering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/custom-hooks.html"><strong aria-hidden="true">8.11.3.</strong> Custom Hooks i React</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/performance.html"><strong aria-hidden="true">8.11.4.</strong> Prestanda: memo, virtualisering, splitting</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/data-advanced.html"><strong aria-hidden="true">8.11.5.</strong> Data: caching, retry, WebSockets</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/ssr-ssg.html"><strong aria-hidden="true">8.11.6.</strong> SSR/SSG och Next.js</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_8/fordjupning/typescript.html"><strong aria-hidden="true">8.11.7.</strong> TypeScript i React</a></span></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/index.html"><strong aria-hidden="true">9.</strong> Backend-utveckling med Node.js</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/node-intro.html"><strong aria-hidden="true">9.1.</strong> Node.js introduktion</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/http-webserver.html"><strong aria-hidden="true">9.2.</strong> Webbserver med http</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/expressjs.html"><strong aria-hidden="true">9.3.</strong> Express</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/rest-api.html"><strong aria-hidden="true">9.4.</strong> RESTful API:er</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/mongodb.html"><strong aria-hidden="true">9.5.</strong> MongoDB</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/testning.html"><strong aria-hidden="true">9.6.</strong> Testning med Jest</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/middleware.html"><strong aria-hidden="true">9.7.</strong> Middleware och autentisering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/sessions.html"><strong aria-hidden="true">9.8.</strong> Sessionshantering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/demo.html"><strong aria-hidden="true">9.9.</strong> Demo App</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/ovningar.html"><strong aria-hidden="true">9.10.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_9/teknisk-intervju.html"><strong aria-hidden="true">9.11.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/index.html"><strong aria-hidden="true">10.</strong> Spelutveckling och WebSockets</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/websockets.html"><strong aria-hidden="true">10.1.</strong> WebSockets</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/chat.html"><strong aria-hidden="true">10.2.</strong> Chattapplikation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/canvas.html"><strong aria-hidden="true">10.3.</strong> Canvas och grafik</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/oop.html"><strong aria-hidden="true">10.4.</strong> Objektorienterad programmering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/multiplayer.html"><strong aria-hidden="true">10.5.</strong> Multiplayer-spel</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/ovningar.html"><strong aria-hidden="true">10.6.</strong> Praktiska övningar</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_10/teknisk-intervju.html"><strong aria-hidden="true">10.7.</strong> Teknisk Intervju</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/index.html"><strong aria-hidden="true">11.</strong> Arbeta i Team</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/agile.html"><strong aria-hidden="true">11.1.</strong> Agil projektledning</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/trello.html"><strong aria-hidden="true">11.2.</strong> Trello för projekthantering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/team-git.html"><strong aria-hidden="true">11.3.</strong> Team Git</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/communication.html"><strong aria-hidden="true">11.4.</strong> Kommunikation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/planning.html"><strong aria-hidden="true">11.5.</strong> Planering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_11/ovningar.html"><strong aria-hidden="true">11.6.</strong> Praktiska övningar</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_12/index.html"><strong aria-hidden="true">12.</strong> Examensprojekt</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_12/project-planning.html"><strong aria-hidden="true">12.1.</strong> Projektplanering</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_12/development.html"><strong aria-hidden="true">12.2.</strong> Utvecklingsprocess</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_12/documentation.html"><strong aria-hidden="true">12.3.</strong> Dokumentation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_12/portfolio.html"><strong aria-hidden="true">12.4.</strong> Portfolio</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="kapitel_12/career.html"><strong aria-hidden="true">12.5.</strong> Karriärutveckling</a></span></li></ol><li class="chapter-item expanded "><li class="part-title">Frontend Ramverk</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/index.html"><strong aria-hidden="true">13.</strong> CSS Frontend Ramverk introduktion</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-introduction.html"><strong aria-hidden="true">13.1.</strong> Tailwind CSS</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-flex-grid.html"><strong aria-hidden="true">13.1.1.</strong> Layout med Flex och Grid</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-colors-typography.html"><strong aria-hidden="true">13.1.2.</strong> Färger och Typografi</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-responsive-design.html"><strong aria-hidden="true">13.1.3.</strong> Responsive Design</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-states-interactivity.html"><strong aria-hidden="true">13.1.4.</strong> States och Interaktivitet</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-configuration-customization.html"><strong aria-hidden="true">13.1.5.</strong> Konfiguration och anpassning</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-build-a-site.html"><strong aria-hidden="true">13.1.6.</strong> Bygga en sida (Dashboard)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-components.html"><strong aria-hidden="true">13.1.7.</strong> Best Practices &amp; Komponentbibliotek</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="css-frontend-ramverk/tailwind-react.html"><strong aria-hidden="true">13.1.8.</strong> Tailwind och React</a></span></li></ol></li></ol><li class="chapter-item expanded "><li class="part-title">SCSS</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/index.html"><strong aria-hidden="true">14.</strong> Introduktion till SCSS</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/variabler-maps.html"><strong aria-hidden="true">14.1.</strong> Variabler och Maps</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/sju-ett-struktur.html"><strong aria-hidden="true">14.2.</strong> 7-1 Struktur med importer</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/mixins.html"><strong aria-hidden="true">14.3.</strong> Mixins</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/funktioner.html"><strong aria-hidden="true">14.4.</strong> Funktioner i SCSS</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/nesting-selektorstrategi.html"><strong aria-hidden="true">14.5.</strong> Nesting och selektorstrategi</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/moduler-use-forward.html"><strong aria-hidden="true">14.6.</strong> Moduler med @use och @forward</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/design-tokens-css-custom-properties.html"><strong aria-hidden="true">14.7.</strong> Design tokens och CSS custom properties</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/responsiv-breakpoints.html"><strong aria-hidden="true">14.8.</strong> Responsiv SCSS med breakpoints</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/loopar-utility-klasser.html"><strong aria-hidden="true">14.9.</strong> Loopar i praktiken och utility-klasser</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/theming.html"><strong aria-hidden="true">14.10.</strong> Theming: ljust och mörkt tema</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/prestanda-css-output.html"><strong aria-hidden="true">14.11.</strong> Prestanda och CSS-output</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/tillganglighet.html"><strong aria-hidden="true">14.12.</strong> Tillgänglighet i SCSS</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="SCSS/mini-projekt-komponentbibliotek.html"><strong aria-hidden="true">14.13.</strong> Mini-projekt: komponentbibliotek i SCSS</a></span></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

