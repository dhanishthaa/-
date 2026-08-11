// Quiet Atelier style reminder: admin is a calm instrument panel—functional, protected, and visually continuous with the house.
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, BarChart3, Check, Edit3, Eye, LogOut, Package, Plus, Save, Settings2, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { defaultProducts, readLocalProducts, writeLocalProducts, type Product } from "@/data/products";
import { deleteRemoteProduct, fetchRemoteProducts, isAuthorizedEmail, isSupabaseConfigured, supabase, upsertRemoteProduct } from "@/lib/supabase";

type SessionUser = { email: string } | null;

export default function Admin() {
  const [user, setUser] = useState<SessionUser>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [active, setActive] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setProducts(readLocalProducts());
    fetchRemoteProducts().then((remote) => { if (remote?.length) setProducts(remote); });
    const savedEmail = window.localStorage.getItem("isth-admin-session");
    if (savedEmail) setUser({ email: savedEmail });
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { if (data.session?.user.email) setUser({ email: data.session.user.email }); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user.email ? { email: session.user.email } : null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    if (!email || !password) return setMessage("Enter the authorized email and password.");
    if (!isAuthorizedEmail(email)) return setMessage("This account is not on the ISTH admin allowlist.");
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(error.message);
    } else {
      window.localStorage.setItem("isth-admin-session", email); setUser({ email }); setMessage("Preview access enabled locally. Connect Supabase for production auth.");
    }
  };

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); window.localStorage.removeItem("isth-admin-session"); setUser(null); };
  const saveProduct = async (product: Product) => { const next = isNew ? [...products, product] : products.map((item) => item.id === product.id ? product : item); setProducts(next); writeLocalProducts(next); const synced = await upsertRemoteProduct(product); setActive(null); setIsNew(false); setMessage(synced ? (isSupabaseConfigured ? "Saved to the ISTH product library." : "Saved to this browser. Connect Supabase for production sync.") : "Saved locally, but Supabase did not accept the update."); };
  const deleteProduct = async (id: string) => { const next = products.filter((item) => item.id !== id); setProducts(next); writeLocalProducts(next); const synced = await deleteRemoteProduct(id); setMessage(synced ? (isSupabaseConfigured ? "Product removed from the ISTH library." : "Product removed from this browser.") : "Removed locally, but Supabase did not accept the deletion."); };

  if (!user) return <main className="admin-login"><div className="admin-login-card"><Link className="back-link" href="/home"><ArrowLeft size={14} /> Back to ISTH</Link><div className="admin-login-mark"><span className="brand-symbol" /><span>ISTH</span></div><p className="eyebrow">Private room / Admin</p><h1>Keep the house<br /><em>in order.</em></h1><p className="admin-intro">Manage compositions, descriptions, and the public scent library from one quiet workspace.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@isth.house" autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" /></label><button className="cherry-button" type="submit">Enter the room <ArrowLeft size={14} className="turn-arrow" /></button></form>{message && <p className="form-message">{message}</p>}<p className="admin-security"><Settings2 size={14} /> {isSupabaseConfigured ? "Supabase Auth is connected." : "Preview mode: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for protected production access."}</p></div><div className="admin-login-aside"><span>ISTH / 2026</span><p>Access is reserved<br />for the house.</p></div></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/home" className="admin-brand"><span className="brand-symbol" />ISTH</Link><div className="admin-side-nav"><span className="side-label">Workspace</span><button className="is-active"><BarChart3 size={16} /> Overview</button><button><Package size={16} /> Products <span>{products.length}</span></button><button><Eye size={16} /> Public site</button></div><div className="admin-side-bottom"><span className="admin-status"><i /> {isSupabaseConfigured ? "Connected" : "Local preview"}</span><button onClick={signOut}><LogOut size={15} /> Sign out</button></div></aside><section className="admin-content"><header className="admin-header"><div><p className="eyebrow">Private room / Overview</p><h1>Good morning, <em>house.</em></h1></div><Link className="outline-button dark" href="/home">View storefront <Eye size={14} /></Link></header><div className="admin-stats"><div><span>Published compositions</span><strong>{products.length.toString().padStart(2, "0")}</strong><small>in the scent library</small></div><div><span>Public visits</span><strong>—</strong><small>connect analytics to measure</small></div><div><span>Last update</span><strong>Today</strong><small>{user.email}</small></div></div><div className="admin-section-head"><div><p className="eyebrow">Scent library</p><h2>Compositions</h2></div><button className="cherry-button" onClick={() => { setIsNew(true); setActive({ id: `new-${Date.now()}`, name: "", notes: "", description: "", collection: "Signature", color: "#5B0D18" }); }}><Plus size={15} /> New composition</button></div>{message && <div className="admin-toast"><Check size={15} /> {message}<button onClick={() => setMessage("")}><X size={13} /></button></div>}<div className="admin-table"><div className="admin-table-head"><span>Composition</span><span>Collection</span><span>Notes</span><span>Actions</span></div>{products.map((product) => <div className="admin-row" key={product.id}><div className="admin-product-cell"><span className="admin-swatch" style={{ background: product.color }} /><div><strong>{product.name}</strong><small>{product.id}</small></div></div><span>{product.collection}</span><span>{product.notes}</span><div className="admin-row-actions"><button onClick={() => { setIsNew(false); setActive(product); }} aria-label={`Edit ${product.name}`}><Edit3 size={15} /></button><button onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button></div></div>)}</div><p className="admin-footnote">Product edits are persisted locally for this static preview. For production, create a Supabase `products` table with Row Level Security and connect the supplied client configuration.</p></section>{active && <ProductEditor product={active} isNew={isNew} onSave={saveProduct} onClose={() => { setActive(null); setIsNew(false); }} />}</main>;
}

function ProductEditor({ product, isNew, onSave, onClose }: { product: Product; isNew: boolean; onSave: (product: Product) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(product);
  const update = (key: keyof Product, value: string | boolean) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="editor-backdrop"><div className="editor-panel"><header><div><p className="eyebrow">{isNew ? "New composition" : "Edit composition"}</p><h2>{isNew ? "Compose a scent." : draft.name}</h2></div><button onClick={onClose} aria-label="Close editor"><X size={18} /></button></header><div className="editor-form"><label>Name<input value={draft.name} onChange={(event) => update("name", event.target.value)} /></label><label>Notes<input value={draft.notes} onChange={(event) => update("notes", event.target.value)} /></label><label>Collection<input value={draft.collection} onChange={(event) => update("collection", event.target.value)} /></label><label>Color<input value={draft.color} onChange={(event) => update("color", event.target.value)} /></label><label className="wide">Description<textarea rows={4} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label><label className="checkbox-label"><input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update("featured", event.target.checked)} /> Feature on the storefront</label></div><button className="cherry-button" onClick={() => onSave(draft)}><Save size={15} /> Save composition</button></div></div>;
}
