import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Здесь можно логировать ошибку, если нужно
    // Например: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red" }}>Error displaying map</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
