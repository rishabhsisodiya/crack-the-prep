/**
 * - lazy-load + async-decode every markdown <img>
 * - prefix base-relative note images ("/notes-img/..") with the site base,
 *   and root-relative note links ("/javascript/..") with the site base,
 *   since markdown does not get Astro's automatic base handling.
 */
export default function rehypeImgAttrs({ base = '/' } = {}) {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  return (tree) => walk(tree, prefix);
}

function walk(node, prefix) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'element' && node.tagName === 'img') {
    node.properties = node.properties || {};
    if (node.properties.loading == null) node.properties.loading = 'lazy';
    if (node.properties.decoding == null) node.properties.decoding = 'async';
    const src = node.properties.src;
    if (typeof src === 'string' && src.startsWith('/notes-img/')) {
      node.properties.src = prefix + src;
    }
  }
  // root-relative links between notes ("/javascript/05-closure/") also need the base
  if (node.type === 'element' && node.tagName === 'a') {
    const href = node.properties?.href;
    if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(prefix + '/')) {
      // older notes link as "/prep/<track>/..."; strip that so it isn't doubled
      node.properties.href = prefix + (href.startsWith('/prep/') ? href.slice('/prep'.length) : href);
    }
  }
  if (Array.isArray(node.children)) for (const c of node.children) walk(c, prefix);
}
