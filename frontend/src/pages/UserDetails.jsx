import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function UserDetails() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);

    // Custom Notification State
    const [notification, setNotification] = useState(null); // { text: string, type: 'error' | 'success' }

    const navigate = useNavigate();

    const save = async () => {
        setLoading(true);
        setNotification(null); // Clear previous notifications
        try {
            await API.put("/user/details", { name, phone, college, year });

            // Show success message
            setNotification({ text: "Profile updated!", type: "success" });

            // Delay navigation slightly so the user can read the notification
            setTimeout(() => {
                navigate("/profile");
            }, 1500);

        } catch {
            setNotification({ text: "Failed to update profile.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px" }}>
            <div className="card" style={{ width: "100%", maxWidth: "440px", margin: "0 auto" }}>

                {/* Screen bar */}
                <div className="screen-bar" style={{ background: "linear-gradient(90deg, var(--sage), var(--mint), var(--sky))" }} />

                {/* Header */}
                <div style={{ padding: "20px 22px 12px", borderBottom: "1px solid #f0eefc" }}>
                    <div className="screen-dots">
                        <span className="d1" /><span className="d2" /><span className="d3" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div className="form-title" style={{ textAlign: "left", marginBottom: "2px" }}>✏️ Edit Profile</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Update your details</div>
                        </div>
                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <span className="link-text" style={{ fontSize: "0.75rem" }}>← Back</span>
                        </Link>
                    </div>
                </div>

                {/* Form */}
                <div className="form-screen" style={{ paddingTop: "18px" }}>

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

                    {/* Avatar preview */}
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--lavender), var(--pink))",
                            margin: "0 auto 8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            border: "3px solid white",
                            boxShadow: "var(--shadow2)"
                        }}>
                            🎓
                        </div>
                        <span className="link-text" style={{ fontSize: "0.72rem" }}>Change Photo</span>
                    </div>

                    <div className="field-label">Full Name</div>
                    <input
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="field-label">Phone Number</div>
                    <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <div className="field-label">College / Institution</div>
                    <input
                        placeholder="Your college name"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                    />

                    <div className="field-label">Year of Study</div>
                    <input
                        placeholder="e.g. 2nd Year B.Tech"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />

                    <div style={{ marginTop: "22px" }}>
                        <button
                            className="btn-primary"
                            onClick={save}
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Saving..." : "💾 Save Changes"}
                        </button>
                    </div>

                    <div className="divider" />

                    <div style={{ textAlign: "center" }}>
                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <span className="link-text" style={{ fontSize: "0.78rem" }}>Cancel</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserDetails;