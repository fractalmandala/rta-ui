import type { ClassValue } from 'svelte/elements';

// Class name join for the shapes component props receive: strings, numbers, nested arrays,
// and objects whose truthy keys are emitted. `ClassValue` comes from `svelte/elements` so the
// `class` prop of every component type-checks against it directly.
export function cn(...values: (ClassValue | number | boolean | null | undefined)[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
      out.push(String(value));
      continue;
    }

    if (Array.isArray(value)) {
      const nested = cn(...(value as (ClassValue | number)[]));
      if (nested) out.push(nested);
      continue;
    }

    for (const [name, on] of Object.entries(value)) if (on) out.push(name);
  }

  return out.join(' ');
}

export type { ClassValue };
