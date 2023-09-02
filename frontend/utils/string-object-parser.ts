export function parseStringToObject(entryString: string) {
  const entries = entryString.split("&");
  let dict: Record<string, string> = {};
  entries.forEach((entry) => {
    const [key, value] = entry.split("=");
    dict[key] = value;
  });
  return dict;
}
