import { Facebook, Mail } from 'lucide-react';
import Link from 'next/link';
import client from '../../tina/__generated__/client';

export default async function PieDePagina() {
  const anioActual = new Date().getFullYear();
  
  // Pedimos todas las recetas a TinaCMS
  const respuesta = await client.queries.recetaConnection({
    first: 500, // Ampliamos el límite por defecto de 50 a 500 recetas
  });
  
  // Limpiamos los datos, filtramos por la casilla "favorita" y nos quedamos con las 3 primeras
  const recetasFavoritas = respuesta.data.recetaConnection.edges
    ?.map((borde) => borde?.node)
    .filter((nodo) => nodo?.favorita === true)
    .slice(0, 5) || [];

  return (
    <footer className="bg-card border-t border-border/60 pt-16 pb-6 mt-16">
      {/* Contenedor ancho */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Columna 1: Marca y Contacto */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-transparente.svg" 
              alt="Logo Las Recetas de Magda" 
              className="w-14 h-14"
            />
            <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Las Recetas de Magda
            </h2>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            Cocinando con cariño y compartiendo los secretos artesanales de casa para que nunca falte un buen postre en tu mesa.
          </p>
          
          <div className="flex items-center gap-3 mt-2">
            <a href="https://www.facebook.com/LasRecetasDeMagda/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-primary hover:bg-secondary hover:text-white transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="mailto:lasrecetasdemagda13@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Correo de contacto" className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-primary hover:bg-secondary hover:text-white transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Columna 2: Explorar */}
        <div className="flex flex-col gap-4 md:pl-8">
          <h3 className="font-bold text-primary uppercase tracking-wider text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
            Explorar
          </h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inicio</Link></li>
            <li><Link href="/recetas" className="text-sm text-muted-foreground hover:text-primary transition-colors">Todas las recetas</Link></li>
            <li><Link href="/sobre-mi" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre mí</Link></li>
            <li><a href="https://crochetmagda.blogspot.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Crochet Magda</a></li>
          </ul>
        </div>

        {/* Columna 3: Las que más nos gustan */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-primary uppercase tracking-wider text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
            Las que más nos gustan
          </h3>
          <ul className="flex flex-col gap-3">
            {recetasFavoritas.map((receta, indice) => (
              <li key={indice}>
                <Link href={`/recetas/${receta?._sys.filename}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-secondary/70 text-lg leading-none">&rsaquo;</span>
                  {receta?.titulo}
                </Link>
              </li>
            ))}
            {recetasFavoritas.length === 0 && (
              <li className="text-sm text-muted-foreground italic">Aún no hay recetas destacadas</li>
            )}
          </ul>
        </div>
        
      </div>

      {/* Barra inferior */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <span>&copy; {anioActual} Las Recetas de Magda. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}