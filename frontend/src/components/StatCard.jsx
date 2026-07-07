export default function StatCard({ titulo, valor, icono, formato, color }) {
  const esNegativo = typeof valor === "number" && valor < 0;

  const colorFinal =
    color || (esNegativo
      ? { texto: "text-red-400", bg: "bg-red-500/10 border-red-500/20" }
      : { texto: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" });

  const valorFormateado =
    formato && typeof valor === "number"
      ? `${formato} ${valor.toFixed(2)}`
      : valor;

  return (
    <div className={`${colorFinal.bg} border rounded-xl p-5 flex items-start gap-4 transition-colors`}>
      <div className={`p-2 rounded-lg ${colorFinal.bg}`}>
        <svg className={`w-6 h-6 ${colorFinal.texto}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icono} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {titulo}
        </p>
        <p className={`text-xl font-bold font-mono mt-1 ${colorFinal.texto}`}>
          {valorFormateado}
        </p>
      </div>
    </div>
  );
}
