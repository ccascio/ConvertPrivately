export function encodeUrl(input: string, component = true): string {
  return component ? encodeURIComponent(input) : encodeURI(input);
}

export function decodeUrl(input: string, component = true): string {
  return component ? decodeURIComponent(input) : decodeURI(input);
}
