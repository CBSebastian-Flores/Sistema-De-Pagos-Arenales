import { useState } from "react";

const IconWarning = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
    />
  </svg>
);

const IconInfo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.028M12 13.5h.008v.008H12v-.008zM12 3a9 9 0 100 18 9 9 0 000-18z"
    />
  </svg>
);

export default function ModalAuditoria({
  titulo,
  mensajeAdvertencia,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [motivo, setMotivo] = useState("");

  if (!isOpen) return null;

  const handleAceptar = () => {
    onConfirm(motivo.trim());
    setMotivo("");
  };

  const handleCancelar = () => {
    setMotivo("");
    onClose();
  };

  const esInhabilitar = titulo.toLowerCase().includes("inhabilitar");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e3a5f]">
          <h3 className="text-white font-bold text-lg">{titulo}</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm mb-5 transition-colors
            ${
              esInhabilitar
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {esInhabilitar ? <IconWarning /> : <IconInfo />}

            <span className="font-medium leading-relaxed">
              {mensajeAdvertencia}
            </span>
          </div>

          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Motivo / Justificación
          </label>

          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={5}
            placeholder="Ingrese el motivo de la acción..."
            className="w-full bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 resize-none transition-colors"
          />

          <div className="mt-2 text-xs text-gray-500">
            {motivo.trim().length}/10 caracteres mínimos
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1e3a5f]">
          <button
            onClick={handleCancelar}
            className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleAceptar}
            disabled={motivo.trim().length < 10}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white transition-colors 
             hover:bg-blue-500 cursor-pointer
             disabled:bg-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600/40" // 🚀
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
