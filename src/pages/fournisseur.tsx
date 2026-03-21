// HelloFournisseur.tsx
import React from "react";

const HelloFournisseur: React.FC = () => {
    const handleClick = () => {
        alert("Test successful! Hello Fournisseur 👋");
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f8f9fa"
        }}>
            <h1 style={{ color: "#e23654" }}>Hello Fournisseur!</h1>
            <p>Welcome to the test page.</p>
            <button
                onClick={handleClick}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#e23654",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "20px"
                }}
            >
                Test Button
            </button>
        </div>
    );
};

export default HelloFournisseur;