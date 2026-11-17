"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const RECETAS_POR_PAGINA = 12;
const STORAGE_KEY = 'filtrosRecetasMagda';

export const OPCIONES_DIFICULTAD = [
  { valor: 'Todas', etiqueta: 'Todas las dificultades' },
  { valor: 'Fácil', etiqueta: 'Fácil' },
  { valor: 'Media', etiqueta: 'Media' },
  { valor: 'Alta', etiqueta: 'Alta' },
];

export const OPCIONES_METODO = [
  { valor: 'Todos', etiqueta: 'Cualquier método' },
  { valor: 'Thermomix', etiqueta: 'Thermomix' },
  { valor: 'Horno', etiqueta: 'Horno' },
  { valor: 'Sin horno', etiqueta: 'Sin horno' },
  { valor: 'Freidora de aire', etiqueta: 'Freidora de aire' },
  { valor: 'Microondas', etiqueta: 'Microondas' },
  { valor: 'Navidad', etiqueta: 'Navidad' },
];

export const OPCIONES_ORDEN = [
  { valor: 'Recientes', etiqueta: 'Más recientes primero' },
  { valor: 'Antiguas', etiqueta: 'Más antiguas primero' },
];

const FILTROS_INICIALES = {
  textoBusqueda: '',
  categoriaActiva: 'Todas',
  dificultadActiva: 'Todas',
  ordenActivo: 'Recientes',
  anioActivo: 'Todos',
  metodoActivo: 'Todos',
  paginaActual: 1,
};

const normalizarTexto = (texto?: string) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export function useFiltrosRecetas(recetas: any[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [cargadoDesdeMemoria, setCargadoDesdeMemoria] = useState(false);

  // 1. Recuperar filtros de URL o sessionStorage al montar
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setFiltros({ ...FILTROS_INICIALES, textoBusqueda: q });
      router.replace('/recetas', { scroll: false });
      setCargadoDesdeMemoria(true);
      return;
    }

    const guardados = sessionStorage.getItem(STORAGE_KEY);
    if (guardados) {
      try {
        setFiltros((prev) => ({ ...prev, ...JSON.parse(guardados) }));
      } catch (e) {
        console.error('Error leyendo filtros guardados', e);
      }
    }
    setCargadoDesdeMemoria(true);
  }, [searchParams, router]);

  // 2. Guardar cambios en sessionStorage
  useEffect(() => {
    if (!cargadoDesdeMemoria) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filtros));
  }, [filtros, cargadoDesdeMemoria]);

  const actualizarFiltro = (campo: keyof typeof FILTROS_INICIALES) => (valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      paginaActual: 1,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, paginaActual: nuevaPagina }));
  };

  // 3. Categorías y años dinámicos
  const { categorias, opcionesAnio } = useMemo(() => {
    const cats = Array.from(new Set(recetas.map((r) => r.categoria)))
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b), 'es'));

    const anios = Array.from(
      new Set(recetas.map((r) => (r.fecha ? new Date(r.fecha).getFullYear().toString() : '')))
    )
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));

    return {
      categorias: ['Todas', ...cats],
      opcionesAnio: [
        { valor: 'Todos', etiqueta: 'Cualquier año' },
        ...anios.map((a) => ({ valor: String(a), etiqueta: String(a) })),
      ],
    };
  }, [recetas]);

  // 4. Filtrado y ordenación
  const recetasFiltradas = useMemo(() => {
    const busqueda = normalizarTexto(filtros.textoBusqueda);

    return recetas
      .filter((receta) => {
        const coincideBusqueda =
          busqueda === '' ||
          normalizarTexto(receta.titulo).includes(busqueda) ||
          normalizarTexto(receta.categoria).includes(busqueda) ||
          receta.metodos_preparacion?.some((m: string) => normalizarTexto(m).includes(busqueda));

        const coincideCategoria =
          filtros.categoriaActiva === 'Todas' || receta.categoria === filtros.categoriaActiva;
        const coincideDificultad =
          filtros.dificultadActiva === 'Todas' || receta.dificultad === filtros.dificultadActiva;
        const coincideAnio =
          filtros.anioActivo === 'Todos' ||
          (receta.fecha && new Date(receta.fecha).getFullYear().toString() === filtros.anioActivo);
        const coincideMetodo =
          filtros.metodoActivo === 'Todos' ||
          receta.metodos_preparacion?.includes(filtros.metodoActivo);

        return (
          coincideBusqueda &&
          coincideCategoria &&
          coincideDificultad &&
          coincideAnio &&
          coincideMetodo
        );
      })
      .sort((a, b) => {
        const fechaA = a?.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b?.fecha ? new Date(b.fecha).getTime() : 0;
        return filtros.ordenActivo === 'Recientes' ? fechaB - fechaA : fechaA - fechaB;
      });
  }, [recetas, filtros]);

  // 5. Paginación
  const totalPaginas = Math.ceil(recetasFiltradas.length / RECETAS_POR_PAGINA);
  const recetasPaginadas = useMemo(() => {
    const inicio = (filtros.paginaActual - 1) * RECETAS_POR_PAGINA;
    return recetasFiltradas.slice(inicio, inicio + RECETAS_POR_PAGINA);
  }, [recetasFiltradas, filtros.paginaActual]);

  const paginasVisibles = useMemo(() => {
    const { paginaActual } = filtros;
    if (totalPaginas <= 5) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    if (paginaActual <= 3) return [1, 2, 3, 4, '...', totalPaginas];
    if (paginaActual >= totalPaginas - 2) {
      return [1, '...', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
    }
    return [1, '...', paginaActual - 1, paginaActual, paginaActual + 1, '...', totalPaginas];
  }, [filtros.paginaActual, totalPaginas]);

  return {
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
  };
}