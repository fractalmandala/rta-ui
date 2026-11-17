// Generates `docs/components/<family>.md` from the shipped source, so the docs cannot drift from the
// code they describe: parts, props, styling hooks, ids and the behaviours the tests assert are all
// read out of the repository rather than retyped. Run `pnpm docs` after changing any component.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = path.join(root, 'src/lib/components');
const DEMOS = path.join(root, 'src/routes/demos');
const TESTS = path.join(root, 'tests');
const OUT = path.join(root, 'docs/components');
const DOCS_ROOT = path.join(root, 'docs');
const MODUIX_DOCS =
	process.env.RTA_MODUIX_DOCS_DIR ??
	path.resolve(root, '../moduix-main/website/docs/en/docs');
const PARITY_SCRIPT = path.join(root, 'scripts/check-parity.mjs');
const PARITY_REFERENCE =
	process.env.RTA_PARITY_REFERENCE ??
	path.resolve(root, '../moduix-main/packages/svelte/src/components');

const pascal = (family) =>
	family
		.split('-')
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join('');

async function readIfExists(file) {
	try {
		return await readFile(file, 'utf8');
	} catch {
		return null;
	}
}

/** Pulls the `<script module lang="ts">` block, which is where every family declares its props. */
function moduleScript(source) {
	const match = /<script\s+module\s+lang="ts"\s*>([\s\S]*?)<\/script>/.exec(source);
	return match ? match[1] : null;
}

function parseAliases(text) {
	const file = ts.createSourceFile('source.ts', text, ts.ScriptTarget.Latest, true);
	const aliases = new Map();
	for (const statement of file.statements) {
		if (ts.isTypeAliasDeclaration(statement)) {
			aliases.set(statement.name.text, statement.type.getText());
		}
	}
	return aliases;
}

function parseInterfaceSource(text) {
	const file = ts.createSourceFile('source.ts', text, ts.ScriptTarget.Latest, true);
	const interfaces = [];
	for (const statement of file.statements) {
		if (!ts.isInterfaceDeclaration(statement)) continue;
		interfaces.push({
			name: statement.name.text,
			extends: (statement.heritageClauses ?? []).flatMap((clause) =>
				clause.types.map((type) => type.getText())
			),
			members: statement.members.filter(ts.isPropertySignature).map((member) => ({
				name: member.name.getText().replace(/^['"]|['"]$/g, ''),
				type: member.type ? member.type.getText() : 'unknown',
				optional: Boolean(member.questionToken),
				doc: ts
					.getJSDocCommentsAndTags(member)
					.map((tag) => ('comment' in tag ? tag.comment : undefined))
					.filter(Boolean)
					.join(' ')
			}))
		});
	}
	return interfaces;
}

function parseInterfaces(source) {
	const script = moduleScript(source);
	if (!script) return [];

	const file = ts.createSourceFile('module.ts', script, ts.ScriptTarget.Latest, true);
	const interfaces = [];

	for (const statement of file.statements) {
		if (!ts.isInterfaceDeclaration(statement)) continue;

		const members = statement.members
			.filter(ts.isPropertySignature)
			.map((member) => ({
				name: member.name.getText(),
				type: member.type ? member.type.getText() : 'unknown',
				optional: Boolean(member.questionToken),
				doc: ts
					.getJSDocCommentsAndTags(member)
					.map((tag) => ('comment' in tag ? tag.comment : undefined))
					.filter(Boolean)
					.join(' ')
			}));

		interfaces.push({
			name: statement.name.text,
			extends: (statement.heritageClauses ?? []).flatMap((clause) =>
				clause.types.map((type) => type.getText())
			),
			members
		});
	}

	return interfaces;
}

function roleMap(stateSource) {
	const map = new Map();
	if (!stateSource) return map;
	// `controlAttrs() { ... role: 'switch' ... }` — attribute the role to the part with that base name.
	const pattern = /\n\t{1,2}([a-zA-Z]+)Attrs\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\t{1,2}\}/g;
	for (const match of stateSource.matchAll(pattern)) {
		const body = match[3];
		const role = /role':?\s*'([a-z]+)'/.exec(body)?.[1] ?? /role:\s*'([a-z]+)'/.exec(body)?.[1];
		if (role) map.set(match[1].toLowerCase(), role);
		const dynamic = /role':\s*([^,\n]+)/.exec(body)?.[1];
		if (!role && dynamic) map.set(match[1].toLowerCase(), 'computed');
	}
	return map;
}

function roleOf(source) {
	const literal = /role="([a-z]+)"/.exec(source)?.[1];
	if (literal) return literal;
	const attr = /'role':\s*'([a-z]+)'/.exec(source)?.[1];
	if (attr) return attr;
	const dynamic = /'role':\s*([^,\n]+)/.exec(source)?.[1];
	if (dynamic) return 'computed';
	// Decorative parts hand their semantics to the hidden native control.
	if (/aria-hidden/.test(source)) return 'none (aria-hidden)';
	return '—';
}

function keysHandled(stateSource) {
	if (!stateSource) return [];
	const keys = new Set();
	for (const match of stateSource.matchAll(/case '([^']{1,12})':/g)) keys.add(match[1]);
	for (const match of stateSource.matchAll(/event\.key === '([^']{1,12})'/g)) keys.add(match[1]);
	for (const match of stateSource.matchAll(/key === '([^']{1,12})'/g)) keys.add(match[1]);
	const friendly = (key) =>
		key
			.replace('ArrowUp', '↑ ArrowUp')
			.replace('ArrowDown', '↓ ArrowDown')
			.replace('ArrowLeft', '← ArrowLeft')
			.replace('ArrowRight', '→ ArrowRight')
			.replace(' ', 'Space')
			.replace('PageUp', 'PageUp')
			.replace('PageDown', 'PageDown');
	return [...keys]
		.filter((key) => /^([A-Za-z]+| )$/.test(key) || key.startsWith('Arrow'))
		.map(friendly)
		.sort();
}

/** String-literal unions on the root, which are what a variation grid can drive. */
function enumProps(rootIface, library) {
	if (!rootIface) return [];
	const rows = flatten(rootIface, library);
	const interesting = ['variant', 'size', 'tone', 'appearance', 'orientation', 'shape', 'radius'];
	const results = [];
	for (const row of rows) {
		if (!interesting.includes(row.name)) continue;
		// `variant?: ButtonVariant` needs the alias expanded before values can be read.
		const resolved = library.aliases.get(row.type.trim()) ?? row.type;
		const values = [...resolved.matchAll(/'([^']+)'/g)].map((match) => match[1]);
		if (values.length < 2 || values.length > 9) continue;
		if (resolved.includes('=>') || resolved.includes('[')) continue;
		results.push({ prop: row.name, values });
	}
	return results;
}

const DOM_BASES = /^(Omit<)?(HTMLProps|PolymorphicProps|RefAttribute|HTMLAttributes|SvelteHTMLElements|Omit<HTMLAttributes)/;

function hookTable(sources) {
	const rows = new Map();
	for (const { part, source } of sources) {
		const slot = /data-slot="([^"]+)"/.exec(source)?.[1];
		const partAttr = /data-part="([^"]+)"/.exec(source)?.[1];
		const scope = /data-scope="([^"]+)"/.exec(source)?.[1];
		if (!slot && !partAttr) continue;
		rows.set(part, { slot, part: partAttr, scope });
	}
	return [...rows.entries()]
		.map(([part, row]) => `| \`${part}\` | \`${row.scope ?? '—'}\` | \`${row.part ?? '—'}\` | \`${row.slot ?? '—'}\` |`)
		.join('\n');
}

/** Custom properties with the default the CSS Module gives them. */
function cssVariables(css, family) {
	const found = new Map();
	const pattern = new RegExp(
		`var\\(\\s*(--moduix-${family}[a-z0-9-]*)\\s*,\\s*((?:[^()]|\\([^()]*\\))*)\\)`,
		'g'
	);
	for (const match of css.matchAll(pattern)) {
		if (!found.has(match[1])) found.set(match[1], match[2].trim());
	}
	// A property declared directly on a variant rule is its own default.
	for (const match of css.matchAll(new RegExp(`^\\s*(--moduix-${family}[a-z0-9-]*):\\s*([^;]+);`, 'gm'))) {
		if (!found.has(match[1])) found.set(match[1], match[2].trim());
	}
	return [...found.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function idPatterns(stateSource) {
	if (!stateSource) return [];
	const found = new Set();
	for (const match of stateSource.matchAll(/`([a-z][a-z-]*:[^`]{0,80})`/g)) {
		const value = match[1];
		if (value.includes('calc(') || value.includes('var(--')) continue;
		found.add(value.replace(/\$\{[^}]*\}/g, '${id}'));
	}
	return [...found].sort().slice(0, 12);
}

function testTitles(testSource) {
	if (!testSource) return [];
	return [...testSource.matchAll(/(?:test|it)\(\s*['"`]([^'"`]+)['"`]/g)].map((match) => match[1]);
}

/** A public usage example: the gallery demo, with local imports rewritten to the package name. */
function usageSnippet(demo) {
	if (!demo) return null;
	return demo
		.replace(/from '(?:\.\.\/)+lib\/index'/g, "from 'rta-ui'")
		.replace(/from '(?:\.\.\/)+lib\/components\/[a-z-]+\/index'/g, "from 'rta-ui'")
		.trim();
}

async function moduixDescription(family) {
	const source = await readIfExists(path.join(MODUIX_DOCS, `${family}.mdx`));
	if (!source) return null;
	return /^description:\s*(.+)$/m.exec(source)?.[1]?.trim() ?? null;
}

async function parityDeviations() {
	const source = await readFile(PARITY_SCRIPT, 'utf8');
	const block = /const ACCEPTED = \{([\s\S]*?)\n\};/.exec(source)?.[1] ?? '';
	const entries = new Map();
	for (const match of block.matchAll(/^\s{2}'?([a-z-]+)'?:\s*\{([\s\S]*?)\n\s{2}\},?$/gm)) {
		const [, family, body] = match;
		const reason = /reason:\s*\n?\s*'([^']+)'/.exec(body)?.[1];
		const added = /added:\s*\[([^\]]*)\]/.exec(body)?.[1];
		const removed = /removed:\s*\[([^\]]*)\]/.exec(body)?.[1];
		entries.set(family, { reason, added, removed });
	}
	return entries;
}

const GALLERY_NOTES = new Map();
async function galleryNotes() {
	const source = await readFile(path.join(root, 'src/routes/+page.svelte'), 'utf8');
	for (const match of source.matchAll(/\{ name: '([^']+)', note: '([^']+)'/g)) {
		GALLERY_NOTES.set(match[1].toLowerCase().replaceAll(' ', '-'), match[2]);
	}
	return GALLERY_NOTES;
}

/** Resolves a heritage entry such as `Omit<UseSliderProps, 'x'>` down to the interface name. */
function baseName(text) {
	const inner = /(?:Omit|Partial|Required|Readonly)<\s*([A-Za-z0-9_]+)/.exec(text);
	return inner ? inner[1] : text.trim();
}

function flatten(iface, library, seen = new Set()) {
	const rows = [];
	for (const base of iface.extends ?? []) {
		const name = baseName(base);
		if (DOM_BASES.test(base) || seen.has(name)) continue;
		seen.add(name);
		const inherited = library.get(name);
		if (!inherited) continue;
		for (const row of flatten(inherited, library, seen)) rows.push(row);
	}
	for (const member of iface.members) rows.push({ ...member, from: iface.name });
	return rows;
}

/** Defaults come from the part's own `$props()` destructuring. */
function defaultsFrom(source) {
	const instance = /<script lang="ts"[^>]*>([\s\S]*?)<\/script>/.exec(source)?.[1];
	if (!instance) return new Map();
	const head = instance.slice(0, instance.indexOf('$props()'));
	const defaults = new Map();
	for (const match of head.matchAll(/(?:^|[\s{,])([A-Za-z_$][\w$]*)\s*=\s*([^,\n]+)/g)) {
		defaults.set(match[1], match[2].trim());
	}
	return defaults;
}

function propsSection(parts, interfaces, library, sourcesByPart) {
	const blocks = [];
	for (const part of parts) {
		const iface = interfaces.get(part);
		if (!iface) continue;

		const bases = iface.extends.filter((base) => !DOM_BASES.test(base));
		const domBases = iface.extends.filter((base) => DOM_BASES.test(base));
		const rows = flatten(iface, library);
		if (!rows.length) continue;
		const defaults = defaultsFrom(sourcesByPart.get(part) ?? '');

		blocks.push(`### \`${part}\` — \`${iface.name}\``);
		const inheritance = [];
		if (domBases.length) inheritance.push(`accepts the native props of ${domBases.map((base) => `\`${base}\``).join(', ')}`);
		if (bases.length) inheritance.push(`adds to ${bases.map((base) => `\`${base}\``).join(', ')}`);
		if (inheritance.length) blocks.push(`${inheritance.join(', and ')}.\n`);

		blocks.push('| prop | type | default | notes |');
		blocks.push('| --- | --- | --- | --- |');
		const seen = new Set();
		for (const member of rows) {
			if (seen.has(member.name)) continue;
			seen.add(member.name);
			const type = member.type.replaceAll('|', '\\|');
			const raw = defaults.get(member.name);
			const fallback = raw && !raw.startsWith('$bindable') ? raw : undefined;
			const bound = raw?.startsWith('$bindable');
			const notes = [
				member.doc,
				bound ? 'bindable' : '',
				member.from !== iface.name ? `from \`${member.from}\`` : ''
			]
				.filter(Boolean)
				.join(' ');
			blocks.push(
				`| \`${member.name}\`${member.optional ? '' : ''} | \`${type}\` | ${fallback ? `\`${fallback.replaceAll('|', '\\|')}\`` : '—'} | ${notes} |`
			);
		}
		blocks.push('');
	}
	return blocks.join('\n');
}

async function buildFamily(family, deviations) {
	const dir = path.join(COMPONENTS, family);
	const files = await readdir(dir);
	const svelteFiles = files.filter((file) => file.endsWith('.svelte')).sort();
	const index = await readFile(path.join(dir, 'index.ts'), 'utf8');

	// Exported parts, in barrel order, mapped to the file that implements them.
	const partFiles = new Map();
	for (const match of index.matchAll(/export \{ default as (\w+) \} from '(\.\/[^']+\.svelte)'/g)) {
		partFiles.set(match[1], match[2].replace('./', ''));
	}

	const sources = await Promise.all(
		svelteFiles.map(async (file) => ({ file, source: await readFile(path.join(dir, file), 'utf8') }))
	);

	const library = new Map();
	library.aliases = new Map();
	for (const file of files.filter((name) => name.endsWith('.ts'))) {
		const text = await readIfExists(path.join(dir, file));
		if (!text) continue;
		for (const iface of parseInterfaceSource(text)) library.set(iface.name, iface);
		for (const [name, body] of parseAliases(text)) library.aliases.set(name, body);
	}
	for (const { source } of sources) {
		const script = moduleScript(source);
		if (script) for (const [name, body] of parseAliases(script)) library.aliases.set(name, body);
		for (const iface of parseInterfaces(source)) library.set(iface.name, iface);
	}

	const sourcesByPart = new Map();
	for (const [part, file] of partFiles) {
		const entry = sources.find((candidate) => candidate.file === file);
		if (entry) sourcesByPart.set(part, entry.source);
	}

	const interfaces = new Map();
	for (const [part, file] of partFiles) {
		const entry = sources.find((candidate) => candidate.file === file);
		if (!entry) continue;
		const declared = parseInterfaces(entry.source);
		// Roots declare `<Family>RootProps` (the file is `<Family>.svelte`), parts declare `<Part>Props`.
		const found =
			declared.find((iface) => iface.name === `${part}Props`) ??
			declared.find((iface) => iface.name === `${part}RootProps`) ??
			declared.find((iface) => iface.name.endsWith('Props'));
		if (found) interfaces.set(part, found);
	}

	const css = (await readIfExists(path.join(dir, `${pascal(family)}.module.css`))) ?? '';
	const state = await readIfExists(path.join(dir, `${family}.state.svelte.ts`));
	const demo = await readIfExists(path.join(DEMOS, `${pascal(family)}.svelte`));
	const test = await readIfExists(path.join(TESTS, `${family}.test.ts`));
	const description = (await moduixDescription(family)) ?? GALLERY_NOTES.get(family) ?? null;
	const isParityExceptional = deviations.get(family);

	const parts = [...partFiles.keys()];
	const hooks = hookTable(sources.map(({ file, source }) => ({ part: file.replace('.svelte', ''), source })));
	const variables = cssVariables(css, family);
	const ids = idPatterns(state);
	const titles = testTitles(test);
	const keys = keysHandled(state);
	const roles = roleMap(state);
	// Every role the family actually puts in the DOM, wherever it is declared.
	const familyRoles = new Set();
	for (const source of [state ?? '', ...sources.map((entry) => entry.source)]) {
		for (const match of source.matchAll(/role['"]?\s*:\s*'([a-z]+)'/g)) familyRoles.add(match[1]);
		for (const match of source.matchAll(/role="([a-z]+)"/g)) familyRoles.add(match[1]);
		// `role: role()` with `getProps().role ?? 'dialog'` — the fallback is the rendered default.
		for (const match of source.matchAll(/getProps\(\)\.role\s*\?\?\s*'([a-z]+)'/g)) familyRoles.add(match[1]);
	}

	// A variation grid needs a root that renders children directly and an enum prop to drive it.
	const rootPart = [...partFiles.keys()][0];
	const rootSource = sources.find((candidate) => candidate.file === partFiles.get(rootPart))?.source ?? '';
	// Roots either render children explicitly or forward them through a `...props` spread into Element.
	const rootRendersChildren =
		/\{@render children/.test(rootSource) || /\.\.\.props/.test(rootSource);
	// A generated grid can only drive a root that needs nothing but the prop it varies, so a family
	// with required props (Splitter's `panels`, Navigator's items) is left to its own demo.
	const rootInterface = rootPart ? interfaces.get(rootPart) : undefined;
	const requiredProps = rootInterface
		? flatten(rootInterface, library).filter(
				(member) => !member.optional && member.name !== 'children' && member.name !== 'asChild'
			)
		: [];
	const examples =
		rootRendersChildren && rootPart && requiredProps.length === 0
			? enumProps(rootInterface, library).slice(0, 2)
			: [];

	const isStateOnly = partFiles.size === 0;

	const lines = [];
	lines.push('---');
	lines.push(`title: ${pascal(family)}`);
	lines.push(`component: ${family}`);
	if (description) lines.push(`description: ${description}`);
	lines.push('---');
	lines.push('');
	lines.push(`# ${pascal(family)}`);
	lines.push('');
	if (description) {
		lines.push(description);
		lines.push('');
	}
	if (isStateOnly) {
		lines.push(
			`Shared state module rather than a component: there is no markup of its own. The visual families built on it are \`${family}-linear\` and \`${family}-circular\`, which reuse these types and the \`create${pascal(family)}\` factory.`
		);
	} else {
		lines.push(
			`Port of \`moduix/packages/svelte/src/components/${family}\` with the same public parts and a byte-identical CSS Module, rebuilt on \`src/lib/internal\` instead of Ark UI.`
		);
	}
	lines.push('');

	if (isStateOnly) {
		lines.push('## Exports');
		lines.push('');
		for (const match of index.matchAll(/export (?:type )?\{([\s\S]*?)\}/g)) {
			for (const name of match[1].split(',').map((value) => value.trim()).filter(Boolean)) {
				lines.push(`- \`${name.replace(/^type\s+/, '')}\``);
			}
		}
		lines.push('');
	} else {
	lines.push('## Installation');
	lines.push('');
	lines.push('```sh');
	lines.push('pnpm add rta-ui');
	lines.push('```');
	lines.push('');
	lines.push('`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:');
	lines.push('');
	lines.push('```svelte');
	lines.push('<script lang="ts">');
	lines.push(`\timport { ${rootPart ?? pascal(family)} } from 'rta-ui';`);
	lines.push("\timport 'rta-ui/style.css';");
	lines.push('</script>');
	lines.push('```');
	lines.push('');

	lines.push('## Anatomy');
	lines.push('');
	lines.push('| export | file | role |');
	lines.push('| --- | --- | --- |');
	for (const [part, file] of partFiles) {
		const entry = sources.find((candidate) => candidate.file === file);
		const base = part.replace(pascal(family), '').toLowerCase() || 'root';
		const local = entry ? roleOf(entry.source) : '—';
		const role = local !== '—' ? local : (roles.get(base) ?? roles.get(file.replace(/^\.\//, '')) ?? '—');
		lines.push(`| \`${part}\` | \`${file}\` | \`${role}\` |`);
	}
	lines.push('');
	// A part renders no element when its markup has no tags at all, only a `{@render}` of children.
	const providers = [...partFiles.entries()]
		.filter(([, file]) => {
			const entry = sources.find((candidate) => candidate.file === file);
			if (!entry) return false;
			const markup = entry.source.slice(entry.source.lastIndexOf('</script>') + '</script>'.length);
			return !/<[A-Za-z]/.test(markup);
		})
		.map(([part]) => `\`${part}\``);
	if (providers.length) {
		lines.push(
			`${providers.join(', ')} ${providers.length === 1 ? 'renders' : 'render'} no element of ${providers.length === 1 ? 'its' : 'their'} own: ${providers.length === 1 ? 'it creates' : 'they create'} the state and provide${providers.length === 1 ? 's' : ''} it to the other parts.`
		);
		lines.push('');
	}
	}

	if (parts.length) {
		if (familyRoles.size) {
		lines.push(`ARIA roles rendered by this family: ${[...familyRoles].sort().map((role) => `\`${role}\``).join(', ')}.`);
		lines.push('');
	}

	lines.push('## Props');
		lines.push('');
		const section = propsSection(parts, interfaces, library, sourcesByPart);
		lines.push(section.trim() ? section : 'Every part accepts its native element props plus `class`, `style`, `ref` and `asChild`.');
		lines.push('');
	}

	if (!isStateOnly) {
		lines.push('## Styling hooks');
		lines.push('');
		lines.push('| part file | `data-scope` | `data-part` | `data-slot` |');
		lines.push('| --- | --- | --- | --- |');
		lines.push(hooks || '| — | — | — | — |');
		lines.push('');
	}
	if (variables.length) {
		lines.push('### CSS variables');
		lines.push('');
		lines.push('| variable | default |');
		lines.push('| --- | --- |');
		for (const [name, value] of variables) lines.push(`| \`${name}\` | \`${value}\` |`);
		lines.push('');
	}

	lines.push('## Keyboard');
	lines.push('');
	lines.push(
		keys.length
			? `Keys handled by this family: ${keys.map((key) => `\`${key}\``).join(', ')}.`
			: 'No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.'
	);
	lines.push('');

	if (ids.length) {
		lines.push('## Generated ids');
		lines.push('');
		for (const id of ids) lines.push(`- \`${id}\``);
		lines.push('');
		if (!isStateOnly) lines.push('Every id is overridable through the `ids` prop.');
		lines.push('');
	}

	const snippet = usageSnippet(demo);
	if (snippet) {
		lines.push('## Overview example source');
		lines.push('');
		lines.push('The component above is this file, unchanged:');
		lines.push('');
		lines.push('```svelte');
		lines.push(snippet);
		lines.push('```');
		lines.push('');
	}

	if (titles.length) {
		lines.push('## Behaviour covered by tests');
		lines.push('');
		for (const title of titles) lines.push(`- ${title}`);
		lines.push('');
	}

	const notes = [];
	if (isParityExceptional?.reason) {
		const reason = isParityExceptional.reason;
		const sentence = reason[0].toUpperCase() + reason.slice(1);
		const slots = (raw) =>
			[...raw.matchAll(/'([^']+)'/g)]
				.map((match) => match[1].replace(/^slot:/, ''))
				.map((name) => `\`${name}\``)
				.join(', ');
		notes.push(`- **Parity:** accepted deviation — ${sentence}.`);
		if (isParityExceptional.added) notes.push(`  Extra slots: ${slots(isParityExceptional.added)}.`);
		if (isParityExceptional.removed) notes.push(`  Missing slots: ${slots(isParityExceptional.removed)}.`);
	}
	if (!isParityExceptional) {
		const counterpart = path.join(PARITY_REFERENCE, family);
		notes.push(
			existsSync(counterpart)
				? '- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).'
				: `- **Parity:** moduix has no \`${family}\` family; this is an rta-ui family, so nothing is compared.`
		);
	}
	if (notes.length) {
		lines.push('## Notes');
		lines.push('');
		lines.push(...notes);
		lines.push('');
	}

	lines.push('---');
	lines.push('');
	lines.push(
		'Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.'
	);
	lines.push('');

	return { family, markdown: lines.join('\n'), parts, examples };
}

const GALLERY_GROUPS = [
	['Pure', ['alert', 'aspect-ratio', 'avatar', 'badge', 'bleed', 'breadcrumbs', 'button', 'card', 'close-button', 'container', 'empty', 'heading', 'highlight', 'image', 'input', 'input-group', 'kbd', 'list', 'marquee', 'progress-circular', 'progress-linear', 'separator', 'simple-grid', 'skeleton', 'spinner', 'stack', 'swap', 'table', 'tag', 'text', 'textarea', 'typeset']],
	['Behavioral', ['accordion', 'angle-slider', 'checkbox', 'clipboard', 'collapsible', 'editable', 'field', 'fieldset', 'native-select', 'number-input', 'pagination', 'password-input', 'pin-input', 'qr-code', 'radio-group', 'rating-group', 'scroll-area', 'segment-group', 'signature-pad', 'slider', 'splitter', 'steps', 'switch', 'tabs', 'tags-input', 'timer', 'toggle', 'toggle-group']],
	['Overlays', ['command-palette', 'dialog', 'drawer', 'floating-panel', 'hover-card', 'lightbox', 'menu', 'navigation-menu', 'popover', 'sidebar', 'split-button', 'toast', 'tooltip', 'tour']],
	['Collections', ['combobox', 'json-tree-view', 'listbox', 'select', 'toc', 'tree-view']],
	['Data and media', ['carousel', 'color-picker', 'date-input', 'date-picker', 'file-upload', 'image-cropper']]
];

export async function buildDocs() {
	const families = (await readdir(COMPONENTS, { withFileTypes: true }))
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.filter((family) => existsSync(path.join(COMPONENTS, family, 'index.ts')))
		.sort();

	await mkdir(OUT, { recursive: true });
	await galleryNotes();
	const deviations = await parityDeviations();

	const docs = [];
	for (const family of families) {
		docs.push(await buildFamily(family, deviations));
	}

	for (const doc of docs) {
		await writeFile(path.join(OUT, `${doc.family}.md`), doc.markdown, 'utf8');
	}

	const grouped = new Map();
	for (const [group, list] of GALLERY_GROUPS) {
		for (const family of list) grouped.set(family, group);
	}

	const index = ['---', 'title: Components', 'description: Every component in rta ui, by group.', '---', '', '# Components', ''];
	index.push(`${docs.length} component families, all dependency-free. Each page is generated from its source, demo and tests.`);
	index.push('');
	for (const [group, list] of GALLERY_GROUPS) {
		const present = list.filter((family) => docs.some((doc) => doc.family === family));
		if (!present.length) continue;
		index.push(`## ${group}`);
		index.push('');
		for (const family of present) {
			const doc = docs.find((candidate) => candidate.family === family);
			const description = /^description:\s*(.+)$/m.exec(doc.markdown)?.[1] ?? '';
			index.push(`- [${pascal(family)}](./${family}.md) — ${description}`);
		}
		index.push('');
	}
	const ungrouped = docs.filter((doc) => !grouped.has(doc.family)).map((doc) => doc.family);
	if (ungrouped.length) {
		index.push('## Other');
		index.push('');
		for (const family of ungrouped) index.push(`- [${pascal(family)}](./${family}.md)`);
		index.push('');
	}
	const files = new Map(docs.map((doc) => [`${doc.family}.md`, doc.markdown]));
	const exampleMap = Object.fromEntries(
		docs.filter((doc) => doc.examples?.length).map((doc) => [doc.family, doc.examples])
	);
	files.set('../examples.json', JSON.stringify(exampleMap, null, '\t') + '\n');
	files.set('README.md', index.join('\n'));
	return { files, count: docs.length };
}

async function main() {
	const { files, count } = await buildDocs();

	// `--check` proves the committed pages are exactly what the current source produces.
	if (process.argv.includes('--check')) {
		const stale = [];
		for (const [name, markdown] of files) {
			const onDisk = await readIfExists(path.join(OUT, name));
			if (onDisk !== markdown) stale.push(name);
		}
		if (stale.length) {
			console.error(`stale component pages (${stale.length}): ${stale.join(', ')}`);
			console.error('run `pnpm docs` to regenerate them');
			process.exitCode = 1;
			return;
		}
		console.log(`docs up to date: ${count} component pages`);
		return;
	}

	for (const [name, markdown] of files) {
		await writeFile(path.join(OUT, name), markdown, 'utf8');
	}
	console.log(`${count} component pages written to docs/components/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await main();
}
