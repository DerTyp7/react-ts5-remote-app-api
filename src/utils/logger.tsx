export interface ILogger {
  enabled: boolean;
  log(message: string, data?: object | null): void;
  warn(message: string, data?: object | null): void;
  error(message: string, data?: object | null): void;
  wsReceived(data: object, message?: string | undefined): void;
  wsSent(data: object, message?: string | undefined): void;
  ts(message: string, data?: object | null): void;
}

export default class Logger implements ILogger {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  // Log message to the console
  public log(message: string, data: object | null = null): void {
    if (!this.enabled) return;
    console.log(`[Log] %c${message}`.trim(), "color: gray", data ?? "");
  }

  // Log warning to the console
  public warn(message: string, data: object | null = null): void {
    if (!this.enabled) return;
    console.warn(`%c${message}`.trim(), data ?? "");
  }

  // Log error to the console
  public error(message: string, data: object | null = null): void {
    if (!this.enabled) return;
    console.error(`%c${message}`.trim(), data ?? "");
  }

  // Log message received from the websocket to the console
  public wsReceived(data: object, message: string | undefined = undefined): void {
    if (!this.enabled) return;
    console.log(`%c[WS Recieved] ${message ?? ""}`.trim(), "color: #8258c7", data);
  }

  // Log message sent to the websocket to the console
  public wsSent(data: object, message: string | undefined = undefined): void {
    if (!this.enabled) return;
    console.log(`%c[WS Sent] ${message ?? ""}`.trim(), "color: #4eb570", data);
  }

  // Log message to the console with a timestamp
  public ts(message: string, data: object | null = null): void {
    if (!this.enabled) return;
    console.log(`%c[TS] ${message}`.trim(), "color: #2e6bc7", data ?? "");
  }
}
