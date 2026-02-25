const S3_BUCKET_URL = "https://mentormind-qtech.s3.us-east-1.amazonaws.com";
const S3_BUCKET_URL_ALT = "https://mentormind-qtech.s3.amazonaws.com";

// transformar una URL de S3 o CloudFront a una ruta local para el CDN
export const transformS3ToCdn = (s3Url: string | null | undefined): string => {
  if (!s3Url) return "";

  // Si ya es una ruta local de CDN, retornar tal cual
  if (s3Url.startsWith("/cdn/")) {
    return s3Url;
  }

  // Si ya es una URL de CloudFront, convertir a ruta local
  if (s3Url.includes("cdn.mentormind.com.pe")) {
    const path = s3Url.replace("https://cdn.mentormind.com.pe", "");
    return `/cdn${path}`;
  }

  // Si es una URL de S3, extraer el path y convertir a ruta local
  if (s3Url.startsWith(S3_BUCKET_URL)) {
    const path = s3Url.replace(S3_BUCKET_URL, "");
    return `/cdn${path}`;
  }

  if (s3Url.startsWith(S3_BUCKET_URL_ALT)) {
    const path = s3Url.replace(S3_BUCKET_URL_ALT, "");
    return `/cdn${path}`;
  }

  // Si es solo un path relativo (trainings/scorm/...), agregar prefijo
  if (s3Url.startsWith("trainings/")) {
    return `/cdn/${s3Url}`;
  }

  // Si no coincide con ningún patrón conocido, retornar como está
  return s3Url;
};

// obtenemos la URL procesada para el reproductor SCORM
export const getScormPlayerUrl = (
  contentUrl: string | null | undefined,
  contentType: string,
): string => {
  if (!contentUrl) return "";

  // Para SCORM, siempre usar ruta local para evitar problemas de Same-Origin
  if (contentType === "scorm" || contentUrl.includes("/trainings/scorm/")) {
    return transformS3ToCdn(contentUrl);
  }

  // Para otros tipos de contenido, también usar CDN para mejor performance
  if (contentUrl.includes("mentormind-qtech.s3")) {
    return transformS3ToCdn(contentUrl);
  }

  return contentUrl;
};

// obtenemos la URL final para cargar el contenido
export const getContentUrl = (
  contentUrl: string | null | undefined,
  contentType: string,
): string => {
  if (!contentUrl) return "";

  // Siempre usar CDN para contenido almacenado en S3
  if (
    contentUrl.includes("mentormind-qtech.s3") ||
    contentUrl.includes("cdn.mentormind.com.pe")
  ) {
    return transformS3ToCdn(contentUrl);
  }

  return contentUrl;
};
