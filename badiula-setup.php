<?php
/**
 * Plugin Name: Badiula Headless Setup
 * Description: Configura CPT, Options Pages, CORS e ISR per il sito headless Badiula.
 * Version: 1.1.0
 * Author: Badiula
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

error_reporting( E_ALL );

// ─── 1. Custom Post Types ─────────────────────────────────────────────────────

add_action( 'init', function () {

	// CPT: prodotto
	register_post_type( 'prodotto', [
		'labels' => [
			'name'               => 'Prodotti',
			'singular_name'      => 'Prodotto',
			'add_new'            => 'Aggiungi prodotto',
			'add_new_item'       => 'Aggiungi nuovo prodotto',
			'edit_item'          => 'Modifica prodotto',
			'new_item'           => 'Nuovo prodotto',
			'view_item'          => 'Visualizza prodotto',
			'search_items'       => 'Cerca prodotti',
			'not_found'          => 'Nessun prodotto trovato',
			'not_found_in_trash' => 'Nessun prodotto nel cestino',
		],
		'public'              => true,
		'has_archive'         => true,
		'rewrite'             => [ 'slug' => 'prodotti' ],
		'supports'            => [ 'title', 'editor', 'excerpt', 'thumbnail' ],
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'prodotto',
		'graphql_plural_name' => 'prodotti',
		'menu_icon'           => 'dashicons-cart',
	] );

	// CPT: sezione_azienda (solo backend — non pubblica)
	register_post_type( 'sezione_azienda', [
		'labels' => [
			'name'               => 'Sezioni Azienda',
			'singular_name'      => 'Sezione Azienda',
			'add_new'            => 'Aggiungi sezione',
			'add_new_item'       => 'Aggiungi nuova sezione',
			'edit_item'          => 'Modifica sezione',
			'new_item'           => 'Nuova sezione',
			'search_items'       => 'Cerca sezioni',
			'not_found'          => 'Nessuna sezione trovata',
			'not_found_in_trash' => 'Nessuna sezione nel cestino',
		],
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'supports'            => [ 'title', 'editor' ],
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'sezioneAzienda',
		'graphql_plural_name' => 'sezioniAzienda',
		'menu_icon'           => 'dashicons-building',
	] );

} );

// ─── 2. ACF Options Pages ─────────────────────────────────────────────────────

add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	// Parent: Opzioni Globali
	acf_add_options_page( [
		'page_title'         => 'Opzioni Globali Badiula',
		'menu_title'         => 'Opzioni Badiula',
		'menu_slug'          => 'badiula-options',
		'capability'         => 'manage_options',
		'redirect'           => false,
		'show_in_graphql'    => true,
		'graphql_field_name' => 'opzioniGlobali',
	] );

	$sub_pages = [
		[
			'page_title'         => 'Sezioni Homepage',
			'menu_title'         => 'Sezioni Homepage',
			'menu_slug'          => 'badiula-sezioni-homepage',
			'graphql_field_name' => 'sezioniHomepage',
		],
		[
			'page_title'         => 'Pagina Azienda',
			'menu_title'         => 'Azienda',
			'menu_slug'          => 'badiula-azienda',
			'graphql_field_name' => 'paginaAzienda',
		],
		[
			'page_title'         => 'Pagina Coltivazioni',
			'menu_title'         => 'Coltivazioni',
			'menu_slug'          => 'badiula-coltivazioni',
			'graphql_field_name' => 'paginaColtivazioni',
		],
		[
			'page_title'         => 'Luce di Terra',
			'menu_title'         => 'Luce di Terra',
			'menu_slug'          => 'badiula-luce-di-terra',
			'graphql_field_name' => 'paginaLuceDiTerra',
		],
		[
			'page_title'         => 'Olio EVO',
			'menu_title'         => 'Olio EVO',
			'menu_slug'          => 'badiula-olio-evo',
			'graphql_field_name' => 'paginaOlioEvo',
		],
		[
			'page_title'         => 'Marmellate',
			'menu_title'         => 'Marmellate',
			'menu_slug'          => 'badiula-marmellate',
			'graphql_field_name' => 'paginaMarmellate',
		],
		[
			'page_title'         => 'Shop',
			'menu_title'         => 'Shop',
			'menu_slug'          => 'badiula-shop',
			'graphql_field_name' => 'paginaShop',
		],
	];

	foreach ( $sub_pages as $page ) {
		acf_add_options_sub_page( [
			'page_title'         => $page['page_title'],
			'menu_title'         => $page['menu_title'],
			'menu_slug'          => $page['menu_slug'],
			'parent_slug'        => 'badiula-options',
			'capability'         => 'manage_options',
			'show_in_graphql'    => true,
			'graphql_field_name' => $page['graphql_field_name'],
		] );
	}
} );

// ─── 3. CORS per WPGraphQL ────────────────────────────────────────────────────

add_action( 'graphql_response_headers_to_send', function ( array $headers ): array {
	$allowed_origins = [
		'http://localhost:3000',
		'https://agribadiula.it',
		'https://www.agribadiula.it',
	];

	$origin    = $_SERVER['HTTP_ORIGIN'] ?? '';
	$is_vercel = (bool) preg_match( '#^https://[a-z0-9-]+\.vercel\.app$#i', $origin );

	if ( $is_vercel || in_array( $origin, $allowed_origins, true ) ) {
		$headers['Access-Control-Allow-Origin']      = $origin;
		$headers['Access-Control-Allow-Credentials'] = 'true';
	}

	$headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
	$headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

	return $headers;
} );

// Risponde subito alle preflight OPTIONS
add_action( 'init', function () {
	if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] && str_contains( $_SERVER['REQUEST_URI'] ?? '', '/graphql' ) ) {
		$allowed_origins = [
			'http://localhost:3000',
			'https://agribadiula.it',
			'https://www.agribadiula.it',
		];

		$origin    = $_SERVER['HTTP_ORIGIN'] ?? '';
		$is_vercel = (bool) preg_match( '#^https://[a-z0-9-]+\.vercel\.app$#i', $origin );

		if ( $is_vercel || in_array( $origin, $allowed_origins, true ) ) {
			header( 'Access-Control-Allow-Origin: ' . $origin );
			header( 'Access-Control-Allow-Credentials: true' );
		}

		header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
		header( 'Content-Length: 0' );
		status_header( 204 );
		exit;
	}
} );

// ─── 4. Revalidazione ISR on-demand ──────────────────────────────────────────

/**
 * Invia una richiesta non bloccante all'endpoint ISR di Next.js.
 *
 * @param string $path Percorso da revalidare, es. '/coltivazioni'
 */
function badiula_revalidate( string $path ): void {
	$secret = defined( 'REVALIDATE_SECRET' ) ? REVALIDATE_SECRET : '';
	if ( ! $secret ) {
		return;
	}

	$endpoint = add_query_arg(
		'secret',
		$secret,
		'https://agribadiula.it/api/revalidate'
	);

	wp_remote_post( $endpoint, [
		'body'      => wp_json_encode( [ 'path' => $path ] ),
		'headers'   => [ 'Content-Type' => 'application/json' ],
		'timeout'   => 5,
		'blocking'  => false,
		'sslverify' => true,
	] );
}

// CPT: prodotto → revalida homepage e listing coltivazioni
// CPT: sezione_azienda → revalida homepage
add_action( 'save_post', function ( int $post_id ) {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}

	$cpt_paths = [
		'prodotto'        => [ '/', '/coltivazioni' ],
		'sezione_azienda' => [ '/' ],
	];

	$cpt = get_post_type( $post_id );

	if ( ! isset( $cpt_paths[ $cpt ] ) ) {
		return;
	}

	foreach ( $cpt_paths[ $cpt ] as $path ) {
		badiula_revalidate( $path );
	}
}, 10, 1 );

// Options Pages ACF → revalida la pagina corrispondente
add_action( 'acf/save_post', function ( $post_id ) {
	$options_page_paths = [
		'badiula-options'           => [ '/' ],
		'badiula-sezioni-homepage'  => [ '/' ],
		'badiula-azienda'           => [ '/azienda' ],
		'badiula-coltivazioni'      => [ '/coltivazioni' ],
		'badiula-luce-di-terra'     => [ '/luce-di-terra' ],
		'badiula-olio-evo'          => [ '/luce-di-terra/olio-evo' ],
		'badiula-marmellate'        => [ '/luce-di-terra/marmellata-agrumi' ],
		'badiula-shop'              => [ '/shop' ],
	];

	if ( ! is_string( $post_id ) || ! isset( $options_page_paths[ $post_id ] ) ) {
		return;
	}

	foreach ( $options_page_paths[ $post_id ] as $path ) {
		badiula_revalidate( $path );
	}
}, 20 );

// ─── 5. Redirect frontend → sito principale ──────────────────────────────────

add_action( 'template_redirect', function () {
	$request_uri = $_SERVER['REQUEST_URI'] ?? '/';

	$is_admin   = str_starts_with( $request_uri, '/wp-admin' );
	$is_api     = str_starts_with( $request_uri, '/wp-json' );
	$is_graphql = str_starts_with( $request_uri, '/graphql' );
	$is_login   = str_starts_with( $request_uri, '/wp-login' );
	$is_cron    = str_starts_with( $request_uri, '/wp-cron' );

	if ( $is_admin || $is_api || $is_graphql || $is_login || $is_cron ) {
		return;
	}

	wp_redirect( 'https://agribadiula.it', 301 );
	exit;
} );
