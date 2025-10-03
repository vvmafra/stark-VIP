declare module 'qrcode' {
  export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export interface QRCodeToCanvasOptions extends QRCodeOptions {
    canvas?: HTMLCanvasElement;
  }

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<void>;

  export function toString(text: string, options?: QRCodeOptions): Promise<string>;
  export function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
}
