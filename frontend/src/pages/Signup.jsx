import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Custom Notification State
    const [notification, setNotification] = useState(null); // { text: string, type: 'error' | 'success' }

    const navigate = useNavigate();

    const signup = async () => {

        setLoading(true);
        setNotification(null); // Clear previous notifications

        try {

            const res = await API.post("/auth/signup", {
                name,
                email,
                password
            });

            // Show success message
            setNotification({ text: "OTP sent to your email", type: "success" });

            // Delay navigation slightly so the user can read the notification
            setTimeout(() => {
                navigate("/verify-otp", { state: { email } });
            }, 1500);

        } catch (err) {

            // Show error message
            setNotification({ text: err.response?.data?.message || "Signup failed", type: "error" });

        } finally {
            setLoading(false);
        }

    };

    const inputStyle = {
        width: "100%",
        padding: "11px 5px",
        background: "#f7f3ef",
        border: "1.2px solid #e8e4f8",
        borderRadius: "10px",
        fontSize: "0.88rem",
        fontFamily: "'DM Sans', sans-serif",
        outline: "none",
        color: "#2d2d2d",
    };

    const labelStyle = {
        fontSize: "0.72rem",
        color: "#7a7a8c",
        fontWeight: 500,
        marginBottom: "5px",
        display: "block",
    };

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            background: "#f7f3ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
        }}>

            {/* background circles */}
            <div style={{
                position: "fixed",
                width: 360,
                height: 360,
                borderRadius: "50%",
                background: "rgba(232,97,90,0.07)",
                top: -90,
                right: -70
            }} />

            <div style={{
                position: "fixed",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "rgba(107,92,231,0.07)",
                bottom: -70,
                left: -50
            }} />

            <div style={{
                width: "100%",
                maxWidth: "420px",
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(107,92,231,0.13)",
                border: "1.5px solid rgba(107,92,231,0.10)"
            }}>

                <div style={{ height: 5, background: "linear-gradient(90deg, #e8615a, #f4c5c5, #ddd6f7)" }} />

                <div style={{ padding: "32px 36px 36px" }}>

                    <div style={{ display: "flex", gap: 5, marginBottom: 28 }}>
                        {["#f4846a", "#f4c84a", "#64c87d"].map(c => (
                            <span key={c} style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: c
                            }} />
                        ))}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.7rem",
                            color: "#2d2d2d",
                            marginBottom: 4
                        }}>
                            Create Account ✨
                        </div>

                        <div style={{
                            fontSize: "0.8rem",
                            color: "#7a7a8c"
                        }}>
                            Join the Student Event Portal
                        </div>
                    </div>

                    {/* Custom Notification UI */}
                    {notification && (
                        <div style={{
                            marginBottom: 16,
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

                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        onClick={signup}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: loading ? "#c0a0e0" : "#6b5ce7",
                            color: "white",
                            border: "none",
                            borderRadius: 11,
                            fontSize: "0.92rem",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            marginBottom: 20
                        }}
                    >
                        {loading ? "Creating account..." : "✨ Create Account"}
                    </button>

                    <div style={{
                        height: 1,
                        background: "#f0eefc",
                        marginBottom: 20
                    }} />

                    <div style={{
                        textAlign: "center",
                        fontSize: "0.8rem",
                        color: "#7a7a8c"
                    }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{
                            color: "#6b5ce7",
                            fontWeight: 600,
                            textDecoration: "none"
                        }}>
                            Login →
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Signup;