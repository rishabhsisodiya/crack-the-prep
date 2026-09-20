/**
 * GitHub-style callouts:  > [!NOTE] / [!TIP] / [!WARNING] / [!IMPORTANT] / [!CAUTION]
 * Turns a leading `[!TYPE]` line inside a blockquote into a styled <aside>.
 * Works in .md and .mdx.
 */
const TYPES = {
  NOTE: { label: 'Note', cls: 'note' },
  TIP: { label: 'Tip', cls: 'tip' },
  IMPORTANT: { label: 'Important', cls: 'important' },
  WARNING: { label: 'Warning', cls: 'warning' },
  CAUTION: { label: 'Caution', cls: 'caution' },
};

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;
      const firstText = first.children[0];
      if (!firstText || firstText.type !== 'text') return;

      const m = firstText.value.match(/^\[!(\w+)\]\s*(.*)$/s);
      if (!m) return;
      const type = TYPES[m[1].toUpperCase()];
      if (!type) return;

      // strip the marker, keep any trailing text on that line
      firstText.value = m[2];
      if (!firstText.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();

      node.data = node.data || {};
      node.data.hName = 'aside';
      node.data.hProperties = { className: ['callout', `callout--${type.cls}`], 'data-label': type.label };
    });
  };
}

// tiny local unist visitor (avoids adding a dep)
function visit(node, type, fn) {
  if (!node || typeof node !== 'object') return;
  if (node.type === type) fn(node);
  const kids = node.children;
  if (Array.isArray(kids)) for (const k of kids) visit(k, type, fn);
}
