/**
 * Reglas visuales del concepto Campaña y de su excepción por empresa.
 *
 * El concepto global es "Campaña". Rimac (enterprise_id === 2) conserva la
 * denominación "Producto" por acuerdo propio con el cliente.
 *
 * Nota de contrato: el accessor `product` y la clave `product` del JSON de la API
 * NO se renombran. Son contrato público congelado con el backend (spec S7 en
 * educa-web-api/odd/tasks/rename-products-to-campaigns.md). Solo cambia el texto
 * visible de la columna.
 */

export const RIMAC_ENTERPRISE_ID = 2;

/**
 * Etiqueta de la columna de campaña/producto según la empresa que se está listando.
 * Para Rimac devuelve "Producto"; para el resto de empresas, "Campaña".
 *
 * Acepta number o string porque en el frontend los ids de empresa circulan como string.
 */
export const getCampaignLabel = (
  enterpriseId: number | string | null | undefined,
): string =>
  Number(enterpriseId) === RIMAC_ENTERPRISE_ID ? "Producto" : "Campaña";

// Versión en minúscula para interpolar dentro de frases ("la campaña de la empresa").
export const getCampaignLabelLower = (
  enterpriseId: number | string | null | undefined,
): string => getCampaignLabel(enterpriseId).toLowerCase();

// Plural para textos como "No hay campañas para esta empresa".
export const getCampaignLabelPlural = (
  enterpriseId: number | string | null | undefined,
): string =>
  Number(enterpriseId) === RIMAC_ENTERPRISE_ID ? "Productos" : "Campañas";

export const getCampaignLabelPluralLower = (
  enterpriseId: number | string | null | undefined,
): string => getCampaignLabelPlural(enterpriseId).toLowerCase();

// Alias conservado: encabezado de la columna de la tabla de usuarios.
export const getCampaignColumnLabel = getCampaignLabel;
