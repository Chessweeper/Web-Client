import { useEffect, useRef } from "react";
import "./LoadingBar.css";

interface LoadingBarProps {
  value: number;
}

export const LoadingBar = ({ value }: LoadingBarProps): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = value + "%";
    }
  }, [value]);

  return (
    <div id="progress-container">
      Generating Board...
      <div id="progress">
        <div id="progress-content" ref={ref} />
      </div>
    </div>
  );
};
