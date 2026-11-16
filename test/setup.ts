/**
 * Configuración común de la suite de tests (unitarios y E2E).
 *
 * La clave maestra de cifrado de certificados es obligatoria para instanciar
 * EncryptionService (la usa CertificateModule). En los tests se usa el valor
 * dummy público de .env.example SOLO si no hay una configurada en el
 * entorno: nunca se cifra un certificado real con esta clave.
 */
if (!process.env.CERTIFICATE_MASTER_KEY) {
  process.env.CERTIFICATE_MASTER_KEY =
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
}
