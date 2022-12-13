import { forwardRef, InputHTMLAttributes } from "react";
import "./Switch.css";

interface SwitchProps {
  id: string;
  label: string;
}

export const Switch = forwardRef<
  HTMLInputElement,
  SwitchProps & InputHTMLAttributes<HTMLInputElement>
>((props, ref): JSX.Element => {
  return (
    <div className="switch-container">
      <label className="switch">
        <input
          ref={ref}
          type="checkbox"
          id={props.id}
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className="slider"></span>
      </label>
      <label htmlFor={props.id} className="switch-label">
        {props.label}
      </label>
    </div>
  );
});

Switch.displayName = "Switch";
