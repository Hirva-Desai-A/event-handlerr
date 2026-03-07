import { Link } from "react-router-dom";

function Landing() {
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            background: "#f0ecff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* subtle background blobs */}
            <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "rgba(107,92,231,0.08)", top: -100, right: -80, pointerEvents: "none" }} />
            <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", background: "rgba(232,97,90,0.06)", bottom: -80, left: -60, pointerEvents: "none" }} />

            {/* Card */}
            <div style={{
                width: "100%",
                maxWidth: "400px",
                background: "white",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(107,92,231,0.15)",
                border: "1.5px solid rgba(107,92,231,0.12)",
                position: "relative",
            }}>

                {/* top gradient bar */}
                <div style={{ height: 6, background: "linear-gradient(90deg, #ddd6f7, #f4c5c5, #bfe3f5)" }} />

                {/* Hero */}
                <div style={{
                    background: "linear-gradient(145deg, #f9f0ff 0%, #fff0f8 55%, #f0f9ff 100%)",
                    borderBottom: "1px solid #f0eefc",
                    padding: "26px 24px 22px",
                    textAlign: "center",
                }}>
                    {/* screen dots */}
                    <div style={{ display: "flex", gap: 5, marginBottom: 18 }}>
                        {["#f4846a", "#f4c84a", "#64c87d"].map(c => (
                            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block" }} />
                        ))}
                    </div>

                    <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎪</div>

                    <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        color: "#6b5ce7",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginBottom: 6,
                    }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#6b5ce7", display: "inline-block" }} />
                        Event Handler
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "#7a7a8c" }}>
                        Discover · Register · Attend
                    </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "28px 26px 30px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.84rem", color: "#7a7a8c", marginBottom: 22 }}>
                        Welcome! How would you like to continue?
                    </p>

                    <div style={{ display: "flex", gap: 12 }}>
                        <Link to="/login" style={{ flex: 1, textDecoration: "none" }}>
                            <button style={{
                                width: "100%", padding: "12px",
                                background: "#6b5ce7", color: "white",
                                border: "none", borderRadius: 12,
                                fontSize: "0.9rem", fontWeight: 600,
                                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                            }}>🔑 Login</button>
                        </Link>
                        <Link to="/signup" style={{ flex: 1, textDecoration: "none" }}>
                            <button style={{
                                width: "100%", padding: "12px",
                                background: "white", color: "#6b5ce7",
                                border: "1.5px solid #6b5ce7", borderRadius: 12,
                                fontSize: "0.9rem", fontWeight: 600,
                                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                            }}>✨ Sign Up</button>
                        </Link>
                    </div>

                    <div style={{ height: 1, background: "#f0eefc", margin: "20px 0" }} />

                    <div style={{ fontSize: "0.74rem", color: "#7a7a8c" }}>
                        Are you an admin?{" "}
                        <Link to="/admin" style={{ color: "#6b5ce7", fontWeight: 700, textDecoration: "none" }}>
                            Admin Portal →
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Landing;