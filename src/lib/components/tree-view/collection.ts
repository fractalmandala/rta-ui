// Family-local port of Zag's TreeCollection (tree-collection.ts + tree-visit.ts, @zag-js/collection
// 1.48.0). Nodes are plain objects; `value`, `label`, `disabled`, `children` and `childrenCount` are
// the defaults, and every accessor can be overridden so a consumer node model still works.

export type IndexPath = number[];
export type ValuePath = string[];

/** Minimum node shape. A node type whose own fields satisfy these extends it structurally. */
export interface TreeNode {
	children?: unknown;
	childrenCount?: number;
	disabled?: boolean;
}

export interface TreeCollectionMethods<T> {
	isNodeDisabled: (node: T) => boolean;
	nodeToValue: (node: T) => string;
	nodeToString: (node: T) => string;
	nodeToChildren: (node: T) => T[];
	nodeToChildrenCount: (node: T) => number | undefined;
}

export interface TreeCollectionOptions<T> extends Partial<TreeCollectionMethods<T>> {
	rootNode: T;
}

export interface TreeSkipArgs<T> {
	value: string;
	node: T;
	indexPath: IndexPath;
}

export type TreeSkipFn<T> = (args: TreeSkipArgs<T>) => boolean | void;

export interface TreeSkipOptions<T> {
	skip?: TreeSkipFn<T>;
}

export interface BranchValuesOptions<T> extends TreeSkipOptions<T> {
	depth?: number | ((depth: number) => boolean);
}

export interface DescendantOptions {
	withBranch?: boolean;
}

export interface FlatTreeNodeMeta extends TreeNode {
	_children: number[] | undefined;
	_parent: number | undefined;
	_index: number;
}

type EnterResult = 'stop' | 'skip' | void;

interface VisitOptions<T> {
	onEnter?: (node: T, indexPath: IndexPath) => EnterResult;
	onLeave?: (node: T, indexPath: IndexPath) => 'stop' | void;
	getChildren: (node: T) => T[];
}

interface VisitStackEntry<T> {
	node: T;
	state?: number;
	children?: T[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function visit<T>(node: T, options: VisitOptions<T>): void {
	const { onEnter, onLeave, getChildren } = options;
	const indexPath: IndexPath = [];
	const stack: VisitStackEntry<T>[] = [{ node }];

	while (stack.length > 0) {
		const wrapper = stack[stack.length - 1];

		if (wrapper.state === undefined) {
			const result = onEnter?.(wrapper.node, [...indexPath]);
			if (result === 'stop') return;
			wrapper.state = result === 'skip' ? -1 : 0;
		}

		const children = wrapper.children ?? getChildren(wrapper.node);
		wrapper.children = children;

		if (wrapper.state !== -1) {
			if (wrapper.state < children.length) {
				const currentIndex = wrapper.state;
				indexPath.push(currentIndex);
				stack.push({ node: children[currentIndex] });
				wrapper.state = currentIndex + 1;
				continue;
			}
			if (onLeave?.(wrapper.node, [...indexPath]) === 'stop') return;
		}

		indexPath.pop();
		stack.pop();
	}
}

function find<T>(node: T, options: VisitOptions<T> & { predicate: (node: T, indexPath: IndexPath) => boolean }): T | undefined {
	let found: T | undefined;
	visit(node, {
		getChildren: options.getChildren,
		onEnter(child, indexPath) {
			if (options.predicate(child, indexPath)) {
				found = child;
				return 'stop';
			}
		}
	});
	return found;
}

function findAll<T>(
	node: T,
	options: VisitOptions<T> & { predicate: (node: T, indexPath: IndexPath) => boolean }
): T[] {
	const found: T[] = [];
	visit(node, {
		getChildren: options.getChildren,
		onEnter(child, indexPath) {
			if (options.predicate(child, indexPath)) found.push(child);
		}
	});
	return found;
}

function findIndexPath<T>(
	node: T,
	options: VisitOptions<T> & { predicate: (node: T, indexPath: IndexPath) => boolean }
): IndexPath | undefined {
	let found: IndexPath | undefined;
	visit(node, {
		getChildren: options.getChildren,
		onEnter(child, indexPath) {
			if (options.predicate(child, indexPath)) {
				found = [...indexPath];
				return 'stop';
			}
		}
	});
	return found;
}

function flatMap<T, R>(node: T, options: VisitOptions<T> & { transform: (node: T, indexPath: IndexPath) => R[] }): R[] {
	const result: R[] = [];
	visit(node, {
		getChildren: options.getChildren,
		onEnter(child, indexPath) {
			result.push(...options.transform(child, indexPath));
		}
	});
	return result;
}

export function compareIndexPaths(a: IndexPath, b: IndexPath): number {
	for (let index = 0; index < Math.min(a.length, b.length); index++) {
		if (a[index] < b[index]) return -1;
		if (a[index] > b[index]) return 1;
	}
	return a.length - b.length;
}

function access<T>(node: T, indexPath: IndexPath, getChildren: (node: T) => T[]): T | undefined {
	let current: T | undefined = node;
	for (const index of indexPath) {
		current = current === undefined ? undefined : getChildren(current)[index];
	}
	return current;
}

function replaceAt<T>(
	root: T,
	indexPath: IndexPath,
	node: T,
	getChildren: (node: T) => T[],
	create: (node: T, children: T[]) => T
): T {
	if (indexPath.length === 0) return node;
	const [index, ...rest] = indexPath;
	const children = [...getChildren(root)];
	if (index < 0 || index >= children.length) return root;
	children[index] = replaceAt(children[index], rest, node, getChildren, create);
	return create(root, children);
}

function filterTree<T>(
	root: T,
	predicate: (node: T, indexPath: IndexPath) => boolean,
	getChildren: (node: T) => T[],
	create: (node: T, children: T[]) => T
): T {
	const walk = (node: T, indexPath: IndexPath): T | undefined => {
		const children = getChildren(node);
		const kept: T[] = [];

		children.forEach((child, index) => {
			const keptChild = walk(child, [...indexPath, index]);
			if (keptChild !== undefined) kept.push(keptChild);
		});

		const isRoot = indexPath.length === 0;
		if (isRoot || predicate(node, indexPath) || kept.length > 0) return create(node, kept);
		return undefined;
	};

	return walk(root, []) ?? create(root, []);
}

const fallbackMethods: TreeCollectionMethods<TreeNode> = {
	nodeToValue(node) {
		if (typeof node === 'string') return node;
		if (isRecord(node) && typeof node.value === 'string') return node.value;
		return '';
	},
	nodeToString(node) {
		if (typeof node === 'string') return node;
		if (isRecord(node) && typeof node.label === 'string') return node.label;
		return fallbackMethods.nodeToValue(node);
	},
	isNodeDisabled(node) {
		return isRecord(node) && Boolean(node.disabled);
	},
	nodeToChildren(node) {
		return isRecord(node) && Array.isArray(node.children) ? (node.children as TreeNode[]) : [];
	},
	nodeToChildrenCount(node) {
		return isRecord(node) && typeof node.childrenCount === 'number' ? node.childrenCount : undefined;
	}
};

export class TreeCollection<T = TreeNode> {
	rootNode: T;
	private options: TreeCollectionOptions<T>;

	constructor(options: TreeCollectionOptions<T>) {
		this.options = options;
		this.rootNode = options.rootNode;
	}

	getNodeChildren = (node: T): T[] => {
		const custom = this.options.nodeToChildren;
		if (custom) return custom(node);
		return fallbackMethods.nodeToChildren(node as TreeNode) as T[];
	};

	getNodeChildrenCount = (node: T): number | undefined =>
		this.options.nodeToChildrenCount?.(node) ?? fallbackMethods.nodeToChildrenCount(node as TreeNode);

	getNodeValue = (node: T): string =>
		this.options.nodeToValue?.(node) ?? fallbackMethods.nodeToValue(node as TreeNode);

	getNodeDisabled = (node: T): boolean =>
		this.options.isNodeDisabled?.(node) ?? fallbackMethods.isNodeDisabled(node as TreeNode);

	stringifyNode = (node: T): string =>
		this.options.nodeToString?.(node) ?? fallbackMethods.nodeToString(node as TreeNode);

	stringify = (value: string): string | null => {
		const node = this.findNode(value);
		return node === undefined ? null : this.stringifyNode(node);
	};

	isSameNode = (node: T, other: T): boolean => this.getNodeValue(node) === this.getNodeValue(other);

	isRootNode = (node: T): boolean => this.isSameNode(node, this.rootNode);

	isEqual = (other: TreeCollection<T>): boolean => this.rootNode === other.rootNode;

	resolveIndexPath(valueOrIndexPath: string | IndexPath): IndexPath | undefined {
		return typeof valueOrIndexPath === 'string' ? this.getIndexPath(valueOrIndexPath) : valueOrIndexPath;
	}

	resolveNode(valueOrIndexPath: string | IndexPath): T | undefined {
		const indexPath = this.resolveIndexPath(valueOrIndexPath);
		return indexPath === undefined ? undefined : this.at(indexPath);
	}

	at = (indexPath: IndexPath): T | undefined => access(this.rootNode, indexPath, this.getNodeChildren);

	findNode = (value: string, rootNode: T = this.rootNode): T | undefined =>
		find(rootNode, {
			getChildren: this.getNodeChildren,
			predicate: (node) => this.getNodeValue(node) === value
		});

	findNodes = (values: string[], rootNode: T = this.rootNode): T[] => {
		const wanted = new Set(values.filter((value) => value != null));
		return findAll(rootNode, {
			getChildren: this.getNodeChildren,
			predicate: (node) => wanted.has(this.getNodeValue(node))
		});
	};

	sort = (values: string[]): string[] =>
		values
			.reduce<{ value: string; indexPath: IndexPath }[]>((acc, value) => {
				const indexPath = this.getIndexPath(value);
				if (indexPath) acc.push({ value, indexPath });
				return acc;
			}, [])
			.sort((a, b) => compareIndexPaths(a.indexPath, b.indexPath))
			.map(({ value }) => value);

	getFirstNode = (rootNode: T = this.rootNode, opts: TreeSkipOptions<T> = {}): T | undefined => {
		let firstChild: T | undefined;
		visit(rootNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (this.isSameNode(node, rootNode)) return;
				if (opts.skip?.({ value: this.getNodeValue(node), node, indexPath })) return 'skip';
				if (firstChild === undefined && indexPath.length > 0 && !this.getNodeDisabled(node)) {
					firstChild = node;
					return 'stop';
				}
			}
		});
		return firstChild;
	};

	getLastNode = (rootNode: T = this.rootNode, opts: TreeSkipOptions<T> = {}): T | undefined => {
		let lastChild: T | undefined;
		visit(rootNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (this.isSameNode(node, rootNode)) return;
				if (opts.skip?.({ value: this.getNodeValue(node), node, indexPath })) return 'skip';
				if (indexPath.length > 0 && !this.getNodeDisabled(node)) lastChild = node;
			}
		});
		return lastChild;
	};

	getIndexPath(value: string | string[]): IndexPath | undefined {
		if (Array.isArray(value)) {
			if (value.length === 0) return [];
			const indexPath: IndexPath = [];
			let children = this.getNodeChildren(this.rootNode);
			for (let index = 0; index < value.length; index++) {
				const currentValue = value[index];
				const match = children.findIndex((child) => this.getNodeValue(child) === currentValue);
				if (match === -1) break;
				indexPath.push(match);
				if (index < value.length - 1) children = this.getNodeChildren(children[match]);
			}
			return indexPath;
		}
		return findIndexPath(this.rootNode, {
			getChildren: this.getNodeChildren,
			predicate: (node) => this.getNodeValue(node) === value
		});
	}

	getValue = (indexPath: IndexPath): string | undefined => {
		const node = this.at(indexPath);
		return node === undefined ? undefined : this.getNodeValue(node);
	};

	getValuePath = (indexPath: IndexPath | undefined): ValuePath => {
		if (!indexPath) return [];
		const valuePath: ValuePath = [];
		const current = [...indexPath];
		while (current.length > 0) {
			const node = this.at(current);
			if (node !== undefined) valuePath.unshift(this.getNodeValue(node));
			current.pop();
		}
		return valuePath;
	};

	getDepth = (value: string): number =>
		findIndexPath(this.rootNode, {
			getChildren: this.getNodeChildren,
			predicate: (node) => this.getNodeValue(node) === value
		})?.length ?? 0;

	contains = (parentIndexPath: IndexPath, valueIndexPath: IndexPath): boolean => {
		if (!parentIndexPath || !valueIndexPath) return false;
		return valueIndexPath
			.slice(0, parentIndexPath.length)
			.every((_, index) => parentIndexPath[index] === valueIndexPath[index]);
	};

	getNextNode = (value: string, opts: TreeSkipOptions<T> = {}): T | undefined => {
		let found = false;
		let nextNode: T | undefined;
		visit(this.rootNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (this.isRootNode(node)) return;
				const nodeValue = this.getNodeValue(node);
				if (opts.skip?.({ value: nodeValue, node, indexPath })) {
					if (nodeValue === value) found = true;
					return 'skip';
				}
				if (found && !this.getNodeDisabled(node)) {
					nextNode = node;
					return 'stop';
				}
				if (nodeValue === value) found = true;
			}
		});
		return nextNode;
	};

	getPreviousNode = (value: string, opts: TreeSkipOptions<T> = {}): T | undefined => {
		let previousNode: T | undefined;
		let found = false;
		visit(this.rootNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (this.isRootNode(node)) return;
				const nodeValue = this.getNodeValue(node);
				if (opts.skip?.({ value: nodeValue, node, indexPath })) return 'skip';
				if (nodeValue === value) {
					found = true;
					return 'stop';
				}
				if (!this.getNodeDisabled(node)) previousNode = node;
			}
		});
		return found ? previousNode : undefined;
	};

	getParentNodes = (valueOrIndexPath: string | IndexPath): T[] => {
		const indexPath = this.resolveIndexPath(valueOrIndexPath)?.slice();
		if (!indexPath) return [];
		const result: T[] = [];
		while (indexPath.length > 0) {
			indexPath.pop();
			const parentNode = this.at(indexPath);
			if (parentNode !== undefined && !this.isRootNode(parentNode)) result.unshift(parentNode);
		}
		return result;
	};

	getDescendantNodes = (valueOrIndexPath: string | IndexPath, options?: DescendantOptions): T[] => {
		const parentNode = this.resolveNode(valueOrIndexPath);
		if (parentNode === undefined) return [];
		const result: T[] = [];
		visit(parentNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (indexPath.length === 0) return;
				if (!options?.withBranch && this.isBranchNode(node)) return;
				result.push(node);
			}
		});
		return result;
	};

	getDescendantValues = (valueOrIndexPath: string | IndexPath, options?: DescendantOptions): string[] =>
		this.getDescendantNodes(valueOrIndexPath, options).map((node) => this.getNodeValue(node));

	getParentNode = (valueOrIndexPath: string | IndexPath): T | undefined => {
		const indexPath = this.resolveIndexPath(valueOrIndexPath);
		if (!indexPath) return undefined;
		return this.at(indexPath.slice(0, -1));
	};

	visit = (opts: { skip?: TreeSkipFn<T>; onEnter?: (node: T, indexPath: IndexPath) => EnterResult; onLeave?: (node: T, indexPath: IndexPath) => 'stop' | void }): void => {
		const { skip, ...rest } = opts;
		visit(this.rootNode, {
			...rest,
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (this.isRootNode(node)) return;
				if (skip?.({ value: this.getNodeValue(node), node, indexPath })) return 'skip';
				return rest.onEnter?.(node, indexPath);
			}
		});
	};

	getPreviousSibling = (indexPath: IndexPath): T | undefined => {
		const parentNode = this.getParentNode(indexPath);
		if (parentNode === undefined) return undefined;
		const siblings = this.getNodeChildren(parentNode);
		let index = indexPath[indexPath.length - 1];
		while (--index >= 0) {
			const sibling = siblings[index];
			if (sibling !== undefined && !this.getNodeDisabled(sibling)) return sibling;
		}
		return undefined;
	};

	getNextSibling = (indexPath: IndexPath): T | undefined => {
		const parentNode = this.getParentNode(indexPath);
		if (parentNode === undefined) return undefined;
		const siblings = this.getNodeChildren(parentNode);
		let index = indexPath[indexPath.length - 1];
		while (++index < siblings.length) {
			const sibling = siblings[index];
			if (sibling !== undefined && !this.getNodeDisabled(sibling)) return sibling;
		}
		return undefined;
	};

	getSiblingNodes = (indexPath: IndexPath): T[] => {
		const parentNode = this.getParentNode(indexPath);
		return parentNode === undefined ? [] : this.getNodeChildren(parentNode);
	};

	getValues = (rootNode: T = this.rootNode): string[] =>
		flatMap(rootNode, {
			getChildren: this.getNodeChildren,
			transform: (node) => [this.getNodeValue(node)]
		}).slice(1);

	isBranchNode = (node: T): boolean =>
		this.getNodeChildren(node).length > 0 || this.getNodeChildrenCount(node) != null;

	getBranchValues = (rootNode: T = this.rootNode, opts: BranchValuesOptions<T> = {}): string[] => {
		const values: string[] = [];
		const matchesDepth = (indexPath: IndexPath): boolean => {
			if (opts.depth == null) return true;
			if (typeof opts.depth === 'function') return opts.depth(indexPath.length);
			return indexPath.length === opts.depth;
		};
		visit(rootNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (indexPath.length === 0) return;
				const nodeValue = this.getNodeValue(node);
				if (opts.skip?.({ value: nodeValue, node, indexPath })) return 'skip';
				if (this.isBranchNode(node) && matchesDepth(indexPath)) values.push(nodeValue);
			}
		});
		return values;
	};

	flatten = (rootNode: T = this.rootNode): FlatTreeNodeMeta[] => {
		const nodes: FlatTreeNodeMeta[] = [];
		let counter = 0;
		const indexMap = new Map<T, number>();
		const parentMap = new Map<T, T>();

		visit(rootNode, {
			getChildren: this.getNodeChildren,
			onEnter: (node, indexPath) => {
				if (!indexMap.has(node)) indexMap.set(node, counter++);
				const children = this.getNodeChildren(node);
				for (const child of children) {
					if (!parentMap.has(child)) parentMap.set(child, node);
					if (!indexMap.has(child)) indexMap.set(child, counter++);
				}
				const childIndexes = children.length > 0 ? children.map((child) => indexMap.get(child) as number) : undefined;
				const parent = parentMap.get(node);
				nodes.push({
					...(node as unknown as TreeNode),
					_children: childIndexes,
					_parent: parent === undefined ? undefined : indexMap.get(parent),
					_index: indexMap.get(node) as number
				});
			}
		});
		return nodes;
	};

	private create = (node: T, children: T[]): T => {
		const originalChildren = this.getNodeChildren(node);
		if (originalChildren.length > 0 || children.length > 0) {
			return { ...node, children } as T;
		}
		return { ...node };
	};

	copy = (rootNode: T): TreeCollection<T> => new TreeCollection<T>({ ...this.options, rootNode });

	replace = (indexPath: IndexPath, node: T): TreeCollection<T> =>
		this.copy(replaceAt(this.rootNode, indexPath, node, this.getNodeChildren, this.create));

	filter = (predicate: (node: T, indexPath: IndexPath) => boolean): TreeCollection<T> =>
		this.copy(filterTree(this.rootNode, predicate, this.getNodeChildren, this.create));

	toJSON = (): string[] => this.getValues(this.rootNode);
}

export function createTreeCollection<T extends TreeNode>(options: TreeCollectionOptions<T>): TreeCollection<T> {
	return new TreeCollection<T>(options);
}

export interface FilePathTreeNode extends TreeNode {
	value: string;
	label: string;
	children?: FilePathTreeNode[];
}

export function createFileTreeCollection(paths: string[]): TreeCollection<FilePathTreeNode> {
	const rootNode: FilePathTreeNode = { value: 'ROOT', label: '', children: [] };

	for (const path of paths) {
		const parts = path.split('/');
		let current = rootNode;
		parts.forEach((part, index) => {
			current.children ??= [];
			let child = current.children.find((entry) => entry.label === part);
			if (!child) {
				child = { value: parts.slice(0, index + 1).join('/'), label: part };
				current.children.push(child);
			}
			current = child;
		});
	}

	return new TreeCollection<FilePathTreeNode>({ rootNode });
}
