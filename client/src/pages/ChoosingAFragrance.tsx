import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { DEFAULT_WHATSAPP_NUMBER, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";
import { defaultProducts } from "@/data/products";

export default function ChoosingAFragrance() {
  return (
    <div className="site-shell about-editorial fragrance-guide-page">
      <header className="site-nav is-scrolled">
        <Link href="/home/" className="site-brand" aria-label="ISTH perfume collection"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="ISTH" /></Link>
        <nav className="desktop-nav" aria-label="Main navigation"><Link href="/home/">Perfume collection</Link><Link href="/about/">About ISTH</Link></nav>
        <div className="site-actions"><Link href="/home/#collection" className="action-link">All fragrances</Link></div>
      </header>

      <main className="fragrance-guide-main">
        <nav className="product-detail-breadcrumbs" aria-label="Breadcrumb"><Link href="/">ISTH</Link><span aria-hidden="true">/</span><Link href="/home/">Perfume collection</Link><span aria-hidden="true">/</span><span aria-current="page">Choosing a fragrance</span></nav>
        <header className="fragrance-guide-heading">
          <p className="product-detail-kicker">ISTH · A note-led guide</p>
          <h1>How to choose a perfume: start with the notes</h1>
          <p>This guide compares the names, notes, and descriptions currently published in the ISTH collection. It is not a ranking: the right fragrance depends on what you enjoy, and no wear-time, rating, or “best in India” claim is made here.</p>
        </header>

        <section className="fragrance-guide-steps" aria-label="How to compare fragrances">
          <article><span>01</span><div><h2>Start with notes you recognize</h2><p>Shortlist a few listed notes that appeal to you, then compare the complete combinations. Kawaii Marshmallow lists marshmallow, vanilla chocolate, and musk; Éclat Courinné lists aqua, lavender, and citrus; Fiery Soul lists rum, kesar, and oud.</p></div></article>
          <article><span>02</span><div><h2>Read the full description</h2><p>A shared note does not make two fragrances identical. Use each published composition description alongside its note list; the descriptions below reflect ISTH’s own catalog wording.</p></div></article>
          <article><span>03</span><div><h2>Ask for current order details</h2><p>Prices, sizes, and availability are not displayed in the catalog. Ask ISTH through the existing WhatsApp ordering path before placing an order.</p></div></article>
        </section>

        <section className="fragrance-guide-catalog" aria-labelledby="guide-catalog-title">
          <div className="fragrance-guide-catalog-heading"><p className="product-detail-kicker">The current collection</p><h2 id="guide-catalog-title">Compare the published fragrance notes</h2></div>
          <div className="fragrance-guide-table-wrap"><table><thead><tr><th scope="col">ISTH fragrance</th><th scope="col">Listed notes</th><th scope="col">Published description</th></tr></thead><tbody>{defaultProducts.map((product) => <tr key={product.id}><th scope="row"><Link href={`/products/${product.id}/`}>{product.name}<ArrowRight size={14} aria-hidden="true" /></Link></th><td>{product.notes}</td><td>{product.description}</td></tr>)}</tbody></table></div>
        </section>

        <section className="fragrance-guide-close"><div><h2>Found a composition to explore?</h2><p>Open its detail page for the published notes and description, then contact ISTH on WhatsApp for current ordering details.</p></div><Link className="cherry-button" href="/home/#collection">Browse the collection <ArrowRight size={15} /></Link></section>
      </main>

      <footer className="site-footer about-footer"><div className="footer-top"><div><Link href="/home/" className="footer-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="ISTH" /></Link><p>estd. 2021</p></div><div className="footer-links"><div><span>Explore</span><Link href="/home/#collection">The collection</Link><Link href="/about/">About ISTH</Link><Link href="/guides/choosing-a-fragrance/">Choosing a fragrance</Link></div><div><span>Direct</span><a href="mailto:isth.support@gmail.com">Email</a><a href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a></div></div></div><div className="footer-bottom"><span>© 2026 isth Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span></div></footer>
    </div>
  );
}
