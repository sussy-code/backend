export class StatusError extends Error {
  errorStatusCode: number;

  constructor(message: string, code: number) {
    super(message);
    this.errorStatusCode = code;
    this.message = message;
  }
}
