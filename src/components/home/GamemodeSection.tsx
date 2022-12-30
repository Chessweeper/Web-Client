import { GamemodeButton, GamemodeButtonProps } from "./GamemodeButton";
import "./GamemodeSection.css";

interface GamemodeSectionProps {
  title: string;
  description: string;
  buttons: GamemodeButtonProps[];
}

export const GamemodeSection = ({
  title,
  description,
  buttons,
}: GamemodeSectionProps): JSX.Element => {
  return (
    <div className="gamemode-section">
      <h2 className="gamemode-section__title">{title}</h2>
      <p>{description}</p>
      <div className="flex hor">
        {buttons.map((props) => (
          <GamemodeButton key={props.title} {...props} />
        ))}
      </div>
    </div>
  );
};
