import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TarjetaReceta from '../recetas/TarjetaReceta';
import client from '../../tina/__generated__/client';

export default async function SeccionUltimasRecetas() {
  // 1. Pedimos todas las recetas a TinaCMS
  const respuesta = await client.queries.recetaConnection({
    first: 500, // Ampliamos el límite por defecto de 50 a 500 recetas
  });
  
  // 2. Limpiamos los datos, los ordenamos de más reciente a más antigua y cogemos desde la segunda hasta la quinta
  const ultimasRecetas = respuesta.data.recetaConnection.edges
    ?.map((borde) => borde?.node)
    .filter((nodo) => nodo)
    .sort((a, b) => {
      const fechaA = a?.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b?.fecha ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    })
    .slice(1, 5) || [];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
        Últimas recetas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {ultimasRecetas.map((receta, indice) => (
          <Link key={indice} href={`/recetas/${receta?._sys.filename}`}>
            <TarjetaReceta receta={receta} />
          </Link>
        ))}
        
        {ultimasRecetas.length === 0 && (
          <div className="col-span-full text-muted-foreground italic">
            Aún no hay recetas publicadas.
          </div>
        )}
      </div>

      {/* Botón para ver todas las recetas */}
      <div className="flex justify-center mt-12 mb-4">
        <Link 
          href="/recetas" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-md"
        >
          Ver todas las recetas
          <ArrowRight size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}