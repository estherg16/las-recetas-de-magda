"use client"; 

import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BotonModoOscuro from '../ui/BotonModoOscuro';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const router = useRouter();

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (terminoBusqueda.trim()) {
      setIsMenuOpen(false); 
      router.push(`/recetas?q=${encodeURIComponent(terminoBusqueda)}`);
      setTerminoBusqueda('');
    }
  };

  return (
    <header className="bg-muted py-4 sticky top-0 z-50 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-3 items-center gap-4">
        
        {/* === A. IZQUIERDA: Logo + Título === */}
        <Link href="/" className="flex items-center space-x-2 md:space-x-3 justify-self-start transition-opacity hover:opacity-80">
          <Image 
            src="/images/logo-transparente.svg" 
            alt="Logo Las Recetas de Magda" 
            width={40}
            height={40} 
            className="md:w-12 md:h-12"
            priority 
          />
          <span className="text-base sm:text-lg lg:text-xl font-bold text-primary tracking-wide whitespace-nowrap" style={{ fontFamily: 'Playfair Display, serif' }}>
            Las Recetas de Magda
          </span>
        </Link>

        {/* === B. CENTRO: Menú Escritorio === */}
        <nav className="text-sm text-muted-foreground hidden lg:flex font-medium tracking-wide justify-self-center gap-8">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link href="/recetas" className="hover:text-primary transition-colors">Recetas</Link>
          <Link href="/sobre-mi" className="hover:text-primary transition-colors">Sobre mí</Link>
        </nav>

        {/* === C. DERECHA: Buscador Escritorio + Modo Oscuro + Hamburguesa === */}
        <div className="flex items-center space-x-4 justify-self-end">
          
          {/* Buscador (Visible en escritorio) */}
          <div className="relative hidden lg:block group">
            <form onSubmit={manejarBusqueda}>
              <input 
                type="text" 
                placeholder="Buscar receta..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="bg-card border border-border/60 text-foreground text-sm rounded-full pl-10 pr-4 py-2 w-48 xl:w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" strokeWidth={2} />
            </form>
          </div>

          {/* Botón Modo Oscuro (Visible en todos los dispositivos) */}
          <BotonModoOscuro />

          {/* Icono Hamburguesa (Solo móvil y tablet) */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-primary hover:opacity-80 p-1"
            aria-label="Abrir menú"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* =========================================================
          === DESPLEGABLE LATERAL (Móvil y Tablet) ===
          ========================================================= */}
      
      {/* CAPA OSCURA DE FONDO */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden backdrop-blur-sm ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* MENÚ LATERAL */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background p-6 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-muted-foreground hover:text-primary p-1"
            aria-label="Cerrar menú"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Buscador en el menú móvil */}
        <div className="relative mb-8">
          <form onSubmit={manejarBusqueda}>
            <input 
              type="text" 
              placeholder="Buscar receta..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="bg-card border border-border/60 text-foreground text-sm rounded-full pl-10 pr-4 py-3 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" strokeWidth={2} />
          </form>
        </div>

        {/* Enlaces del menú lateral */}
        <nav className="flex flex-col gap-6 text-lg font-medium text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">Inicio</Link>
          <Link href="/recetas" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">Recetas</Link>
          <Link href="/sobre-mi" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">Sobre mí</Link>
        </nav>
      </div>
    </header>
  );
}