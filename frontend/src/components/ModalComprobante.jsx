export default function ModalComprobante({ egreso, onClose }) {
  if (!egreso) return null;

  const esPdf =
    egreso.comprobanteUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f]">
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-base">
              Comprobante de Egreso
            </h3>
            <span className="text-xs text-gray-500">
              {egreso.codigoEgreso} &middot; {egreso.beneficiario}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {egreso.comprobanteUrl ? (
            esPdf ? (
              <iframe
                src={egreso.comprobanteUrl}
                title="Comprobante"
                className="w-full h-[500px] rounded-lg border border-[#1e3a5f]"
              />
            ) : (
              <img
                src={egreso.comprobanteUrl}
                alt="Comprobante"
                className="w-full rounded-lg border border-[#1e3a5f] object-contain max-h-[500px]"
              />
            )
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              No hay comprobante disponible
            </div>
          )}
        </div>

        <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0f1b2d] rounded-lg px-3 py-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              Monto
            </span>
            <span className="text-sm font-bold text-red-400 font-mono">
              S/. {Number(egreso.monto).toFixed(2)}
            </span>
          </div>
          <div className="bg-[#0f1b2d] rounded-lg px-3 py-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              Categoría
            </span>
            <span className="text-sm text-white">{egreso.categoriaEgreso}</span>
          </div>
          <div className="bg-[#0f1b2d] rounded-lg px-3 py-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              Método
            </span>
            <span className="text-sm text-white">{egreso.metodoRetiro}</span>
          </div>
          <div className="bg-[#0f1b2d] rounded-lg px-3 py-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              Registrado por
            </span>
            <span className="text-sm text-white">
              {egreso.usernameRegistro || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
