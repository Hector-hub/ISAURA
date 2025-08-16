import { faker } from "@faker-js/faker";
import { Alert } from "../store/slices/alertsSlice";

// Datos reales estáticos de redes sociales
const realAlertsData = [
  {
    post_id: "1953815937972404231",
    date: "Sun, 02 Feb 2025 18:15:00 GMT",
    author: "@CarmenO26657205",
    content:
      "Paso elevado entre Av. Winston Churchill y Av. John F. Kennedy severamente agrietado. Riesgo de falla estructural inminente. ¡Jet Set necesita otro préstamo para el desastre! #InfraestructuraEnRiesgo #SantoDomingo",
    location: { lat: 18.482447, lng: -69.945985 },
    link: "https://x.com/CarmenO26657205/status/1953815937972404231",
    tag: "[suceso actual]",
    description:
      "La imagen muestra un paso elevado severamente agrietado que conecta la Avenida Winston Churchill y la Avenida John F. Kennedy en Santo Domingo, República Dominicana, destacando los riesgos potenciales de falla estructural, una preocupación respaldada por un estudio de 2023 de la Universidad de Puerto Rico que encontró que el 15% de la infraestructura del Caribe está en riesgo debido al mantenimiento inadecuado y la actividad sísmica. La mención sarcástica del post sobre 'Jet Set' y 'otro préstamo para el desastre' alude a escándalos históricos de corrupción, como el caso de sobornos de Lockheed en los años 70 donde los préstamos gubernamentales enmascaraban la mala gestión, sugiriendo escepticismo público sobre el mal uso de fondos en reparaciones de infraestructura. Los datos de transporte local de Moovit indican que esta sección elevada es un centro crítico de rutas de autobús, sirviendo líneas como 100B y 47, lo que implica que su deterioro podría interrumpir los desplazamientos diarios de miles de personas, amplificando la urgencia del problema.",
  },
  {
    post_id: "1910293459056947325",
    date: "Fri, 13 Apr 2024 13:45:00 GMT",
    author: "@HazimNoelia",
    content:
      "El Puente Francisco del Rosario Sánchez (Puente de la 17) está en condición crítica, con deterioro visible que genera temores de colapso. ¡Acción urgente necesaria! #SantoDomingo #Colapso",
    location: { lat: 18.5071711, lng: -69.8820031 },
    link: "https://x.com/HazimNoelia/status/1910293459056947325",
    tag: "[alerta predictiva]",
    description:
      "Esta publicación de Noelia Hazim destaca el grave deterioro del Puente Francisco del Rosario Sánchez (Puente de la 17), una infraestructura vital en Santo Domingo desde su inauguración en 1973. Subraya las crecientes preocupaciones entre periodistas y figuras públicas sobre el posible colapso del puente, especialmente dada las fallas recientes en infraestructuras en la República Dominicana. La publicación sirve como un llamado a la acción para que las autoridades aborden el problema con urgencia, reflejando desafíos más amplios en el mantenimiento de infraestructuras y la seguridad pública, como se menciona en medios locales y informes del Departamento de Estado de EE.UU.",
  },
  {
    post_id: "1726016330627756325",
    date: "Sat, 18 Nov 2023 15:30:00 GMT",
    author: "@ArosNews2",
    content:
      "Inundación severa en la Avenida Monumental cerca de Los Girasoles I. Motociclista luchando, autos arrastrados. ¡Caos! #Inundacion #SantoDomingo",
    location: { lat: 18.52, lng: -69.92 },
    link: "https://x.com/ArosNews2/status/1726016330627756325",
    tag: "[evento histórico]",
    description:
      "La publicación de José Abreu captura una inundación urbana severa ocurrida en noviembre de 2023 en la Avenida Monumental cerca de Los Girasoles I en Santo Domingo. Este evento histórico muestra la vulnerabilidad recurrente del área a inundaciones durante lluvias intensas, sirviendo como referencia para el monitoreo de patrones de riesgo en la zona y la planificación de respuestas futuras.",
  },
  {
    post_id: "1726009333199090154",
    date: "Sat, 18 Nov 2023 15:02:15 GMT",
    author: "@kathernandez",
    content:
      "¡Caos por inundaciones en Santo Domingo! Calles bajo el agua, tráfico paralizado en múltiples avenidas. #Inundacion #SantoDomingo",
    location: { lat: 18.4861, lng: -69.9312 },
    link: "https://x.com/kathernandez/status/1726009333199090154",
    tag: "[evento histórico]",
    description:
      "Esta publicación de kathernandez documenta las inundaciones generalizadas que afectaron Santo Domingo en noviembre de 2023. Este registro histórico es valioso para el análisis de patrones de inundación en el área metropolitana y para la validación de modelos predictivos de riesgo de inundación en la región.",
  },
  {
    post_id: "1726011359450521983",
    date: "Sat, 18 Nov 2023 15:10:20 GMT",
    author: "@lasose2002",
    content:
      "¡Avenida Monumental completamente inundada! Imposible pasar cerca de Los Girasoles. #Inundacion #GranSantoDomingo",
    location: { lat: 18.52, lng: -69.92 },
    link: "https://x.com/lasose2002/status/1726011359450521983",
    tag: "[evento histórico]",
    description:
      "La publicación de lasose2002 documenta las severas inundaciones de noviembre de 2023 en la Avenida Monumental cerca de Los Girasoles. Este registro histórico complementa otros reportes del mismo evento, proporcionando evidencia importante para el análisis de vulnerabilidad y la mejora de sistemas de alerta temprana en la zona.",
  },
  {
    post_id: "1726008717055856781",
    date: "Sat, 18 Nov 2023 14:59:50 GMT",
    author: "@JuniorPeralta3",
    content:
      "¡Aguas inundando Santo Domingo Este! Calles como Avenida San Vicente de Paúl son un desastre. #Inundacion #SantoDomingo",
    location: { lat: 18.5029, lng: -69.8547 },
    link: "https://x.com/JuniorPeralta3/status/1726008717055856781",
    tag: "[evento histórico]",
    description:
      "La publicación de Junior Peralta documenta las inundaciones severas que afectaron Santo Domingo Este en noviembre de 2023, específicamente en la Avenida San Vicente de Paúl. Este registro histórico es útil para el análisis de vulnerabilidad en diferentes sectores de la ciudad y para la planificación de infraestructura resiliente.",
  },
  {
    post_id: "1725998576965169474",
    date: "Sat, 18 Nov 2023 14:19:30 GMT",
    author: "@LeonardoJaquez",
    content:
      "¡Santo Domingo bajo el agua! Inundaciones reportadas en múltiples sectores, tráfico detenido. #Inundacion #SDQ",
    location: { lat: 18.4861, lng: -69.9312 },
    link: "https://x.com/LeonardoJaquez/status/1725998576965169474",
    tag: "[evento histórico]",
    description:
      "La publicación de Leonardo Jaquez documenta las inundaciones generalizadas que afectaron múltiples sectores de Santo Domingo en noviembre de 2023. Este evento histórico sirve como referencia importante para la evaluación de riesgos y el desarrollo de estrategias de mitigación para eventos similares futuros.",
  },
];

// Santo Domingo coordinates and districts para heatmap y datos históricos
const santoDoringoDistricts = [
  { name: "Distrito Nacional", lat: 18.4861, lng: -69.9312 },
  { name: "Santo Domingo Norte", lat: 18.5144, lng: -69.8977 },
  { name: "Santo Domingo Este", lat: 18.4888, lng: -69.8571 },
  { name: "Santo Domingo Oeste", lat: 18.4701, lng: -70.0076 },
  { name: "Los Alcarrizos", lat: 18.4984, lng: -70.0021 },
  { name: "Pedro Brand", lat: 18.5644, lng: -70.0087 },
];

// Función para determinar el tipo de alerta basado en el contenido
const determineAlertType = (content: string): Alert["type"] => {
  const contentLower = content.toLowerCase();

  if (
    contentLower.includes("inundación") ||
    contentLower.includes("agua") ||
    contentLower.includes("inundacion")
  ) {
    return "flood";
  }
  if (
    contentLower.includes("colapso") ||
    contentLower.includes("puente") ||
    contentLower.includes("estructura")
  ) {
    return "collapse";
  }
  if (contentLower.includes("incendio") || contentLower.includes("fuego")) {
    return "fire";
  }
  if (contentLower.includes("sismo") || contentLower.includes("terremoto")) {
    return "earthquake";
  }

  return "incident"; // por defecto
};

// Función para determinar la severidad
const determineSeverity = (content: string, tag: string): Alert["severity"] => {
  const contentLower = content.toLowerCase();

  if (tag === "[alerta predictiva]") {
    return "high"; // alertas predictivas son importantes
  }

  if (tag === "[evento histórico]") {
    return "medium"; // eventos históricos tienen severidad media para referencia
  }

  if (
    contentLower.includes("severa") ||
    contentLower.includes("crítica") ||
    contentLower.includes("caos") ||
    contentLower.includes("urgente")
  ) {
    return "critical";
  }
  if (
    contentLower.includes("imposible") ||
    contentLower.includes("paralizado") ||
    contentLower.includes("desastre")
  ) {
    return "high";
  }

  return "medium"; // por defecto para sucesos actuales
};

// Función para determinar el status
const determineStatus = (tag: string): Alert["status"] => {
  if (tag === "[alerta predictiva]") {
    return "investigating";
  }
  if (tag === "[evento histórico]") {
    return "resolved"; // eventos pasados están resueltos
  }
  return "active"; // sucesos actuales están activos
};

// Función para extraer ubicación aproximada del contenido
const extractLocation = (content: string) => {
  const contentLower = content.toLowerCase();

  // Extraer nombres de lugares mencionados
  if (contentLower.includes("avenida monumental")) {
    return { address: "Avenida Monumental", district: "Santo Domingo Norte" };
  }
  if (contentLower.includes("los girasoles")) {
    return { address: "Los Girasoles I", district: "Santo Domingo Norte" };
  }
  if (contentLower.includes("san vicente de paúl")) {
    return {
      address: "Avenida San Vicente de Paúl",
      district: "Santo Domingo Este",
    };
  }
  if (contentLower.includes("puente") && contentLower.includes("17")) {
    return {
      address: "Puente Francisco del Rosario Sánchez (Puente de la 17)",
      district: "Distrito Nacional",
    };
  }

  return { address: "Centro de Santo Domingo", district: "Distrito Nacional" };
};

export const generateMockAlerts = (count: number = 20): Alert[] => {
  // Convertir datos reales al formato de Alert
  const realAlerts: Alert[] = realAlertsData.map((item) => {
    const alertType = determineAlertType(item.content);
    const severity = determineSeverity(item.content, item.tag);
    const status = determineStatus(item.tag);
    const locationInfo = extractLocation(item.content);

    return {
      id: item.post_id,
      type: alertType,
      severity,
      title: item.content, // El contenido del post como título
      description: item.description,
      location: {
        lat: item.location.lat,
        lng: item.location.lng,
        address: locationInfo.address,
        district: locationInfo.district,
      },
      timestamp: new Date(item.date).toISOString(),
      status,
      author: item.author,
      link: item.link,
      tag: item.tag,
      content: item.content,
    };
  });

  // Retornar solo los datos reales, limitados por el count
  return realAlerts.slice(0, Math.min(count, realAlerts.length));
};

export const generateHeatmapData = () => {
  const data = [];

  for (let i = 0; i < 100; i++) {
    const district = faker.helpers.arrayElement(santoDoringoDistricts);
    const lat = district.lat + (faker.number.float() - 0.5) * 0.1;
    const lng = district.lng + (faker.number.float() - 0.5) * 0.1;

    data.push({
      lat,
      lng,
      intensity: faker.number.float({ min: 0.1, max: 1 }),
    });
  }

  return data;
};

export const generateHistoricalData = () => {
  const data = [];
  const types = ["flood", "collapse", "incident", "fire", "earthquake"];

  for (let i = 0; i < 30; i++) {
    const date = faker.date.past({ years: 1 });
    data.push({
      date: date.toISOString().split("T")[0],
      ...types.reduce(
        (acc, type) => ({
          ...acc,
          [type]: faker.number.int({ min: 0, max: 10 }),
        }),
        {}
      ),
      total: faker.number.int({ min: 5, max: 30 }),
    });
  }

  return data.sort((a, b) => a.date.localeCompare(b.date));
};
