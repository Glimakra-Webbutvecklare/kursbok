# Skapa eget WordPress-tema med _s (Underscores)

Att bygga ett eget tema från grunden ger dig full kontroll över layout, komponenter och prestanda. Ett bra sätt att börja är med **Underscores** (`_s`) som är ett minimalt starttema (starter theme) för WordPress.

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

## Den första kommentaren i `style.css`: vad är den och varför behövs den?

I ett WordPress-tema är den första kommentaren i `style.css` inte bara en vanlig kommentar. Den fungerar som en **temahead(er) med metadata** som WordPress läser.

Exempel:

```css
/*
Theme Name: My School Theme
Theme URI: https://example.com/my-school-theme
Author: Ditt Namn
Description: Ett enkelt kurs-tema för WordPress.
Version: 1.0.0
Text Domain: my-school-theme
*/
```

### Vad används den till?

- WordPress visar temat i **Utseende > Teman** med namn och beskrivning.
- WordPress identifierar temat och dess version.
- `Text Domain` kopplar temat till översättningar.

### Varför är den viktig?

Utan korrekt header kan WordPress missa viktig information om temat, och i vissa fall visas temat felaktigt i adminpanelen.

Kort sagt: den här kommentaren är en "ID-handling" för ditt tema.

## Egen bild för temat (förhandsvisning i admin)

Om du vill visa en egen bild på temat i **Utseende > Teman** lägger du en fil i temats rotmapp med namnet:

```text
screenshot.png
```

Exempel på sökväg:

```text
wp-content/themes/my-school-theme/screenshot.png
```

### Rekommendationer

- Filnamn: exakt `screenshot.png` (WordPress känner automatiskt igen den)
- Format: `.png` (även `.jpg` fungerar i många fall)
- Rekommenderad storlek: cirka `1200 x 900` px

### Tips för bra förhandsbild

- Visa startsidan eller en representativ sektion av temat
- Använd tydlig kontrast och läsbar typografi
- Undvik för mycket detaljer som blir svåra att se i miniatyr

## Text Domain: vad har den för funktion?

I ett eget tema används **Text Domain** för översättning (internationalization, internationalisering). Det är ett unikt namn som kopplar ihop:

- texter i koden
- språkfiler (`.po` / `.mo`)
- temat som helhet

### Exempel i `style.css`

I temats header brukar du ha:

```css
/*
Theme Name: My School Theme
Text Domain: my-school-theme
*/
```

`Text Domain: my-school-theme` talar om för WordPress vilket "språkpaket" som hör till temat.

### Exempel i PHP-kod

När du skriver texter i temat använder du samma text domain:

```php
echo esc_html__( 'Read more', 'my-school-theme' );
```

Här betyder:

- `'Read more'` = textsträng som kan översättas
- `'my-school-theme'` = vilken text domain strängen tillhör

Om text domain i koden inte matchar den i `style.css` kan översättningen misslyckas.

### Kort tumregel

Använd **samma text domain överallt i temat**:

- i `style.css`
- i funktioner som `__()`, `_e()`, `esc_html__()`
- i språkfiler

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

## Säkerhet i teman

När du bygger eget tema behöver du hantera indata och output säkert.

### Exempel: sanitize (rensa indata) och escape (säker output)

```php
$title_raw = $_POST['custom_title'] ?? '';
$title = sanitize_text_field( $title_raw );

echo '<h2>' . esc_html( $title ) . '</h2>';
```

### Exempel: nonce för formulär

I formulär kan du lägga till nonce (engångstoken) för att minska risken för CSRF (cross-site request forgery).

```php
// I formuläret
wp_nonce_field( 'save_theme_options', 'theme_options_nonce' );

// Vid hantering av formulär
if (
	! isset( $_POST['theme_options_nonce'] ) ||
	! wp_verify_nonce( $_POST['theme_options_nonce'], 'save_theme_options' )
) {
	return;
}
```

## Vanliga misstag

- Ändra filer direkt i tredjepartsteman utan child theme
- Lägga för mycket kod i en enda templatefil
- Hårdkoda URL:er och texter istället för WordPress-funktioner
- Glömma att testa templates för tomma listor och 404-sidor

## Sammanfattning

Med `_s` får du en stabil och enkel grund för att skapa ett helt eget WordPress-tema. Fokus bör vara att bygga små delar i taget, hålla strukturen tydlig och testa ofta i lokal miljö.

## Nästa lektioner

Om du vill repetera eller bygga progression:

- [WordPress-introduktion](./wordpress.md)
- [Installation med Local by Flywheel](./wordpress-local.md)

## Reflektionsfrågor

1. Varför är ett starter theme ofta bättre än att börja från en tom mapp?
2. Vilka delar av ett tema vill du göra återanvändbara tidigt i projektet?
3. Hur skulle du organisera CSS och templates för att förenkla underhåll?
