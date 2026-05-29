import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../main";

type Role = "customer" | "rider" | "seller" | null;

const roles: {
  id: Exclude<Role, null>;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "customer",
    label: "Customer",
    icon: "🛒",
    description: "Order food from nearby restaurants",
  },
  {
    id: "rider",
    label: "Rider",
    icon: "🛵",
    description: "Deliver orders & earn on the go",
  },
  {
    id: "seller",
    label: "Seller",
    icon: "🍽️",
    description: "List your restaurant & grow sales",
  },
];

const SelectRole = () => {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppData();
  const navigate = useNavigate();

  const addRole = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${authService}/api/auth/add/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/", { replace: true });
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: "#0f0d0b" }}
    >
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute -left-16 -top-20 h-80 w-80 rounded-full opacity-20"
        style={{ background: "#E23744", filter: "blur(72px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 rounded-full opacity-15"
        style={{ background: "#ff9c40", filter: "blur(72px)" }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-3xl p-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Badge */}
        <span
          className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest"
          style={{
            background: "rgba(226,55,68,0.15)",
            border: "0.5px solid rgba(226,55,68,0.3)",
            color: "#f87171",
          }}
        >
          ✦ Get started
        </span>

        <h1
          className="mb-1 text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "#f5f0eb" }}
        >
          Choose your role
        </h1>
        <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
          Select how you want to use the platform
        </p>

        {/* Role buttons */}
        <div className="mb-6 flex flex-col gap-2.5">
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-all duration-200"
                style={{
                  border: isActive
                    ? "1px solid #E23744"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isActive
                    ? "rgba(226,55,68,0.12)"
                    : "rgba(255,255,255,0.03)",
                  transform: isActive ? "translateX(3px)" : "translateX(0)",
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{
                    background: isActive
                      ? "rgba(226,55,68,0.2)"
                      : "rgba(255,255,255,0.06)",
                  }}
                >
                  {r.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p
                    className="mb-0.5 text-sm font-medium capitalize"
                    style={{ color: "#f0ebe5" }}
                  >
                    {r.label}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {r.description}
                  </p>
                </div>

                {/* Check */}
                <div
                  className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: isActive ? "none" : "1.5px solid rgba(255,255,255,0.15)",
                    background: isActive ? "#E23744" : "transparent",
                  }}
                >
                  {isActive && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mb-5 flex items-center gap-2.5">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="whitespace-nowrap text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            You can change this later in settings
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* CTA */}
        <button
          disabled={!role || loading}
          onClick={addRole}
          className="w-full rounded-2xl py-4 text-sm font-semibold transition-all duration-200"
          style={
            role
              ? {
                  background: "linear-gradient(135deg, #E23744, #c42030)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(226,55,68,0.35)",
                  cursor: loading ? "wait" : "pointer",
                }
              : {
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.2)",
                  cursor: "not-allowed",
                }
          }
        >
          {loading
            ? "Setting up your account..."
            : role
            ? `Continue as ${role.charAt(0).toUpperCase() + role.slice(1)} →`
            : "Continue →"}
        </button>
      </div>
    </div>
  );
};

export default SelectRole;