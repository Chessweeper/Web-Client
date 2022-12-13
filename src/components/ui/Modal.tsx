import { useEffect, useRef } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";
import "./Modal.css";

export const Modal = ({
  title,
  isOpen,
  onClose,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen && !ref.current?.open) {
      ref.current?.showModal();
    } else if (!isOpen && ref.current?.open) {
      close();
    }
  }, [isOpen]);

  const close = () => {
    ref.current?.close();
  };

  const copyToClipboard = async () => {
    const copyable = window.location.href;
    await navigator.clipboard.writeText(copyable);
  };

  return (
    <dialog ref={ref} className="modal-container" onClose={onClose}>
      <h2 className="modal-title">{title}</h2>
      <CloseIcon size={25} className="modal-close-icon" onClick={close} />
      <div className="modal-body">
        <hr />
        <p>Share your current game and include the random seed</p>
        <input value={window.location.href} readOnly />
        <button onClick={copyToClipboard}>copy</button>
      </div>
    </dialog>
  );
};
