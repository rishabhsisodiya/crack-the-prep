/**
 * The practice page's code editor. It starts as the page's plain textarea, so
 * typing works at once, and is swapped for CodeMirror when that has loaded.
 * If CodeMirror cannot load, the textarea simply stays.
 */
import { runOnCtrlEnter } from './runner-client';

export interface CodeEditor {
  getValue(): string;
  setValue(value: string): void;
  focus(): void;
}

interface Handlers {
  /** the reader changed the code */
  onChange: () => void;
  /** Ctrl/⌘ + Enter */
  onRun: () => void;
}

export function textareaEditor(textarea: HTMLTextAreaElement, { onChange, onRun }: Handlers): CodeEditor {
  runOnCtrlEnter(textarea, onRun);
  textarea.addEventListener('input', onChange);
  return {
    getValue: () => textarea.value,
    setValue: (v) => { textarea.value = v; },
    focus: () => textarea.focus(),
  };
}

/** Replace `textarea` with CodeMirror, keeping its current text. Null when CodeMirror fails to load. */
export async function codeMirrorEditor(textarea: HTMLTextAreaElement, { onChange, onRun }: Handlers): Promise<CodeEditor | null> {
  let mods;
  try {
    mods = await Promise.all([
      import('codemirror'),
      import('@codemirror/lang-javascript'),
      import('@codemirror/view'),
      import('@codemirror/commands'),
      import('@codemirror/state'),
      import('@codemirror/language'),
      import('@lezer/highlight'),
    ]);
  } catch {
    return null;
  }
  const [{ EditorView, basicSetup }, { javascript }, { keymap }, { indentWithTab }, { EditorState, Prec }, { HighlightStyle, syntaxHighlighting, indentUnit }, { tags: t }] = mods;

  const run = () => { onRun(); return true; };

  // Colours follow the site's code blocks (Expressive Code, github-dark).
  const theme = EditorView.theme(
    {
      '&': {
        color: '#e6edf3',
        backgroundColor: '#0d1117',
        border: '1px solid var(--navy-line-2)',
        borderRadius: '6px',
        fontSize: '0.8rem',
      },
      '&.cm-focused': { outline: '2px solid var(--cyan)', outlineOffset: '1px' },
      '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.55', minHeight: '16rem', maxHeight: '60vh' },
      '.cm-content': { padding: '0.8rem 0', caretColor: 'var(--cyan)' },
      '.cm-cursor': { borderLeftColor: 'var(--cyan)' },
      '.cm-gutters': { backgroundColor: '#0d1117', color: '#6e7681', border: 'none' },
      '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'rgba(0, 180, 216, 0.06)' },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(0, 180, 216, 0.25)' },
      '.cm-matchingBracket': { backgroundColor: 'rgba(0, 180, 216, 0.25)', outline: 'none' },
      '.cm-tooltip': { backgroundColor: 'var(--navy-card)', border: '1px solid var(--navy-line-2)', color: 'var(--text)' },
      '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: 'rgba(0, 180, 216, 0.2)', color: 'var(--white)' },
      '.cm-panels': { backgroundColor: 'var(--navy-card)', color: 'var(--text)' },
    },
    { dark: true },
  );
  const highlight = HighlightStyle.define([
    { tag: [t.keyword, t.operatorKeyword, t.modifier], color: '#ff7b72' },
    { tag: [t.string, t.special(t.string), t.regexp], color: '#a5d6ff' },
    { tag: [t.number, t.bool, t.null, t.atom], color: '#79c0ff' },
    { tag: [t.comment], color: '#8b949e', fontStyle: 'italic' },
    { tag: [t.function(t.variableName), t.function(t.propertyName), t.className], color: '#d2a8ff' },
    { tag: [t.definition(t.variableName), t.propertyName], color: '#e6edf3' },
    { tag: [t.self], color: '#79c0ff' },
  ]);

  const view = new EditorView({
    doc: textarea.value,
    extensions: [
      Prec.highest(keymap.of([{ key: 'Mod-Enter', run }, { key: 'Ctrl-Enter', run }])),
      basicSetup,
      keymap.of([indentWithTab]),
      javascript(),
      EditorState.tabSize.of(2),
      indentUnit.of('  '),
      theme,
      syntaxHighlighting(highlight),
      EditorView.contentAttributes.of({ 'aria-label': textarea.getAttribute('aria-label') ?? 'Code' }),
      EditorView.updateListener.of((u) => { if (u.docChanged) onChange(); }),
    ],
  });

  const hadFocus = document.activeElement === textarea;
  textarea.before(view.dom);
  textarea.hidden = true;
  if (hadFocus) view.focus();

  return {
    getValue: () => view.state.doc.toString(),
    setValue: (v) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } }),
    focus: () => view.focus(),
  };
}
