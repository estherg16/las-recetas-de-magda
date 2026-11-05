import client from '../../../tina/__generated__/client';
import PlantillaReceta from '../../../components/PlantillaReceta';

export default async function PaginaRecetaIndividual({ params }: { params: { slug: string } }) {
  // Leemos la URL y buscamos el archivo .mdx correspondiente en TinaCMS
  const respuesta = await client.queries.receta({ relativePath: `${params.slug}.mdx` });
  const recetaReal = respuesta.data.receta;

  return (
    <main>
      {/* Pasamos los datos reales al diseño */}
      <PlantillaReceta receta={recetaReal} />
    </main>
  );
}