import { Metadata } from 'next';
import client from '../../../tina/__generated__/client';
import PlantillaReceta from '../../../components/recetas/PlantillaReceta';

// Función auxiliar para traducir textos como "45 min" o "1h 20m" al formato ISO 8601 que exige Google
function convertirTiempoISO(tiempoTexto?: string | null): string | undefined {
  if (!tiempoTexto) return undefined;
  const texto = tiempoTexto.toLowerCase();
  
  const horasMatch = texto.match(/(\d+)\s*(h|hora|horas)/);
  const minutosMatch = texto.match(/(\d+)\s*(m|min|minutos)/);

  const horas = horasMatch ? `${horasMatch[1]}H` : '';
  const minutos = minutosMatch ? `${minutosMatch[1]}M` : '';

  if (horas || minutos) {
    return `PT${horas}${minutos}`;
  }
  
  // Si solo pusiste un número (ej: "45"), asumimos minutos
  const soloNumero = texto.match(/^(\d+)$/);
  if (soloNumero) {
    return `PT${soloNumero[1]}M`;
  }

  return undefined;
}

// 1. SEO Dinámico (Título, descripción y miniatura al compartir el enlace)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const respuesta = await client.queries.receta({ relativePath: `${slug}.mdx` });
  const receta = respuesta.data.receta;

  const urlBase = 'https://lasrecetasdemagda.netlify.app';
  const imagenUrl = receta.imagen
    ? (receta.imagen.startsWith('http') ? receta.imagen : `${urlBase}${receta.imagen}`)
    : `${urlBase}/images/logo-transparente.jpg`;

  const descripcionSeo = `Aprende a preparar ${receta.titulo} (${receta.categoria || 'Receta casera'}) en ${receta.tiempo || 'poco tiempo'}. Dificultad: ${receta.dificultad || 'Fácil'}.`;

  return {
    title: `${receta.titulo} | Las Recetas de Magda`,
    description: descripcionSeo,
    openGraph: {
      title: receta.titulo,
      description: descripcionSeo,
      images: [imagenUrl],
      type: 'article',
    },
  };
}

export default async function PaginaRecetaIndividual({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Esperamos a que los parámetros se resuelvan (Requisito de Next.js 15)
  const { slug } = await params;

  // 2. Leemos la URL usando el slug resuelto y buscamos el archivo en TinaCMS
  const respuesta = await client.queries.receta({ relativePath: `${slug}.mdx` });
  const recetaReal = respuesta.data.receta;

  // 3. Preparamos la URL absoluta de la imagen (Google exige que empiece por https://)
  const urlBase = 'https://lasrecetasdemagda.netlify.app';
  const imagenAbsoluta = recetaReal.imagen
    ? (recetaReal.imagen.startsWith('http') ? recetaReal.imagen : `${urlBase}${recetaReal.imagen}`)
    : `${urlBase}/images/receta-por-defecto.jpg`;

  // 4. Construimos el esquema JSON-LD oficial para Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recetaReal.titulo,
    image: [imagenAbsoluta],
    author: {
      '@type': 'Person',
      name: 'Magda',
    },
    datePublished: recetaReal.fecha || undefined,
    description: `Receta casera de ${recetaReal.titulo}. Tiempo de preparación: ${recetaReal.tiempo}. Dificultad: ${recetaReal.dificultad}.`,
    recipeCategory: recetaReal.categoria || 'Postres y Repostería',
    recipeIngredient: recetaReal.ingredientes || [],
    totalTime: convertirTiempoISO(recetaReal.tiempo),
    keywords: [
      recetaReal.categoria,
      ...(recetaReal.metodos_preparacion || []),
      'receta casera',
    ].filter(Boolean).join(', '),
  };

  return (
    <main>
      {/* Inyectamos los datos estructurados invisibles para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Pasamos los datos reales al diseño */}
      <PlantillaReceta receta={recetaReal} />
    </main>
  );
}