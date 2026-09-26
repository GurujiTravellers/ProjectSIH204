import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Travel_Guruji ErrorBoundary Caught Error]:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            padding: "40px 20px",
            maxWidth: "800px",
            margin: "40px auto",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            fontFamily: "inherit",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧭</div>
          <h2 style={{ fontSize: "24px", color: "#1e293b", marginBottom: "8px" }}>
            Trip Plan Display Notice
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "15px",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            We encountered a temporary display issue while rendering this section.
            Your travel parameters and preferences are safe.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Refresh Plan
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

