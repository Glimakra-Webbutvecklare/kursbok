# Skapa eget WordPress-plugin: Content Slider

I den här lektionen bygger vi ett eget plugin från grunden. Målet är en content slider som går att lägga in på valfri sida med en shortcode (kortkod).

Du får både **kod** och **förklaring av varför varje del finns**, så att du kan förstå flödet även om du aldrig byggt plugin tidigare.

Varje slide ska kunna ha:

- bild som bakgrund
- rubrik
- underrubrik
- knapp

## Så fungerar hela lösningen (innan vi kodar)

1. Vi registrerar ett plugin så WordPress kan aktivera det.
2. Vi skapar en egen post type `school_slide` där redaktören lägger slides.
3. Vi lägger till extra fält (underrubrik, knapptext, knapp-länk).
4. Vi skapar shortcoden `[school_slider]` som bygger HTML för sliden.
5. Vi laddar CSS och JavaScript som ger layout, auto-play och navigering.

Det här är ett vanligt WordPress-mönster: **lagra data i adminpanelen**, och **presentera data med shortcode i frontend**.

## Förkunskaper

Innan du börjar är det bra om du har läst:

- [WordPress](./wordpress.md)
- [WordPress plugins](./wordpress-plugins.md)
- [WordPress teman](./wordpress-teman.md)
- [WordPress shortcodes](./wordpress-shortcodes.md)

## Plugin-struktur

Skapa en mapp i `wp-content/plugins`:

```text
school-content-slider/
├─ school-content-slider.php
├─ assets/
│  ├─ slider.css
│  └─ slider.js
```

- `school-content-slider.php` innehåller pluginets PHP-logik.
- `slider.css` styr hur sliden ser ut.
- `slider.js` styr beteendet (byte av slide, klick på navigering).

## 1) Skapa pluginets huvudfil

Skapa filen `school-content-slider.php`:

```php
<?php
/**
 * Plugin Name: School Content Slider
 * Description: Enkel content slider med shortcode.
 * Version: 1.0.0
 * Author: Glimakra Webbutvecklare
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function school_slider_register_post_type() {
	register_post_type(
		'school_slide',
		array(
			'labels' => array(
				'name'          => __( 'Slides', 'school-slider' ),
				'singular_name' => __( 'Slide', 'school-slider' ),
			),
			'public'       => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-images-alt2',
			'supports'     => array( 'title', 'thumbnail' ),
			'has_archive'  => false,
		)
	);
}
add_action( 'init', 'school_slider_register_post_type' );
```

Här används en egen post type: `school_slide`. Rubriken hämtas från postens titel och bilden hanteras via Featured Image (utvald bild).

### Vad händer i den här koden?

- Plugin-huvudet (`Plugin Name`, `Version` ...) gör att WordPress känner igen pluginet i listan under **Tillägg**.
- `if ( ! defined( 'ABSPATH' ) ) { exit; }` skyddar filen mot direkt anrop.
- `register_post_type( 'school_slide', ... )` skapar en ny innehållstyp i adminpanelen.
- `supports => array( 'title', 'thumbnail' )` betyder att varje slide får titel och Featured Image.
- `add_action( 'init', ... )` kör registreringen när WordPress startar.

När pluginet aktiveras ska du se en ny meny i adminpanelen: **Slides**.

## 2) Lägg till fält för underrubrik och knapp

Lägg till i samma fil:

```php
function school_slider_add_meta_box() {
	add_meta_box(
		'school_slider_fields',
		__( 'Slide-innehåll', 'school-slider' ),
		'school_slider_render_meta_box',
		'school_slide',
		'normal',
		'default'
	);
}
add_action( 'add_meta_boxes', 'school_slider_add_meta_box' );

function school_slider_render_meta_box( $post ) {
	wp_nonce_field( 'school_slider_save_fields', 'school_slider_nonce' );

	$subtitle   = get_post_meta( $post->ID, '_school_slide_subtitle', true );
	$button_txt = get_post_meta( $post->ID, '_school_slide_button_text', true );
	$button_url = get_post_meta( $post->ID, '_school_slide_button_url', true );

	echo '<p><label for="school_slide_subtitle">Underrubrik</label></p>';
	echo '<input type="text" id="school_slide_subtitle" name="school_slide_subtitle" value="' . esc_attr( $subtitle ) . '" style="width:100%;" />';

	echo '<p><label for="school_slide_button_text">Knapptext</label></p>';
	echo '<input type="text" id="school_slide_button_text" name="school_slide_button_text" value="' . esc_attr( $button_txt ) . '" style="width:100%;" />';

	echo '<p><label for="school_slide_button_url">Knapp-länk</label></p>';
	echo '<input type="url" id="school_slide_button_url" name="school_slide_button_url" value="' . esc_attr( $button_url ) . '" style="width:100%;" />';
}

function school_slider_save_meta_box( $post_id ) {
	if ( ! isset( $_POST['school_slider_nonce'] ) ) {
		return;
	}

	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['school_slider_nonce'] ) ), 'school_slider_save_fields' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['school_slide_subtitle'] ) ) {
		update_post_meta( $post_id, '_school_slide_subtitle', sanitize_text_field( wp_unslash( $_POST['school_slide_subtitle'] ) ) );
	}

	if ( isset( $_POST['school_slide_button_text'] ) ) {
		update_post_meta( $post_id, '_school_slide_button_text', sanitize_text_field( wp_unslash( $_POST['school_slide_button_text'] ) ) );
	}

	if ( isset( $_POST['school_slide_button_url'] ) ) {
		update_post_meta( $post_id, '_school_slide_button_url', esc_url_raw( wp_unslash( $_POST['school_slide_button_url'] ) ) );
	}
}
add_action( 'save_post_school_slide', 'school_slider_save_meta_box' );
```

Nu kan varje slide få en underrubrik samt knappens text och länk.

### Vad gör meta box-delen?

- `add_meta_box(...)` lägger till en extra panel under editorn för `school_slide`.
- `school_slider_render_meta_box()` visar formulärfälten i admin.
- `get_post_meta(...)` läser tidigare sparade värden.
- `school_slider_save_meta_box()` körs vid sparning av slide.

Säkerhetsflödet vid sparning:

1. Kontrollera att nonce-fält finns.
2. Verifiera nonce (skydd mot CSRF).
3. Stoppa autosave-fall.
4. Kontrollera behörighet med `current_user_can()`.
5. Sanera data och spara med `update_post_meta()`.

Det här är standardmönstret i WordPress när du sparar egna fält.

## 3) Registrera shortcode

Lägg till i plugin-filen:

```php
function school_slider_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'count' => 5,
		),
		$atts,
		'school_slider'
	);

	$slides = new WP_Query(
		array(
			'post_type'      => 'school_slide',
			'posts_per_page' => (int) $atts['count'],
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	if ( ! $slides->have_posts() ) {
		return '<p>Inga slides hittades.</p>';
	}

	$slider_id = 'school-slider-' . wp_rand( 1000, 9999 );

	ob_start();
	echo '<div class="school-slider" id="' . esc_attr( $slider_id ) . '" data-slider>';
	echo '<div class="school-slider__track">';

	$dot_index = 0;

	while ( $slides->have_posts() ) {
		$slides->the_post();

		$subtitle   = get_post_meta( get_the_ID(), '_school_slide_subtitle', true );
		$button_txt = get_post_meta( get_the_ID(), '_school_slide_button_text', true );
		$button_url = get_post_meta( get_the_ID(), '_school_slide_button_url', true );
		$image_url  = get_the_post_thumbnail_url( get_the_ID(), 'full' );

		echo '<article class="school-slide" style="background-image:url(' . esc_url( $image_url ) . ');">';
		echo '<div class="school-slide__overlay">';
		echo '<h2 class="school-slide__title">' . esc_html( get_the_title() ) . '</h2>';

		if ( ! empty( $subtitle ) ) {
			echo '<p class="school-slide__subtitle">' . esc_html( $subtitle ) . '</p>';
		}

		if ( ! empty( $button_txt ) && ! empty( $button_url ) ) {
			echo '<a class="school-slide__button" href="' . esc_url( $button_url ) . '">' . esc_html( $button_txt ) . '</a>';
		}

		echo '</div>';
		echo '</article>';

		$dot_index++;
	}

	echo '</div>';
	echo '<button class="school-slider__nav school-slider__nav--prev" type="button" data-slider-prev aria-label="Föregående slide">&#10094;</button>';
	echo '<button class="school-slider__nav school-slider__nav--next" type="button" data-slider-next aria-label="Nästa slide">&#10095;</button>';

	echo '<div class="school-slider__dots" role="tablist" aria-label="Slide navigation">';
	for ( $i = 0; $i < $dot_index; $i++ ) {
		echo '<button class="school-slider__dot" type="button" data-slide-to="' . esc_attr( $i ) . '" aria-label="Gå till slide ' . esc_attr( (string) ( $i + 1 ) ) . '"></button>';
	}
	echo '</div>';

	echo '</div>';

	wp_reset_postdata();
	return ob_get_clean();
}
add_shortcode( 'school_slider', 'school_slider_shortcode' );
```

### Hur shortcoden jobbar

- `add_shortcode( 'school_slider', ... )` kopplar `[school_slider]` till funktionen.
- `shortcode_atts(...)` sätter standardvärde för `count`.
- `WP_Query` hämtar slides från databasen.
- `ob_start()` används för att bygga HTML och returnera den som en sträng.
- Loopen skriver ut varje slide:
	- bakgrundsbild från `get_the_post_thumbnail_url()`
	- rubrik från post title
	- underrubrik + knapp från post meta
- Efter loopen skapas navigering:
	- två knappar (föregående/nästa)
	- en dot-knapp per slide
- `wp_reset_postdata()` återställer global query.

Varför både `esc_html()` och `esc_url()`?

- För att skydda output mot skadligt innehåll och trasig HTML.

Shortcoden blir:

```text
[school_slider]
```

Du kan styra antal slides:

```text
[school_slider count="3"]
```

Om en sida innehåller flera sliders fungerar det också, eftersom JavaScript-koden loopar över alla element med `data-slider`.

## 4) Ladda CSS och JavaScript

Lägg till i plugin-filen:

```php
function school_slider_enqueue_assets() {
	wp_enqueue_style(
		'school-slider-style',
		plugin_dir_url( __FILE__ ) . 'assets/slider.css',
		array(),
		'1.0.0'
	);

	wp_enqueue_script(
		'school-slider-script',
		plugin_dir_url( __FILE__ ) . 'assets/slider.js',
		array(),
		'1.0.0',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'school_slider_enqueue_assets' );
```

### Vad betyder enqueue?

`wp_enqueue_style()` och `wp_enqueue_script()` är WordPress sätt att ladda filer på rätt sätt.

Fördelar:

- undviker dubbel inladdning
- bättre kompatibilitet med andra teman/plugins
- WordPress kan hantera ordning och beroenden

Skapa `assets/slider.css`:

```css
.school-slider {
	position: relative;
	overflow: hidden;
	min-height: 380px;
}

.school-slider__track {
	position: relative;
}

.school-slide {
	display: none;
	min-height: 380px;
	background-size: cover;
	background-position: center;
}

.school-slide.is-active {
	display: block;
}

.school-slide__overlay {
	background: rgba(0, 0, 0, 0.45);
	color: #fff;
	padding: 64px 40px;
	min-height: 380px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 12px;
}

.school-slide__title {
	margin: 0;
	font-size: 2rem;
}

.school-slide__subtitle {
	margin: 0;
	font-size: 1.1rem;
}

.school-slide__button {
	align-self: flex-start;
	padding: 10px 18px;
	background: #ffffff;
	color: #111111;
	text-decoration: none;
	border-radius: 6px;
}

.school-slider__nav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(0, 0, 0, 0.55);
	color: #ffffff;
	border: 0;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	cursor: pointer;
	font-size: 1.2rem;
	z-index: 10;
}

.school-slider__nav--prev {
	left: 16px;
}

.school-slider__nav--next {
	right: 16px;
}

.school-slider__dots {
	position: absolute;
	left: 50%;
	bottom: 18px;
	transform: translateX(-50%);
	display: flex;
	gap: 8px;
	z-index: 10;
}

.school-slider__dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	border: 0;
	background: rgba(255, 255, 255, 0.5);
	cursor: pointer;
}

.school-slider__dot.is-active {
	background: #ffffff;
}
```

Skapa `assets/slider.js`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('[data-slider]');

	if (!sliders.length) {
		return;
	}

	sliders.forEach((slider) => {
		const slides = Array.from(slider.querySelectorAll('.school-slide'));
		const dots = Array.from(slider.querySelectorAll('.school-slider__dot'));
		const prevButton = slider.querySelector('[data-slider-prev]');
		const nextButton = slider.querySelector('[data-slider-next]');

		if (!slides.length) {
			return;
		}

		let activeIndex = 0;

		const render = () => {
			slides.forEach((slide, index) => {
				slide.classList.toggle('is-active', index === activeIndex);
			});

			dots.forEach((dot, index) => {
				dot.classList.toggle('is-active', index === activeIndex);
			});
		};

		const goToNext = () => {
			activeIndex = (activeIndex + 1) % slides.length;
			render();
		};

		const goToPrev = () => {
			activeIndex = (activeIndex - 1 + slides.length) % slides.length;
			render();
		};

		if (nextButton) {
			nextButton.addEventListener('click', goToNext);
		}

		if (prevButton) {
			prevButton.addEventListener('click', goToPrev);
		}

		dots.forEach((dot) => {
			dot.addEventListener('click', () => {
				activeIndex = Number(dot.dataset.slideTo);
				render();
			});
		});

		render();

		setInterval(goToNext, 5000);
	});
});
```

### Hur JavaScript-navigeringen fungerar

1. Hitta alla sliders på sidan.
2. För varje slider:
	- hämta slides, dots och pilknappar
	- sätt `activeIndex = 0`
	- kör `render()` för att markera aktiv slide/dot
3. Lägg event listeners:
	- nästa-knapp -> `goToNext()`
	- föregående-knapp -> `goToPrev()`
	- dot -> hoppa till vald index
4. Starta auto-play med `setInterval(goToNext, 5000)`.

Det betyder att användaren kan både klicka manuellt och låta sliden rotera automatiskt.

## 5) Aktivera och testa

1. Gå till **Tillägg > Installerade tillägg** och aktivera `School Content Slider`.
2. Gå till **Slides** i adminpanelen och skapa några slides.
3. Ange titel, underrubrik, knapptext och knapp-länk.
4. Sätt en Featured Image (utvald bild) för varje slide.
5. Lägg in `[school_slider]` på en sida.
6. Testa navigeringen med pilarna och dots under sliden.

## Felsökning för nybörjare

### Jag ser inte menyn Slides i admin

- Kontrollera att pluginet är aktiverat.
- Kontrollera att filnamnet är rätt och att plugin-huvudet finns kvar.

### Shortcoden visar bara "Inga slides hittades"

- Kontrollera att du har publicerat slides (inte utkast).
- Kontrollera att post typen heter exakt `school_slide` i queryn.

### Bakgrundsbild syns inte

- Kontrollera att varje slide har en Featured Image.
- Kontrollera att temat visar featured images korrekt i admin.

### Navigering klickar men inget händer

- Kontrollera att `slider.js` laddas (t.ex. i webbläsarens DevTools).
- Kontrollera att klassnamn i HTML, CSS och JS matchar exakt.

## Säkerhet i plugin-kod

I exemplet används flera viktiga säkerhetsdelar:

- `wp_nonce_field()` och `wp_verify_nonce()`
- `current_user_can()`
- `sanitize_text_field()` och `esc_url_raw()` vid sparning
- `esc_html()` och `esc_url()` vid utskrift

Detta minskar risk för XSS (cross-site scripting) och felaktig indata.

## Sammanfattning

Du har byggt ett komplett plugin med egen datamodell (post type), egna fält, shortcode, styling och JavaScript-navigering. Det är en bra mall för många andra plugin-idéer, till exempel testimonials, teamkort eller kundcase.

## Reflektionsfrågor

1. Varför är det bättre att lägga den här funktionen i ett plugin istället för i temat?
2. Hur påverkas sliden om en post saknar Featured Image?
3. Hur skulle du lägga till swipe-stöd för mobil (touch events)?
