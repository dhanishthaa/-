import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link, useRoute } from "wouter";
import ProductGallery from "@/components/ProductGallery";
import { DEFAULT_WHATSAPP_NUMBER, getProductWhatsAppUrl, INSTAGRAM_URL, readLogoUrl } from "@/data/brand";
import { useAutoHideNavbar } from "@/hooks/useAutoHideNavbar";
import { defaultProducts, findProductByRouteSlug, getProductRouteSlug, type Product } from "@/data/products";
import { fetchRemoteProducts } from "@/lib/supabase";
import { getProductPagePath } from "@/seo/site";

export default function ProductDetail() {
  const { navFolded } = useAutoHideNavbar();
  const [matched, params] = useRoute("/products/:productId");
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    let active = true;
    fetchRemoteProducts().then((remote) => { if (active && remote?.length) setProducts(remote); });
    return () => { active = false; };
  }, []);

  const product = matched ? findProductByRouteSlug(params?.productId ?? "", products) : undefined;

  useEffect(() => {
    if (product && params?.productId && params.productId !== getProductRouteSlug(product)) {
      window.location.replace(getProductPagePath(product));
    }
  }, [product, params?.productId]);

  if (!product) {
    return <main className="product-detail-not-found"><h1>Fragrance not found</h1><p>This fragrance is not part of the current ISTH collection.</p><Link href="/home/">Browse the collection</Link></main>;
  }

  const whatsappUrl = getProductWhatsAppUrl(product.name);

  return (
    <div className="site-shell about-editorial product-detail-page">
      <header className={`site-nav is-scrolled ${navFolded ? "is-folded" : ""}`}>
        <Link href="/home/" className="site-brand" aria-label="ISTH perfume collection">
          <img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="ISTH" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/home/">Perfume collection</Link>
          <Link href="/about/">About ISTH</Link>
          <Link href="/guides/choosing-a-fragrance/">Choosing a fragrance</Link>
        </nav>
        <div className="site-actions"><Link href="/home/#collection" className="action-link">All fragrances</Link></div>
      </header>

      <main className="product-detail-main">
        <nav className="product-detail-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">ISTH</Link><span aria-hidden="true">/</span>
          <Link href="/home/">Perfume collection</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <section className="product-detail-layout" aria-labelledby="product-detail-title">
          <div className="product-detail-media"><ProductGallery product={product} /></div>
          <div className="product-detail-copy">
            <p className="product-detail-kicker">ISTH · {product.collection}</p>
            <h1 id="product-detail-title">{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <div className="product-detail-notes">
              <h2>Listed fragrance notes</h2>
              <p>{product.notes}</p>
              <small>Notes are shown as published in the ISTH collection; no top, middle, or base-note structure is implied.</small>
            </div>
            <p className="product-detail-order-note">Ask ISTH on WhatsApp for current ordering details, including price and available sizes.</p>
            <div className="product-detail-actions">
              <a className="cherry-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Ask about this scent</a>
              <Link className="product-detail-back" href="/home/#collection"><ArrowLeft size={14} /> Back to the collection</Link>
            </div>
          </div>
        </section>

        <section className="product-detail-context" aria-label="More about ISTH fragrances">
          <p>Part of the current ISTH fragrance collection.</p>
          <Link href="/guides/choosing-a-fragrance/">Read the note-led guide to choosing a fragrance</Link>
        </section>
      </main>

      <footer className="site-footer about-footer product-detail-footer">
        <div className="footer-top">
          <div><Link href="/home/" className="footer-brand"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="ISTH" /></Link><p>estd. 2021</p></div>
          <div className="footer-links">
            <div><span>Explore</span><Link href="/home/#collection">The collection</Link><Link href="/about/">About ISTH</Link><Link href="/guides/choosing-a-fragrance/">Choosing a fragrance</Link></div>
            <div><span>Direct</span><a href="mailto:isth.support@gmail.com">Email</a><a href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a className="footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src="/assets/instagram-icon.png" alt="" aria-hidden="true" width={16} height={16} />Instagram</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 isth Fragrance House</span><span>Gujarat, India / Mon–Sat, 10am–7pm IST</span></div>
      </footer>
    </div>
  );
}
