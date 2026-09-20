/**
 * Turn  <p><img></p>  followed by  <p><em>caption</em></p>
 * into  <figure><img><figcaption>caption</figcaption></figure>.
 * The converter emits the italic caption line (see captionImages()).
 */
export default function rehypeFigure() {
  return (tree) => visit(tree);
}

function isImgPara(node) {
  return (
    node?.type === 'element' &&
    node.tagName === 'p' &&
    node.children?.filter((c) => !(c.type === 'text' && !c.value.trim())).every((c) => c.type === 'element' && c.tagName === 'img') &&
    node.children.some((c) => c.type === 'element' && c.tagName === 'img')
  );
}

function isEmPara(node) {
  const kids = node?.children?.filter((c) => !(c.type === 'text' && !c.value.trim()));
  return (
    node?.type === 'element' &&
    node.tagName === 'p' &&
    kids?.length === 1 &&
    kids[0].type === 'element' &&
    kids[0].tagName === 'em'
  );
}

function visit(node) {
  const kids = node.children;
  if (!Array.isArray(kids)) return;
  for (let i = 0; i < kids.length; i++) {
    const cur = kids[i];
    if (isImgPara(cur)) {
      const next = kids[i + 1];
      const imgs = cur.children.filter((c) => c.type === 'element' && c.tagName === 'img');
      const figure = { type: 'element', tagName: 'figure', properties: { className: ['note-figure'] }, children: [...imgs] };
      if (isEmPara(next)) {
        figure.children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: next.children.find((c) => c.tagName === 'em').children,
        });
        kids.splice(i, 2, figure);
      } else {
        kids.splice(i, 1, figure);
      }
      continue;
    }
    visit(cur);
  }
}
