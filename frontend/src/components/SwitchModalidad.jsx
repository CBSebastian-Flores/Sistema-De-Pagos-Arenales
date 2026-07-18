export default function SwitchModalidad({ esIndividual, onChange }) {
  return (
    <div className="flex flex-col gap-2 pt-7 border-t border-[#1e3a5f]/60">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Modalidad de Generación
      </label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            ${!esIndividual
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-[#0f1b2d] text-gray-400 border border-[#1e3a5f] hover:text-white hover:border-gray-500"
            }`}
        >
          Masiva
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
            ${esIndividual
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-[#0f1b2d] text-gray-400 border border-[#1e3a5f] hover:text-white hover:border-gray-500"
            }`}
        >
          Individual
        </button>
      </div>
      <p className="text-xs text-gray-500">
        {esIndividual
          ? "Selecciona un socio específico para generarle su obligación"
          : "Se generará la obligación automáticamente para todos los socios activos"}
      </p>
    </div>
  );
}
