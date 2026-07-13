import React, { useEffect, useState } from "react";
import { fetchTradeinDevices, estimateTradein } from "../lib/api.js";
import { formatGHS } from "../lib/format.js";

const CONDITIONS = [
  { id: "excellent", label: "Excellent", desc: "Like new, no marks, 100% working" },
  { id: "good", label: "Good", desc: "Light wear, everything works fine" },
  { id: "fair", label: "Fair", desc: "Visible wear, minor issues" },
  { id: "faulty", label: "Faulty", desc: "Cracked screen, battery or other issue" },
];

export default function TradeIn() {
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [condition, setCondition] = useState("good");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTradeinDevices().then((data) => {
      setDevices(data);
      if (data[0]) setDeviceId(data[0].id);
    });
  }, []);

  async function handleEstimate(e) {
    e.preventDefault();
    if (!deviceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await estimateTradein({ deviceId, condition });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const whatsappMessage = result
    ? encodeURIComponent(
        `Hi Cboyistore, I'd like an iSwap quote for my ${result.device} (${result.condition} condition). Your estimate said around ${formatGHS(result.estimate)}.`
      )
    : "";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <p className="font-display text-xs font-600 uppercase tracking-[0.3em] text-violet">
        iSwap
      </p>
      <h1 className="mt-2 font-display text-3xl font-700 text-ink sm:text-4xl">
        What's your old device worth?
      </h1>
      <p className="mt-3 max-w-xl text-ink/60">
        Get a ballpark trade-in value in seconds, then bring the device to Tafo
        American Building for a final, confirmed offer — put straight toward
        your next phone or laptop.
      </p>

      <form onSubmit={handleEstimate} className="mt-8 flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
        <div>
          <label className="text-sm font-600 text-ink">Your device</label>
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="focus-ring mt-2 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-600 text-ink">Condition</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {CONDITIONS.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCondition(c.id)}
                className={`focus-ring rounded-xl border p-3 text-left transition-colors ${
                  condition === c.id
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/10 text-ink/70 hover:border-ink/30"
                }`}
              >
                <p className="text-sm font-600">{c.label}</p>
                <p className={`text-xs ${condition === c.id ? "text-cream/60" : "text-ink/40"}`}>
                  {c.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="focus-ring rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 disabled:opacity-60"
        >
          {loading ? "Calculating…" : "Get my estimate"}
        </button>
        {error && <p className="text-sm text-signal">{error}</p>}
      </form>

      {result && (
        <div className="mt-6 rounded-3xl bg-slateink p-6 text-cream sm:p-8">
          <p className="text-xs uppercase tracking-wide text-cream/50">Estimated trade-in value</p>
          <p className="mt-2 font-display text-4xl font-700">
            {formatGHS(result.range[0])} – {formatGHS(result.range[1])}
          </p>
          <p className="mt-2 text-sm text-cream/60">{result.note}</p>
          <a
            href={`https://wa.me/233541533365?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-5 inline-block rounded-full bg-cream px-6 py-3 text-sm font-600 text-ink transition-transform hover:scale-105"
          >
            Get exact quote on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
