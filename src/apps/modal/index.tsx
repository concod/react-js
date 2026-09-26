import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on Escape. Effect only runs while open; cleanup removes the listener.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render into document.body via a portal, so the modal escapes any parent
  // stacking context / overflow:hidden and layers correctly above everything.
  return createPortal(
    <div
      className="modal-overlay"
      onClick={() => {
        onClose();
      }}
    >
      {/* stopPropagation so clicks INSIDE the dialog don't bubble to the overlay */}
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title">
          <h2>{title}</h2>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h1>Modal</h1>
      <button onClick={() => setOpen(true)}>Open Modal</button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm action"
      >
        <p>This is arbitrary body content passed via children.</p>
        <p>Try: click ✕, click the dimmed overlay, or press Escape.</p>
        <button onClick={() => setOpen(false)}>Got it</button>
      </Modal>
    </div>
  );
}
