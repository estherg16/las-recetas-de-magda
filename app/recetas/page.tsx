import { Suspense } from 'react';
import client from '../../tina/__generated__/client';
import GaleriaRecetas from '../../components/recetas/GaleriaRecetas';

export default async function PaginaRecetas() {
  const respuesta = await client.queries.recetaConnection();
  
  const todasLasRecetas = respuesta.data.recetaConnection.edges
    ?.map((borde) => borde?.node)
    .filter((nodo) => nodo) || [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <Suspense fallback={<div className="text-center py-20 text-muted-foreground font-bold tracking-widest uppercase">Cargando recetas...</div>}>
        <GaleriaRecetas recetas={todasLasRecetas} />
      </Suspense>
    </main>
  );
}