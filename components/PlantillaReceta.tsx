"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, Calendar, ExternalLink } from 'lucide-react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

export default function PlantillaReceta({ receta }: { receta: any }) {
  const [ingredientesMarcados, setIngredientesMarcados] = useState<number[]>([]);

  // Comprobamos si las elaboraciones tienen contenido real
  const tieneTradicional = receta.pasos && receta.pasos.children && receta.pasos.children.length > 0;
  const tieneThermomix = receta.pasos_thermomix && receta.pasos_thermomix.children && receta.pasos_thermomix.children.length > 0;
  
  // Iniciamos la pestaña en la elaboración que exista por defecto
  const [modo, setModo] = useState<'tradicional' | 'thermomix'>(tieneTradicional ? 'tradicional' : 'thermomix');

  const alternarIngrediente = (indice: number) => {
    if (ingredientesMarcados.includes(indice)) {
      setIngredientesMarcados(ingredientesMarcados.filter(i => i !== indice));
    } else {
      setIngredientesMarcados([...ingredientesMarcados, indice]);
    }
  };

  const fechaFormateada = receta.fecha 
    ? new Date(receta.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const componentesTina = {
    img: (props: any) => (
      <span className="my-10 flex flex-col items-center w-full">
        <img
          src={props?.url}
          alt={props?.alt}
          className="w-full max-w-md h-auto rounded-2xl shadow-sm border border-border/40 object-cover"
        />
        {props?.alt && (
          <span className="mt-3 text-sm text-muted-foreground italic text-center block">
            {props.alt}
          </span>
        )}
      </span>
    ),
  };

  return (
    <article className="max-w-6xl mx-auto px-6 py-12">
      
      {/* MIGAS DE PAN */}
      <nav aria-label="Migas de pan" className="mb-10 md:mb-14">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
          <li>
            <Link href="/" className="hover:text-secondary transition-colors">
              Inicio
            </Link>
          </li>
          <li><span className="opacity-40">/</span></li>
          <li>
            <Link href="/recetas" className="hover:text-secondary transition-colors">
              Recetas
            </Link>
          </li>
          <li><span className="opacity-40">/</span></li>
          <li>
            <span className="text-secondary">{receta.titulo}</span>
          </li>
        </ol>
      </nav>

      <header className="flex flex-col items-center text-center mb-16 md:mb-20 max-w-5xl mx-auto">
        
        <span className="inline-block bg-accent/40 text-primary text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-6">
          {receta.categoria}
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight max-w-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
          {receta.titulo}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-muted-foreground text-sm font-medium mb-12">
          {fechaFormateada && (
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-secondary" />
              <span>{fechaFormateada}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-secondary" />
            <span>{receta.tiempo}</span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat size={20} className="text-secondary" />
            <span>{receta.dificultad}</span>
          </div>
        </div>

        <div className="relative w-full max-w-2xl aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm border border-border/40">
          <Image 
            src={receta.imagen} 
            alt={receta.titulo} 
            fill
            className="object-cover"
            priority
          />
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* LISTA DE INGREDIENTES */}
        <div className="md:w-1/3">
          <div className="bg-card rounded-[2rem] p-8 border border-border/50 sticky top-24 shadow-sm">
            <h3 className="text-2xl font-bold text-primary mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ingredientes
            </h3>
            <ul className="flex flex-col gap-4">
              {receta.ingredientes?.map((ingrediente: string, indice: number) => {
                // Si el ingrediente está totalmente en MAYÚSCULAS, es un subtítulo
                const esSubtitulo = ingrediente === ingrediente.toUpperCase() && ingrediente.length > 3;

                if (esSubtitulo) {
                  return (
                    <li key={indice} className="mt-4 mb-2">
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest border-b border-secondary/30 pb-1">
                        {ingrediente}
                      </span>
                    </li>
                  );
                }

                // Si es normal, le ponemos el circulito seleccionable
                const marcado = ingredientesMarcados.includes(indice);
                return (
                  <li 
                    key={indice} 
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => alternarIngrediente(indice)}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${marcado ? 'bg-secondary border-secondary' : 'border-border group-hover:border-secondary/60'}`}>
                      {marcado && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-base leading-snug transition-all ${marcado ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}>
                      {ingrediente}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ELABORACIÓN */}
        <div className="md:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h3 className="text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Elaboración
            </h3>

            {/* Solo mostramos las pestañas si hay contenido en AMBAS elaboraciones */}
            {tieneTradicional && tieneThermomix && (
              <div className="flex bg-muted/50 p-1.5 rounded-full border border-border/50">
                <button 
                  onClick={() => setModo('tradicional')}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${modo === 'tradicional' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                >
                  Tradicional
                </button>
                <button 
                  onClick={() => setModo('thermomix')}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${modo === 'thermomix' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                >
                  Thermomix
                </button>
              </div>
            )}
          </div>
          
          <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-primary prose-headings:font-serif max-w-none">
            {modo === 'tradicional' && tieneTradicional && (
              <TinaMarkdown content={receta.pasos} components={componentesTina} />
            )}
            {modo === 'thermomix' && tieneThermomix && (
              <TinaMarkdown content={receta.pasos_thermomix} components={componentesTina} />
            )}
          </div>
        </div>

      </div>

        {receta.url_inspiracion && receta.url_inspiracion.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Fuentes de inspiración:
            </span>
            {receta.url_inspiracion.map((url: string, indice: number) => (
              <a 
                key={indice}
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                <ExternalLink size={16} />
                {url.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            ))}
          </div>
        )}
    </article>
  );
}