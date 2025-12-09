import { Await, useLoaderData, Link } from 'react-router';
import { Suspense } from 'react';
import { Image } from '@shopify/hydrogen';
import { ProductItem } from '~/components/ProductItem';
import Testimonials from '~/components/Testimonial';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    { title: 'Hydrogen | Premium Minimalist Store' },
    { description: 'Discover our curated collection of premium essentials.' },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context }) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({ context }) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroSection collection={data.featuredCollection} />
      <Testimonials />
      <ValuePropsSection />
      <RecommendedProducts products={data.recommendedProducts} />
      <AboutSection />
      <NewsletterSection />
    </div>
  );
}

function HeroSection({ collection }) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="hero">
      {image && (
        <Image
          data={image}
          sizes="100vw"
          loading="eager"
        />
      )}
      <div className="hero-content fade-in">
        <h1>{collection.title}</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Elevate your lifestyle with our curated essentials.
        </p>
        <Link
          className="btn"
          to={`/collections/${collection.handle}`}
        >
          Shop Collection
        </Link>
      </div>
    </section>
  );
}

function ValuePropsSection() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <div className="container">
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
          <div style={{ flex: '1 1 250px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Sustainable</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Ethically sourced materials that last a lifetime.</p>
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Minimalist</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Design that focuses on essential beauty and function.</p>
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Quality</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Craftsmanship that stands the test of time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendedProducts({ products }) {
  return (
    <section className="section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
        <h2>New Arrivals</h2>
        <Link to="/collections/all" className="link">View All &rarr;</Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="products-grid">
              {response
                ? response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--color-neutral-900)', color: 'var(--color-light)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div className="about-image" style={{ backgroundColor: 'var(--color-neutral-800)', height: '100%', minHeight: '400px', borderRadius: '4px' }}>
          {/* Placeholder for an about image if available */}
        </div>
        <div>
          <h2 style={{ color: 'var(--color-light)' }}>Our Philosophy</h2>
          <p style={{ color: 'var(--color-neutral-400)', marginBottom: '2rem' }}>
            We believe in fewer, better things. Our design philosophy is rooted in the balance of function and aesthetic,
            creating products that bring calm and clarity to your everyday life.
          </p>
          <Link to="/pages/about" className="btn" style={{ borderColor: 'var(--color-light)', color: 'var(--color-light)' }}>
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="section container" style={{ textAlign: 'center', maxWidth: '600px' }}>
      <h2>Join the Community</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Sign up for exclusive updates, new arrivals, and insider-only discounts.
      </p>
      <form style={{ display: 'flex', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid var(--border-color)',
            borderRadius: '0'
          }}
        />
        <button type="submit" className="btn">Subscribe</button>
      </form>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
