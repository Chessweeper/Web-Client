import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./Switch.module.css";

interface SwitchProps {
  id: string;
  label: string;
}

export const Switch = forwardRef<
  HTMLInputElement,
  SwitchProps & InputHTMLAttributes<HTMLInputElement>
>((props, ref): JSX.Element => {
  return (
    <div className={styles.switchContainer}>
      <label className={styles.switch}>
        <input
          ref={ref}
          type="checkbox"
          id={props.id}
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className={styles.slider}></span>
      </label>
      <label htmlFor={props.id} className={styles.label}>
        {props.label}
      </label>
    </div>
  );
});

Switch.displayName = "Switch";
