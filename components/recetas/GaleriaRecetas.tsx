"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import TarjetaReceta from './TarjetaReceta';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import SelectorPersonalizado from '../ui/SelectorPersonalizado';
import {
  useFiltrosRecetas,
  OPCIONES_DIFICULTAD,
  OPCIONES_METODO,
  OPCIONES_ORDEN,
} from '../hooks/useFiltrosRecetas';

export default function GaleriaRecetas({ recetas }: { recetas: any[] }) {
  const inicioGaleriaRef = useRef<HTMLDivElement>(null);
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);

  const {
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    cambiarPagina,
    categorias,
    opcionesAnio,
    recetasFiltradas,
    recetasPaginadas,
    totalPaginas,
    paginasVisibles,
  } = useFiltrosRecetas(recetas);

  const manejarCambioPagina = (nuevaPagina: number) => {
    cambiarPagina(nuevaPagina);
    inicioGaleriaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col items-center" ref={inicioGaleriaRef}>
      <div className="text-center mb-10 w-full max-w-3xl">
        <h1
          className="text-4xl md:text-5xl font-bold text-primary mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Explora Nuestro Recetario
        </h1>
        <p className="text-muted-foreground">
          Cuaderno abierto de aromas, horneados pacientes y fórmulas probadas una y otra vez para asegurar tu triunfo dulce en la cocina.
        </p>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative w-full max-w-2xl mb-6">
        <input
          type="text"
          placeholder="Buscar receta..."
          value={filtros.textoBusqueda}
          onChange={(e) => actualizarFiltro('textoBusqueda')(e.target.value)}
          className="w-full bg-card border-2 border-border/60 text-foreground rounded-full pl-14 pr-32 py-4 shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
          Buscar
        </button>
      </div>

      {/* BOTÓN MÓVIL PARA MOSTRAR FILTROS */}
      <button
        onClick={() => setFiltrosVisibles(!filtrosVisibles)}
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-secondary/10 text-secondary font-bold py-3 rounded-xl mb-4 border border-secondary/20 transition-colors"
      >
        <Filter size={18} />
        {filtrosVisibles ? 'Ocultar filtros' : 'Mostrar filtros de búsqueda'}
      </button>

      {/* CONTENEDOR DE FILTROS */}
      <div
        className={`w-full bg-accent/10 border border-border/40 rounded-[2rem] p-6 lg:p-8 mb-12 transition-all ${
          filtrosVisibles ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {categorias.map((categoria, indice) => (
              <button
                key={indice}
                onClick={() => actualizarFiltro('categoriaActiva')(categoria)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  filtros.categoriaActiva === categoria
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-primary border-border/60 hover:bg-secondary hover:text-white'
                }`}
              >
                {categoria} {categoria === 'Todas' && `(${recetas.length})`}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-bold text-primary">{recetasFiltradas.length}</span> de{' '}
            <span className="font-bold text-primary">{recetas.length}</span> recetas
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 pt-6 border-t border-border/40">
          <div className="flex flex-wrap gap-6 w-full lg:w-auto">
            <SelectorPersonalizado
              label="Nivel de técnica"
              valor={filtros.dificultadActiva}
              opciones={OPCIONES_DIFICULTAD}
              onChange={actualizarFiltro('dificultadActiva')}
            />
            <SelectorPersonalizado
              label="Año"
              valor={filtros.anioActivo}
              opciones={opcionesAnio}
              onChange={actualizarFiltro('anioActivo')}
            />
            <SelectorPersonalizado
              label="Preparación"
              valor={filtros.metodoActivo}
              opciones={OPCIONES_METODO}
              onChange={actualizarFiltro('metodoActivo')}
            />
            <SelectorPersonalizado
              label="Ordenar por"
              valor={filtros.ordenActivo}
              opciones={OPCIONES_ORDEN}
              onChange={actualizarFiltro('ordenActivo')}
            />
          </div>

          <button
            onClick={limpiarFiltros}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-muted-foreground border border-border/60 bg-background hover:text-secondary hover:border-secondary transition-all w-full lg:w-auto mt-4 lg:mt-0"
          >
            <RefreshCw size={16} />
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* GRID DE RECETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-12">
        {recetasPaginadas.length > 0 ? (
          recetasPaginadas.map((receta) => (
            <Link key={receta?._sys.filename} href={`/recetas/${receta?._sys.filename}`}>
              <TarjetaReceta receta={receta} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-accent/10 rounded-[2rem] border border-border/40">
            No hemos encontrado recetas con estos filtros. ¡Prueba a limpiarlos!
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => manejarCambioPagina(Math.max(1, filtros.paginaActual - 1))}
            disabled={filtros.paginaActual === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/60 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/20 transition-colors text-primary"
          >
            <ChevronLeft size={18} /> Anterior
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {paginasVisibles.map((item, idx) =>
              item === '...' ? (
                <span key={`puntos-${idx}`} className="px-1.5 text-muted-foreground font-bold select-none">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => manejarCambioPagina(Number(item))}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    filtros.paginaActual === item
                      ? 'bg-primary text-primary-foreground shadow-sm border-primary'
                      : 'border border-border/60 hover:bg-accent/20 text-primary'
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => manejarCambioPagina(Math.min(totalPaginas, filtros.paginaActual + 1))}
            disabled={filtros.paginaActual === totalPaginas}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/60 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/20 transition-colors text-primary"
          >
            Siguiente <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}