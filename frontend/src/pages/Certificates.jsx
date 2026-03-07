import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const MOCK_CERTS = [
    { _id: "1", eventName: "HackForge 2025", issuedOn: "Mar 16, 2025", icon: "🏆" },
    { _id: "2", eventName: "AI Workshop", issuedOn: "Apr 3, 2025", icon: "🤖" },
];

function Certificates() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await API.get("/certificates");
                setCerts(res.data);
            } catch {
                setCerts(MOCK_CERTS);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px" }}>
            <div className="card" style={{ width: "100%", maxWidth: "480px", margin: "0 auto" }}>

                {/* Screen bar */}
                <div className="screen-bar" style={{ background: "linear-gradient(90deg, var(--peach), var(--lilac), var(--pink))" }} />

                {/* Header */}
                <div style={{ padding: "20px 22px 12px", borderBottom: "1px solid #f0eefc" }}>
                    <div className="screen-dots">
                        <span className="d1" /><span className="d2" /><span className="d3" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div className="form-title" style={{ textAlign: "left", marginBottom: "2px" }}>🏆 Certificates</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                                {certs.length} certificate{certs.length !== 1 ? "s" : ""} earned
                            </div>
                        </div>
                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <span className="link-text" style={{ fontSize: "0.75rem" }}>← Back</span>
                        </Link>
                    </div>
                </div>

                {/* Cert list */}
                <div style={{ padding: "16px 20px 24px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                            Loading certificates...
                        </div>
                    ) : certs.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🎗️</div>
                            <div style={{ fontWeight: "600", marginBottom: "4px" }}>No Certificates Yet</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                                Attend events to earn certificates
                            </div>
                        </div>
                    ) : (
                        certs.map((cert) => (
                            <div key={cert._id} className="cert-card">
                                <div className="cert-icon">{cert.icon || "🏆"}</div>
                                <div className="cert-name">{cert.eventName}</div>
                                <div className="cert-event">Issued on {cert.issuedOn}</div>
                                <div style={{ marginTop: "10px" }}>
                                    <button
                                        style={{
                                            background: "var(--lavender)",
                                            color: "var(--accent)",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 16px",
                                            fontSize: "0.73rem",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            width: "auto"
                                        }}
                                    >
                                        ⬇ Download
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}

export default Certificates;