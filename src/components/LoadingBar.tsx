import { forwardRef, useImperativeHandle } from "react";
import "./LoadingBar.css";

export interface LoadingBarRefAttributes {
  update: (value: number) => void;
}

export const LoadingBar = forwardRef<LoadingBarRefAttributes>(
  (_, ref): JSX.Element => {
    useImperativeHandle(ref, () => ({
      update: (value: number) => {
        const ignore = value;
      },
    }));

    return (
      <div id="progress-container">
        Generating Board...
        <div id="progress">
          <div id="progress-content"></div>
        </div>
      </div>
    );
  }
);

LoadingBar.displayName = "Loading Bar";
