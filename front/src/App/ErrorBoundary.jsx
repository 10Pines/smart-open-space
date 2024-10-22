import React, { Component } from 'react';

import MyProps from '#helpers/MyProps';

class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children } = this.props;
    return !errorInfo ? (
      children
    ) : (
      <div>
        <h2>
          <span aria-label="vergüenza" role="img">
            🙈
          </span>
          Algo anduvo mal, que vergüenza!
        </h2>
        {error && error.toString()}
        <details style={{ whiteSpace: 'pre-wrap' }}>{errorInfo.componentStack}</details>
      </div>
    );
  }
}
ErrorBoundary.propTypes = { children: MyProps.children.isRequired };

export default ErrorBoundary;
