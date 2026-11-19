import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('VALENCE Runtime Error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0B0F14',
          color: '#E4E9F0',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: '700px',
            width: '100%',
            background: '#11161C',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px',
          }}>
            <h1 style={{ color: '#EA3943', fontSize: '20px', marginBottom: '16px' }}>
              VALENCE encountered a runtime error
            </h1>
            <pre style={{
              background: '#0B0F14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '13px',
              color: '#FF6B73',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {String(this.state.error)}
            </pre>
            {this.state.errorInfo && (
              <pre style={{
                background: '#0B0F14',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '11px',
                color: '#9AA4B2',
                overflowX: 'auto',
                marginTop: '12px',
                whiteSpace: 'pre-wrap',
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#9AA4B2' }}>
              This is a client-side rendering error. The server is running correctly — check the browser console for the full stack trace.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
