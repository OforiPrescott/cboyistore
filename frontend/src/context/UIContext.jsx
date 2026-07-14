import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Tracks how many blocking modals/overlays are currently open so global
// floating chrome (chat FAB, install prompt, etc.) can step out of the
// way. Modal components call `useModalRegistration()` and the count
// auto-increments on mount / decrements on unmount.
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [modalCount, setModalCount] = useState(0);

  const pushModal = useCallback(() => setModalCount((c) => c + 1), []);
  const popModal = useCallback(() =>
    setModalCount((c) => (c > 0 ? c - 1 : 0)), []
  );

  const value = useMemo(
    () => ({ modalOpen: modalCount > 0, pushModal, popModal }),
    [modalCount, pushModal, popModal]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}

// Register the current component as an open modal for as long as it's
// mounted. Also locks body scroll so background content doesn't scroll
// behind the modal on mobile.
export function useModalRegistration() {
  const { pushModal, popModal } = useUI();
  useEffect(() => {
    pushModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      popModal();
      document.body.style.overflow = previousOverflow;
    };
  }, [pushModal, popModal]);
}
