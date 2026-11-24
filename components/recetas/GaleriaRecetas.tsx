"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import TarjetaReceta from './TarjetaReceta';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import SelectorPersonalizado from '../ui/SelectorPersonalizado';
import {
  useFiltrosRecetas,
  OPCIONES_DIFICULTAD,
  OPCIONES_METODO,
  OPCIONES_ORDEN,
} from '../hooks/useFiltrosRecetas';

// Subcomponente reutilizable para cada bloque plegable con checkboxes estilo PcComponentes
function SeccionFiltroCheckbox({
  titulo,
  opciones,
  seleccionados,
  conteos,
  onToggle,
  abiertoPorDefecto = true,
  limiteInicial,
}: {
  titulo: string;
  opciones: string[];
  seleccionados: string[];
  conteos: Record<string, number>;
  onToggle: (valor: string) => void;
  abiertoPorDefecto?: boolean;
  limiteInicial?: number;
}) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);
  const [verTodo, setVerTodo] = useState(false);

  const tieneLimite = typeof limiteInicial === 'number' && opciones.length > limiteInicial;
  const opcionesVisibles =
    tieneLimite && !verTodo ? opciones.slice(0, limiteInicial) : opciones;

  return (
    <div className="border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between py-1 text-left group"
      >
        <span className="text-sm font-bold text-primary flex items-center gap-2">
          {titulo}
          {seleccionados.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[11px] font-bold px-1.5 py-0.2 rounded-full">
              {seleccionados.length}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 group-hover:text-primary ${
            abierto ? 'rotate-180' : ''
          }`}
        />
      </button>

      {abierto && (
        <div className="mt-3 flex flex-col gap-2.5">
          {opcionesVisibles.map((opcion) => {
            const marcado = seleccionados.includes(opcion);
            const cantidad = conteos[opcion] ?? 0;

            return (
              <label
                key={opcion}
                onClick={() => onToggle(opcion)}
                className="flex items-start gap-2.5 cursor-pointer select-none group"
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                    marcado
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border group-hover:border-primary'
                  }`}
                >
                  {marcado && <Check size={12} strokeWidth={3} />}
                </span>

                <span
                  className={`text-sm leading-snug transition-colors ${
                    marcado
                      ? 'font-bold text-primary'
                      : 'text-foreground/90 group-hover:text-primary'
                  }`}
                >
                  {opcion}{' '}
                  <span className="text-muted-foreground font-normal text-xs">
                    ({cantidad})
                  </span>
                </span>
              </label>
            );
          })}

          {tieneLimite && (
            <button
              type="button"
              onClick={() => setVerTodo(!verTodo)}
              className="mt-1 text-xs font-bold text-secondary hover:underline text-left w-fit"
            >
              {verTodo
                ? 'Ver menos'
                : `Ver más (${opciones.length - (limiteInicial ?? 0)})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function GaleriaRecetas({ recetas }: { recetas: any[] }) {
  const inicioGaleriaRef = useRef<HTMLDivElement>(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const {
    filtros,
    toggleFiltroMultiple,
    actualizarFiltroSimple,
    limpiarFiltros,
    cambiarPagina,
    categorias,
    anios,
    conteoCategorias,
    conteoDificultades,
    conteoAnios,
    conteoMetodos,
    recetasFiltradas,
    recetasPaginadas,
    totalPaginas,
    paginasVisibles,
  } = useFiltrosRecetas(recetas);

  useEffect(() => {
    document.body.style.overflow = drawerAbierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerAbierto]);

  const manejarCambioPagina = (nuevaPagina: number) => {
    cambiarPagina(nuevaPagina);
    inicioGaleriaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Total de checkboxes marcados en todos los grupos
  const cantidadFiltrosActivos =
    filtros.categoriasActivas.length +
    filtros.dificultadesActivas.length +
    filtros.aniosActivos.length +
    filtros.metodosActivos.length;

  const contenidoFiltros = (esMovil = false) => (
    <div className="flex flex-col gap-5">
      {/* Cabecera */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div
          className="flex items-center gap-2 text-primary font-bold text-lg"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <Filter size={18} />
          <span>Filtros</span>
        </div>
        {esMovil && (
          <button
            onClick={() => setDrawerAbierto(false)}
            className="text-muted-foreground hover:text-primary p-1 transition-colors"
            aria-label="Cerrar filtros"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Ordenar por */}
      <div className="border-b border-border/40 pb-4">
        <SelectorPersonalizado
          label="Ordenar por"
          valor={filtros.ordenActivo}
          opciones={OPCIONES_ORDEN}
          onChange={actualizarFiltroSimple('ordenActivo')}
        />
      </div>

      {/* Secciones plegables con checkboxes múltiples */}
      <SeccionFiltroCheckbox
        titulo="Categorías"
        opciones={categorias}
        seleccionados={filtros.categoriasActivas}
        conteos={conteoCategorias}
        onToggle={(val) => toggleFiltroMultiple('categoriasActivas', val)}
        abiertoPorDefecto={true}
        limiteInicial={6}
      />

      <SeccionFiltroCheckbox
        titulo="Preparación"
        opciones={OPCIONES_METODO}
        seleccionados={filtros.metodosActivos}
        conteos={conteoMetodos}
        onToggle={(val) => toggleFiltroMultiple('metodosActivos', val)}
        abiertoPorDefecto={true}
      />

      <SeccionFiltroCheckbox
        titulo="Nivel de técnica"
        opciones={OPCIONES_DIFICULTAD}
        seleccionados={filtros.dificultadesActivas}
        conteos={conteoDificultades}
        onToggle={(val) => toggleFiltroMultiple('dificultadesActivas', val)}
        abiertoPorDefecto={true}
      />

      <SeccionFiltroCheckbox
        titulo="Año"
        opciones={anios}
        seleccionados={filtros.aniosActivos}
        conteos={conteoAnios}
        onToggle={(val) => toggleFiltroMultiple('aniosActivos', val)}
        abiertoPorDefecto={false}
      />

      {/* Botón limpiar filtros */}
      <button
        onClick={limpiarFiltros}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground border border-border/60 bg-background hover:text-secondary hover:border-secondary transition-all w-full"
      >
        <RefreshCw size={16} />
        Limpiar filtros
      </button>

      {/* Botón ver resultados en móvil */}
      {esMovil && (
        <button
          onClick={() => setDrawerAbierto(false)}
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          Ver {recetasFiltradas.length} {recetasFiltradas.length === 1 ? 'receta' : 'recetas'}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full" ref={inicioGaleriaRef}>
      {/* CABECERA DE SECCIÓN */}
      <div className="text-center mb-8 w-full max-w-3xl">
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
      <div className="relative w-full max-w-2xl mb-8">
        <input
          type="text"
          placeholder="Buscar receta..."
          value={filtros.textoBusqueda}
          onChange={(e) => actualizarFiltroSimple('textoBusqueda')(e.target.value)}
          className="w-full bg-card border-2 border-border/60 text-foreground rounded-full pl-14 pr-32 py-4 shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
          Buscar
        </button>
      </div>

      {/* BARRA DE CONTROL SUPERIOR FIJA DEBAJO DEL HEADER */}
      <div className="sticky top-16 md:top-20 z-30 w-full bg-background/95 backdrop-blur-md flex items-center justify-between gap-4 py-3.5 mb-6 border-b border-border/40 transition-colors">
        {/* Botón MÓVIL */}
        <button
          onClick={() => setDrawerAbierto(true)}
          className="lg:hidden flex items-center justify-center gap-2 bg-secondary/10 text-secondary font-bold px-5 py-2.5 rounded-xl border border-secondary/20 transition-colors hover:bg-secondary/20"
        >
          <Filter size={18} />
          <span>Filtrar</span>
          {cantidadFiltrosActivos > 0 && (
            <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cantidadFiltrosActivos}
            </span>
          )}
        </button>

        {/* Botón ESCRITORIO */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors py-1.5 px-3 rounded-xl hover:bg-accent/20"
          >
            <SlidersHorizontal size={16} />
            <span>{sidebarVisible ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
            {!sidebarVisible && cantidadFiltrosActivos > 0 && (
              <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cantidadFiltrosActivos}
              </span>
            )}
          </button>

          {cantidadFiltrosActivos > 0 && (
            <button
              onClick={limpiarFiltros}
              className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Limpiar ({cantidadFiltrosActivos})
            </button>
          )}
        </div>

        {/* Contador de recetas */}
        <div className="text-sm text-muted-foreground ml-auto">
          Mostrando <span className="font-bold text-primary">{recetasFiltradas.length}</span> de{' '}
          <span className="font-bold text-primary">{recetas.length}</span> recetas
        </div>
      </div>

      {/* === DESPLEGABLE LATERAL IZQUIERDO (Móvil) === */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden backdrop-blur-sm ${
          drawerAbierto ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setDrawerAbierto(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-background p-6 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto scroll-sutil ${
          drawerAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {contenidoFiltros(true)}
      </aside>

      {/* === ESTRUCTURA PRINCIPAL: SIDEBAR PLEGABLE + GRID === */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8">
        {sidebarVisible && (
          <aside className="hidden lg:block w-72 shrink-0 sticky top-36 bg-accent/10 border border-border/40 rounded-[2rem] p-6 max-h-[calc(100vh-10rem)] overflow-y-auto scroll-sutil">
            {contenidoFiltros(false)}
          </aside>
        )}

        <div className="flex-1 w-full">
          {/* Píldoras rápidas con los filtros activos seleccionados */}
          {cantidadFiltrosActivos > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {filtros.categoriasActivas.map((cat) => (
                <button
                  key={`cat-${cat}`}
                  onClick={() => toggleFiltroMultiple('categoriasActivas', cat)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat} <X size={13} />
                </button>
              ))}
              {filtros.metodosActivos.map((met) => (
                <button
                  key={`met-${met}`}
                  onClick={() => toggleFiltroMultiple('metodosActivos', met)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-primary border border-secondary/30 hover:bg-secondary hover:text-white transition-colors"
                >
                  {met} <X size={13} />
                </button>
              ))}
              {filtros.dificultadesActivas.map((dif) => (
                <button
                  key={`dif-${dif}`}
                  onClick={() => toggleFiltroMultiple('dificultadesActivas', dif)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent/40 text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Dificultad: {dif} <X size={13} />
                </button>
              ))}
              {filtros.aniosActivos.map((anio) => (
                <button
                  key={`anio-${anio}`}
                  onClick={() => toggleFiltroMultiple('aniosActivos', anio)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent/40 text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Año: {anio} <X size={13} />
                </button>
              ))}
            </div>
          )}

          {/* GRID DE RECETAS */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12 ${
              sidebarVisible ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
            }`}
          >
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
                    <span
                      key={`puntos-${idx}`}
                      className="px-1.5 text-muted-foreground font-bold select-none"
                    >
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
      </div>
    </div>
  );
}