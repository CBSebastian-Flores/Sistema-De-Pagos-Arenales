function SkeletonAuditoria() {
  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 animate-pulse">
      <div className="h-4 w-44 bg-[#1e3a5f] rounded mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 py-2.5 border-b border-[#1e3a5f]/20 last:border-0">
          <div className="h-3 w-16 bg-[#1e3a5f] rounded" />
          <div className="h-3 w-24 bg-[#1e3a5f] rounded" />
          <div className="h-3 w-32 bg-[#1e3a5f] rounded" />
        </div>
      ))}
    </div>
  );
}

export default function TablaAuditoria({ movimientos, cargando }) {
  if (cargando) return <SkeletonAuditoria />;

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    try {
      return new Date(fechaStr).toLocaleDateString("es-PE", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return fechaStr; }
  };

  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e3a5f]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Últimas Transacciones
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
              {["Fecha / Hora", "Operación", "Descripción", "Monto"].map((col) => (
                <th key={col} className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]/40">
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 text-xs">
                  No hay transacciones registradas aún
                </td>
              </tr>
            ) : (
              movimientos.slice(0, 5).map((mov, i) => {
                const esIngreso = mov.tipo === "ingreso";
                return (
                  <tr key={`${mov.tipo}-${mov.id}-${i}`} className="text-center transition-colors hover:bg-[#1a2d4a]/40">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                      {formatearFecha(mov.fecha)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider
                          ${esIngreso
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                      >
                        {mov.codigo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs max-w-[200px] truncate">
                      {mov.descripcion}
                    </td>
                    <td className={`px-4 py-3 font-mono text-sm font-semibold ${esIngreso ? "text-emerald-400" : "text-red-400"}`}>
                      {esIngreso ? "+" : "-"}S/. {Number(mov.monto).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
