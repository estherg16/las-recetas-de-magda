import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center py-20">
      {/* Icono decorativo */}
      <div className="bg-secondary/10 p-8 rounded-full mb-8 border border-secondary/20">
        <ChefHat size={80} className="text-secondary" strokeWidth={1.5} />
      </div>
      
      {/* Título gigante */}
      <h1 className="text-7xl md:text-9xl font-bold text-primary mb-4 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
        404
      </h1>
      
      {/* Subtítulo temático */}
      <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
        ¡Ups! Se nos ha quemado esta receta
      </h2>
      
      {/* Texto explicativo */}
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
        La página que buscas no existe
      </p>
      
      {/* Botón de vuelta */}
      <Link 
        href="/"
        className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300"
      >
        <ChefHat size={20} />
        Volver a la cocina
      </Link>
    </main>
  );
}
