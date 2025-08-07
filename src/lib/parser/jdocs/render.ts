// Example of inputs:
// [
//   'hello2',
//   'https://daviddalbusco.com',
//   '{@link hello } – Another related function',
//   '{@link https://github.com/peterpeterparker/tsdoc-markdown Source code}'
// ]
export const inlineReferences = (references: string[]): string[] => {
  const inlineReference = (reference: string): string => {
    const linkMatch = /\{@link\s+([^\s}]+)\s*(?:\s+([^}]+))?\}/.exec(reference);

    if (linkMatch !== null) {
      const [_, target, label] = linkMatch;

      if (target.startsWith('http')) {
        return `* [${label ?? target}](${target})`;
      }

      return `* \`${target.trim()}\`${label ? ` – ${label}` : ''}`;
    }

    if (reference.startsWith('http')) {
      return `* [${reference}](${reference})`;
    }

    return `* ${reference}`;
  };

  return references.map(inlineReference);
};
