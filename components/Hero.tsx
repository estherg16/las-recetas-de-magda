import Image from 'next/image';
import Link from 'next/link';
import client from '../tina/__generated__/client';

export default async function Hero() {
  // 1. Pedimos todas las recetas a TinaCMS
  const respuesta = await client.queries.recetaConnection();
  
  // 2. Extraemos los datos, filtramos nulos y ordenamos de más reciente a más antigua
  const todasLasRecetas = respuesta.data.recetaConnection.edges
    ?.map((borde) => borde?.node)
    .filter((nodo) => nodo)
    .sort((a, b) => {
      const fechaA = a?.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b?.fecha ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    }) || [];

  // 3. Seleccionamos la primera de la lista (la más actual)
  const recetaPrincipal = todasLasRecetas[0];

  // Si aún no hay recetas en la base de datos, no renderizamos nada para evitar errores
  if (!recetaPrincipal) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
      
      {/* Columna Izquierda: Textos específicos de la receta y Botón */}
      <div className="flex-1 space-y-5 text-center md:text-left w-full">
        
        {/* ETIQUETA DESTACADA: ÚLTIMA RECETA */}
        <div className="inline-block bg-accent/30 text-primary text-xs font-bold px-4 py-1.5 rounded-full border border-border/50 tracking-wider uppercase">
            Última receta
        </div>

        {/* Título de la Receta Estrella (Tamaño reducido) */}
        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          {recetaPrincipal.titulo}
        </h1>

        {/* Descripción de la Receta (Texto dinámico según la categoría y tiempo) */}
        <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
          Descubre nuestra última incorporación a la categoría de {recetaPrincipal.categoria?.toLowerCase()}. Una elaboración paso a paso preparada con cariño y lista en {recetaPrincipal.tiempo}. ¡Atrévete con este plato hecho con amor!
        </p>
        
        {/* Botón (Más compacto convertido a Link para funcionar) */}
        <div className="pt-2">
          <Link 
            href={`/recetas/${recetaPrincipal._sys.filename}`} 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium tracking-wide shadow-md hover:shadow-lg"
          >
            Ver receta completa
          </Link>
        </div>
      </div>
      
      {/* Columna Derecha: La foto espectacular */}
      <div className="flex-1 w-full relative min-h-[300px] h-[300px] md:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl mt-6 md:mt-0">
        <Image 
          src={recetaPrincipal.imagen} 
          alt={recetaPrincipal.titulo}
          fill
          className="object-cover hover:scale-105 transition-transform duration-700"
          priority
        />
      </div>

    </section>
  );
}