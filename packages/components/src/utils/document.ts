export function getDocument(): Document {
  if (typeof document === 'undefined') {
    return null as any;
  }
  return document;
}
