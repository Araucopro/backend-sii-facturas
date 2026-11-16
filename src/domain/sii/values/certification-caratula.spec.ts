import { describe, it, expect } from 'vitest';
import { Issuer } from '../../dte/entities/issuer.entity.js';
import { Rut } from '../../shared/rut.vo.js';
import { FiscalValidationError } from '../../dte/errors/fiscal-domain.error.js';
import {
  resolveCaratulaResolucion,
  CERTIFICATION_FCH_RESOL,
  CERTIFICATION_NRO_RESOL
} from './certification-caratula.js';

const issuerWithRealResolution = Issuer.create({
  rut: Rut.of('76123456-0'),
  razonSocial: 'Empresa Emisora SpA',
  giro: 'Servicios de TI',
  actividadEconomica: 620100,
  direccion: 'Av. Andrés Bello 2777',
  comuna: 'Las Condes',
  fchResol: '2026-09-01',
  nroResol: 80
});

const issuerWithoutResolution = Issuer.create({
  rut: Rut.of('76123456-0'),
  razonSocial: 'Empresa Emisora SpA',
  giro: 'Servicios de TI',
  actividadEconomica: 620100,
  direccion: 'Av. Andrés Bello 2777',
  comuna: 'Las Condes'
});

describe('resolveCaratulaResolucion (hito C1: carátula de certificación)', () => {
  it('en CERTIFICATION usa siempre los valores oficiales aunque el emisor tenga resolución real', () => {
    const result = resolveCaratulaResolucion(
      'CERTIFICATION',
      issuerWithRealResolution
    );

    expect(result).toEqual({
      fchResol: CERTIFICATION_FCH_RESOL,
      nroResol: CERTIFICATION_NRO_RESOL
    });
    expect(result.fchResol).toBe('2014-08-22');
    expect(result.nroResol).toBe(0);
  });

  it('en CERTIFICATION no exige que el emisor tenga resolución configurada', () => {
    const result = resolveCaratulaResolucion(
      'CERTIFICATION',
      issuerWithoutResolution
    );

    expect(result).toEqual({
      fchResol: '2014-08-22',
      nroResol: 0
    });
  });

  it('en PRODUCTION usa la resolución configurada del emisor', () => {
    const result = resolveCaratulaResolucion(
      'PRODUCTION',
      issuerWithRealResolution
    );

    expect(result).toEqual({ fchResol: '2026-09-01', nroResol: 80 });
  });

  it('en PRODUCTION rechaza si el emisor no tiene resolución configurada', () => {
    expect(() =>
      resolveCaratulaResolucion('PRODUCTION', issuerWithoutResolution)
    ).toThrow(FiscalValidationError);
  });
});
