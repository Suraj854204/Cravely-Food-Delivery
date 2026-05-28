import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { Blobs, Brand, FloatInput, SubmitBtn, getStrength, pageStyle, cardStyle, globalStyles } from "./Login";

/* ─── Shield icon ─── */
const ShieldIcon = () => (
  <div style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}>
    <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9,12 11,14 15,10"/>
      </svg>
    </div>
  </div>
);

/* ─── Success state ─── */
const SuccessView = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign:"center", animation:"fadeUp .4s ease" }}>
      <ShieldIcon />
      <h2 style={{ fontSize:"20px", fontWeight:700, color:"#fff", margin:"0 0 10px", fontFamily:"'Syne',sans-serif" }}>
        Password Reset!
      </h2>
      <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.7, marginBottom:"28px" }}>
        Your password has been updated successfully.<br />
        You can now sign in with your new password.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="submit-hover"
        style={{ width:"100%", padding:"15px", borderRadius:"14px", border:"none", cursor:"pointer", fontWeight:700, fontSize:"14px", background:"linear-gradient(135deg,#ff6b35,#e91e63)", color:"#fff", boxShadow:"0 8px 24px rgba(233,30,99,.35)", transition:"transform .18s,box-shadow .18s", fontFamily:"'DM Sans',sans-serif" }}>
        Go to Sign In
      </button>
    </div>
  );
};

/* ══════════════════════════════════
   RESET PASSWORD PAGE
══════════════════════════════════ */
const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [strength, setStrength] = useState<ReturnType<typeof getStrength>>(null);
  const [formData, setFormData] = useState({ password:"", confirm:"" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      toast.error("Passwords do not match"); return;
    }
    if (!strength || strength.label === "Weak") {
      toast.error("Please choose a stronger password"); return;
    }
    if (!token) {
      toast.error("Invalid reset link"); return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${authService}/api/auth/reset-password/${token}`, {
        password: formData.password,
      });
      toast.success(res.data.message || "Password reset successful");
      setDone(true);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Reset failed";
      toast.error(msg);
      // Token expired → send back to forgot password
      if (error?.response?.status === 400) {
        setTimeout(() => navigate("/forgot-password"), 2000);
      }
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

        {done ? <SuccessView /> : (
          <>
            {/* Heading */}
            <div style={{ textAlign:"center", marginBottom:"28px" }}>
              <h2 style={{ fontSize:"22px", fontWeight:700, color:"#fff", margin:0, fontFamily:"'Syne',sans-serif" }}>
                Set New Password
              </h2>
              <p style={{ marginTop:"8px", fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>
                Must be at least 8 characters with a number and uppercase letter.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {/* New password */}
              <div>
                <FloatInput
                  name="password" label="New Password" value={formData.password}
                  onChange={handleChange} required withEye autoComplete="new-password"
                  onStrength={val => setStrength(getStrength(val))}
                />
                {strength && (
                  <div style={{ marginTop:"6px" }}>
                    <div style={{ height:"3px", borderRadius:"2px", background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:"2px", width:strength.width, background:strength.color, transition:"width .4s,background .4s" }} />
                    </div>
                    <div style={{ fontSize:"10px", marginTop:"4px", color:strength.color, fontFamily:"'DM Sans',sans-serif" }}>
                      {strength.label} password
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <FloatInput
                  name="confirm" label="Confirm New Password" value={formData.confirm}
                  onChange={handleChange} required withEye autoComplete="new-password"
                />
                {formData.confirm && (
                  <div style={{ fontSize:"10.5px", marginTop:"4px", fontFamily:"'DM Sans',sans-serif",
                    color: formData.password === formData.confirm ? "#22c55e" : "#ef4444" }}>
                    {formData.password === formData.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </div>
                )}
              </div>

              {/* Requirements checklist */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"14px 16px", display:"flex", flexDirection:"column", gap:"6px" }}>
                {[
                  { label:"At least 8 characters", ok: formData.password.length >= 8 },
                  { label:"One uppercase letter",   ok: /[A-Z]/.test(formData.password) },
                  { label:"One number",             ok: /[0-9]/.test(formData.password) },
                  { label:"One special character",  ok: /[^A-Za-z0-9]/.test(formData.password) },
                ].map(({ label, ok }) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", fontFamily:"'DM Sans',sans-serif", color: ok ? "#22c55e" : "rgba(255,255,255,0.35)", transition:"color .3s" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      {ok ? <><polyline points="20,6 9,17 4,12"/></> : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
                    </svg>
                    {label}
                  </div>
                ))}
              </div>

              <SubmitBtn loading={loading} label="Reset Password" />
            </form>
          </>
        )}

        {/* Back to login */}
        {!done && (
          <div style={{ textAlign:"center", marginTop:"28px" }}>
            <Link to="/login" style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color="#fff")}
              onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/>
              </svg>
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;