import React, { ReactNode } from "react";

export type ApiStatusMap = {
  loading: string;
  complete: string;
  error: string;
};

const WaitFor = ({
  apiStatus,
  apiStatusMap,
  fallback,
  onError,
  children,
}: {
  apiStatus: string;
  apiStatusMap: ApiStatusMap;
  fallback: ReactNode;
  onError: ReactNode;
  children: ReactNode;
}) => {
  const render = (): ReactNode => {
    switch (apiStatus) {
      case apiStatusMap.loading: {
        return fallback;
      }
      case apiStatusMap.complete: {
        return children;
      }
      case apiStatusMap.error: {
        return onError;
      }
      default: {
        return onError;
      }
    }
  };
  return <div>{render()}</div>;
};

export default WaitFor;
