export class InvalidImageFormatError extends Error {
  constructor() {
    super("Format Image tidak sesuai");
    this.name = "InvalidImageFormatError";
  }
}
