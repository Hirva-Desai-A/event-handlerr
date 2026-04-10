import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function ResetPassword() {
    const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // Custom Notification State
    const [notification, setNotification] = useState(null); // { text: string, type: 'error' | 'success' }

    const navigate = useNavigate();

    const handleSendOTP = async () => {
        setNotification(null); // Clear previous notifications

        if (!email) return setNotification({ text: "Please enter your email address.", type: "error" });

        setLoading(true);
        try {
            await API.post("/auth/forgot-password", { email });
            setStep(2);
            setNotification({ text: "An OTP has been sent to your email.", type: "success" });
        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Failed to send OTP. Is this email registered?", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setNotification(null); // Clear previous notifications

        if (!otp || !newPassword) return setNotification({ text: "Please fill out all fields.", type: "error" });
        if (newPassword.length < 6) return setNotification({ text: "Password must be at least 6 characters.", type: "error" });

        setLoading(true);
        try {
            await API.post("/auth/reset-password", { email, otp, newPassword });

            setNotification({ text: "Password reset successfully! You can now login.", type: "success" });

            // Delay navigation slightly so the user can read the success notification
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Failed to reset password. Invalid OTP.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "11px 14px",
        background: "#f7f3ef", border: "1.2px solid #e8e4f8",
        borderRadius: "10px", fontSize: "0.88rem",
        fontFamily: "'DM Sans', sans-serif", outline: "none",
        color: "#2d2d2d", boxSizing: "border-box"
    };

    const labelStyle = {
        fontSize: "0.72rem", color: "#7a7a8c",
        fontWeight: 600, marginBottom: "5px", display: "block",
        letterSpacing: "0.05em", textTransform: "uppercase"
    };

    return (
        <div style={{
            height: "100vh", width: "100vw", overflow: "hidden",
            background: "#f0ecff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <div style={{ position: "fixed", width: 340, height: 340, borderRadius: "50%", background: "rgba(107,92,231,0.08)", top: -80, right: -60, pointerEvents: "none" }} />
            <div style={{ position: "fixed", width: 260, height: 260, borderRadius: "50%", background: "rgba(244,132,106,0.06)", bottom: -70, left: -50, pointerEvents: "none" }} />

            <div style={{
                width: "100%", maxWidth: "400px",
                background: "white", borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(107,92,231,0.14)",
                border: "1.5px solid rgba(107,92,231,0.10)",
                position: "relative",
            }}>
                <div style={{ height: 6, background: "linear-gradient(90deg, #f4846a, #f4c84a, #6b5ce7)" }} />

                <div style={{ padding: "32px 32px 40px" }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 24 }}>
                        {["#f4846a", "#f4c84a", "#64c87d"].map(c => (
                            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block" }} />
                        ))}
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>🔒</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#2d2d2d", marginBottom: 4 }}>
                            Reset Password
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#7a7a8c" }}>
                            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
                        </div>
                    </div>

                    {/* Custom Notification UI */}
                    {notification && (
                        <div style={{
                            marginBottom: 20,
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

                    {step === 1 ? (
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>Registered Email</label>
                                <input
                                    type="email" placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (notification) setNotification(null);
                                    }}
                                    style={inputStyle}
                                />
                            </div>

                            <button onClick={handleSendOTP} disabled={loading} style={{
                                width: "100%", padding: "13px",
                                background: loading ? "#a89fe0" : "#6b5ce7",
                                color: "white", border: "none", borderRadius: 11,
                                fontSize: "0.92rem", fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                marginBottom: 20,
                            }}>
                                {loading ? "Sending OTP..." : "📩 Send OTP"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Enter 6-Digit OTP</label>
                                <input
                                    type="text" placeholder="123456"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value);
                                        if (notification) setNotification(null);
                                    }}
                                    style={{ ...inputStyle, letterSpacing: "2px", fontWeight: "bold" }}
                                    maxLength="6"
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>New Password</label>
                                <input
                                    type="password" placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (notification) setNotification(null);
                                    }}
                                    style={inputStyle}
                                />
                            </div>

                            <button onClick={handleResetPassword} disabled={loading} style={{
                                width: "100%", padding: "13px",
                                background: loading ? "#71c9a8" : "#2cbf8a",
                                color: "white", border: "none", borderRadius: 11,
                                fontSize: "0.92rem", fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                marginBottom: 20,
                            }}>
                                {loading ? "Resetting..." : "✅ Reset Password"}
                            </button>
                        </>
                    )}

                    <div style={{ height: 1, background: "#f0eefc", marginBottom: 20 }} />

                    <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#7a7a8c" }}>
                        Remember your password?{" "}
                        <Link to="/login" style={{ color: "#6b5ce7", fontWeight: 600, textDecoration: "none" }}>Login →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;