import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { Blobs, Brand, FloatInput, SubmitBtn, pageStyle, cardStyle, globalStyles } from "./Login";

/* ─── Back arrow icon ─── */
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/>
  </svg>
);

/* ─── Mail sent illustration ─── */
const MailSent = () => (
  <div style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}>
    <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    </div>
  </div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${authService}/api/auth/forgot-password`, { email });
      toast.success(res.data.message || "Reset link sent!");
      setSent(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <style>{globalStyles}</style>
      <Blobs />

      <div style={cardStyle}>
        <Brand />

        {!sent ? (
          <>
            {/* Heading */}
            <div style={{ textAlign:"center", marginBottom:"28px" }}>
              <h2 style={{ fontSize:"22px", fontWeight:700, color:"#fff", margin:0, fontFamily:"'Syne',sans-serif" }}>
                Forgot Password?
              </h2>
              <p style={{ marginTop:"8px", fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>
                No worries — enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <FloatInput
                type="email" name="reset_email" label="Email Address"
                value={email} autoComplete="email" required
                onChange={e => setEmail(e.target.value)}
              />
              <SubmitBtn loading={loading} label="Send Reset Link" />
            </form>
          </>
        ) : (
          /* ── Success state ── */
          <div style={{ textAlign:"center", animation:"fadeUp .4s ease" }}>
            <MailSent />
            <h2 style={{ fontSize:"20px", fontWeight:700, color:"#fff", margin:"0 0 10px", fontFamily:"'Syne',sans-serif" }}>
              Check your inbox
            </h2>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.7, marginBottom:"28px" }}>
              We sent a password reset link to<br />
              <span style={{ color:"#fbbf24", fontWeight:600 }}>{email}</span>.<br />
              The link expires in <strong style={{ color:"rgba(255,255,255,0.7)" }}>15 minutes</strong>.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{ background:"none", border:"1.5px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.6)", padding:"10px 24px", borderRadius:"12px", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.5)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
              Try a different email
            </button>
          </div>
        )}

        {/* Back to login */}
        <div style={{ textAlign:"center", marginTop:"28px" }}>
          <Link to="/login" style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.color="#fff")}
            onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>
            <ArrowLeft /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;