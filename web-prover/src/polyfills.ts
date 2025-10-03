import { Buffer } from 'buffer';

// Polyfill global para Buffer e outras APIs do Node.js
(globalThis as any).global = globalThis;
(globalThis as any).Buffer = Buffer;

// Garantir que Buffer está disponível globalmente
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export {};
