// Quiet Atelier style reminder: admin is a calm instrument panel—functional, role-aware, and visually continuous with isth.
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, BarChart3, Check, Edit3, Eye, EyeOff, ImagePlus, LogOut, Package, Plus, RefreshCw, Save, Trash2, Upload, Video, X } from "lucide-react";
import { Link } from "wouter";
import { defaultProducts, MAX_PRODUCT_MEDIA_ITEMS, type Product, type ProductMedia } from "@/data/products";
import { DEFAULT_HERO_CAROUSEL, deletePublicAsset, deleteRemoteProduct, fetchAdminRole, fetchPublicHeroCarousel, fetchRemoteProducts, isSupabaseConfigured, savePublicSetting, supabase, type HeroCarouselSettings, type HeroSlide, uploadProductAsset, uploadPublicAsset, upsertRemoteProduct } from "@/lib/supabase";
import { isSafeAssetFile, isSafeHttpUrl, readLogoUrl, readVideoUrl, writeLogoUrl, writeVideoUrl } from "@/data/brand";
import { AtelierAdmin, WebsiteContentAdmin } from "@/components/AdminAtelier";

type SessionUser = { email: string; id?: string; role?: string } | null;
type WorkspaceView = "overview" | "products" | "media" | "atelier" | "content";

function getManagedProductAssetUrls(product: Product) {
  const urls = [product.image, ...(product.media ?? []).map((item) => item.url)];
  const managed = urls.filter((url): url is string => typeof url === "string" && url.includes("/storage/v1/object/public/product-images/"));
  return Array.from(new Set(managed.map((url) => url.split("?")[0])));
}

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
  const atelierRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
  const saveProduct = async (product: Product): Promise<boolean> => {
    const existing = products.find((item) => item.id === product.id);
    const synced = await upsertRemoteProduct(product);
    if (!synced.ok) {
      console.error("Admin product save failed", synced.error);
      setMessage(synced.error ? `Unable to save: ${synced.error}` : "Unable to save this composition. Your secure session may have expired.");
      return false;
    }
    const next = isNew ? [...products, product] : products.map((item) => item.id === product.id ? product : item);
    setProducts(next); setActive(null); setIsNew(false);
    const referencedAssets = new Set(next.flatMap(getManagedProductAssetUrls));
    const retiredAssets = existing ? getManagedProductAssetUrls(existing).filter((url) => !referencedAssets.has(url)) : [];
    const cleanupResults = await Promise.all(retiredAssets.map(async (url) => {
      try { return await deletePublicAsset(url); } catch (error) { console.warn("Unable to remove an unreferenced product asset", error); return false; }
    }));
    setMessage(cleanupResults.some((deleted) => !deleted)
      ? "Saved to the isth product library, but a removed file could not be cleared from storage."
      : "Saved to the isth product library.");
    return true;
  };
  const deleteProduct = async (id: string) => {
    const existing = products.find((item) => item.id === id);
    const synced = await deleteRemoteProduct(id);
    if (!synced) return setMessage("Unable to remove this composition. Your secure session may have expired.");
    const remaining = products.filter((item) => item.id !== id);
    setProducts(remaining);
    const referencedAssets = new Set(remaining.flatMap(getManagedProductAssetUrls));
    const retiredAssets = existing ? getManagedProductAssetUrls(existing).filter((url) => !referencedAssets.has(url)) : [];
    const cleanupResults = await Promise.all(retiredAssets.map(async (url) => {
      try { return await deletePublicAsset(url); } catch (error) { console.warn("Unable to remove an unreferenced product asset", error); return false; }
    }));
    setMessage(cleanupResults.some((deleted) => !deleted)
      ? "Product removed from the isth library, but some media files could not be cleared from storage."
      : "Product and its unreferenced media removed from the isth library.");
  };
  const activateWorkspace = (view: WorkspaceView) => {
    setWorkspaceView(view);
    if (view === "media") setMediaOpen(true);
    window.requestAnimationFrame(() => {
      const target = view === "overview" ? overviewRef.current : view === "products" ? productsRef.current : view === "media" ? mediaRef.current : view === "atelier" ? atelierRef.current : contentRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const openPublicSite = () => window.open("/home", "_blank", "noopener,noreferrer");

  if (!user) return <main className="admin-login"><div className="admin-login-card"><Link className="back-link" href="/home"><ArrowLeft size={14} /> Back to isth</Link><div className="admin-login-mark"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></div><p className="eyebrow">Private room / Admin</p><h1>Keep the house<br /><em>in order.</em></h1><p className="admin-intro">Manage compositions, descriptions, bottle formats, and the public scent library from one quiet workspace.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@isth.house" autoComplete="email" required /></label><label>Password<span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" minLength={6} required /><button className="password-visibility" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <Eye size={17} /> : <EyeOff size={17} />}</button></span></label><div className="admin-login-actions"><button className="cherry-button" type="submit">Enter the room <ArrowLeft size={14} className="turn-arrow" /></button><button className="plain-button" type="button" onClick={resetPassword}>Forgot password?</button></div></form>{message && <p className="form-message">{message}</p>}</div><div className="admin-login-aside"><span>isth / private</span><p>Access is reserved<br />for the house.</p></div></main>;

  const workspaceDetails: Record<WorkspaceView, { eyebrow: string; title: string; description: string }> = {
    overview: { eyebrow: "Private room / Overview", title: "Good morning, house.", description: "A calm control room for the public isth experience." },
    products: { eyebrow: "Workspace / Products", title: "Compositions.", description: "Create, edit, and publish the scent library." },
    atelier: { eyebrow: "Workspace / Atelier", title: "The media room.", description: "Manage the responsive gallery and the story paired with each composition." },
    content: { eyebrow: "Workspace / Website Content", title: "Every visible word.", description: "Edit public copy, styling, and restore points without touching code." },
    media: { eyebrow: "Workspace / Brand & media", title: "Brand surfaces.", description: "Manage the logo, hero gallery, and motion media used by the storefront." },
  };
  const details = workspaceDetails[workspaceView];
  const activateProductEditor = () => { setIsNew(true); setActive({ id: `new-${Date.now()}`, name: "", notes: "", description: "", collection: "Signature", color: "#5B0D18", size: "10ml tower" }); };

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/home" className="admin-brand"><img className="brand-logo brand-logo-light" src={readLogoUrl()} alt="isth" /></Link>
      <div className="admin-side-nav"><span className="side-label">Workspace</span>
        <button className={workspaceView === "overview" ? "is-active" : ""} onClick={() => activateWorkspace("overview")}><BarChart3 size={16} /><span>Overview</span></button>
        <button className={workspaceView === "products" ? "is-active" : ""} onClick={() => activateWorkspace("products")}><Package size={16} /><span>Products</span><b>{products.length}</b></button>
        <button className={workspaceView === "atelier" ? "is-active" : ""} onClick={() => activateWorkspace("atelier")}><ImagePlus size={16} /><span>Atelier</span></button>
        <button className={workspaceView === "content" ? "is-active" : ""} onClick={() => activateWorkspace("content")}><Edit3 size={16} /><span>Website Content</span></button>
        <button className={workspaceView === "media" ? "is-active" : ""} onClick={() => activateWorkspace("media")}><Video size={16} /><span>Brand &amp; media</span></button>
      </div>
      <div className="admin-side-bottom"><button className="admin-public-link" onClick={openPublicSite}><Eye size={15} /> View storefront</button><span className="admin-status"><i /> {isSupabaseConfigured ? `${user.role ?? "admin"} / connected` : "Local preview"}</span><button onClick={signOut}><LogOut size={15} /> Sign out</button></div>
    </aside>
    <section className="admin-content">
      <header className="admin-header admin-header-clean"><div><p className="eyebrow">{details.eyebrow}</p><h1>{details.title}</h1><p className="admin-header-description">{details.description}</p></div><div className="admin-header-actions"><Link className="outline-button dark" href="/home"><Eye size={14} /> Storefront</Link>{workspaceView === "products" && <button className="cherry-button" onClick={activateProductEditor}><Plus size={15} /> New product</button>}</div></header>
      <nav className="admin-workspace-tabs" aria-label="Admin workspaces">{(Object.keys(workspaceDetails) as WorkspaceView[]).map((view) => <button key={view} className={workspaceView === view ? "is-active" : ""} onClick={() => activateWorkspace(view)}>{view === "content" ? "Website Content" : view === "media" ? "Brand & media" : view[0].toUpperCase() + view.slice(1)}</button>)}</nav>
      {message && <div className="admin-toast admin-toast-sticky"><Check size={15} /> <span>{message}</span><button onClick={() => setMessage("")} aria-label="Dismiss message"><X size={13} /></button></div>}
      {workspaceView === "overview" && <section ref={overviewRef} className="admin-overview-panel"><div className="admin-stats"><div><span>Published compositions</span><strong>{products.length}</strong><small>in the scent library</small></div><div><span>Atelier</span><strong>Ready</strong><small>responsive media room</small></div><div><span>Session</span><strong>{user.role === "preview" ? "Preview" : "Live"}</strong><small>{user.email}</small></div></div><div className="admin-quick-grid"><button onClick={() => activateWorkspace("products")}><Package size={18} /><strong>Manage products</strong><span>Edit scent names, notes, prices, and galleries.</span></button><button onClick={() => activateWorkspace("atelier")}><ImagePlus size={18} /><strong>Open Atelier</strong><span>Upload media and pair descriptions.</span></button><button onClick={() => activateWorkspace("content")}><Edit3 size={18} /><strong>Edit website content</strong><span>Find and update public words by section.</span></button></div></section>}
      {workspaceView === "products" && <section ref={productsRef} className="admin-products-section"><div className="admin-section-head"><div><p className="eyebrow">Scent library</p><h2>Compositions</h2></div><button className="cherry-button" onClick={activateProductEditor}><Plus size={15} /> New composition</button></div><div className="admin-table"><div className="admin-table-head"><span>Composition</span><span>Format</span><span>Notes</span><span>Actions</span></div>{products.map((product) => {
          const previewImage = product.image || product.media?.find((item) => item.kind === "image")?.url;
          return (
            <div className="admin-row" key={product.id}>
              <div className="admin-product-cell">
                <span className="admin-product-thumbnail" aria-hidden="true">
                  {previewImage ? <img src={previewImage} alt="" loading="lazy" decoding="async" /> : <ImagePlus size={16} />}
                </span>
                <span className="admin-swatch" style={{ background: product.color }} />
                <div><strong>{product.name}</strong><small>{product.id}</small></div>
              </div>
              <span>{product.size}</span>
              <span>{product.notes}</span>
              <div className="admin-row-actions">
                <button onClick={() => { setIsNew(false); setActive(product); }} aria-label={`Edit ${product.name}`}><Edit3 size={15} /></button>
                <button onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
          );
        })}</div></section>}
      {workspaceView === "atelier" && <div ref={atelierRef}><AtelierAdmin onStatus={setMessage} /></div>}
      {workspaceView === "content" && <div ref={contentRef}><WebsiteContentAdmin onStatus={setMessage} /></div>}
      {workspaceView === "media" && <div ref={mediaRef}><MediaSettings /></div>}
    </section>
    {active && <ProductEditor product={active} isNew={isNew} onSave={saveProduct} onClose={() => { setActive(null); setIsNew(false); }} />}
  </main>;
}

function ProductEditor({ product, isNew, onSave, onClose }: { product: Product; isNew: boolean; onSave: (product: Product) => Promise<boolean>; onClose: () => void }) {
  const [draft, setDraft] = useState(product);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaMessage, setMediaMessage] = useState("");
  const uploadedAssetUrls = useRef(new Set<string>());
  const media = draft.media ?? [];
  const coverImageUrl = draft.image || media.find((item) => item.kind === "image")?.url;

  const update = (key: keyof Product, value: string | boolean) => setDraft((current) => ({ ...current, [key]: value }));
  const updateMedia = (next: ProductMedia[], coverOverride?: string) => setDraft((current) => {
    const previousCover = current.image;
    const coverWasInGallery = Boolean(previousCover && current.media?.some((item) => item.kind === "image" && item.url === previousCover));
    let image = current.image;
    if (coverOverride) image = coverOverride;
    else if (coverWasInGallery && previousCover && !next.some((item) => item.kind === "image" && item.url === previousCover)) {
      image = next.find((item) => item.kind === "image")?.url;
    }
    return { ...current, media: next, image };
  });

  const addMedia = async (files: FileList | null, kind: "image" | "video") => {
    if (!files?.length || mediaBusy || saving) return;
    const selected = Array.from(files);
    const valid = selected.filter((file) => isSafeAssetFile(file) && (kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/")));
    const invalidCount = selected.length - valid.length;
    const capacity = MAX_PRODUCT_MEDIA_ITEMS - media.length;
    if (capacity <= 0) return setMediaMessage(`Gallery limit reached (${MAX_PRODUCT_MEDIA_ITEMS}). Replace or remove an item before adding more.`);
    const toUpload = valid.slice(0, capacity);
    if (!toUpload.length) return setMediaMessage(`Choose ${kind === "image" ? "JPG, PNG, WebP, or AVIF images" : "MP4 or WebM videos"} up to 10MB.`);

    setMediaBusy(true);
    setMediaMessage(`Uploading ${toUpload.length} ${kind}${toUpload.length === 1 ? "" : "s"}…`);
    const uploaded: ProductMedia[] = [];
    for (const file of toUpload) {
      try {
        const url = await uploadProductAsset(file, kind);
        if (url) {
          uploadedAssetUrls.current.add(url);
          uploaded.push({ id: crypto.randomUUID(), kind, url, fit: kind === "image" ? "contain" : undefined, alt: `${draft.name} ${kind}` });
        }
      } catch (error) {
        console.error(`Product ${kind} upload failed`, error);
      }
    }
    if (uploaded.length) updateMedia([...media, ...uploaded]);
    const skippedForLimit = Math.max(0, valid.length - toUpload.length);
    const failedCount = toUpload.length - uploaded.length;
    const messages = [uploaded.length ? `${uploaded.length} ${kind}${uploaded.length === 1 ? "" : "s"} added to the draft.` : "No files uploaded; check your secure session and storage policy."];
    if (invalidCount) messages.push(`${invalidCount} unsupported or oversized file${invalidCount === 1 ? "" : "s"} skipped.`);
    if (skippedForLimit) messages.push(`${skippedForLimit} skipped because the gallery limit is ${MAX_PRODUCT_MEDIA_ITEMS}.`);
    if (failedCount) messages.push(`${failedCount} upload${failedCount === 1 ? "" : "s"} failed.`);
    if (uploaded.length) messages.push("Save the composition to publish.");
    setMediaMessage(messages.join(" "));
    setMediaBusy(false);
  };

  const replacePrimaryImage = async (file: File | undefined) => {
    if (!file || mediaBusy || saving) return;
    if (!isSafeAssetFile(file) || !file.type.startsWith("image/")) return setMediaMessage("Choose a JPG, PNG, WebP, or AVIF image up to 10MB.");
    setMediaBusy(true);
    setMediaMessage("Uploading cover image…");
    try {
      const url = await uploadProductAsset(file, "image");
      if (!url) {
        setMediaMessage("Cover upload failed. Check your secure session and storage policy.");
        return;
      }
      uploadedAssetUrls.current.add(url);
      setDraft((current) => {
        const currentMedia = current.media ?? [];
        const previousCover = current.image || currentMedia.find((item) => item.kind === "image")?.url;
        const coverItem = currentMedia.find((item) => item.kind === "image" && item.url === previousCover);
        const nextMedia = coverItem ? currentMedia.map((item) => item.id === coverItem.id ? { ...item, url, alt: `${current.name} primary image` } : item) : currentMedia;
        return { ...current, image: url, media: nextMedia };
      });
      setMediaMessage("Cover image replaced in the draft. Save the composition to publish.");
    } catch (error) {
      console.error("Product cover upload failed", error);
      setMediaMessage("Cover upload failed. Check your secure session and storage policy.");
    } finally {
      setMediaBusy(false);
    }
  };

  const replaceMedia = async (item: ProductMedia, file: File | undefined) => {
    if (!file || mediaBusy || saving) return;
    const validType = item.kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/");
    if (!isSafeAssetFile(file) || !validType) return setMediaMessage(`Choose a valid ${item.kind} file up to 10MB.`);
    setMediaBusy(true);
    setMediaMessage(`Replacing ${item.kind}…`);
    try {
      const url = await uploadProductAsset(file, item.kind);
      if (!url) {
        setMediaMessage(`Replace failed. Check your secure session and storage policy.`);
        return;
      }
      uploadedAssetUrls.current.add(url);
      const next = media.map((entry) => entry.id === item.id ? { ...entry, url, alt: item.kind === "image" ? `${draft.name} image` : entry.alt } : entry);
      updateMedia(next, draft.image === item.url ? url : undefined);
      setMediaMessage(`${item.kind === "image" ? "Image" : "Video"} replaced in the draft. Save the composition to publish.`);
    } catch (error) {
      console.error(`Product ${item.kind} replacement failed`, error);
      setMediaMessage(`Replace failed. Check your secure session and storage policy.`);
    } finally {
      setMediaBusy(false);
    }
  };

  const removePrimaryImage = () => {
    setDraft((current) => {
      const currentMedia = current.media ?? [];
      const primary = current.image || currentMedia.find((item) => item.kind === "image")?.url;
      return {
        ...current,
        image: undefined,
        media: primary ? currentMedia.filter((item) => !(item.kind === "image" && item.url === primary)) : currentMedia,
      };
    });
    setMediaMessage("Cover removed from the draft. Save to apply; stored files are kept until the save succeeds.");
  };

  const removeMedia = (item: ProductMedia) => {
    updateMedia(media.filter((entry) => entry.id !== item.id));
    setMediaMessage(`Removed from the draft. Save to apply; the stored file is kept until the save succeeds.`);
  };

  const moveMedia = (index: number, direction: -1 | 1) => {
    const next = [...media];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateMedia(next);
  };

  const closeEditor = () => {
    if (mediaBusy || saving) return;
    const uncommitted = Array.from(uploadedAssetUrls.current);
    uploadedAssetUrls.current.clear();
    void Promise.all(uncommitted.map(async (url) => {
      try { return await deletePublicAsset(url); } catch (error) { console.warn("Unable to clean up an unsaved product upload", error); return false; }
    }));
    onClose();
  };

  const save = async () => {
    if (mediaBusy || saving) return;
    setSaving(true);
    setMediaMessage("");
    try {
      const saved = await onSave({ ...draft, media });
      if (!saved) {
        setSaving(false);
        return;
      }
      const retained = new Set([draft.image, ...media.map((item) => item.url)].filter((url): url is string => Boolean(url)));
      const abandoned = Array.from(uploadedAssetUrls.current).filter((url) => !retained.has(url));
      uploadedAssetUrls.current.clear();
      await Promise.all(abandoned.map(async (url) => {
        try { return await deletePublicAsset(url); } catch (error) { console.warn("Unable to clean up a replaced draft upload", error); return false; }
      }));
    } catch (error) {
      console.error("Product save failed", error);
      setMediaMessage("Unable to save this composition. Check your connection and secure session, then try again.");
      setSaving(false);
    }
  };

  return <div className="editor-backdrop">
    <div className="editor-panel">
      <header>
        <div><p className="eyebrow">{isNew ? "New composition" : "Edit composition"}</p><h2>{isNew ? "Compose a scent." : draft.name}</h2></div>
        <button type="button" onClick={closeEditor} aria-label="Close editor" disabled={mediaBusy || saving}><X size={18} /></button>
      </header>
      <div className="editor-form">
        <label>Name<input maxLength={80} value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
        <label>Notes<input maxLength={160} value={draft.notes} onChange={(event) => update("notes", event.target.value)} /></label>
        <label>Format<select value={draft.size} onChange={(event) => update("size", event.target.value)}><option value="10ml tower">10ml tower</option><option value="30ml cosmos">30ml cosmos</option></select></label>
        <label>Color<input value={draft.color} onChange={(event) => update("color", event.target.value)} /></label>
        <label className="wide">Primary image URL<input value={draft.image || ""} onChange={(event) => update("image", event.target.value)} placeholder="https://… or /assets/…" /></label>
        <label className="wide">Description<textarea rows={4} maxLength={500} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label>
        <label className="checkbox-label"><input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update("featured", event.target.checked)} /> Feature on the storefront</label>
      </div>

      <section className="product-media-editor">
        <div className="product-primary-image">
          <div className="product-primary-image-preview">
            {coverImageUrl ? <img src={coverImageUrl} alt={`${draft.name || "Product"} cover preview`} /> : <ImagePlus size={22} aria-hidden="true" />}
          </div>
          <div className="product-primary-image-copy">
            <span className="eyebrow">Catalogue cover</span>
            <strong>{coverImageUrl ? "Primary product image" : "No cover image yet"}</strong>
            <p>This image leads the product card and detail gallery. It is stored separately from the 12-item gallery below.</p>
            <div className="product-primary-image-actions">
              <label className="outline-button dark media-upload-button"><Upload size={14} /> {coverImageUrl ? "Replace cover" : "Add cover image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={mediaBusy || saving} onChange={(event) => { void replacePrimaryImage(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>
              {coverImageUrl && <button className="outline-button dark" type="button" onClick={removePrimaryImage} disabled={mediaBusy || saving}><Trash2 size={14} /> Remove cover</button>}
            </div>
          </div>
        </div>

        <div className="product-media-editor-head">
          <div><p className="eyebrow">Supplementary gallery · {media.length}/{MAX_PRODUCT_MEDIA_ITEMS}</p><h3>Images &amp; videos</h3><p>The cover stays separate; add supporting images or videos here. Each item can be replaced, reordered, or removed.</p></div>
          <div className="product-media-upload-actions">
            <label className="outline-button dark">Add images<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={mediaBusy || saving || media.length >= MAX_PRODUCT_MEDIA_ITEMS} onChange={(event) => { void addMedia(event.currentTarget.files, "image"); event.currentTarget.value = ""; }} /></label>
            <label className="outline-button dark">Add videos<input type="file" multiple accept="video/mp4,video/webm" disabled={mediaBusy || saving || media.length >= MAX_PRODUCT_MEDIA_ITEMS} onChange={(event) => { void addMedia(event.currentTarget.files, "video"); event.currentTarget.value = ""; }} /></label>
          </div>
        </div>

        <div className="product-media-list">
          {media.map((item, index) => <article className="product-media-item" key={item.id}>
            {item.kind === "video" ? <video src={item.url} controls preload="metadata" /> : <img src={item.url} alt={item.alt || `${draft.name} image ${index + 1}`} />}
            <div>
              <strong>{item.kind === "video" ? "Video" : "Image"} {index + 1}</strong>
              <div className="product-media-item-controls">
                <button type="button" onClick={() => moveMedia(index, -1)} disabled={mediaBusy || saving || index === 0} aria-label={`Move ${item.kind} ${index + 1} earlier`}>←</button>
                <button type="button" onClick={() => moveMedia(index, 1)} disabled={mediaBusy || saving || index === media.length - 1} aria-label={`Move ${item.kind} ${index + 1} later`}>→</button>
                <label className="product-media-replace" title={`Replace ${item.kind} ${index + 1}`}><RefreshCw size={12} /><span>Replace</span><input type="file" accept={item.kind === "image" ? "image/jpeg,image/png,image/webp,image/avif" : "video/mp4,video/webm"} disabled={mediaBusy || saving} onChange={(event) => { void replaceMedia(item, event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>
                <button type="button" onClick={() => removeMedia(item)} disabled={mediaBusy || saving} aria-label={`Delete ${item.kind} ${index + 1}`} title={`Delete ${item.kind}`}><Trash2 size={13} /></button>
              </div>
            </div>
          </article>)}
          {media.length === 0 && <div className="product-media-empty"><ImagePlus size={18} /><span>No supplementary media yet. Add images or videos above.</span></div>}
        </div>
        {mediaMessage && <p className="form-message" role="status">{mediaMessage}</p>}
      </section>
      <button className="cherry-button" type="button" onClick={() => { void save(); }} disabled={mediaBusy || saving}><Save size={15} /> {saving ? "Saving…" : "Save composition"}</button>
    </div>
  </div>;
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
  const saveCarousel = async (next: HeroCarouselSettings, previous = carousel) => { setCarousel(next); setCarouselSaving(true); let saved = false; try { saved = await savePublicSetting("hero_carousel", JSON.stringify(next)); } catch (error) { console.error("Hero carousel save failed", error); } setCarouselSaving(false); if (!saved) setCarousel(previous); setStatus(saved ? "Hero carousel published and persisted." : "Carousel save failed. Your changes were not published; check your secure session and try again."); return saved; };
  const updateGallery = (kind: "desktop" | "mobile", slides: HeroSlide[]) => setCarousel((current) => ({ ...current, [kind]: slides }));
  const addHeroFiles = async (files: FileList | null, kind: "desktop" | "mobile") => {
    if (!files?.length) return;
    setStatus(`Preparing ${files.length} ${kind} hero image${files.length === 1 ? "" : "s"}…`);
    const uploaded: HeroSlide[] = [];
    const selected = Array.from(files);
    for (let index = 0; index < selected.length; index += 1) { const file = selected[index]; setStatus(`Uploading ${kind} hero image ${index + 1} of ${selected.length}…`); if (!isSafeAssetFile(file)) continue; const url = await uploadPublicAsset(file, kind === "desktop" ? "hero-desktop" : "hero-mobile"); if (url) uploaded.push({ id: crypto.randomUUID(), url, focalX: 50, focalY: 50 }); }
    if (!uploaded.length) return setStatus("No images uploaded. Use JPG, PNG, WebP, or AVIF files up to 10MB.");
    const next = { ...carousel, [kind]: [...carousel[kind], ...uploaded] };
    const saved = await saveCarousel(next, carousel);
    if (!saved) { await Promise.all(uploaded.map((slide) => deletePublicAsset(slide.url))); setStatus("Upload completed but save failed; uploaded files were cleaned up and the active carousel was unchanged."); }
  };
  const removeHeroSlide = async (kind: "desktop" | "mobile", slide: HeroSlide) => { const next = { ...carousel, [kind]: carousel[kind].filter((item) => item.id !== slide.id) }; const saved = await saveCarousel(next, carousel); if (!saved) return; const managedFile = slide.url.includes("/storage/v1/object/public/site-media/"); const deleted = managedFile ? await deletePublicAsset(slide.url) : true; setStatus(deleted ? "Hero image removed from the active carousel and storage." : "Hero image removed from the active carousel, but its stored file could not be deleted."); };
  const moveHeroSlide = (kind: "desktop" | "mobile", index: number, direction: -1 | 1) => { const next = [...carousel[kind]]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; updateGallery(kind, next); };
  const renderGallery = (kind: "desktop" | "mobile", title: string) => <div className="hero-gallery"><div className="hero-gallery-head"><div><span className="eyebrow">{kind === "desktop" ? "Large screens" : "Small screens"}</span><h3>{title}</h3></div><label className="cherry-button media-upload-button"><ImagePlus size={15} /> Add images<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => { void addHeroFiles(event.target.files, kind); event.currentTarget.value = ""; }} /></label></div><div className="hero-gallery-grid">{carousel[kind].map((slide, index) => <article className="hero-slide-card" key={slide.id}><img src={slide.url} alt={`${title} slide ${index + 1}`} style={{ objectPosition: `${slide.focalX}% ${slide.focalY}%` }} /><div className="hero-slide-controls"><span>Slide {index + 1}</span><button type="button" onClick={() => moveHeroSlide(kind, index, -1)} disabled={index === 0} aria-label="Move slide left">←</button><button type="button" onClick={() => moveHeroSlide(kind, index, 1)} disabled={index === carousel[kind].length - 1} aria-label="Move slide right">→</button><button type="button" onClick={() => { void removeHeroSlide(kind, slide); }} aria-label="Remove slide"><Trash2 size={13} /></button></div><label className="focal-control">Focal X <input type="range" min="0" max="100" value={slide.focalX} onChange={(event) => updateGallery(kind, carousel[kind].map((item) => item.id === slide.id ? { ...item, focalX: Number(event.target.value) } : item))} /></label><label className="focal-control">Focal Y <input type="range" min="0" max="100" value={slide.focalY} onChange={(event) => updateGallery(kind, carousel[kind].map((item) => item.id === slide.id ? { ...item, focalY: Number(event.target.value) } : item))} /></label></article>)}</div><button className="outline-button dark hero-gallery-save" type="button" onClick={() => { void saveCarousel(carousel); }} disabled={carouselSaving}>{carouselSaving ? "Publishing…" : "Publish gallery changes"}</button></div>;
  return <div className="admin-media-panel"><div><p className="eyebrow">Brand & media</p><h2>Shape the public room.</h2><p>Logo, motion, and responsive hero galleries publish through the secured Supabase workflow. Hero slides loop every three seconds by default.</p></div><div className="media-form"><label><ImagePlus size={14} /> Logo URL<input value={logo} onChange={(event) => setLogo(event.target.value)} onBlur={() => saveUrl("logo")} /></label><label><ImagePlus size={14} /> Upload logo<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => handleFile(event.target.files?.[0], "logo")} /></label><label><Video size={14} /> Video URL<input value={video} onChange={(event) => setVideo(event.target.value)} onBlur={() => saveUrl("video")} placeholder="https://…/isth-loop.mp4" /></label><label><Video size={14} /> Upload motion video<input type="file" accept="video/mp4,video/webm" onChange={(event) => handleFile(event.target.files?.[0], "video")} /></label></div><div className="hero-carousel-settings"><label>Autoplay interval <select value={carousel.interval} onChange={(event) => setCarousel((current) => ({ ...current, interval: Number(event.target.value) }))}><option value={2000}>2 seconds</option><option value={3000}>3 seconds</option><option value={4000}>4 seconds</option><option value={5000}>5 seconds</option></select></label>{renderGallery("desktop", "Desktop hero gallery")}{renderGallery("mobile", "Mobile hero gallery")}</div>{status && <p className="form-message">{status}</p>}</div>;
}
