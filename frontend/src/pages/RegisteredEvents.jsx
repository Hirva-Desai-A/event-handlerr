import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

// Fallback mock events for display when API is unavailable
const MOCK_EVENTS = [
    {
        _id: "1",
        title: "HackForge 2025",
        date: "Mar 15, 2025",
        venue: "IIT Delhi",
        type: "Hackathon",
        badgeClass: "badge-purple",
        emoji: "💻"
    },
    {
        _id: "2",
        title: "AI Workshop",
        date: "Apr 2, 2025",
        venue: "Online",
        type: "Workshop",
        badgeClass: "badge-green",
        emoji: "🤖"
    }
];

function RegisteredEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get("/events/registered");
                setEvents(res.data);
            } catch {
                setEvents(MOCK_EVENTS);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px" }}>
            <div className="card" style={{ width: "100%", maxWidth: "480px", margin: "0 auto" }}>

                {/* Screen bar */}
                <div className="screen-bar" style={{ background: "linear-gradient(90deg, var(--sky), var(--lavender), var(--mint))" }} />

                {/* Header */}
                <div style={{ padding: "20px 22px 12px", borderBottom: "1px solid #f0eefc" }}>
                    <div className="screen-dots">
                        <span className="d1" /><span className="d2" /><span className="d3" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div className="form-title" style={{ textAlign: "left", marginBottom: "2px" }}>📅 My Events</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                                {events.length} registered event{events.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <span className="link-text" style={{ fontSize: "0.75rem" }}>← Back</span>
                        </Link>
                    </div>
                </div>

                {/* Events list */}
                <div style={{ padding: "16px 20px 24px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                            Loading events...
                        </div>
                    ) : events.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📭</div>
                            <div style={{ fontWeight: "600", marginBottom: "4px" }}>No Events Yet</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                                Register for events to see them here
                            </div>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div
                                key={event._id}
                                style={{
                                    background: "white",
                                    border: "1.3px solid #f0eefc",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    marginBottom: "12px",
                                    boxShadow: "var(--shadow2)"
                                }}
                            >
                                {/* Event image strip */}
                                <div style={{
                                    height: "56px",
                                    background: "linear-gradient(135deg, var(--sky), var(--lavender))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.5rem"
                                }}>
                                    {event.emoji || "🎪"}
                                </div>

                                <div style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.88rem" }}>{event.title}</div>
                                        <span className={`badge ${event.badgeClass || "badge-purple"}`}>
                                            {event.type || "Event"}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "2px" }}>
                                        📅 {event.date}
                                    </div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                                        📍 {event.venue}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}

export default RegisteredEvents;