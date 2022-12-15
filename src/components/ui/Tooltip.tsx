import { ReactNode } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  text: string;
  direction: "top" | "bottom" | "left" | "right";
  isVisible: boolean;
  children: ReactNode;
}

export const Tooltip = ({
  text,
  direction,
  isVisible,
  children,
}: TooltipProps) => {
  return (
    <div className={styles.tooltip}>
      {children}
      {isVisible && (
        <div className={`${styles.tooltiptext} ${styles[direction]}`}>
          {text}
        </div>
      )}
    </div>
  );
};
