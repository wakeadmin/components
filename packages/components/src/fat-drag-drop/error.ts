export class FatDragRefError extends Error {
  constructor(message: string) {
    super(`[fat-drag error]: ${message}`);
  }
}
