// Quiet Atelier style reminder: admin is a calm instrument panel—functional, role-aware, and visually continuous with isth.
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, BarChart3, Check, Edit3, Eye, EyeOff, ImagePlus, LogOut, Package, Plus, Save, Trash2, Video, X } from "lucide-react";
import { Link } from "wouter";
import { defaultProducts, type Product } from "@/data/products";
import { DEFAULT_HERO_CAROUSEL, deletePublicAsset, deleteRemoteProduct, fetchAdminRole, fetchPublicHeroCarousel, fetchRemoteProducts, isSupabaseConfigured, savePublicSetting, supabase, type HeroCarouselSettings, type HeroSlide, uploadPublicAsset, upsertRemoteProduct } from "@/lib/supabase";
import { isSafeAssetFile, isSafeHttpUrl, readLogoUrl, readVideoUrl, writeLogoUrl, writeVideoUrl } from "@/data/brand";

type SessionUser = { email: string; id?: string; role?: string } | null;
type WorkspaceView = "overview" | "products" | "media";

export default function Admin() {
  const [user, setUser] = useState<SessionUser>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [active, setActive] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("overview");
  const overviewRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    const client = supabase;
    if (!client) return;
    const hydrate = async (session: { user: { id: string; email?: string; email_confirmed_at?: string | null } } | null) => {
      if (!session?.user.email || !session.user.email_confirmed_at) {
        if (session?.user) {
          await client.auth.signOut();
          setMessage("Invalid username or password.");
        }
        return setUser(null);
      }
      const role = await fetchAdminRole();
      if (role === "super_admin") {
        setUser({ email: session.user.email, id: session.user.id, role });
        return;
      }
      await client.auth.signOut();
      setUser(null);
      setMessage("Invalid username or password.");
    };
    client.auth.getSession().then(({ data }) => { void hydrate(data.session as typeof data.session & { user: { email?: string; email_confirmed_at?: string | null } }); });
    // Supabase holds an internal auth lock while notifying listeners. Defer
    // the role RPC so it never runs nested inside onAuthStateChange.
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => { void hydrate(session as typeof session & { user: { email?: string; email_confirmed_at?: string | null } }); }, 0);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) return setMessage("Invalid username or password.");
    if (!supabase) return setMessage("Invalid username or password.");
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error || !data.session) return setMessage("Invalid username or password.");
  };

  const resetPassword = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) return setMessage("Enter your email address to reset your password.");
    if (!supabase) return setMessage("Unable to send a reset email. Please try again.");
    const redirectTo = new URL("/isth/frag/minda", window.location.origin).toString();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });
    if (error) return setMessage("Unable to send a reset email. Please try again.");
    setMessage("If the account is eligible, a reset email has been sent.");
  };

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); setUser(null); };
  const saveProduct = async (product: Product) => {
    const synced = await upsertRemoteProduct(product);
    if (!synced.ok) {
      console.error("Admin product save failed", synced.error);
      return setMessage(synced.error ? `Unable to save: ${synced.error}` : "Unable to save this composition. Your secure session may have expired.");
    }
    const next = isNew ? [...products, product] : products.map((item) => item.id === product.id ? product : item);
    setProducts(next); setActive(null); setIsNew(false); setMessage("Saved to the isth product library.");
  };
  const deleteProduct = async (id: string) => {
    const synced = await deleteRemoteProduct(id);
    if (!synced) return setMessage("Unable to remove this composition. Your secure session may have expired.");
    setProducts((current) => current.filter((item) => item.id !== id)); setMessage("Product removed from the isth library.");
  };
  const activateWorkspace = (view: WorkspaceView) => {
    setWorkspaceView(view);
    if (view === "media") setMediaOpen(true);
    window.requestAnimationFrame(() => {
      const target = view === "overview" ? overviewRef.current : view === "products" ? productsRef.current : mediaRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const openPublicSite = () => window.open("/home", "_blank", "noopener,noreferrer");

  if (!user) return <main className="admin-login"><div className="admin-login-card"><Link className="back-link" href="/home"><ArrowLeft size={14} /> Back to isth</Link><div className="admin-login-mark"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></div><p className="eyebrow">Private room / Admin</p><h1>Keep the house<br /><em>in order.</em></h1><p className="admin-intro">Manage compositions, descriptions, bottle formats, and the public scent library from one quiet workspace.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@isth.house" autoComplete="email" required /></label><label>Password<span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" minLength={6} required /><button className="password-visibility" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <Eye size={17} /> : <EyeOff size={17} />}</button></span></label><div className="admin-login-actions"><button className="cherry-button" type="submit">Enter the room <ArrowLeft size={14} className="turn-arrow" /></button><button className="plain-button" type="button" onClick={resetPassword}>Forgot password?</button></div></form>{message && <p className="form-message">{message}</p>}</div><div className="admin-login-aside"><span>isth / private</span><p>Access is reserved<br />for the house.</p></div></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/home" className="admin-brand"><img className="brand-logo brand-logo-light" src={readLogoUrl()} alt="isth" /></Link><div className="admin-side-nav"><span className="side-label">Workspace</span><button className={workspaceView === "overview" ? "is-active" : ""} onClick={() => activateWorkspace("overview")} aria-current={workspaceView === "overview" ? "page" : undefined}><BarChart3 size={16} /> Overview</button><button className={workspaceView === "products" ? "is-active" : ""} onClick={() => activateWorkspace("products")} aria-current={workspaceView === "products" ? "page" : undefined}><Package size={16} /> Products <span>{products.length}</span></button><button className={workspaceView === "media" ? "is-active" : ""} onClick={() => activateWorkspace("media")} aria-current={workspaceView === "media" ? "page" : undefined}><ImagePlus size={16} /> Brand & media</button><button onClick={openPublicSite}><Eye size={16} /> Public site</button></div><div className="admin-side-bottom"><span className="admin-status"><i /> {isSupabaseConfigured ? `${user.role ?? "admin"} / connected` : "Local preview"}</span><button onClick={signOut}><LogOut size={15} /> Sign out</button></div></aside><section className="admin-content"><header className="admin-header" ref={overviewRef}><div><p className="eyebrow">Private room / Overview</p><h1>Good morning, <em>house.</em></h1></div><Link className="outline-button dark" href="/home">View storefront <Eye size={14} /></Link></header><div className="admin-stats"><div><span>Published compositions</span><strong>{products.length}</strong><small>in the scent library</small></div><div><span>Public visits</span><strong>—</strong><small>connect analytics to measure</small></div><div><span>Session</span><strong>{user.role === "preview" ? "Preview" : "Live"}</strong><small>{user.email}</small></div></div><div className="admin-products-section" ref={productsRef}><div className="admin-section-head"><div><p className="eyebrow">Scent library</p><h2>Compositions</h2></div><button className="cherry-button" onClick={() => { setIsNew(true); setActive({ id: `new-${Date.now()}`, name: "", notes: "", description: "", collection: "Signature", color: "#5B0D18", size: "10ml tower" }); }}><Plus size={15} /> New composition</button></div>{message && <div className="admin-toast"><Check size={15} /> {message}<button onClick={() => setMessage("")}><X size={13} /></button></div>}<div className="admin-table"><div className="admin-table-head"><span>Composition</span><span>Format</span><span>Notes</span><span>Actions</span></div>{products.map((product) => <div className="admin-row" key={product.id}><div className="admin-product-cell"><span className="admin-swatch" style={{ background: product.color }} /><div><strong>{product.name}</strong><small>{product.id}</small></div></div><span>{product.size}</span><span>{product.notes}</span><div className="admin-row-actions"><button onClick={() => { setIsNew(false); setActive(product); }} aria-label={`Edit ${product.name}`}><Edit3 size={15} /></button><button onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button></div></div>)}</div></div><div ref={mediaRef}>{mediaOpen && <MediaSettings />}</div></section>{active && <ProductEditor product={active} isNew={isNew} onSave={saveProduct} onClose={() => { setActive(null); setIsNew(false); }} />}</main>;
}

function ProductEditor({ product, isNew, onSave, onClose }: { product: Product; isNew: boolean; onSave: (product: Product) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(product);
  const update = (key: keyof Product, value: string | boolean) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="editor-backdrop"><div className="editor-panel"><header><div><p className="eyebrow">{isNew ? "New composition" : "Edit composition"}</p><h2>{isNew ? "Compose a scent." : draft.name}</h2></div><button onClick={onClose} aria-label="Close editor"><X size={18} /></button></header><div className="editor-form"><label>Name<input maxLength={80} value={draft.name} onChange={(event) => update("name", event.target.value)} /></label><label>Notes<input maxLength={160} value={draft.notes} onChange={(event) => update("notes", event.target.value)} /></label><label>Format<select value={draft.size} onChange={(event) => update("size", event.target.value)}><option value="10ml tower">10ml tower</option><option value="30ml cosmos">30ml cosmos</option></select></label><label>Color<input value={draft.color} onChange={(event) => update("color", event.target.value)} /></label><label className="wide">Image URL<input value={draft.image || ""} onChange={(event) => update("image", event.target.value)} placeholder="https://… or bottle placeholder" /></label><label className="wide">Description<textarea rows={4} maxLength={500} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label><label className="checkbox-label"><input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update("featured", event.target.checked)} /> Feature on the storefront</label></div><button className="cherry-button" onClick={() => onSave(draft)}><Save size={15} /> Save composition</button></div></div>;
}

function MediaSettings() {
  const [logo, setLogo] = useState(readLogoUrl()); const [video, setVideo] = useState(readVideoUrl()); const [status, setStatus] = useState("");
  const [carousel, setCarousel] = useState<HeroCarouselSettings>(DEFAULT_HERO_CAROUSEL);
  const [carouselSaving, setCarouselSaving] = useState(false);
  useEffect(() => { fetchPublicHeroCarousel().then((remote) => { if (remote) setCarousel(remote); }); }, []);
  const handleFile = async (file: File | undefined, kind: "logo" | "video") => {
    if (!file || !isSafeAssetFile(file)) return setStatus("Use JPG, PNG, WebP, AVIF, MP4, or WebM files up to 10MB.");
    const remoteUrl = await uploadPublicAsset(file, kind === "logo" ? "brand" : "motion");
    if (!remoteUrl) return setStatus("Upload rejected. Confirm your secure Supabase session and storage policy.");
    const saved = await savePublicSetting(kind === "logo" ? "logo_url" : "motion_video_url", remoteUrl);
    if (!saved) return setStatus("Upload succeeded, but publishing the setting was rejected.");
    if (kind === "logo") { setLogo(remoteUrl); writeLogoUrl(remoteUrl); } else { setVideo(remoteUrl); writeVideoUrl(remoteUrl); }
    setStatus("Uploaded and published through the secured media workflow.");
  };
  const saveUrl = async (kind: "logo" | "video") => {
    const value = kind === "logo" ? logo : video;
    if (value && !isSafeHttpUrl(value) && !value.startsWith("/assets/") && !value.startsWith("/manus-storage/")) return setStatus("Asset URLs must use HTTPS or an approved storage path.");
    const synced = await savePublicSetting(kind === "logo" ? "logo_url" : "motion_video_url", value);
    if (!synced) return setStatus("Setting change rejected. Confirm your secure Supabase session and policy.");
    if (kind === "logo") writeLogoUrl(value); else writeVideoUrl(value);
    setStatus("Asset setting saved through the secured publishing workflow.");
  };
  const saveCarousel = async (next: HeroCarouselSettings) => { setCarousel(next); setCarouselSaving(true); const saved = await savePublicSetting("hero_carousel", JSON.stringify(next)); setCarouselSaving(false); setStatus(saved ? "Hero carousel published." : "Carousel publish rejected. Confirm your secure session and migration."); };
  const updateGallery = (kind: "desktop" | "mobile", slides: HeroSlide[]) => setCarousel((current) => ({ ...current, [kind]: slides }));
  const addHeroFiles = async (files: FileList | null, kind: "desktop" | "mobile") => {
    if (!files?.length) return;
    setStatus("Uploading hero images…");
    const uploaded: HeroSlide[] = [];
    for (const file of Array.from(files)) { if (!isSafeAssetFile(file)) continue; const url = await uploadPublicAsset(file, kind === "desktop" ? "hero-desktop" : "hero-mobile"); if (url) uploaded.push({ id: crypto.randomUUID(), url, focalX: 50, focalY: 50 }); }
    if (!uploaded.length) return setStatus("No images uploaded. Use JPG, PNG, WebP, or AVIF files up to 10MB.");
    const next = { ...carousel, [kind]: [...carousel[kind], ...uploaded] };
    await saveCarousel(next);
  };
  const removeHeroSlide = async (kind: "desktop" | "mobile", slide: HeroSlide) => { const next = { ...carousel, [kind]: carousel[kind].filter((item) => item.id !== slide.id) }; await deletePublicAsset(slide.url); await saveCarousel(next); };
  const moveHeroSlide = (kind: "desktop" | "mobile", index: number, direction: -1 | 1) => { const next = [...carousel[kind]]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; updateGallery(kind, next); };
  const renderGallery = (kind: "desktop" | "mobile", title: string) => <div className="hero-gallery"><div className="hero-gallery-head"><div><span className="eyebrow">{kind === "desktop" ? "Large screens" : "Small screens"}</span><h3>{title}</h3></div><label className="cherry-button media-upload-button"><ImagePlus size={15} /> Add images<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => { void addHeroFiles(event.target.files, kind); event.currentTarget.value = ""; }} /></label></div><div className="hero-gallery-grid">{carousel[kind].map((slide, index) => <article className="hero-slide-card" key={slide.id}><img src={slide.url} alt={`${title} slide ${index + 1}`} style={{ objectPosition: `${slide.focalX}% ${slide.focalY}%` }} /><div className="hero-slide-controls"><span>Slide {index + 1}</span><button type="button" onClick={() => moveHeroSlide(kind, index, -1)} disabled={index === 0} aria-label="Move slide left">←</button><button type="button" onClick={() => moveHeroSlide(kind, index, 1)} disabled={index === carousel[kind].length - 1} aria-label="Move slide right">→</button><button type="button" onClick={() => { void removeHeroSlide(kind, slide); }} aria-label="Remove slide"><Trash2 size={13} /></button></div><label className="focal-control">Focal X <input type="range" min="0" max="100" value={slide.focalX} onChange={(event) => updateGallery(kind, carousel[kind].map((item) => item.id === slide.id ? { ...item, focalX: Number(event.target.value) } : item))} /></label><label className="focal-control">Focal Y <input type="range" min="0" max="100" value={slide.focalY} onChange={(event) => updateGallery(kind, carousel[kind].map((item) => item.id === slide.id ? { ...item, focalY: Number(event.target.value) } : item))} /></label></article>)}</div><button className="outline-button dark hero-gallery-save" type="button" onClick={() => { void saveCarousel(carousel); }} disabled={carouselSaving}>{carouselSaving ? "Publishing…" : "Publish gallery changes"}</button></div>;
  return <div className="admin-media-panel"><div><p className="eyebrow">Brand & media</p><h2>Shape the public room.</h2><p>Logo, motion, and responsive hero galleries publish through the secured Supabase workflow. Hero slides loop every two seconds by default.</p></div><div className="media-form"><label><ImagePlus size={14} /> Logo URL<input value={logo} onChange={(event) => setLogo(event.target.value)} onBlur={() => saveUrl("logo")} /></label><label><ImagePlus size={14} /> Upload logo<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => handleFile(event.target.files?.[0], "logo")} /></label><label><Video size={14} /> Video URL<input value={video} onChange={(event) => setVideo(event.target.value)} onBlur={() => saveUrl("video")} placeholder="https://…/isth-loop.mp4" /></label><label><Video size={14} /> Upload motion video<input type="file" accept="video/mp4,video/webm" onChange={(event) => handleFile(event.target.files?.[0], "video")} /></label></div><div className="hero-carousel-settings"><label>Autoplay interval <select value={carousel.interval} onChange={(event) => setCarousel((current) => ({ ...current, interval: Number(event.target.value) }))}><option value={1000}>1 second</option><option value={2000}>2 seconds</option><option value={3000}>3 seconds</option><option value={5000}>5 seconds</option></select></label>{renderGallery("desktop", "Desktop hero gallery")}{renderGallery("mobile", "Mobile hero gallery")}</div>{status && <p className="form-message">{status}</p>}</div>;
}
