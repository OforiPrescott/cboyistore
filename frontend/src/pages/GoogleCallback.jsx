import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const error = params.get("error");

  useEffect(() => {
    if (error) {
      window.opener?.postMessage({ type: "google-oauth-error", error }, window.location.origin);
      return;
    }
    if (!code) {
      window.opener?.postMessage({ type: "google-oauth-error", error: "Missing authorization code" }, window.location.origin);
      return;
    }
    window.opener?.postMessage({ type: "google-oauth-success", code }, window.location.origin);
  }, [code, error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="text-center">
        <p className="text-sm font-600 text-ink">Completing Google sign-in...</p>
        <p className="mt-2 text-xs text-ink/50">You can close this tab after returning to the shop.</p>
      </div>
    </div>
  );
}
