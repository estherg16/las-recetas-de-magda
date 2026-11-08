"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TarjetaReceta from './TarjetaReceta';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import SelectorPersonalizado from '../ui/SelectorPersonalizado';

export default function GaleriaRecetas({ recetas }: { recetas: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Referencia para el inicio de la galería
  const inicioGaleriaRef = useRef<HTMLDivElement>(null);

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [dificultadActiva, setDificultadActiva] = useState('Todas');
  const [ordenActivo, setOrdenActivo] = useState('Recientes');
  const [anioActivo, setAnioActivo] = useState('Todos');
  const [metodoActivo, setMetodoActivo] = useState('Todos');
  
  // Nuevo estado para controlar la visibilidad de los filtros en móvil
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const recetasPorPagina = 12;

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setTextoBusqueda(q);
      router.replace('/recetas', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    setPaginaActual(1);
  }, [textoBusqueda, categoriaActiva, dificultadActiva, ordenActivo, anioActivo, metodoActivo]);

  const categoriasUnicas = Array.from(new Set(recetas.map(r => r.categoria))).filter(Boolean);
  const categorias = ['Todas', ...categoriasUnicas];
  
  const aniosUnicos = Array.from(
    new Set(recetas.map(r => r.fecha ? new Date(r.fecha).getFullYear().toString() : ''))
  ).filter(Boolean).sort((a, b) => Number(b) - Number(a));
  
  let recetasFiltradas = recetas.filter(receta => {
    const busqueda = textoBusqueda.toLowerCase();
    const coincideBusqueda = textoBusqueda === '' || 
      receta.titulo.toLowerCase().includes(busqueda) || 
      receta.categoria.toLowerCase().includes(busqueda) ||
      (receta.metodos_preparacion && receta.metodos_preparacion.some((metodo: string) => metodo.toLowerCase().includes(busqueda)));
      
    const coincideCategoria = categoriaActiva === 'Todas' || receta.categoria === categoriaActiva;
    const coincideDificultad = dificultadActiva === 'Todas' || receta.dificultad === dificultadActiva;
    const coincideAnio = anioActivo === 'Todos' || (receta.fecha && new Date(receta.fecha).getFullYear().toString() === anioActivo);
    const coincideMetodo = metodoActivo === 'Todos' || (receta.metodos_preparacion && receta.metodos_preparacion.includes(metodoActivo));
    
    return coincideBusqueda && coincideCategoria && coincideDificultad && coincideAnio && coincideMetodo;
  });

  recetasFiltradas = recetasFiltradas.sort((a, b) => {
    const fechaA = a?.fecha ? new Date(a.fecha).getTime() : 0;
    const fechaB = b?.fecha ? new Date(b.fecha).getTime() : 0;
    return ordenActivo === 'Recientes' ? fechaB - fechaA : fechaA - fechaB;
  });

  const totalPaginas = Math.ceil(recetasFiltradas.length / recetasPorPagina);
  const indiceUltimaReceta = paginaActual * recetasPorPagina;
  const indicePrimeraReceta = indiceUltimaReceta - recetasPorPagina;
  const recetasPaginadas = recetasFiltradas.slice(indicePrimeraReceta, indiceUltimaReceta);

  const limpiarFiltros = () => {
    setTextoBusqueda('');
    setCategoriaActiva('Todas');
    setDificultadActiva('Todas');
    setOrdenActivo('Recientes');
    setAnioActivo('Todos');
    setMetodoActivo('Todos');
    setPaginaActual(1);
  };

  // Función para cambiar de página y hacer scroll arriba
  const manejarCambioPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
    if (inicioGaleriaRef.current) {
      inicioGaleriaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const opcionesDificultad = [
    { valor: 'Todas', etiqueta: 'Todas las dificultades' },
    { valor: 'Fácil', etiqueta: 'Fácil' },
    { valor: 'Media', etiqueta: 'Media' },
    { valor: 'Difícil', etiqueta: 'Difícil' }
  ];

  const opcionesAnio = [
    { valor: 'Todos', etiqueta: 'Cualquier año' },
    ...aniosUnicos.map(a => ({ valor: String(a), etiqueta: String(a) }))
  ];

  const opcionesMetodo = [
    { valor: 'Todos', etiqueta: 'Cualquier método' },
    { valor: 'Thermomix', etiqueta: 'Thermomix' },
    { valor: 'Horno', etiqueta: 'Horno' },
    { valor: 'Sin horno', etiqueta: 'Sin horno' },
    { valor: 'Freidora de aire', etiqueta: 'Freidora de aire' },
    { valor: 'Microondas', etiqueta: 'Microondas' },
    { valor: 'Navidad', etiqueta: 'Navidad' },
  ];

  const opcionesOrden = [
    { valor: 'Recientes', etiqueta: 'Más recientes primero' },
    { valor: 'Antiguas', etiqueta: 'Más antiguas primero' }
  ];

  return (
    <div className="flex flex-col items-center" ref={inicioGaleriaRef}>
      
      <div className="text-center mb-10 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Explora Nuestro Recetario
        </h1>
        <p className="text-muted-foreground">
          Cuaderno abierto de aromas, horneados pacientes y fórmulas probadas una y otra vez para asegurar tu triunfo dulce en la cocina.
        </p>
      </div>

      <div className="relative w-full max-w-2xl mb-6">
        <input 
          type="text" 
          placeholder="Buscar receta..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
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

      {/* CONTENEDOR DE FILTROS (Oculto en móvil por defecto) */}
      <div className={`w-full bg-accent/10 border border-border/40 rounded-[2rem] p-6 lg:p-8 mb-12 transition-all ${filtrosVisibles ? 'block' : 'hidden lg:block'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {categorias.map((categoria, indice) => (
              <button
                key={indice}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  categoriaActiva === categoria
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-primary border-border/60 hover:bg-secondary hover:text-white'
                }`}
              >
                {categoria} {categoria === 'Todas' && `(${recetas.length})`}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-bold text-primary">{recetasFiltradas.length}</span> de <span className="font-bold text-primary">{recetas.length}</span> recetas
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 pt-6 border-t border-border/40">
          <div className="flex flex-wrap gap-6 w-full lg:w-auto">
            <SelectorPersonalizado label="Nivel de técnica" valor={dificultadActiva} opciones={opcionesDificultad} onChange={setDificultadActiva} />
            <SelectorPersonalizado label="Año" valor={anioActivo} opciones={opcionesAnio} onChange={setAnioActivo} />
            <SelectorPersonalizado label="Preparación" valor={metodoActivo} opciones={opcionesMetodo} onChange={setMetodoActivo} />
            <SelectorPersonalizado label="Ordenar por" valor={ordenActivo} opciones={opcionesOrden} onChange={setOrdenActivo} />
          </div>

          <button onClick={limpiarFiltros} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-muted-foreground border border-border/60 bg-background hover:text-secondary hover:border-secondary transition-all w-full lg:w-auto mt-4 lg:mt-0">
            <RefreshCw size={16} />
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-12">
        {recetasPaginadas.length > 0 ? (
          recetasPaginadas.map((receta, indice) => (
            <Link key={indice} href={`/recetas/${receta?._sys.filename}`}>
                <TarjetaReceta receta={receta} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-accent/10 rounded-[2rem] border border-border/40">
            No hemos encontrado recetas con estos filtros. ¡Prueba a limpiarlos!
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button 
            onClick={() => manejarCambioPagina(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/60 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/20 transition-colors text-primary"
          >
            <ChevronLeft size={18} /> Anterior
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => manejarCambioPagina(num)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                  paginaActual === num 
                    ? 'bg-primary text-primary-foreground shadow-sm border-primary' 
                    : 'border border-border/60 hover:bg-accent/20 text-primary'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button 
            onClick={() => manejarCambioPagina(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/60 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/20 transition-colors text-primary"
          >
            Siguiente <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}