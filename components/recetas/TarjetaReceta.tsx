import Image from 'next/image';
import { Clock, ChefHat } from 'lucide-react';

export default function TarjetaReceta({ receta }: { receta: any }) {
  // Formateamos la fecha directamente dentro del componente
  const fechaFormateada = receta?.fecha 
    ? new Date(receta.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : '';

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/40 hover:shadow-md transition-shadow h-full flex flex-col group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={receta?.imagen || '/images/receta-por-defecto.jpg'} 
          alt={receta?.titulo || 'Receta de Magda'} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Contenedor de etiquetas */}
        <div className="flex flex-wrap gap-2 mb-3">
          {receta?.categoria && (
            <span className="bg-accent/40 text-primary text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              {receta.categoria}
            </span>
          )}
          {receta?.metodos_preparacion && receta.metodos_preparacion.map((metodo: string, idx: number) => (
            <span key={idx} className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full border border-secondary/20">
              {metodo}
            </span>
          ))}
        </div>

        {fechaFormateada && (
          <span className="text-xs text-secondary font-bold uppercase tracking-widest mb-2 block">
            {fechaFormateada}
          </span>
        )}
        <h3 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {receta?.titulo}
        </h3>
        {/* <p className="text-muted-foreground text-sm flex-grow line-clamp-2 mb-4">
          Preparación en {receta?.tiempo} - Dificultad: {receta?.dificultad}
        </p> */}
        
        <div className="mt-auto pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <ChefHat size={14} className="text-secondary" />
            <span>Dificultad: <strong className="text-primary font-bold">{receta?.dificultad}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-secondary" />
            <span>{receta?.tiempo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}