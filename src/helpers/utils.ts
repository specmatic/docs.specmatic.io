export function trimHeredoc(str: string) {
  // Normalize newlines and split into lines
  const lines = str.replace(/\r\n/g, '\n').split('\n');

  // Remove leading and trailing blank lines
  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length === 0) return '';

  // Determine minimum indentation (in characters) among non-empty lines
  const indents = lines
    .filter(line => line.trim().length > 0)
    .map(line => {
      const m = line.match(/^[ \t]*/);
      return m ? m[0].length : 0;
    });

  const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

  // Remove that indentation from every line and return
  return lines.map(line => line.slice(minIndent)).join('\n');
}
