// Quiet Atelier style reminder: admin is a calm instrument panel—functional, role-aware, and visually continuous with isth.
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, BarChart3, Check, Edit3, Eye, ImagePlus, LogOut, Package, Plus, Save, Settings2, Trash2, Video, X } from "lucide-react";
import { Link } from "wouter";
import { defaultProducts, readLocalProducts, writeLocalProducts, type Product } from "@/data/products";
import { deleteRemoteProduct, fetchAdminRole, fetchRemoteProducts, isSupabaseConfigured, savePublicSetting, supabase, uploadPublicAsset, upsertRemoteProduct } from "@/lib/supabase";
import { isSafeAssetFile, isSafeHttpUrl, readLogoUrl, readVideoUrl, writeLogoUrl, writeVideoUrl } from "@/data/brand";

type SessionUser = { email: string; id?: string; role?: string } | null;

export default function Admin() {
  const [user, setUser] = useState<SessionUser>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [active, setActive] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  useEffect(() => {
    setProducts(readLocalProducts());
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    const client = supabase;
    if (!client) return;
    const hydrate = async (session: { user: { id: string; email?: string; email_confirmed_at?: string | null } } | null) => {
      if (!session?.user.email || !session.user.email_confirmed_at) return setUser(null);
      const role = await fetchAdminRole();
      if (role === "super_admin") {
        setUser({ email: session.user.email, id: session.user.id, role });
        return;
      }
      await client.auth.signOut();
      setUser(null);
      setMessage("This account is not authorised for the isth admin panel.");
    };
    client.auth.getSession().then(({ data }) => hydrate(data.session as typeof data.session & { user: { email?: string; email_confirmed_at?: string | null } }));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => hydrate(session as typeof session & { user: { email?: string; email_confirmed_at?: string | null } }));
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    if (!email || !password) return setMessage("Enter your email and password.");
    if (!supabase) return setMessage("Admin access is unavailable until Supabase is configured for this deployment.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage("Invalid email or password.");
    return setMessage("Checking your isth super-admin role…");
  };

  const resetPassword = async () => {
    if (!email || !supabase) return setMessage("Enter your email. Password reset becomes available after Supabase is configured.");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
    setMessage("If the account is eligible, a reset email has been sent.");
  };

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); setUser(null); };
  const saveProduct = async (product: Product) => { const next = isNew ? [...products, product] : products.map((item) => item.id === product.id ? product : item); setProducts(next); writeLocalProducts(next); const synced = await upsertRemoteProduct(product); setActive(null); setIsNew(false); setMessage(synced ? (isSupabaseConfigured ? "Saved to the isth product library." : "Saved to this browser. Connect Supabase for production sync.") : "Saved locally, but Supabase rejected the update."); };
  const deleteProduct = async (id: string) => { const next = products.filter((item) => item.id !== id); setProducts(next); writeLocalProducts(next); const synced = await deleteRemoteProduct(id); setMessage(synced ? (isSupabaseConfigured ? "Product removed from the isth library." : "Product removed from this browser.") : "Removed locally, but Supabase rejected the deletion."); };

  if (!user) return <main className="admin-login"><div className="admin-login-card"><Link className="back-link" href="/home"><ArrowLeft size={14} /> Back to isth</Link><div className="admin-login-mark"><img className="brand-logo brand-logo-dark" src={readLogoUrl()} alt="isth" /></div><p className="eyebrow">Private room / Admin</p><h1>Keep the house<br /><em>in order.</em></h1><p className="admin-intro">Manage compositions, descriptions, bottle formats, and the public scent library from one quiet workspace.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@isth.house" autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" minLength={10} required /></label><div className="admin-login-actions"><button className="cherry-button" type="submit">Enter the room <ArrowLeft size={14} className="turn-arrow" /></button><button className="plain-button" type="button" onClick={resetPassword}>Forgot password?</button></div></form>{message && <p className="form-message">{message}</p>}<p className="admin-security"><Settings2 size={14} /> {isSupabaseConfigured ? "Supabase Auth, verified email, and secure super-admin verification are required." : "Admin access is locked until Supabase build variables are configured."}</p></div><div className="admin-login-aside"><span>isth / private</span><p>Access is reserved<br />for the house.</p></div></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/home" className="admin-brand"><img className="brand-logo brand-logo-light" src={readLogoUrl()} alt="isth" /></Link><div className="admin-side-nav"><span className="side-label">Workspace</span><button className="is-active"><BarChart3 size={16} /> Overview</button><button><Package size={16} /> Products <span>{products.length}</span></button><button onClick={() => setMediaOpen((open) => !open)}><ImagePlus size={16} /> Brand & media</button><button><Eye size={16} /> Public site</button></div><div className="admin-side-bottom"><span className="admin-status"><i /> {isSupabaseConfigured ? `${user.role ?? "admin"} / connected` : "Local preview"}</span><button onClick={signOut}><LogOut size={15} /> Sign out</button></div></aside><section className="admin-content"><header className="admin-header"><div><p className="eyebrow">Private room / Overview</p><h1>Good morning, <em>house.</em></h1></div><Link className="outline-button dark" href="/home">View storefront <Eye size={14} /></Link></header><div className="admin-stats"><div><span>Published compositions</span><strong>{products.length}</strong><small>in the scent library</small></div><div><span>Public visits</span><strong>—</strong><small>connect analytics to measure</small></div><div><span>Session</span><strong>{user.role === "preview" ? "Preview" : "Live"}</strong><small>{user.email}</small></div></div><div className="admin-section-head"><div><p className="eyebrow">Scent library</p><h2>Compositions</h2></div><button className="cherry-button" onClick={() => { setIsNew(true); setActive({ id: `new-${Date.now()}`, name: "", notes: "", description: "", collection: "Signature", color: "#5B0D18", size: "10ml tower" }); }}><Plus size={15} /> New composition</button></div>{message && <div className="admin-toast"><Check size={15} /> {message}<button onClick={() => setMessage("")}><X size={13} /></button></div>}<div className="admin-table"><div className="admin-table-head"><span>Composition</span><span>Format</span><span>Notes</span><span>Actions</span></div>{products.map((product) => <div className="admin-row" key={product.id}><div className="admin-product-cell"><span className="admin-swatch" style={{ background: product.color }} /><div><strong>{product.name}</strong><small>{product.id}</small></div></div><span>{product.size}</span><span>{product.notes}</span><div className="admin-row-actions"><button onClick={() => { setIsNew(false); setActive(product); }} aria-label={`Edit ${product.name}`}><Edit3 size={15} /></button><button onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button></div></div>)}</div>{mediaOpen && <MediaSettings />}</section>{active && <ProductEditor product={active} isNew={isNew} onSave={saveProduct} onClose={() => { setActive(null); setIsNew(false); }} />}</main>;
}

function ProductEditor({ product, isNew, onSave, onClose }: { product: Product; isNew: boolean; onSave: (product: Product) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(product);
  const update = (key: keyof Product, value: string | boolean) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="editor-backdrop"><div className="editor-panel"><header><div><p className="eyebrow">{isNew ? "New composition" : "Edit composition"}</p><h2>{isNew ? "Compose a scent." : draft.name}</h2></div><button onClick={onClose} aria-label="Close editor"><X size={18} /></button></header><div className="editor-form"><label>Name<input maxLength={80} value={draft.name} onChange={(event) => update("name", event.target.value)} /></label><label>Notes<input maxLength={160} value={draft.notes} onChange={(event) => update("notes", event.target.value)} /></label><label>Format<select value={draft.size} onChange={(event) => update("size", event.target.value)}><option value="10ml tower">10ml tower</option><option value="30ml cosmos">30ml cosmos</option></select></label><label>Color<input value={draft.color} onChange={(event) => update("color", event.target.value)} /></label><label className="wide">Image URL<input value={draft.image || ""} onChange={(event) => update("image", event.target.value)} placeholder="https://… or bottle placeholder" /></label><label className="wide">Description<textarea rows={4} maxLength={500} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label><label className="checkbox-label"><input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update("featured", event.target.checked)} /> Feature on the storefront</label></div><button className="cherry-button" onClick={() => onSave(draft)}><Save size={15} /> Save composition</button></div></div>;
}

function MediaSettings() {
  const [logo, setLogo] = useState(readLogoUrl()); const [video, setVideo] = useState(readVideoUrl()); const [status, setStatus] = useState("");
  const handleFile = async (file: File | undefined, kind: "logo" | "video") => { if (!file || !isSafeAssetFile(file)) return setStatus("Use JPG, PNG, WebP, AVIF, MP4, or WebM files up to 10MB."); const remoteUrl = await uploadPublicAsset(file, kind === "logo" ? "brand" : "motion"); const url = remoteUrl || URL.createObjectURL(file); if (kind === "logo") { setLogo(url); writeLogoUrl(url); } else { setVideo(url); writeVideoUrl(url); } if (remoteUrl) await savePublicSetting(kind === "logo" ? "logo_url" : "motion_video_url", remoteUrl); setStatus(remoteUrl ? "Uploaded to Supabase Storage and saved to public settings." : "Saved in this preview. Connect Supabase Storage for production persistence."); };
  const saveUrl = async (kind: "logo" | "video") => { const value = kind === "logo" ? logo : video; if (value && !isSafeHttpUrl(value) && !value.startsWith("blob:") && !value.startsWith("/assets/") && !value.startsWith("./assets/") && !value.startsWith("/manus-storage/")) return setStatus("Asset URLs must use HTTPS or an approved storage path."); if (kind === "logo") writeLogoUrl(value); else writeVideoUrl(value); const synced = await savePublicSetting(kind === "logo" ? "logo_url" : "motion_video_url", value); setStatus(synced && isSupabaseConfigured ? "Asset setting saved to public settings." : "Asset setting saved."); };
  return <div className="admin-media-panel"><div><p className="eyebrow">Brand & media</p><h2>Shape the public room.</h2><p>Logo and motion slots are editable here. Production uploads must be sent through Supabase Storage policies.</p></div><div className="media-form"><label><ImagePlus size={14} /> Logo URL<input value={logo} onChange={(event) => setLogo(event.target.value)} onBlur={() => saveUrl("logo")} /></label><label><ImagePlus size={14} /> Upload logo<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => handleFile(event.target.files?.[0], "logo")} /></label><label><Video size={14} /> Video URL<input value={video} onChange={(event) => setVideo(event.target.value)} onBlur={() => saveUrl("video")} placeholder="https://…/isth-loop.mp4" /></label><label><Video size={14} /> Upload motion video<input type="file" accept="video/mp4,video/webm" onChange={(event) => handleFile(event.target.files?.[0], "video")} /></label></div>{status && <p className="form-message">{status}</p>}</div>;
}
