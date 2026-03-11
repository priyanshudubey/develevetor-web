import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import UpgradeModal from "../components/UpgradeModal";

interface UpgradeContextType {
  isOpen: boolean;
  message: string;
  openModal: (msg?: string) => void;
  closeModal: () => void;
}

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined);

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openModal = (msg?: string) => {
    if (msg) setMessage(msg);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Listen for the native DOM event dispatched by the Axios interceptor
  useEffect(() => {
    const handleRateLimitHit = (event: Event) => {
      // The event is a CustomEvent, but TypeScript's default Event interface
      // doesn't have a 'detail' property, so we cast it.
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      
      const msg = detail?.message || "You've hit your usage limit. Upgrade to Pro for more.";
      openModal(msg);
    };

    window.addEventListener("rate-limit-hit", handleRateLimitHit);

    return () => {
      window.removeEventListener("rate-limit-hit", handleRateLimitHit);
    };
  }, []);

  return (
    <UpgradeContext.Provider value={{ isOpen, message, openModal, closeModal }}>
      {children}
      {isOpen && <UpgradeModal isOpen={isOpen} onClose={closeModal} message={message} />}
    </UpgradeContext.Provider>
  );
}

export function useUpgrade() {
  const context = useContext(UpgradeContext);
  if (context === undefined) {
    throw new Error("useUpgrade must be used within an UpgradeProvider");
  }
  return context;
}
