// Checked-state derivation for the checkbox tree, ported from @zag-js/tree-view's
// utils/checked-state.ts: a branch is checked when every descendant leaf is checked, mixed when
// some are, unchecked otherwise.

import type { TreeCollection, TreeNode } from './collection';
import { addAll, removeAll, uniq } from './utils';

export type CheckedState = boolean | 'indeterminate';

export interface CheckedValueMapEntry {
	type: 'leaf' | 'branch';
	checked: CheckedState;
}

export type CheckedValueMap = Map<string, CheckedValueMapEntry>;

export function getCheckedState<T extends TreeNode>(
	collection: TreeCollection<T>,
	node: T,
	checkedValue: string[]
): CheckedState {
	const value = collection.getNodeValue(node);
	if (!collection.isBranchNode(node)) return checkedValue.includes(value);

	const childValues = collection.getDescendantValues(value);
	const allChecked = childValues.every((child) => checkedValue.includes(child));
	const someChecked = childValues.some((child) => checkedValue.includes(child));
	return allChecked ? true : someChecked ? 'indeterminate' : false;
}

export function toggleBranchChecked<T extends TreeNode>(
	collection: TreeCollection<T>,
	value: string,
	checkedValue: string[]
): string[] {
	const childValues = collection.getDescendantValues(value);
	const allChecked = childValues.every((child) => checkedValue.includes(child));
	return uniq(allChecked ? removeAll(checkedValue, ...childValues) : addAll(checkedValue, ...childValues));
}

export function getCheckedValueMap<T extends TreeNode>(
	collection: TreeCollection<T>,
	checkedValue: string[]
): CheckedValueMap {
	const map: CheckedValueMap = new Map();
	collection.visit({
		onEnter: (node) => {
			const value = collection.getNodeValue(node);
			const isBranch = collection.isBranchNode(node);
			map.set(value, {
				type: isBranch ? 'branch' : 'leaf',
				checked: getCheckedState(collection, node, checkedValue)
			});
		}
	});
	return map;
}
