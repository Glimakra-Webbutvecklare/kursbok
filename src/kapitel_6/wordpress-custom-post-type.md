# Egen post type i WordPress (Portfolio)

I den här lektionen skapar vi en egen post type (innehållstyp) med namnet **Portfolio**. Vi lägger också till stöd för kategorier och bygger en shortcode (kortkod) så innehållet kan visas på valfri sida.

## Förkunskaper

Innan du börjar är det bra om du har läst:

- [WordPress](./wordpress.md)
- [WordPress teman](./wordpress-teman.md)
- [WordPress plugins](./wordpress-plugins.md)

## Varför använda en egen post type?

Standardtyperna i WordPress är **Inlägg** och **Sidor**. För innehåll som inte riktigt passar där, till exempel projekt, case eller kundjobb, blir en egen post type tydligare.

Exempel:

- Inlägg = nyheter och blogg
- Sidor = statiska undersidor
- Portfolio = projekt och referenser

Det gör adminpanelen enklare för redaktören och minskar risken att innehåll blandas ihop.

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
		'taxonomies'            => array( 'category' ),
	);

	register_post_type( 'portfolio', $args );
}
add_action( 'init', 'school_register_portfolio_post_type' );
```

`'taxonomies' => array( 'category' )` betyder att Portfolio får stöd för samma kategorier som vanliga inlägg.

## 2) Skapa shortcode för att visa Portfolio

Nu skapar vi en shortcode som hämtar Portfolio-inlägg och skriver ut dem som en lista.

```php
function school_portfolio_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'count'    => 6,
			'category' => '',
		),
		$atts,
		'portfolio_list'
	);

	$query_args = array(
		'post_type'      => 'portfolio',
		'posts_per_page' => (int) $atts['count'],
	);

	if ( ! empty( $atts['category'] ) ) {
		$query_args['category_name'] = sanitize_text_field( $atts['category'] );
	}

	$portfolio_query = new WP_Query( $query_args );

	if ( ! $portfolio_query->have_posts() ) {
		return '<p>Inga portfolio-inlägg hittades.</p>';
	}

	ob_start();
	echo '<ul class="portfolio-list">';

	while ( $portfolio_query->have_posts() ) {
		$portfolio_query->the_post();
		echo '<li>';
		echo '<a href="' . esc_url( get_permalink() ) . '">';
		echo esc_html( get_the_title() );
		echo '</a>';
		echo '</li>';
	}

	echo '</ul>';

	wp_reset_postdata();
	return ob_get_clean();
}
add_shortcode( 'portfolio_list', 'school_portfolio_shortcode' );
```

## 3) Använd shortcoden på en sida

Grundexempel:

```text
[portfolio_list]
```

Med parametrar:

```text
[portfolio_list count="3" category="webbdesign"]
```

- `count` styr antal inlägg
- `category` filtrerar på kategorins slug

## Säkerhet och kvalitet

I koden ovan används:

- `sanitize_text_field()` för indata från shortcode-attribut
- `esc_url()` och `esc_html()` vid utskrift
- `wp_reset_postdata()` för att återställa global loop

Detta minskar risk för fel och gör koden säkrare i praktisk användning.

## Praktisk övning

1. Skapa tre Portfolio-inlägg.
2. Lägg dem i minst två olika kategorier.
3. Skapa en sida med `[portfolio_list]`.
4. Skapa en till sida med `[portfolio_list count="2" category="webbdesign"]`.
5. Jämför resultaten och förklara vad parametrarna gör.
