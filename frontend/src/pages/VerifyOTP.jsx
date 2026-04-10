import { useState, useRef } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";

function VerifyOTP() {
    const location = useLocation();
    const [email] = useState(location.state?.email || "");
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    // Custom Notification State
    const [notification, setNotification] = useState(null); // { text: string, type: 'error' | 'success' }

    const inputRefs = useRef([]);

    const navigate = useNavigate();

    const handleDigit = (val, idx) => {
        const clean = val.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[idx] = clean;
        setDigits(next);

        // Clear notification on input change
        if (notification) setNotification(null);

        if (clean && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleKey = (e, idx) => {
        if (e.key === "Backspace" && !digits[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const next = ["", "", "", "", "", ""];
        text.split("").forEach((ch, i) => { next[i] = ch; });
        setDigits(next);

        if (notification) setNotification(null);

        const focusIdx = Math.min(text.length, 5);
        inputRefs.current[focusIdx]?.focus();
    };

    const verify = async () => {
        setNotification(null); // Clear previous notifications

        const otp = digits.join("");
        if (otp.length < 6) return setNotification({ text: "Please enter all 6 digits.", type: "error" });

        setLoading(true);
        try {
            const res = await API.post("/auth/verify-otp", { email, otp });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/profile");
        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Invalid OTP. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // NEW: Handle Resend OTP
    const handleResendOTP = async () => {
        setNotification(null); // Clear previous notifications

        if (!email) return setNotification({ text: "Email not found. Please try signing up again.", type: "error" });

        setResending(true);
        try {
            await API.post("/auth/resend-otp", { email });
            setNotification({ text: "A new OTP has been sent to your email!", type: "success" });
        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Failed to resend OTP.", type: "error" });
        } finally {
            setResending(false);
        }
    };

    return (
        <div style={{
            height: "100vh", width: "100vw", overflow: "hidden", background: "#f0ecff",
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif",
        }}>
            <div style={{ position: "fixed", width: 340, height: 340, borderRadius: "50%", background: "rgba(44,191,138,0.08)", top: -80, right: -60, pointerEvents: "none" }} />
            <div style={{ position: "fixed", width: 260, height: 260, borderRadius: "50%", background: "rgba(107,92,231,0.07)", bottom: -70, left: -50, pointerEvents: "none" }} />

            <div style={{
                width: "100%", maxWidth: "420px", background: "white", borderRadius: 24,
                overflow: "hidden", boxShadow: "0 8px 40px rgba(107,92,231,0.14)", border: "1.5px solid rgba(107,92,231,0.10)", position: "relative",
            }}>
                <div style={{ height: 6, background: "linear-gradient(90deg, #c5e8d8, #bfe3f5, #ddd6f7)" }} />

                <div style={{ padding: "28px 32px 32px" }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 22 }}>
                        {["#f4846a", "#f4c84a", "#64c87d"].map(c => (
                            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block" }} />
                        ))}
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 22 }}>
                        <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>📬</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#2d2d2d", marginBottom: 4 }}>
                            Verify Your Email
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#7a7a8c" }}>
                            Enter the OTP sent to <strong style={{ color: "#6b5ce7" }}>{email}</strong>
                        </div>
                    </div>

                    {/* Custom Notification UI */}
                    {notification && (
                        <div style={{
                            marginBottom: 22,
                            padding: "10px 14px",
                            background: notification.type === "success" ? "rgba(44,191,138,0.1)" : "rgba(244,132,106,0.1)",
                            border: `1px solid ${notification.type === "success" ? "rgba(44,191,138,0.3)" : "rgba(244,132,106,0.3)"}`,
                            borderRadius: "10px",
                            color: notification.type === "success" ? "#1a7a52" : "#d63031",
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <span>{notification.text}</span>
                            <button
                                onClick={() => setNotification(null)}
                                style={{
                                    background: "transparent", border: "none",
                                    color: notification.type === "success" ? "#1a7a52" : "#d63031",
                                    cursor: "pointer",
                                    fontSize: "1.2rem", lineHeight: 1, padding: 0
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 26 }} onPaste={handlePaste}>
                        {digits.map((d, i) => (
                            <input
                                key={i} ref={el => (inputRefs.current[i] = el)}
                                type="text" inputMode="numeric" maxLength={1} value={d}
                                onChange={e => handleDigit(e.target.value, i)}
                                onKeyDown={e => handleKey(e, i)}
                                style={{
                                    width: 44, height: 52, textAlign: "center",
                                    fontSize: "1.25rem", fontWeight: 700, color: "#6b5ce7",
                                    background: d ? "#f4f0ff" : "#faf8ff",
                                    border: d ? "2px solid #6b5ce7" : "2px solid #ddd6f7",
                                    borderRadius: 10, outline: "none", fontFamily: "'DM Sans', sans-serif",
                                    transition: "border 0.15s, background 0.15s", caretColor: "#6b5ce7",
                                }}
                            />
                        ))}
                    </div>

                    <button onClick={verify} disabled={loading} style={{
                        width: "100%", padding: 13, background: loading ? "#71c9a8" : "#2cbf8a",
                        color: "white", border: "none", borderRadius: 11, fontSize: "0.92rem", fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer", marginBottom: 18,
                    }}>
                        {loading ? "Verifying..." : "✅ Verify OTP"}
                    </button>

                    <div style={{ height: 1, background: "#f0eefc", marginBottom: 16 }} />

                    <div style={{ textAlign: "center", fontSize: "0.77rem", color: "#7a7a8c", marginBottom: 8 }}>
                        Didn't receive the code?{" "}
                        <span
                            onClick={handleResendOTP}
                            style={{ color: "#6b5ce7", fontWeight: 600, cursor: resending ? "not-allowed" : "pointer", opacity: resending ? 0.6 : 1 }}
                        >
                            {resending ? "Sending..." : "Resend OTP"}
                        </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Link to="/login" style={{ color: "#6b5ce7", fontWeight: 600, fontSize: "0.77rem", textDecoration: "none" }}>
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;