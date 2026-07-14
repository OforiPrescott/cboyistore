import React, { createContext, useCallback, useContext, useState } from "react";
import { Modal, Button } from "./ui.jsx";

const AdminContext = createContext(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

const STORAGE_KEY = "cboyistore_admin_key";
const WORKER_TOKEN_KEY = "cboyistore_worker_token";
const WORKER_INFO_KEY = "cboyistore_worker_info";

export function AdminProvider({ children }) {
  const [adminKey, setAdminKeyState] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) || ""
  );
  const [workerToken, setWorkerTokenState] = useState(
    () => sessionStorage.getItem(WORKER_TOKEN_KEY) || ""
  );
  const [workerInfo, setWorkerInfoState] = useState(() => {
    try {
      const raw = sessionStorage.getItem(WORKER_INFO_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const notify = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const setAdminKey = useCallback((key) => {
    if (key) sessionStorage.setItem(STORAGE_KEY, key);
    else sessionStorage.removeItem(STORAGE_KEY);
    setAdminKeyState(key);
  }, []);

  const setWorkerSession = useCallback((token, info) => {
    sessionStorage.setItem(WORKER_TOKEN_KEY, token);
    sessionStorage.setItem(WORKER_INFO_KEY, JSON.stringify(info));
    setWorkerTokenState(token);
    setWorkerInfoState(info);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(WORKER_TOKEN_KEY);
    sessionStorage.removeItem(WORKER_INFO_KEY);
    setAdminKeyState("");
    setWorkerTokenState("");
    setWorkerInfoState(null);
  }, []);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setConfirmState({
          title: opts.title || "Are you sure?",
          message: opts.message,
          confirmLabel: opts.confirmLabel || "Confirm",
          tone: opts.tone || "danger",
          onResult: (value) => {
            setConfirmState(null);
            resolve(value);
          },
        });
      }),
    []
  );

  const toastTone = {
    success: "bg-ink text-cream",
    error: "bg-signal text-white",
    info: "bg-violet text-white",
  };

  const isAuthed = Boolean(adminKey || workerToken);

  return (
    <AdminContext.Provider
      value={{
        adminKey,
        setAdminKey,
        workerToken,
        workerInfo,
        setWorkerSession,
        logout,
        notify,
        confirm,
        isAuthed,
      }}
    >
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`-mb-0 rounded-full px-4 py-2.5 text-sm font-600 shadow-lg ${toastTone[t.type] || toastTone.success}`}
          >
            {t.message}
          </div>
        ))}
      </div>

      <Modal
        open={Boolean(confirmState)}
        onClose={() => confirmState?.onResult(false)}
        title={confirmState?.title}
        footer={
          confirmState && (
            <>
              <Button variant="outline" onClick={() => confirmState.onResult(false)}>
                Cancel
              </Button>
              <Button
                variant={confirmState.tone}
                onClick={() => confirmState.onResult(true)}
              >
                {confirmState.confirmLabel}
              </Button>
            </>
          )
        }
      >
        <p className="text-sm text-ink/60">{confirmState?.message}</p>
      </Modal>
    </AdminContext.Provider>
  );
}
