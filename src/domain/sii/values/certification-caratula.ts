import { Issuer } from '../../dte/entities/issuer.entity.js';
import { FiscalValidationError } from '../../dte/errors/fiscal-domain.error.js';
import { SiiEnvironment } from './sii-domain.types.js';

export interface CaratulaResolucion {
  fchResol: string;
  nroResol: number;
}

/**
 * Valores de carátula que el SII exige en el ambiente de certificación.
 *
 * En certificación el emisor aún no tiene resolución propia: el SII rechaza
 * el sobre EnvioDTE si la carátula trae el número/fecha de una resolución
 * real. Los valores oficiales del set de pruebas son nroResol = 0 y
 * fchResol = "2014-08-22".
 */
export const CERTIFICATION_FCH_RESOL = '2014-08-22';
export const CERTIFICATION_NRO_RESOL = 0;

/**
 * Resuelve los valores de resolución (fchResol / nroResol) que debe llevar
 * la carátula del EnvioDTE según el ambiente SII.
 *
 * - CERTIFICATION: siempre usa los valores oficiales de certificación,
 *   aunque el emisor tenga configurada una resolución real. Esto evita el
 *   rechazo de carátula (hito C1) por configurar la resolución real antes
 *   de estar certificado.
 * - PRODUCTION: usa la resolución configurada del emisor; si no está
 *   configurada, falla antes de consumir folio.
 */
export function resolveCaratulaResolucion(
  environment: SiiEnvironment,
  emisor: Issuer
): CaratulaResolucion {
  if (environment === 'CERTIFICATION') {
    return {
      fchResol: CERTIFICATION_FCH_RESOL,
      nroResol: CERTIFICATION_NRO_RESOL
    };
  }

  const fchResol = emisor.fchResol;
  const nroResol = emisor.nroResol;
  if (fchResol === undefined || nroResol === undefined) {
    throw new FiscalValidationError(
      'En producción el emisor debe tener configurados fchResol y nroResol (resolución de autorización de facturación electrónica) antes de emitir. Configúrelos vía PUT /tenants/issuer.'
    );
  }

  return { fchResol, nroResol };
}
