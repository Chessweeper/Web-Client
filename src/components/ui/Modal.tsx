import { useEffect, useRef, ReactNode } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";
import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal = ({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps): JSX.Element => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    ref.current?.showModal();
    return close;
  }, [isOpen]);

  const close = () => {
    ref.current?.close();
  };

  return (
    <dialog ref={ref} className={styles.modalContainer} onClose={onClose}>
      <h2 className={styles.modalTitle}>{title}</h2>
      <CloseIcon size={25} className={styles.modalCloseIcon} onClick={close} />
      <div className={styles.modalBody}>
        <hr />
        {children}
      </div>
    </dialog>
  );
};
