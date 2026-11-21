import { defineConfig } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  // Estos IDs los rellenaremos cuando vayamos a subir la web a Netlify
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images", // Guarda las fotos directamente en public/images
      publicFolder: "public",
    },
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || "local-search-token",
      stopwordLanguages: ["spa"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },
  // Aquí definimos la estructura de la base de datos
  schema: {
    collections: [
      {
        name: "receta",
        label: "Recetas",
        path: "content/recetas",
        format: "mdx",
        ui: {
          filename: {
            readonly: true, // Bloquea la edición manual para forzar esta regla
            slugify: (valores) => {
              if (valores?.titulo) {
                return valores.titulo
                  .toLowerCase() // 1. Pasamos todo a minúsculas
                  .normalize("NFD") // 2. Separamos las letras de sus tildes
                  .replace(/[\u0300-\u036f]/g, "") // 3. Eliminamos los acentos sueltos
                  .replace(/[^a-z0-9]+/g, "-") // 4. Cambiar espacios por guiones
                  .replace(/(^-|-$)+/g, ""); // 5. Quitar guiones sobrantes a los lados
              }
              return "nueva-receta";
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "titulo",
            label: "Título de la receta",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "fecha",
            label: "Fecha de la receta",
            required: true,
          },
          {
            type: "string",
            name: "tiempo",
            label: "Tiempo de preparación",
            required: true,
          },
          {
            type: "string",
            name: "dificultad",
            label: "Dificultad",
            options: ["Fácil", "Media", "Alta"],
            required: true,
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoría principal",
            options: [
              { value: "Aperitivos y Canapés", label: "Aperitivos y Canapés" }, 
              { value: "Arroces y Pastas", label: "Arroces y Pastas" }, 
              { value: "Bizcochos", label: "Bizcochos" },
              { value: "Carnes y Pescados", label: "Carnes y Pescados" },
              { value: "Galletas", label: "Galletas" },
              { value: "Helados y sorbetes", label: "Helados y sorbetes" },
              { value: "Magdalenas y Bollería", label: "Magdalenas y Bollería" },
              { value: "Masas y Básicos", label: "Masas y Básicos" },
              { value: "Platos Salados", label: "Platos Salados" }, 
              { value: "Postres de Cuchara", label: "Postres de Cuchara" }, 
              { value: "Recetas Infantiles", label: "Recetas Infantiles" },
              { value: "Salsas", label: "Salsas" },
              { value: "Tartas y Pasteles", label: "Tartas y Pasteles" },
              { value: "Verduras y Legumbres", label: "Verduras y Legumbres" },
            ],
            required: true,
          },
          {
            type: "boolean",
            name: "favorita",
            label: "¿Es de las que más nos gustan?",
          },
          {
            type: "string",
            name: "metodos_preparacion",
            label: "Métodos de preparación",
            list: true,
            options: [
              { value: "Thermomix", label: "Thermomix" },
              { value: "Horno", label: "Horno" },
              { value: "Sin horno", label: "Sin horno" },
              { value: "Freidora de aire", label: "Freidora de aire" },
              { value: "Microondas", label: "Microondas" },
              { value: "Navidad", label: "Navidad" }
            ],
          },
          {
            type: "image",
            name: "imagen",
            label: "Foto principal (Portada)",
            required: false,
          },
          {
            type: "string",
            name: "ingredientes",
            label: "Ingredientes",
            list: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "pasos",
            label: "Elaboración Tradicional",
            isBody: true, 
          },
          {
            type: "rich-text",
            name: "pasos_thermomix",
            label: "Elaboración con Thermomix",
          },
          {
          type: "string",
          name: "url_inspiracion",
          label: "URL de inspiración (Opcional)",
          list: true,
          },
        ],
      },
    ],
  },
});