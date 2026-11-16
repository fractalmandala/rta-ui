import { cn } from './cn.js';

// Prop merging for composed elements. Later arguments win, except for the keys that must
// combine instead: classes concatenate, styles merge, event handlers chain, and `data-ownedby`
// unions its ids. Symbol keys (Svelte attachments, including the ref attachment added by
// Element) are copied as a whole, as an attachment cannot be merged.
type AnyProps = Record<PropertyKey, any>;

const cssDeclaration = /((?:--)?(?:\w+-?)+)\s*:\s*([\s\S]*)/;

function serializeStyle(style: string) {
  const declarations: Record<string, string> = {};
  let start = 0;
  let depth = 0;
  let quote = '';
  let inComment = false;

  const add = (declaration: string) => {
    const match = cssDeclaration.exec(declaration);
    if (match) declarations[match[1]] = match[2];
  };

  for (let i = 0; i < style.length; i++) {
    const char = style[i];
    if (inComment) {
      if (char === '*' && style[i + 1] === '/') {
        inComment = false;
        i++;
      }
    } else if (quote) {
      if (char === '\\') i++;
      if (char === quote) quote = '';
    } else if (char === '\\') i++;
    else if (char === '/' && style[i + 1] === '*') {
      inComment = true;
      i++;
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '(') depth++;
    else if (char === ')' && depth) depth--;
    else if (char === ';' && !depth) {
      add(style.slice(start, i));
      start = i + 1;
    }
  }

  add(style.slice(start));
  return declarations;
}

// Returns `base` untouched when the consumer adds nothing, so generated style strings keep their
// exact serialization; otherwise consumer declarations are appended and win per property.
export function mergeStyleDeclarations(base: unknown, extra: unknown): string | undefined {
  const additive = typeof extra === 'string' ? extra.trim() : '';
  if (!additive) return typeof base === 'string' ? base : undefined;
  const merged = mergeStyle(base, extra);
  return merged ? `${merged};` : merged;
}

function mergeStyle(a: unknown, b: unknown): string | undefined {
  const left = typeof a === 'string' ? serializeStyle(a) : ((a as AnyProps | undefined) ?? {});
  const right = typeof b === 'string' ? serializeStyle(b) : ((b as AnyProps | undefined) ?? {});
  const declarations = Object.entries({ ...left, ...right }).filter(([, value]) => value != null);
  if (!declarations.length) return undefined;
  return declarations.map(([name, value]) => `${name}: ${value}`).join('; ');
}

function ownedBy(...values: unknown[]): string {
  const ids = values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)
    .flatMap((value) => value.split(/\s+/).filter(Boolean));
  return Array.from(new Set(ids)).join(' ');
}

function callAll(first: (...args: any[]) => void, second: (...args: any[]) => void) {
  return (...args: any[]) => {
    first(...args);
    second(...args);
  };
}

export function mergeProps(...sources: (AnyProps | undefined | null)[]): AnyProps {
  const result: AnyProps = {};

  for (const props of sources) {
    if (!props) continue;

    for (const key in result) {
      const incoming = props[key];
      if (incoming === undefined) continue;

      if (key.startsWith('on') && typeof result[key] === 'function' && typeof incoming === 'function') {
        result[key] = callAll(incoming, result[key]);
      } else if (key === 'class' || key === 'className') {
        result[key] = cn(result[key], incoming);
      } else if (key === 'style') {
        result[key] = mergeStyle(result[key], incoming);
      } else if (key === 'data-ownedby') {
        result[key] = ownedBy(result[key], incoming);
      } else {
        result[key] = incoming;
      }
    }

    for (const key in props) {
      if (result[key] === undefined) result[key] = props[key];
    }

    for (const symbol of Object.getOwnPropertySymbols(props)) result[symbol] = props[symbol];
  }

  return result;
}
