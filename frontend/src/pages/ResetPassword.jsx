import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function ResetPassword() {
    const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!email) return alert("Please enter your email address.");
        setLoading(true);
        try {
            await API.post("/auth/forgot-password", { email });
            setStep(2);
            alert("An OTP has been sent to your email.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP. Is this email registered?");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword) return alert("Please fill out all fields.");
        if (newPassword.length < 6) return alert("Password must be at least 6 characters.");

        setLoading(true);
        try {
            await API.post("/auth/reset-password", { email, otp, newPassword });
            alert("Password reset successfully! You can now login.");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reset password. Invalid OTP.");
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

                    {step === 1 ? (
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>Registered Email</label>
                                <input
                                    type="email" placeholder="you@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
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
                                    value={otp} onChange={(e) => setOtp(e.target.value)}
                                    style={{ ...inputStyle, letterSpacing: "2px", fontWeight: "bold" }}
                                    maxLength="6"
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>New Password</label>
                                <input
                                    type="password" placeholder="••••••••"
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
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