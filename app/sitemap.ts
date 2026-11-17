import { MetadataRoute } from 'next';
import client from '../tina/__generated__/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const URL_BASE = 'https://lasrecetasdemagda.netlify.app';

  // 1. Rutas estáticas principales
  const rutasEstaticas: MetadataRoute.Sitemap = [
    {
      url: URL_BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${URL_BASE}/recetas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${URL_BASE}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Rutas dinámicas (Extraer todas las recetas de TinaCMS)
  let rutasDinamicas: MetadataRoute.Sitemap = [];
  
  try {
    const respuesta = await client.queries.recetaConnection({
      first: 500, // Ampliamos el límite por defecto de 50 a 500 recetas
    });
    const recetas = respuesta.data.recetaConnection.edges
      ?.map((borde) => borde?.node)
      .filter((nodo) => nodo) || [];

    rutasDinamicas = recetas.map((receta) => ({
      url: `${URL_BASE}/recetas/${receta?._sys.filename}`,
      // Usamos la fecha de la receta si existe, si no, la de hoy
      lastModified: receta?.fecha ? new Date(receta.fecha) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, // Las recetas individuales tienen un poco menos de prioridad que las páginas principales
    }));
  } catch (error) {
    console.error("Error generando el sitemap dinámico:", error);
  }

  // Juntamos todo y se lo devolvemos a Google
  return [...rutasEstaticas, ...rutasDinamicas];
}