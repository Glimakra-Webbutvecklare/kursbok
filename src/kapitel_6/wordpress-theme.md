# Skapa eget WordPress-tema med _s (Underscores)

Att bygga ett eget tema från grunden ger dig full kontroll över layout, komponenter och prestanda. Ett bra sätt att börja är med **Underscores** (`_s`) som är ett minimalt starter theme för WordPress.

## Vad är Underscores (_s)?

Underscores är ett grundtema som innehåller:

- Rätt grundfiler för ett WordPress-tema
- En enkel och ren kodbas utan onödiga funktioner
- Bra startpunkt för att bygga helt egen design

Det är inte ett färdigt design-tema, utan ett utvecklarvänligt skelett.

## Förkunskaper

Innan du börjar bör du ha:

- En lokal WordPress-installation (t.ex. med Local)
- Grundkunskap i HTML, CSS och lite PHP
- En kodeditor (t.ex. VS Code)

## 1. Generera ett _s-tema

1. Gå till [Underscores](https://underscores.me/).
2. Skriv in ett temanamn, t.ex. `my-school-theme`.
3. Klicka på **Generate** för att ladda ner `.zip`.
4. Packa upp mappen.

## 2. Lägg in temat i WordPress

1. Öppna din WordPress-installation.
2. Gå till `wp-content/themes/`.
3. Kopiera in den uppackade temamappen.
4. Gå till **Utseende > Teman** i admin.
5. Aktivera ditt nya tema.

## 3. Förstå viktiga filer

De vanligaste filerna att börja med:

- `style.css` – temats metadata och grundstil
- `functions.php` – laddar in scripts/styles och aktiverar tema-funktioner
- `header.php` – sidhuvud
- `footer.php` – sidfot
- `index.php` – fallback-template
- `single.php` – enskilt inlägg
- `page.php` – enskild sida
- `archive.php` – listning av inlägg

## 4. Börja bygga din egen design

Ett bra arbetsflöde:

1. Skapa en enkel designskiss (hero, navigation, innehåll, footer).
2. Bygg layout i `header.php`, `footer.php` och templates.
3. Lägg all styling i separata CSS-filer och enqueua via `functions.php`.
4. Testa olika innehållstyper: inlägg, sidor, kategori-arkiv och 404.

## 5. Exempel: ladda in egen CSS i `functions.php`

```php
function my_school_theme_scripts() {
	wp_enqueue_style(
		'my-school-theme-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'my_school_theme_scripts' );
```

## Bra praxis när du bygger tema

- Använd child theme om du utgår från ett externt tema
- Håll logik i rätt lager (undvik tung affärslogik i templates)
- Sanitera och escapa data i PHP-output
- Optimera bilder och minimera tunga frontend-resurser
- Testa responsivt och tillgängligt från start

## Vanliga misstag

- Ändra filer direkt i tredjepartsteman utan child theme
- Lägga för mycket kod i en enda templatefil
- Hårdkoda URL:er och texter istället för WordPress-funktioner
- Glömma att testa templates för tomma listor och 404-sidor

## Sammanfattning

Med `_s` får du en stabil och enkel grund för att skapa ett helt eget WordPress-tema. Fokus bör vara att bygga små delar i taget, hålla strukturen tydlig och testa ofta i lokal miljö.

## Reflektionsfrågor

1. Varför är ett starter theme ofta bättre än att börja från en tom mapp?
2. Vilka delar av ett tema vill du göra återanvändbara tidigt i projektet?
3. Hur skulle du organisera CSS och templates för att förenkla underhåll?
