import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        container: {
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "12px 24px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(107,92,231,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 10000,
            border: `1.5px solid ${type === "error" ? "#e8615a" : "#2cbf8a"}`,
            animation: "slideUp 0.3s ease-out forwards",
        },
        icon: { fontSize: "1.2rem" },
        text: {
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "#2d2d2d",
            fontFamily: "'DM Sans', sans-serif"
        }
    };

    return (
        <div style={styles.container}>
            <span style={styles.icon}>{type === "error" ? "⚠️" : "✨"}</span>
            <span style={styles.text}>{message}</span>
        </div>
    );
};

export default Toast;