export default function TablaAuditoria({ movimientos, cargando }) {
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    try {
      return new Date(fechaStr).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  if (cargando) {
    return (
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 animate-pulse">
        <div className="h-4 w-44 bg-[#1e3a5f] rounded mb-4" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 py-2.5 border-b border-[#1e3a5f]/20 last:border-0"
          >
            <div className="h-3 w-24 bg-[#1e3a5f] rounded" />
            <div className="h-3 flex-1 bg-[#1e3a5f] rounded" />
            <div className="h-3 w-20 bg-[#1e3a5f] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden shadow-md">
      <div className="px-5 py-4 border-b border-[#1e3a5f] bg-[#0f1b2d]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Actividad Reciente (Últimos Movimientos)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
              {["Fecha", "Tipo", "Operación / Descripción", "Monto"].map(
                (col) => (
                  <th
                    key={col}
                    className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]/40">
            {movimientos.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-gray-400 text-xs"
                >
                  No hay movimientos registrados en el sistema aún
                </td>
              </tr>
            ) : (
              movimientos.map((mov, idx) => {
                const esIngreso = mov.tipo?.toUpperCase() === "INGRESO";
                return (
                  <tr
                    key={idx}
                    className="text-center transition-colors hover:bg-[#1a2d4a]/40"
                  >
                    {/* 1. Fecha */}
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                      {formatearFecha(mov.fecha)}
                    </td>
                    {/* 2. Tipo Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          esIngreso
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {mov.tipo}
                      </span>
                    </td>
<<<<<<< HEAD
                    <td className="px-4 py-3 text-gray-300 text-xs max-w-50 truncate">
=======
                    {/* 3. Descripción */}
                    <td className="px-4 py-3 text-gray-300 text-xs max-w-[300px] truncate mx-auto">
>>>>>>> 092bb189f725030f9e41daa74d8bfd28786935bd
                      {mov.descripcion}
                    </td>
                    {/* 4. Monto */}
                    <td
                      className={`px-4 py-3 font-mono font-semibold ${esIngreso ? "text-emerald-400" : "text-red-400"}`}
                    >
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
