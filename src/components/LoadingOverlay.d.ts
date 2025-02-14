declare module './LoadingOverlay' {
  import React from 'react';

  export interface LoadingOverlayProps {
    visible: boolean;
  }

  const LoadingOverlay: React.FC<LoadingOverlayProps>;
  export default LoadingOverlay;
} 