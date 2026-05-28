import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAppData } from "../context/AppContext";

/* ─── Shared design tokens ─── */
export const pageStyle: React.CSSProperties = {
  minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
  padding: "32px 16px", background: "#080010", position: "relative", overflow: "hidden",
  fontFamily: "'DM Sans', sans-serif",
};
export const cardStyle: React.CSSProperties = {
  position: "relative", zIndex: 10, width: "100%", maxWidth: "420px",
  background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "28px", padding: "40px 36px",
  backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.1)",
};
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @keyframes driftA{0%{transform:translate(0,0) scale(1)}100%{transform:translate(40px,55px) scale(1.12)}}
  @keyframes driftB{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-45px,-55px) scale(1.1)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes fadeUp{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
  .submit-hover:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 36px rgba(233,30,99,.48)!important}
  .submit-hover:active{transform:scale(.98)}
  .gbtn:hover:not(:disabled){background:rgba(255,255,255,0.13)!important;transform:translateY(-1px)}
  input::placeholder{color:transparent}
`;

/* ─── Background blobs ─── */
export const Blobs = () => (
  <>
    <div style={{ position:"absolute", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,#ff4500,#e91e63 55%,transparent 75%)", top:"-180px", left:"-160px", filter:"blur(80px)", opacity:.6, animation:"driftA 11s ease-in-out infinite alternate" }} />
    <div style={{ position:"absolute", width:"420px", height:"420px", borderRadius:"50%", background:"radial-gradient(circle,#ff9800,#ff5722 60%,transparent 80%)", bottom:"-160px", right:"-100px", filter:"blur(80px)", opacity:.5, animation:"driftB 15s ease-in-out infinite alternate" }} />
    <div style={{ position:"absolute", width:"260px", height:"260px", borderRadius:"50%", background:"radial-gradient(circle,#ffeb3b,transparent 70%)", top:"45%", left:"58%", filter:"blur(70px)", opacity:.18, animation:"driftA 18s ease-in-out infinite alternate" }} />
    <div style={{ position:"absolute", inset:0, opacity:.03, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
  </>
);

/* ─── Brand header ─── */
export const Brand = ({ sub }: { sub?: string }) => (
  <div style={{ textAlign:"center", marginBottom:"26px" }}>
    <div style={{ justifyContent:"center", display:"flex" }}>
      <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"10px", background:"rgba(255,182,0,0.15)", border:"1px solid rgba(255,182,0,0.3)", color:"#fbbf24", padding:"3px 12px", borderRadius:"50px", marginBottom:"14px", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase" }}>
        <span style={{ width:5, height:5, borderRadius:"50%", background:"#fbbf24", animation:"pulse 2s infinite", display:"inline-block" }} />
        Now live in your city
      </span>
    </div>
    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"46px", fontWeight:900, letterSpacing:"-2px", lineHeight:1, background:"linear-gradient(135deg,#fff 25%,#ffb347 85%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
      Cravely
    </div>
    {sub && <div style={{ marginTop:"5px", fontSize:"11px", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.38)", fontWeight:500 }}>{sub}</div>}
  </div>
);

/* ─── Eye icons ─── */
export const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
export const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─── Password strength ─── */
export const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label:"Weak",   color:"#ef4444", width:"20%" },
    { label:"Fair",   color:"#f97316", width:"45%" },
    { label:"Good",   color:"#eab308", width:"70%" },
    { label:"Strong", color:"#22c55e", width:"100%" },
  ];
  return pw.length ? levels[Math.max(0, score - 1)] : null;
};

/* ─── Floating label input ─── */
interface FloatInputProps {
  type?: string; name: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; withEye?: boolean; onStrength?: (val: string) => void;
  autoComplete?: string;
}

export const FloatInput = ({ type="text", name, label, value, onChange, required, withEye, onStrength, autoComplete }: FloatInputProps) => {
  const [visible, setVisible] = useState(false);
  const inputType = withEye ? (visible ? "text" : "password") : type;
  const base: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.15)",
    borderRadius:"14px", padding: withEye ? "22px 48px 10px 18px" : "22px 18px 10px",
    color:"#fff", fontSize:"14px", outline:"none", fontFamily:"'DM Sans',sans-serif",
    transition:"border-color .2s,background .2s", boxSizing:"border-box",
  };
  return (
    <div style={{ position:"relative" }}>
      <input type={inputType} name={name} id={name} placeholder=" " value={value} autoComplete={autoComplete}
        onChange={e => { onChange(e); onStrength?.(e.target.value); }} required={required} style={base}
        onFocus={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.5)"; e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
        onBlur={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
      />
      <label htmlFor={name} style={{ position:"absolute", left:"18px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)", fontSize:"13px", pointerEvents:"none", transition:"all .22s ease", fontFamily:"'DM Sans',sans-serif" }}>
        {label}
      </label>
      {withEye && (
        <button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? "Hide password" : "Show password"}
          style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)", padding:"4px", display:"flex", alignItems:"center", borderRadius:"6px", transition:"color .2s" }}
          onMouseEnter={e => (e.currentTarget.style.color="rgba(255,255,255,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.4)")}>
          {visible ? <EyeOpen /> : <EyeClosed />}
        </button>
      )}
      <style>{`#${name}:not(:placeholder-shown)+label,#${name}:focus+label{top:14px!important;font-size:10.5px!important;color:rgba(255,255,255,0.65)!important;letter-spacing:.05em;text-transform:uppercase}`}</style>
    </div>
  );
};

/* ─── Submit button ─── */
export const SubmitBtn = ({ loading, label }: { loading: boolean; label: string }) => (
  <button type="submit" disabled={loading} className="submit-hover" style={{
    width:"100%", padding:"15px", borderRadius:"14px", border:"none", cursor:"pointer",
    fontWeight:700, fontSize:"14px", letterSpacing:".04em",
    background:"linear-gradient(135deg,#ff6b35,#e91e63)", color:"#fff",
    boxShadow:"0 8px 24px rgba(233,30,99,.35)", transition:"transform .18s,box-shadow .18s",
    fontFamily:"'DM Sans',sans-serif", marginTop:"4px", opacity: loading ? .7 : 1,
  }}>
    {loading ? "Please wait…" : label}
  </button>
);

/* ══════════════════════════════════
   LOGIN PAGE
══════════════════════════════════ */
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [strength, setStrength] = useState<ReturnType<typeof getStrength>>(null);
  const [formData, setFormData] = useState({ name:"", email:"", password:"", confirm:"" });
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useAppData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && formData.password !== formData.confirm) {
      toast.error("Passwords do not match"); return;
    }
    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const result = await axios.post(`${authService}${endpoint}`, formData);
      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/google-login`, { code: authResult.code });
      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch { toast.error("Google Login Failed"); }
    finally { setLoading(false); }
  };

  const googleLogin = useGoogleLogin({ onSuccess: responseGoogle, onError: responseGoogle, flow: "auth-code" });

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex:1, padding:"10px", border:"none", borderRadius:"11px",
    fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
    cursor:"pointer", transition:"all .25s",
    background: active ? "rgba(255,255,255,0.15)" : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.45)",
    boxShadow: active ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
  });

  return (
    <div style={pageStyle}>
      <style>{globalStyles}</style>
      <Blobs />
      <div style={cardStyle}>
        <Brand sub="Premium Food Delivery" />

        {/* Tabs */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.07)", borderRadius:"14px", padding:"4px", marginBottom:"26px", gap:"4px" }}>
          <button style={tabStyle(!isSignup)} onClick={() => setIsSignup(false)}>Sign In</button>
          <button style={tabStyle(isSignup)} onClick={() => setIsSignup(true)}>Create Account</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {isSignup && <FloatInput name="name" label="Full Name" value={formData.name} onChange={handleChange} required autoComplete="name" />}

          <FloatInput type="email" name="email" label="Email Address" value={formData.email} onChange={handleChange} required autoComplete="email" />

          <div>
            <FloatInput name="password" label="Password" value={formData.password} onChange={handleChange} required withEye autoComplete={isSignup ? "new-password" : "current-password"}
              onStrength={val => setStrength(getStrength(val))} />
            {isSignup && strength && (
              <div style={{ marginTop:"6px" }}>
                <div style={{ height:"3px", borderRadius:"2px", background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:"2px", width:strength.width, background:strength.color, transition:"width .4s,background .4s" }} />
                </div>
                <div style={{ fontSize:"10px", marginTop:"4px", color:strength.color, fontFamily:"'DM Sans',sans-serif" }}>{strength.label} password</div>
              </div>
            )}
          </div>

          {isSignup && (
            <div>
              <FloatInput name="confirm" label="Confirm Password" value={formData.confirm} onChange={handleChange} required withEye autoComplete="new-password" />
              {formData.confirm && (
                <div style={{ fontSize:"10.5px", marginTop:"4px", fontFamily:"'DM Sans',sans-serif", color: formData.password === formData.confirm ? "#22c55e" : "#ef4444" }}>
                  {formData.password === formData.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                </div>
              )}
            </div>
          )}

          {/* Forgot password link */}
          {!isSignup && (
            <div style={{ textAlign:"right", marginTop:"-6px" }}>
              <Link to="/forgot-password" style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>
                Forgot password?
              </Link>
            </div>
          )}

          <SubmitBtn loading={loading} label={isSignup ? "Create Account" : "Sign In"} />
        </form>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"20px 0" }}>
          <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,.12)" }} />
          <span style={{ fontSize:"11px", letterSpacing:".16em", textTransform:"uppercase", color:"rgba(255,255,255,.35)" }}>or continue with</span>
          <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,.12)" }} />
        </div>

        <button onClick={() => googleLogin()} disabled={loading} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"11px", padding:"13px", borderRadius:"14px", border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.85)", fontWeight:600, fontSize:"13.5px", cursor:"pointer", transition:"background .2s,transform .18s", fontFamily:"'DM Sans',sans-serif" }} className="gbtn">
          <FcGoogle size={20} /> Continue with Google
        </button>

        <p style={{ textAlign:"center", marginTop:"22px", fontSize:"11px", lineHeight:"1.7", color:"rgba(255,255,255,.35)" }}>
          By continuing you agree to our{" "}
          <span style={{ color:"rgba(255,255,255,.7)", fontWeight:600 }}>Terms of Service</span>{" "}and{" "}
          <span style={{ color:"rgba(255,255,255,.7)", fontWeight:600 }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;