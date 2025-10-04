/**
 * Valida os dados de prova recebidos do frontend
 * @param {Object} data - Dados recebidos
 * @returns {Object} Resultado da validação
 */
export function validateProofData(data) {
  const errors = [];

  // Verificar se os dados existem
  if (!data) {
    errors.push('Dados não fornecidos');
    return { isValid: false, errors };
  }

  // Verificar proof
  if (!data.proof) {
    errors.push('Campo "proof" é obrigatório');
  } else if (!Array.isArray(data.proof) && !(data.proof instanceof Uint8Array)) {
    errors.push('Campo "proof" deve ser um array ou Uint8Array');
  } else if (data.proof.length === 0) {
    errors.push('Campo "proof" não pode estar vazio');
  }

  // Verificar publicInputs (opcional, mas se presente deve ser array)
  if (data.publicInputs !== undefined) {
    if (!Array.isArray(data.publicInputs)) {
      errors.push('Campo "publicInputs" deve ser um array');
    }
  }

  // Verificar verificationKey
  if (!data.verificationKey) {
    errors.push('Campo "verificationKey" é obrigatório');
  } else if (!Array.isArray(data.verificationKey) && !(data.verificationKey instanceof Uint8Array)) {
    errors.push('Campo "verificationKey" deve ser um array ou Uint8Array');
  } else if (data.verificationKey.length === 0) {
    errors.push('Campo "verificationKey" não pode estar vazio');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida dados de prova em formato base64
 * @param {Object} data - Dados em base64
 * @returns {Object} Resultado da validação
 */
export function validateBase64ProofData(data) {
  const errors = [];

  if (!data) {
    errors.push('Dados não fornecidos');
    return { isValid: false, errors };
  }

  if (!data.proofB64) {
    errors.push('Campo "proofB64" é obrigatório');
  } else if (typeof data.proofB64 !== 'string') {
    errors.push('Campo "proofB64" deve ser uma string');
  } else if (!isValidBase64(data.proofB64)) {
    errors.push('Campo "proofB64" deve ser uma string base64 válida');
  }

  if (!data.verificationKeyB64) {
    errors.push('Campo "verificationKeyB64" é obrigatório');
  } else if (typeof data.verificationKeyB64 !== 'string') {
    errors.push('Campo "verificationKeyB64" deve ser uma string');
  } else if (!isValidBase64(data.verificationKeyB64)) {
    errors.push('Campo "verificationKeyB64" deve ser uma string base64 válida');
  }

  if (data.publicInputs !== undefined && !Array.isArray(data.publicInputs)) {
    errors.push('Campo "publicInputs" deve ser um array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Verifica se uma string é base64 válida
 * @param {string} str - String para verificar
 * @returns {boolean} True se for base64 válida
 */
function isValidBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

/**
 * Converte array de números para Uint8Array
 * @param {Array} arr - Array de números
 * @returns {Uint8Array} Uint8Array convertido
 */
export function arrayToUint8Array(arr) {
  if (arr instanceof Uint8Array) {
    return arr;
  }
  
  if (Array.isArray(arr)) {
    return new Uint8Array(arr);
  }
  
  throw new Error('Dados não podem ser convertidos para Uint8Array');
}

/**
 * Converte Uint8Array para array de números
 * @param {Uint8Array} uint8Array - Uint8Array para converter
 * @returns {Array} Array de números
 */
export function uint8ArrayToArray(uint8Array) {
  if (Array.isArray(uint8Array)) {
    return uint8Array;
  }
  
  if (uint8Array instanceof Uint8Array) {
    return Array.from(uint8Array);
  }
  
  throw new Error('Dados não podem ser convertidos para array');
}