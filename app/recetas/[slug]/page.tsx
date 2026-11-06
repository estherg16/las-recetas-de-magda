import client from '../../../tina/__generated__/client';
import PlantillaReceta from '../../../components/recetas/PlantillaReceta';

export default async function PaginaRecetaIndividual({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Esperamos a que los parámetros se resuelvan (Requisito de Next.js 15)
  const { slug } = await params;

  // 2. Leemos la URL usando el slug resuelto y buscamos el archivo en TinaCMS
  const respuesta = await client.queries.receta({ relativePath: `${slug}.mdx` });
  const recetaReal = respuesta.data.receta;

  return (
    <main>
      {/* Pasamos los datos reales al diseño */}
      <PlantillaReceta receta={recetaReal} />
    </main>
  );
}