import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function SobreMi() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-14 md:py-14">
      
      {/* Título de la sección */}
      <header className="mb-16 md:mb-12 text-center md:text-left">
        <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
          Nuestra historia
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          Detrás de los fogones
        </h1>
      </header>

      {/* Grid Editorial: 7 columnas para texto, 5 para imágenes (solo en pantallas grandes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Columna Izquierda: Texto Editorial */}
        <div className="lg:col-span-7 space-y-8 text-lg text-muted-foreground leading-relaxed">
          
          <p>
            ¡Hola! Soy Magda, la persona detrás de los fogones de este blog. La cocina siempre ha sido para mí mucho más que un pasatiempo: es mi forma favorita de compartir amor con los que más quiero. Todo esto empezó con las tartas y dulces que preparaba para los cumpleaños de mi familia y amigos. Como siempre me acababan pidiendo las recetas, pensé que ya era hora de pasar mis viejos cuadernos de notas a un espacio digital al que todos pudierais acceder.
          </p>

          <p>
            Es posible que algunos ya me conozcáis de nuestra anterior casita en <a href="https://lasrecetasdemagda.blogspot.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Blogger</a>, pero hemos decidido dar el salto y mudarnos a esta nueva web para darle un buen lavado de cara y tener un rincón mucho más bonito, actual y fácil de usar.
          </p>

          <p>
            Soy una apasionada de la cocina casera hecha con ingredientes sencillos, de los que siempre hay por casa. Soy de Cáceres, una ciudad maravillosa en Extremadura, y su tradición culinaria inspira muchas de las ideas que comparto aquí. En este espacio encontrarás de todo un poco: desde los postres de "toda la vida" que reconfortan el estómago, hasta platos salados para sorprender a tus invitados. Eso sí, aquí no hay complicaciones innecesarias, sino el paso a paso detallado y trucos probados cientos de veces para que ese bizcocho suba perfecto.
          </p>

          <p>
            En esta aventura no estoy sola, somos un gran equipo de madre e hija. Yo me encargo de cocinar y perfeccionar cada plato, mientras que mi hija Esther es la artista que ha diseñado y programado desde cero toda esta preciosa página web (además de ser, por supuesto, la catadora oficial de los postres).
          </p>

          {/* Cita destacada estilo revista */}
          <blockquote className="border-l-2 border-secondary/50 pl-6 my-10 py-2">
            <p className="text-2xl md:text-3xl text-primary font-medium italic leading-snug" style={{ fontFamily: 'Playfair Display, serif' }}>
              "Porque, al final, el mejor ingrediente de cualquier receta es el tiempo que pasas en la cocina pensando en quién se la va a comer."
            </p>
          </blockquote>

          <p>
            Mi mayor propósito es demostrarte que la buena repostería está al alcance de cualquiera y que cocinar puede ser una experiencia muy divertida y relajante. Espero que este espacio sea para ti una gran fuente de inspiración y que disfrutes experimentando tanto como nosotras.
          </p>
          
          <div className="pt-4">
            <span className="font-bold text-xl text-primary block" style={{ fontFamily: 'Playfair Display, serif' }}>
              Un abrazo,<br/>Magda y Esther
            </span>
          </div>
        </div>

        {/* Columna Derecha: Composición asimétrica de imágenes */}
        <div className="lg:col-span-5 relative mt-10 lg:mt-0">
          {/* Imagen Principal */}
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-border/40 z-10">
            <Image 
              src="/images/Esther-Magda.jpg" 
              alt="Magda en su cocina" 
              fill
              className="object-cover"
            />
          </div>
          
          {/* Imagen Secundaria Superpuesta (Flotando abajo a la izquierda) */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-background z-20 hidden lg:block">
            <Image 
              src="/images/logo.jpg" 
              alt="Detalle de ingredientes" 
              fill
              className="object-cover"
            />
          </div>
          
          {/* Elemento decorativo sutil (Puntos o forma orgánica) */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-2xl -z-10"></div>
        </div>

      </div>

      {/* Tarjeta de Amigurumis (Banner inferior) */}
      <div className="mt-32 bg-card rounded-[2rem] p-8 md:p-12 border border-border/50 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-32 h-32 relative rounded-full overflow-hidden shrink-0 border-2 border-secondary/30">
          <Image 
            src="/images/logo-crochet-transparente.svg"
            alt="Amigurumis de Crochet Magda" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-grow text-center md:text-left">
          <h3 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Mi otro rincón creativo: Crochet Magda
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Cuando el horno está apagado, las agujas de ganchillo toman el relevo. Descubre mi colección de amigurumis y muñecos tejidos a mano con la misma paciencia y cariño que los bizcochos.
          </p>
          <a href="https://crochetmagda.blogspot.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-secondary/10 text-primary font-semibold px-6 py-3 rounded-full hover:bg-secondary hover:text-white transition-colors border border-secondary/20">
            <Heart size={18} />
            Visitar Crochet Magda
          </a>
        </div>
      </div>

    </main>
  );
}