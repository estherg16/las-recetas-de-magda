"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SelectorPersonalizado({ label, valor, opciones, onChange }: { label: string, valor: string, opciones: {valor: string, etiqueta: string}[], onChange: (v: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  const opcionSeleccionada = opciones.find(opt => opt.valor === valor) || opciones[0];

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto relative" ref={ref}>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div 
        onClick={() => setAbierto(!abierto)}
        className="w-full sm:min-w-[200px] bg-card border-2 border-border/60 text-foreground rounded-xl px-4 py-2.5 text-sm shadow-sm flex justify-between items-center cursor-pointer hover:border-primary/50 transition-all select-none"
      >
        <span className="truncate pr-4">{opcionSeleccionada.etiqueta}</span>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 flex-shrink-0 ${abierto ? 'rotate-180' : ''}`} />
      </div>

      {abierto && (
        <div className="absolute top-[100%] left-0 w-full mt-2 bg-card border-2 border-border/60 rounded-xl shadow-lg z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
          {opciones.map((opcion, idx) => (
            <div 
              key={idx}
              onClick={() => {
                onChange(opcion.valor);
                setAbierto(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                valor === opcion.valor 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-foreground hover:bg-accent/40'
              }`}
            >
              {opcion.etiqueta}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}