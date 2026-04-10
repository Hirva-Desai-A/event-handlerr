import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Sub-panels ───────────────────────────────────────────────────────────────

function UserDetailsPanel({ onClose, user, setUser }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // Email Verification State
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    // Custom Notification State
    const [notification, setNotification] = useState(null); // { text: string, type: 'error' | 'success' }

    const emailChanged = email !== user?.email;

    // Handles sending the OTP to the new email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setNotification(null); // Clear previous notifications

        if (!email || !email.includes('@')) {
            return setNotification({ text: "Enter a valid email", type: "error" });
        }

        setSendingOtp(true);
        try {
            // FIX: Grab the token to fix the 401 Unauthorized error
            const token = localStorage.getItem("token");

            await API.post("/auth/send-update-otp",
                { newEmail: email },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOtpSent(true);
            setNotification({ text: `OTP sent to ${email}`, type: "success" });
        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Failed to send OTP", type: "error" });
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSave = async () => {
        setNotification(null); // Clear previous notifications

        if (password || confirm) {
            if (password !== confirm) {
                return setNotification({ text: "Passwords do not match!", type: "error" });
            }
            if (password.length < 6) {
                return setNotification({ text: "Password must be at least 6 characters long.", type: "error" });
            }
        }

        // Verification Checks for Email Change
        if (emailChanged && !otpSent) {
            return setNotification({ text: "Please click 'Send OTP' to verify your new email first.", type: "error" });
        }
        if (emailChanged && !otp) {
            return setNotification({ text: "Please enter the OTP sent to your new email.", type: "error" });
        }

        setLoading(true);
        try {
            // FIX: Grab the token
            const token = localStorage.getItem("token");

            const res = await API.put("/auth/update", {
                name,
                email,
                password: password || undefined,
                otp: emailChanged ? otp : undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

            setPassword("");
            setConfirm("");
            setOtp("");
            setOtpSent(false);

        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Failed to update profile", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const inp = {
        width: "100%", padding: "11px 14px", background: "#f7f4ff", border: "1.5px solid #ece8fc",
        borderRadius: 10, fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", outline: "none",
        color: "#2d2d2d", boxSizing: "border-box",
    };

    const lbl = {
        fontSize: "0.7rem", color: "#7a7a8c", fontWeight: 600, marginBottom: 5, display: "block",
        letterSpacing: "0.05em", textTransform: "uppercase",
    };

    return (
        <div style={{ paddingBottom: 32 }}>

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

            <div style={{ marginBottom: 14 }}>
                <label style={lbl}>User Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={inp} placeholder="Your full name" />
            </div>

            <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Email ID</label>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            setOtpSent(false);
                            setOtp("");
                            setNotification(null); // Clear notification on email change
                        }}
                        style={inp}
                        placeholder="your@email.com"
                    />

                    {emailChanged && !otpSent && (
                        <button
                            onClick={handleSendOtp} disabled={sendingOtp}
                            style={{
                                padding: "0 16px", background: "#e0f5ed", color: "#1a7a52", border: "none",
                                borderRadius: 10, fontSize: "0.75rem", fontWeight: 700,
                                cursor: sendingOtp ? "not-allowed" : "pointer", whiteSpace: "nowrap"
                            }}
                        >
                            {sendingOtp ? "Sending..." : "Send OTP"}
                        </button>
                    )}
                </div>

                {emailChanged && otpSent && (
                    <div style={{ marginTop: "8px" }}>
                        <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            style={{ ...inp, borderColor: "#2cbf8a", background: "#f0fff8" }}
                            placeholder="Enter 6-digit OTP sent to new email"
                        />
                    </div>
                )}
            </div>

            <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Change Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} placeholder="New password" />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inp} placeholder="Confirm new password" />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={handleSave} disabled={loading} style={{
                    flex: 2, padding: 12, background: saved ? "#2cbf8a" : "#6b5ce7",
                    color: "white", border: "none", borderRadius: 11, fontSize: "0.9rem", fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.2s", opacity: loading ? 0.7 : 1
                }}>
                    {loading ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
                </button>
                <button onClick={onClose} style={{
                    flex: 1, padding: 12, background: "white", color: "#7a7a8c", border: "1.5px solid #ece8fc",
                    borderRadius: 11, fontSize: "0.9rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                }}>Cancel</button>
            </div>
        </div>
    );
}

function RegisteredEventsPanel() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackEvents = [
        { _id: "1", emoji: "🚀", title: "HackForge 2025", date: "Mar 15, 2025", venue: "IIT Campus", type: "Upcoming", statusColor: "#6b5ce7", statusBg: "#f0ecff", grad: "linear-gradient(135deg,#ddd6f7,#bfe3f5)" },
        { _id: "2", emoji: "💡", title: "AI Workshop", date: "Apr 2, 2025", venue: "Online", type: "Confirmed", statusColor: "#2cbf8a", statusBg: "#e0f5ed", grad: "linear-gradient(135deg,#c5e8d8,#f0fff8)" },
        { _id: "3", emoji: "🎨", title: "UX Design Sprint", date: "Apr 20, 2025", venue: "NSIT Delhi", type: "Upcoming", statusColor: "#6b5ce7", statusBg: "#f0ecff", grad: "linear-gradient(135deg,#f4c5c5,#fdecd8)" },
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get("/events/registered");
                setEvents(res.data?.length ? res.data : fallbackEvents);
            } catch {
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div style={{ paddingBottom: 32 }}>
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#7a7a8c", fontSize: "0.85rem" }}>
                    Loading events...
                </div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#7a7a8c", fontSize: "0.85rem" }}>
                    No registered events found.
                </div>
            ) : (
                events.map(ev => (
                    <div key={ev._id} style={{ marginBottom: 14, borderRadius: 16, overflow: "hidden", border: "1px solid #ece8fc", background: "white" }}>
                        <div style={{ height: 68, background: ev.grad || "linear-gradient(135deg,#ddd6f7,#bfe3f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{ev.emoji || "🎪"}</div>
                        <div style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2d2d2d" }}>{ev.title || ev.name}</div>
                                <span style={{ background: ev.statusBg || "#f0ecff", color: ev.statusColor || "#6b5ce7", borderRadius: 20, padding: "3px 11px", fontSize: "0.68rem", fontWeight: 700 }}>{ev.status || ev.type || "Event"}</span>
                            </div>
                            <div style={{ fontSize: "0.73rem", color: "#7a7a8c" }}>📅 {ev.date} · 📍 {ev.venue}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function EventsAttendedPanel() {
    const events = [
        { id: 1, emoji: "🏅", name: "DevSprint 2024", date: "Nov 20, 2024", grad: "linear-gradient(135deg,#fdecd8,#f4c5c5)" },
        { id: 2, emoji: "🎯", name: "UX Summit", date: "Oct 5, 2024", grad: "linear-gradient(135deg,#f4c5c5,#ddd6f7)" },
        { id: 3, emoji: "⚡", name: "Code Blitz", date: "Sep 12, 2024", grad: "linear-gradient(135deg,#c5e8d8,#bfe3f5)" },
    ];
    return (
        <div style={{ paddingBottom: 32 }}>
            {events.map(ev => (
                <div key={ev.id} style={{ marginBottom: 14, borderRadius: 16, overflow: "hidden", border: "1px solid #ece8fc", background: "white" }}>
                    <div style={{ height: 68, background: ev.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{ev.emoji}</div>
                    <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2d2d2d", marginBottom: 3 }}>{ev.name}</div>
                            <div style={{ fontSize: "0.73rem", color: "#7a7a8c" }}>📅 {ev.date}</div>
                        </div>
                        <span style={{ background: "#e0f5ed", color: "#1a7a52", borderRadius: 20, padding: "4px 13px", fontSize: "0.68rem", fontWeight: 700 }}>Attended ✓</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CertificatesPanel() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackCerts = [
        { _id: "1", emoji: "🥇", eventName: "DevSprint 2024", type: "Participation Certificate", grad: "linear-gradient(135deg,#fdecd8,#fad5b0)" },
        { _id: "2", emoji: "🏆", eventName: "UX Summit 2024", type: "Achievement Certificate", grad: "linear-gradient(135deg,#ddd6f7,#f4c5c5)" },
    ];

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await API.get("/certificates");
                setCerts(res.data?.length ? res.data : fallbackCerts);
            } catch {
                setCerts(fallbackCerts);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div style={{ paddingBottom: 32 }}>
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#7a7a8c", fontSize: "0.85rem" }}>
                    Loading certificates...
                </div>
            ) : certs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#7a7a8c", fontSize: "0.85rem" }}>
                    No certificates found.
                </div>
            ) : (
                certs.map(cert => (
                    <div key={cert._id} style={{ marginBottom: 14, borderRadius: 16, overflow: "hidden", border: "1px solid #ece8fc", background: "white" }}>
                        <div style={{ height: 68, background: cert.grad || "linear-gradient(135deg,#fdecd8,#fad5b0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{cert.emoji || cert.icon || "🏆"}</div>
                        <div style={{ padding: "10px 14px" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2d2d2d", marginBottom: 2 }}>{cert.eventName || cert.name}</div>
                            <div style={{ fontSize: "0.73rem", color: "#7a7a8c", marginBottom: 10 }}>{cert.type || `Issued on ${cert.issuedOn || "recent"}`}</div>
                            <button style={{
                                background: "#fdecd8", color: "#b05a10", border: "none",
                                borderRadius: 10, padding: "6px 16px", fontSize: "0.75rem",
                                fontWeight: 700, cursor: "pointer",
                            }}>⬇ Download</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// ── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
    { key: "user-details", icon: "👤", label: "User Details" },
    { key: "registered-events", icon: "📅", label: "Registered Events" },
    { key: "events-attended", icon: "✅", label: "Events Attended" },
    { key: "certificates", icon: "🏆", label: "Certificates" },
];

const MIN_W = 260;
const MAX_W = 680;
const DEFAULT_W = 360;

// ── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user") || "{}");
    });

    const userName = user?.name || "Guest User";
    const userEmail = user?.email || "guest@email.com";

    const generateInitials = (nameStr) => {
        if (!nameStr) return "GU";
        const parts = nameStr.trim().split(" ");
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return nameStr.slice(0, 2).toUpperCase();
    };

    const initials = generateInitials(userName);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [drawerWidth, setDrawerWidth] = useState(DEFAULT_W);

    const [isDragging, setIsDragging] = useState(false);

    const startX = useRef(0);
    const startW = useRef(DEFAULT_W);

    const openDrawer = () => { setDrawerOpen(true); setActiveSection(null); };
    const closeDrawer = () => { setDrawerOpen(false); setActiveSection(null); };
    const goBack = () => setActiveSection(null);
    const currentSection = SECTIONS.find(s => s.key === activeSection);

    const onDragStart = useCallback((e) => {
        e.preventDefault();
        startX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        startW.current = drawerWidth;
        setIsDragging(true);
    }, [drawerWidth]);

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e) => {
            const cx = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
            const next = Math.min(MAX_W, Math.max(MIN_W, startW.current + (startX.current - cx)));
            setDrawerWidth(next);
        };
        const onUp = () => setIsDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
        };
    }, [isDragging]);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(145deg, #f0ecff 0%, #fff0f8 60%, #f0f9ff 100%)",
            fontFamily: "'DM Sans', sans-serif",
        }}>

            {isDragging && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, cursor: "ew-resize" }} />
            )}

            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(107,92,231,0.1)",
                boxShadow: "0 2px 16px rgba(107,92,231,0.07)",
            }}>
                <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem", color: "#6b5ce7", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6b5ce7", display: "inline-block" }} />
                    Event Handler
                </div>

                <button
                    onClick={openDrawer}
                    style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg, #6b5ce7, #9b8ef5)",
                        border: "2.5px solid white",
                        boxShadow: "0 2px 12px rgba(107,92,231,0.35)",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 700, fontSize: "0.82rem",
                        transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    {initials}
                </button>
            </div>

            <div style={{ padding: "90px 20px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎪</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#6b5ce7", marginBottom: 8 }}>
                    Welcome back, {userName.split(" ")[0]}!
                </div>
                <div style={{ fontSize: "0.85rem", color: "#7a7a8c" }}>
                    Click the <strong>{initials}</strong> icon in the top-right to open your profile.
                </div>
            </div>

            <div
                onClick={closeDrawer}
                style={{
                    position: "fixed", inset: 0, zIndex: 40,
                    background: "rgba(30,20,60,0.28)",
                    opacity: drawerOpen ? 1 : 0,
                    pointerEvents: drawerOpen ? "all" : "none",
                    transition: "opacity 0.3s",
                    backdropFilter: drawerOpen ? "blur(2px)" : "none",
                }}
            />

            <div style={{
                position: "fixed", top: 0, right: 0,
                width: `min(${drawerWidth}px, 92vw)`,
                height: "100vh",
                background: "white",
                zIndex: 50,
                transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
                transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                display: "flex", flexDirection: "column",
                boxShadow: "-8px 0 40px rgba(107,92,231,0.18)",
                userSelect: isDragging ? "none" : "auto",
            }}>

                <div
                    onMouseDown={onDragStart}
                    onTouchStart={onDragStart}
                    style={{
                        position: "absolute", top: 0, left: -6,
                        width: 12, height: "100%",
                        cursor: "col-resize", zIndex: 60,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    <div style={{
                        width: 4, height: 40, borderRadius: 4,
                        background: isDragging ? "#6b5ce7" : "rgba(107,92,231,0.3)",
                        transition: "background 0.2s",
                    }} />
                </div>

                <div style={{ height: 5, background: "linear-gradient(90deg, #6b5ce7, #f4c5c5, #bfe3f5)", flexShrink: 0 }} />

                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px",
                    borderBottom: "1px solid #ece8fc",
                    flexShrink: 0,
                    background: activeSection ? "white" : "linear-gradient(145deg, #f4f0ff, #fff0f8)",
                }}>
                    {activeSection ? (
                        <>
                            <button onClick={goBack} style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#6b5ce7", fontWeight: 700, fontSize: "0.88rem",
                                fontFamily: "'DM Sans', sans-serif",
                            }}>← Back</button>
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1rem", color: "#2d2d2d", fontWeight: 700,
                            }}>{currentSection?.icon} {currentSection?.label}</span>
                            <button onClick={closeDrawer} style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#7a7a8c", fontSize: "1.1rem",
                            }}>✕</button>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6b5ce7, #9b8ef5)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "white", fontWeight: 700, fontSize: "0.88rem", flexShrink: 0,
                                }}>{initials}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#2d2d2d" }}>{userName}</div>
                                    <div style={{ fontSize: "0.7rem", color: "#7a7a8c" }}>{userEmail}</div>
                                </div>
                            </div>
                            <button onClick={closeDrawer} style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#7a7a8c", fontSize: "1.2rem",
                            }}>✕</button>
                        </>
                    )}
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px 0" }}>
                    {!activeSection ? (
                        <div>
                            {SECTIONS.map(sec => (
                                <button
                                    key={sec.key}
                                    onClick={() => setActiveSection(sec.key)}
                                    style={{
                                        width: "100%",
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "15px 16px", borderRadius: 13,
                                        background: "#f7f4ff", border: "1.3px solid #ece8fc",
                                        marginBottom: 10, cursor: "pointer",
                                        fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#ede8ff"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#f7f4ff"}
                                >
                                    <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "#2d2d2d" }}>
                                        {sec.icon} {sec.label}
                                    </span>
                                    <span style={{ color: "#6b5ce7", fontSize: "1.1rem" }}>›</span>
                                </button>
                            ))}
                            <div style={{ height: 1, background: "#f0eefc", margin: "8px 0 14px" }} />
                            <button onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                window.location.href = "/login";
                            }} style={{
                                width: "100%", padding: 13,
                                background: "#fff5f5", color: "#e8615a",
                                border: "1.5px solid #fdd", borderRadius: 12,
                                fontSize: "0.9rem", fontWeight: 600,
                                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                                marginBottom: 28,
                            }}>🚪 Logout</button>
                        </div>
                    ) : (
                        <>
                            {activeSection === "user-details" && <UserDetailsPanel onClose={closeDrawer} user={user} setUser={setUser} />}
                            {activeSection === "registered-events" && <RegisteredEventsPanel />}
                            {activeSection === "events-attended" && <EventsAttendedPanel />}
                            {activeSection === "certificates" && <CertificatesPanel />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}