export const Popup = ({ text }) => {
  const reload = () => {
    console.log('todo: reload');
  }

  return (
    <div id="popup">
      <h3 id="popup-content">{text}</h3>
      <button id="popup-reload" className="button" onClick={reload}>
        Replay
      </button>
    </div>
  );
};