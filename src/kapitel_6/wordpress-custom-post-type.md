# Egen post type i WordPress (Portfolio)

I den här lektionen skapar vi en egen post type (innehållstyp) med namnet **Portfolio**. Vi lägger också till stöd för kategorier och bygger en shortcode (kortkod) så innehållet kan visas på valfri sida.

Målet är att du ska förstå **vad koden gör**, inte bara kopiera den.

## Förkunskaper

Innan du börjar är det bra om du har läst:

- [WordPress](./wordpress.md)
- [WordPress teman](./wordpress-teman.md)
- [WordPress plugins](./wordpress-plugins.md)
- [WordPress shortcodes](./wordpress-shortcodes.md)

## Varför använda en egen post type?

Standardtyperna i WordPress är **Inlägg** och **Sidor**. För innehåll som inte riktigt passar där, till exempel projekt, case eller kundjobb, blir en egen post type tydligare.

Exempel:

- Inlägg = nyheter och blogg
- Sidor = statiska undersidor
- Portfolio = projekt och referenser

Det gör adminpanelen enklare för redaktören och minskar risken att innehåll blandas ihop.

## Översikt: vad vi bygger

Vi bygger i tre steg:

1. Registrerar en ny post type: `portfolio`
2. Registrerar en egen taxonomy för portfolio-kategorier
3. Skapar en shortcode som hämtar och visar Portfolio-inlägg

Tänk så här:

- WordPress har ett "register" med innehållstyper
- Du lägger till en ny typ i registret med `register_post_type()`
- Shortcoden läser data från databasen och skriver ut HTML

## 1) Registrera post typen Portfolio

Lägg koden i `functions.php` i ditt tema eller i ett eget plugin.

```php
function school_register_portfolio_post_type() {
	$labels = array(
		'name'                  => __( 'Portfolio', 'school-theme' ),
		'singular_name'         => __( 'Portfolio Item', 'school-theme' ),
		'add_new'               => __( 'Add New', 'school-theme' ),
		'add_new_item'          => __( 'Add New Portfolio Item', 'school-theme' ),
		'edit_item'             => __( 'Edit Portfolio Item', 'school-theme' ),
		'new_item'              => __( 'New Portfolio Item', 'school-theme' ),
		'view_item'             => __( 'View Portfolio Item', 'school-theme' ),
		'search_items'          => __( 'Search Portfolio', 'school-theme' ),
		'not_found'             => __( 'No portfolio items found', 'school-theme' ),
		'not_found_in_trash'    => __( 'No portfolio items found in Trash', 'school-theme' ),
		'menu_name'             => __( 'Portfolio', 'school-theme' ),
	);

	$args = array(
		'labels'                => $labels,
		'public'                => true,
		'show_in_rest'          => true,
		'menu_position'         => 20,
		'menu_icon'             => 'dashicons-portfolio',
		'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
		'has_archive'           => true,
		'rewrite'               => array( 'slug' => 'portfolio' ),
	);

	register_post_type( 'portfolio', $args );
}
add_action( 'init', 'school_register_portfolio_post_type' );

function school_register_portfolio_taxonomy() {
	$labels = array(
		'name'              => __( 'Portfolio Categories', 'school-theme' ),
		'singular_name'     => __( 'Portfolio Category', 'school-theme' ),
		'search_items'      => __( 'Search Portfolio Categories', 'school-theme' ),
		'all_items'         => __( 'All Portfolio Categories', 'school-theme' ),
		'edit_item'         => __( 'Edit Portfolio Category', 'school-theme' ),
		'update_item'       => __( 'Update Portfolio Category', 'school-theme' ),
		'add_new_item'      => __( 'Add New Portfolio Category', 'school-theme' ),
		'new_item_name'     => __( 'New Portfolio Category Name', 'school-theme' ),
		'menu_name'         => __( 'Portfolio Categories', 'school-theme' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'show_in_rest'      => true,
		'rewrite'           => array( 'slug' => 'portfolio-category' ),
	);

	register_taxonomy( 'portfolio_category', array( 'portfolio' ), $args );
}
add_action( 'init', 'school_register_portfolio_taxonomy' );
```

Nu får Portfolio en egen taxonomy: `portfolio_category`. Det betyder att portfolio inte delar kategorier med vanliga inlägg.

### Förklaring av koden (viktigaste delarna)

- `school_register_portfolio_post_type()` är vår funktion som beskriver hur post typen ska fungera.
- `$labels` styr texter i adminpanelen, till exempel "Add New Portfolio Item".
- `$args` styr beteendet:
	- `public => true` gör typen synlig i admin och på frontend.
	- `show_in_rest => true` gör att Gutenberg-editorn och REST API fungerar.
	- `supports` talar om vilka fält som finns (titel, editor, utvald bild, utdrag).
	- `editor` gör att du kan skriva innehållstext för varje portfolio-item.
	- `rewrite` bestämmer URL-struktur, här `/portfolio/...`.
- `register_post_type( 'portfolio', $args )` registrerar själva typen i WordPress.
- `add_action( 'init', ... )` betyder: kör funktionen när WordPress startar upp (hook/action, krok/händelse).
- `register_taxonomy( 'portfolio_category', array( 'portfolio' ), $args )` skapar egna portfolio-kategorier.

### Hur ser du att det fungerar?

Efter att koden laddats ska du se en ny meny i adminpanelen: **Portfolio**.

Om du inte ser den:

1. kontrollera att funktionen ligger i fil som verkligen laddas
2. uppdatera sidan i adminpanelen
3. gå till **Inställningar > Permalänkar** och klicka "Spara" en gång

## 2) Skapa shortcode för att visa Portfolio

Nu skapar vi en shortcode som hämtar Portfolio-inlägg och skriver ut dem som en **grid**.

Varje ruta i griden ska:

- använda Featured Image som bakgrund
- visa titel
- länka till portfolio-itemets sida
- visa kategorier

```php
function school_portfolio_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'count'    => 6,
			'category' => '',
		),
		$atts,
		'portfolio_grid'
	);

	$query_args = array(
		'post_type'      => 'portfolio',
		'posts_per_page' => (int) $atts['count'],
	);

	if ( ! empty( $atts['category'] ) ) {
		$query_args['tax_query'] = array(
			array(
				'taxonomy' => 'portfolio_category',
				'field'    => 'slug',
				'terms'    => sanitize_text_field( $atts['category'] ),
			),
		);
	}

	$portfolio_query = new WP_Query( $query_args );

	if ( ! $portfolio_query->have_posts() ) {
		return '<p>Inga portfolio-inlägg hittades.</p>';
	}

	ob_start();
	echo '<div class="portfolio-grid">';

	while ( $portfolio_query->have_posts() ) {
		$portfolio_query->the_post();

		$item_id    = get_the_ID();
		$item_url   = get_permalink( $item_id );
		$item_title = get_the_title( $item_id );
		$image_url  = get_the_post_thumbnail_url( $item_id, 'large' );
		$terms      = get_the_terms( $item_id, 'portfolio_category' );

		echo '<article class="portfolio-grid__item" style="background-image:url(' . esc_url( $image_url ) . ');">';
		echo '<div class="portfolio-grid__overlay">';
		echo '<h3 class="portfolio-grid__title">';
		echo '<a href="' . esc_url( $item_url ) . '">' . esc_html( $item_title ) . '</a>';
		echo '</h3>';

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			echo '<p class="portfolio-grid__categories">';
			foreach ( $terms as $term ) {
				echo '<span>' . esc_html( $term->name ) . '</span> ';
			}
			echo '</p>';
		}

		echo '</div>';
		echo '</article>';
	}

	echo '</div>';

	wp_reset_postdata();
	return ob_get_clean();
}
add_shortcode( 'portfolio_grid', 'school_portfolio_shortcode' );
```

### Förklaring av koden (steg för steg)

- `add_shortcode( 'portfolio_grid', ... )` kopplar texten `[portfolio_grid]` till vår PHP-funktion.
- `$atts = shortcode_atts(...)` sätter standardvärden:
	- `count` = hur många poster som visas
	- `category` = valfritt filter på kategori
- `new WP_Query(...)` gör en databasfråga och hämtar rätt Portfolio-poster.
- `if ( ! $portfolio_query->have_posts() )` hanterar fallet där inget hittas.
- `ob_start()` startar output buffering (utmatningsbuffert): vi bygger HTML som en sträng och returnerar den.
- Loopen `while ( $portfolio_query->have_posts() )` går igenom varje träff och skriver ut en grid-ruta.
- `get_the_post_thumbnail_url()` hämtar bild-URL för bakgrunden.
- `get_the_terms( $item_id, 'portfolio_category' )` hämtar portfolio-kategorier för just den posten.
- `esc_url()` och `esc_html()` skyddar output.
- `wp_reset_postdata()` återställer WordPress globala loop så annan kod inte påverkas.

### CSS för griden (lägg i ditt tema)

```css
.portfolio-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 20px;
}

.portfolio-grid__item {
	min-height: 260px;
	background-size: cover;
	background-position: center;
	border-radius: 10px;
	overflow: hidden;
}

.portfolio-grid__overlay {
	min-height: 260px;
	background: rgba(0, 0, 0, 0.45);
	color: #ffffff;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 8px;
}

.portfolio-grid__title {
	margin: 0;
}

.portfolio-grid__title a {
	color: #ffffff;
	text-decoration: none;
}

.portfolio-grid__categories {
	margin: 0;
	font-size: 0.9rem;
}
```

## 3) Använd shortcoden på en sida

Grundexempel:

```text
[portfolio_grid]
```

Med parametrar:

```text
[portfolio_grid count="3" category="webbdesign"]
```

- `count` styr antal inlägg
- `category` filtrerar på portfolio-kategorins slug

Tips: `category` ska vara slug för **portfolio category**, inte visningsnamn. Om kategorin heter "Webbdesign" kan slug vara `webbdesign`.

## 4) Egen template för portfolio item

För att styra hur en enskild Portfolio-post visas skapar du en template-fil i temat:

```text
wp-content/themes/ditt-tema/single-portfolio.php
```

WordPress template hierarchy (mall-hierarki) gör att `single-portfolio.php` används automatiskt för post typen `portfolio`.

Exempel:

```php
<?php
get_header();

if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		$terms = get_the_terms( get_the_ID(), 'portfolio_category' );
		?>
		<main class="portfolio-single">
			<h1><?php the_title(); ?></h1>

			<?php if ( has_post_thumbnail() ) : ?>
				<div class="portfolio-single__image">
					<?php the_post_thumbnail( 'large' ); ?>
				</div>
			<?php endif; ?>

			<div class="portfolio-single__content">
				<?php the_content(); ?>
			</div>

			<?php if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) : ?>
				<p class="portfolio-single__categories">
					<?php foreach ( $terms as $term ) : ?>
						<span><?php echo esc_html( $term->name ); ?></span>
					<?php endforeach; ?>
				</p>
			<?php endif; ?>
		</main>
		<?php
	endwhile;
endif;

get_footer();
```

Nu får varje portfolio-item en egen visning med titel, bild, innehåll och kategorier.

## Säkerhet och kvalitet

I koden ovan används:

- `sanitize_text_field()` för indata från shortcode-attribut
- `esc_url()` och `esc_html()` vid utskrift
- `wp_reset_postdata()` för att återställa global loop

Detta minskar risk för fel och gör koden säkrare i praktisk användning.

## Vanliga nybörjarfel (och lösning)

1. **Shortcoden visar inget**
	- Kontrollera att det finns publicerade Portfolio-inlägg.
2. **Kategorifilter fungerar inte**
	- Kontrollera att du använder slug från `portfolio_category` i `category`.
3. **Portfolio syns inte i admin**
	- Kontrollera stavning på `register_post_type` och hooken `init`.
4. **Konstig visning efter egen query**
	- Kontrollera att `wp_reset_postdata()` finns kvar.
5. **Template-filen används inte**
	- Kontrollera att filen heter exakt `single-portfolio.php`.

## Sammanfattning

Du har nu byggt en egen innehållstyp och en återanvändbar shortcode. Det är en vanlig och viktig grund i WordPress-utveckling: först modellera innehållet (post type), sedan visa det där redaktören behöver det (shortcode).

## Praktisk övning

1. Skapa tre Portfolio-inlägg.
2. Skapa minst två `Portfolio Categories` och koppla dem till inläggen.
3. Skapa en sida med `[portfolio_grid]`.
4. Skapa en till sida med `[portfolio_grid count="2" category="webbdesign"]`.
5. Skapa `single-portfolio.php` i ditt tema och testa en enskild portfolio-post.
