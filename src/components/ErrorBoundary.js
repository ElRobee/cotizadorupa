import React from 'react';
import { Alert } from './ui/alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <h2>Algo salió mal</h2>
          <p>Por favor, recarga la página o contacta soporte si el problema persiste.</p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;