/** Só os dígitos, sem o +55 e limitados a DDD + número (11 dígitos). */
export function digitosTelefone(valor: string): string {
  let digitos = valor.replace(/\D/g, "");
  if (digitos.length > 11 && digitos.startsWith("55")) digitos = digitos.slice(2);
  return digitos.slice(0, 11);
}

/** Máscara progressiva: (13) 98214-6166 para celular, (13) 3214-6166 para fixo. */
export function mascaraTelefone(valor: string): string {
  const d = digitosTelefone(valor);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  const corte = d.length === 11 ? 5 : 4;
  if (numero.length <= corte) return `(${ddd}) ${numero}`;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

/**
 * Valida um telefone brasileiro: DDD de 11 a 99 e 8 dígitos (fixo, começando
 * por 2 a 5) ou 9 dígitos (celular, começando por 9).
 */
export function telefoneValido(valor: string): boolean {
  const d = digitosTelefone(valor);
  if (!/^[1-9][1-9]/.test(d)) return false;
  if (d.length === 11) return d[2] === "9";
  if (d.length === 10) return /[2-5]/.test(d[2]);
  return false;
}
