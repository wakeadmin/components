export class FatDragDropError extends Error {
  constructor(message: string) {
    super(`[fat-drag error]: ${message}`);
  }
}
