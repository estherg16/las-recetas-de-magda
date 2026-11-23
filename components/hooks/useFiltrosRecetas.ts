"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const RECETAS_POR_PAGINA = 12;
const STORAGE_KEY = 'filtrosRecetasMagda_v2';

export const OPCIONES_DIFICULTAD = ['Fácil', 'Media', 'Alta'];

export const OPCIONES_METODO = [
  'Thermomix',
  'Horno',
  'Sin horno',
  'Freidora de aire',
  'Microondas',
  'Navidad',
];

export const OPCIONES_ORDEN = [
  { valor: 'Recientes', etiqueta: 'Más recientes primero' },
  { valor: 'Antiguas', etiqueta: 'Más antiguas primero' },
];

export interface EstadoFiltros {
  textoBusqueda: string;
  categoriasActivas: string[];
  dificultadesActivas: string[];
  aniosActivos: string[];
  metodosActivos: string[];
  ordenActivo: string;
  paginaActual: number;
}

const FILTROS_INICIALES: EstadoFiltros = {
  textoBusqueda: '',
  categoriasActivas: [],
  dificultadesActivas: [],
  aniosActivos: [],
  metodosActivos: [],
  ordenActivo: 'Recientes',
  paginaActual: 1,
};

type CampoArrayFiltro =
  | 'categoriasActivas'
  | 'dificultadesActivas'
  | 'aniosActivos'
  | 'metodosActivos';

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

  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIALES);
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
        const parsed = JSON.parse(guardados);
        setFiltros((prev) => ({
          ...prev,
          ...parsed,
          categoriasActivas: Array.isArray(parsed.categoriasActivas) ? parsed.categoriasActivas : [],
          dificultadesActivas: Array.isArray(parsed.dificultadesActivas) ? parsed.dificultadesActivas : [],
          aniosActivos: Array.isArray(parsed.aniosActivos) ? parsed.aniosActivos : [],
          metodosActivos: Array.isArray(parsed.metodosActivos) ? parsed.metodosActivos : [],
        }));
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

  // Alternar un elemento dentro de un filtro múltiple (añadir o quitar)
  const toggleFiltroMultiple = (campo: CampoArrayFiltro, valor: string) => {
    setFiltros((prev) => {
      const listaActual = prev[campo];
      const yaExiste = listaActual.includes(valor);
      const nuevaLista = yaExiste
        ? listaActual.filter((item) => item !== valor)
        : [...listaActual, valor];

      return {
        ...prev,
        [campo]: nuevaLista,
        paginaActual: 1,
      };
    });
  };

  // Actualizar campos simples (textoBusqueda u ordenActivo)
  const actualizarFiltroSimple = (campo: 'textoBusqueda' | 'ordenActivo') => (valor: string) => {
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

  // 3. Listas dinámicas y conteos totales por opción
  const {
    categorias,
    anios,
    conteoCategorias,
    conteoDificultades,
    conteoAnios,
    conteoMetodos,
  } = useMemo(() => {
    const cCats: Record<string, number> = {};
    const cDifs: Record<string, number> = {};
    const cAnios: Record<string, number> = {};
    const cMets: Record<string, number> = {};

    recetas.forEach((r) => {
      if (r.categoria) {
        cCats[r.categoria] = (cCats[r.categoria] || 0) + 1;
      }
      if (r.dificultad) {
        cDifs[r.dificultad] = (cDifs[r.dificultad] || 0) + 1;
      }
      if (r.fecha) {
        const anio = new Date(r.fecha).getFullYear().toString();
        cAnios[anio] = (cAnios[anio] || 0) + 1;
      }
      if (Array.isArray(r.metodos_preparacion)) {
        r.metodos_preparacion.forEach((m: string) => {
          cMets[m] = (cMets[m] || 0) + 1;
        });
      }
    });

    return {
      categorias: Object.keys(cCats).sort((a, b) => a.localeCompare(b, 'es')),
      anios: Object.keys(cAnios).sort((a, b) => Number(b) - Number(a)),
      conteoCategorias: cCats,
      conteoDificultades: cDifs,
      conteoAnios: cAnios,
      conteoMetodos: cMets,
    };
  }, [recetas]);

  // 4. Filtrado múltiple y ordenación
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
          filtros.categoriasActivas.length === 0 ||
          filtros.categoriasActivas.includes(receta.categoria);

        const coincideDificultad =
          filtros.dificultadesActivas.length === 0 ||
          filtros.dificultadesActivas.includes(receta.dificultad);

        const anioReceta = receta.fecha ? new Date(receta.fecha).getFullYear().toString() : '';
        const coincideAnio =
          filtros.aniosActivos.length === 0 || filtros.aniosActivos.includes(anioReceta);

        const coincideMetodo =
          filtros.metodosActivos.length === 0 ||
          receta.metodos_preparacion?.some((m: string) => filtros.metodosActivos.includes(m));

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
  };
}