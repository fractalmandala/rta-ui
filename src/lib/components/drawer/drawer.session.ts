// Drawer swipe geometry and snap-point resolution, ported from Zag's drawer session and
// `utils/snap-point`. Pure functions plus one mutable session object, so the state module can stay
// reactive without a statechart.

export type DrawerSwipeDirection = 'up' | 'down' | 'start' | 'end';
export type DrawerPhysicalSwipeDirection = 'up' | 'down' | 'left' | 'right';
export type DrawerSnapPoint = number | string;

export interface DrawerResolvedSnapPoint {
	value: DrawerSnapPoint;
	height: number;
	offset: number;
}

export interface DrawerPoint {
	x: number;
	y: number;
}

export const oppositeSwipeDirection: Record<DrawerSwipeDirection, DrawerSwipeDirection> = {
	up: 'down',
	down: 'up',
	start: 'end',
	end: 'start'
};

export const isVerticalSwipeDirection = (direction: DrawerPhysicalSwipeDirection) =>
	direction === 'down' || direction === 'up';

export const isNegativeSwipeDirection = (direction: DrawerPhysicalSwipeDirection) =>
	direction === 'up' || direction === 'left';

export function resolveSwipeDirection(
	direction: DrawerSwipeDirection,
	dir?: 'ltr' | 'rtl' | 'auto' | null
): DrawerPhysicalSwipeDirection {
	if (direction === 'start') return dir === 'rtl' ? 'right' : 'left';
	if (direction === 'end') return dir === 'rtl' ? 'left' : 'right';
	return direction;
}

export function getSwipeDirectionSize(
	rect: { height: number; width: number },
	direction: DrawerPhysicalSwipeDirection
) {
	return isVerticalSwipeDirection(direction) ? rect.height : rect.width;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function resolveSnapPointValue(
	snapPoint: DrawerSnapPoint,
	viewportSize: number,
	rootFontSize: number
): number | null {
	if (!Number.isFinite(viewportSize) || viewportSize <= 0) return null;
	if (typeof snapPoint === 'number') {
		if (!Number.isFinite(snapPoint)) return null;
		if (snapPoint <= 1) return clamp(snapPoint, 0, 1) * viewportSize;
		return snapPoint;
	}
	const trimmed = snapPoint.trim();
	if (trimmed.endsWith('px')) {
		const value = Number.parseFloat(trimmed);
		return Number.isFinite(value) ? value : null;
	}
	if (trimmed.endsWith('rem')) {
		const value = Number.parseFloat(trimmed);
		return Number.isFinite(value) ? value * rootFontSize : null;
	}
	return null;
}

export function resolveSnapPoint(
	snapPoint: DrawerSnapPoint,
	options: { contentSize: number; viewportSize: number; rootFontSize: number }
): DrawerResolvedSnapPoint | null {
	const { contentSize, viewportSize, rootFontSize } = options;
	const maxSize = Math.min(contentSize, viewportSize);
	if (!Number.isFinite(maxSize) || maxSize <= 0) return null;
	const resolvedSize = resolveSnapPointValue(snapPoint, viewportSize, rootFontSize);
	if (resolvedSize === null || !Number.isFinite(resolvedSize)) return null;
	const height = clamp(resolvedSize, 0, maxSize);
	return { value: snapPoint, height, offset: Math.max(0, contentSize - height) };
}

const HEIGHT_DEDUP_EPSILON_PX = 1;

export function dedupeSnapPoints(points: DrawerResolvedSnapPoint[]): DrawerResolvedSnapPoint[] {
	if (points.length <= 1) return points;
	const done: DrawerResolvedSnapPoint[] = [];
	const heights: number[] = [];
	for (let index = points.length - 1; index >= 0; index -= 1) {
		const point = points[index];
		if (heights.some((height) => Math.abs(height - point.height) <= HEIGHT_DEDUP_EPSILON_PX)) continue;
		heights.push(point.height);
		done.push(point);
	}
	done.reverse();
	return done;
}

export function findClosestSnapPoint(
	offset: number,
	points: DrawerResolvedSnapPoint[]
): DrawerResolvedSnapPoint | null {
	if (!points.length) return null;
	return points.reduce((closest, point) =>
		Math.abs(offset - point.offset) < Math.abs(offset - closest.offset) ? point : closest
	);
}

export function resolveSwipeProgress(
	contentSize: number | null,
	dragOffset: number | null,
	snapPointOffset: number
) {
	if (!contentSize || contentSize <= 0) return 0;
	return clamp((dragOffset ?? snapPointOffset) / contentSize, 0, 1);
}

export function hasOpeningSwipeIntent(
	start: DrawerPoint,
	point: DrawerPoint,
	direction: DrawerPhysicalSwipeDirection
) {
	const axis = isVerticalSwipeDirection(direction) ? 'y' : 'x';
	const sign = isNegativeSwipeDirection(direction) ? -1 : 1;
	return (start[axis] - point[axis]) * sign > 5;
}

const VELOCITY_WINDOW_MS = 100;
const MAX_RELEASE_VELOCITY_AGE_MS = 80;
const MIN_GESTURE_DURATION_MS = 50;
const MIN_VELOCITY_SAMPLES = 2;
const SAMPLE_COMPACT_THRESHOLD = 8;
const RELEASE_DISPLACEMENT_TRUST_PX = 24;
const SNAP_VELOCITY_THRESHOLD = 400;
const SNAP_VELOCITY_MULTIPLIER = 0.4;
const MAX_SNAP_VELOCITY = 4000;
const SEQUENTIAL_THRESHOLD = 24;
const SWIPE_STRENGTH_MAX_DURATION_MS = 360;
const SWIPE_STRENGTH_MIN_SCALAR = 0.1;
const OPEN_SWIPE_HIDDEN_VISIBLE_RATIO = 0.22;
const OPEN_SWIPE_HIDDEN_VELOCITY_MULTIPLIER = 1.25;
const OPEN_SWIPE_REVEALED_VISIBLE_RATIO = 0.5;
const OPEN_SWIPE_REVEALED_OPPOSING_MAX_ABS_VELOCITY = 650;
const DRAG_START_THRESHOLD = 0.3;
const CROSS_AXIS_BIAS = 0.58;
const SCROLL_SLACK_GATE = 0.5;
const SCROLL_SLACK_EPSILON = 1;

const axisOf = (direction: DrawerPhysicalSwipeDirection) =>
	isVerticalSwipeDirection(direction) ? 'y' : 'x';
const signOf = (direction: DrawerPhysicalSwipeDirection) =>
	isNegativeSwipeDirection(direction) ? -1 : 1;

function overflowAllowsScroll(overflow: string) {
	return overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay';
}

function canScrollAlong(element: HTMLElement, direction: DrawerPhysicalSwipeDirection) {
	const style = getComputedStyle(element);
	if (isVerticalSwipeDirection(direction)) {
		if (!overflowAllowsScroll(style.overflowY)) return false;
		return element.scrollHeight > element.clientHeight + SCROLL_SLACK_EPSILON;
	}
	if (!overflowAllowsScroll(style.overflowX)) return false;
	return element.scrollWidth > element.clientWidth + SCROLL_SLACK_EPSILON;
}

function scrollSlack(target: Node | null, container: HTMLElement, direction: DrawerPhysicalSwipeDirection) {
	const vertical = isVerticalSwipeDirection(direction);
	let forward = 0;
	let backward = 0;
	let element: HTMLElement | null = target instanceof HTMLElement ? target : null;
	while (element) {
		if (canScrollAlong(element, direction)) {
			const clientSize = vertical ? element.clientHeight : element.clientWidth;
			const scrollPos = vertical ? element.scrollTop : element.scrollLeft;
			forward += (vertical ? element.scrollHeight : element.scrollWidth) - scrollPos - clientSize;
			backward += scrollPos;
		}
		if (element === container) break;
		element = element.parentElement;
	}
	return { forward, backward };
}

function isDragExempt(target: Node | null, axis: 'x' | 'y'): boolean {
	if (!(target instanceof HTMLElement)) return false;
	let node: HTMLElement | null = target.closest('[data-no-drag]');
	while (node) {
		const value = node.getAttribute('data-no-drag');
		if ((value !== 'x' && value !== 'y') || value === axis) return true;
		node = node.parentElement?.closest('[data-no-drag]') ?? null;
	}
	let walker: HTMLElement | null = target;
	while (walker) {
		if (walker.isContentEditable) return true;
		walker = walker.parentElement;
	}
	const input = target.closest('input');
	if (input instanceof HTMLInputElement && (input.type === 'range' || input.type === 'file')) return true;
	return false;
}

export function isTextSelectedIn(doc: Document, container: HTMLElement | null): boolean {
	if (!container) return false;
	const selection = doc.getSelection();
	if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return false;
	try {
		const range = selection.getRangeAt(0);
		if (container.contains(range.commonAncestorContainer)) return true;
		if (container.contains(selection.anchorNode)) return true;
		if (container.contains(selection.focusNode)) return true;
		return range.intersectsNode(container);
	} catch {
		return false;
	}
}

export function shouldIgnoreDragPointerDown(event: PointerEvent, axis: 'x' | 'y'): boolean {
	if (event.button !== 0) return true;
	const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
	for (const node of path) if (isDragExempt(node as Node, axis)) return true;
	return isDragExempt(event.target as Node | null, axis);
}

export class DrawerSwipeSession {
	dragOffset: number | null = null;

	private start: DrawerPoint | null = null;
	private target: Node | null = null;
	private samples: { axis: number; time: number }[] = [];
	private sampleStart = 0;
	private velocity: number | null = null;
	private gestureStartAxis: number | null = null;
	private gestureStartTime: number | null = null;
	private gestureSign = 1;

	setStart(point: DrawerPoint, target: Node | null) {
		this.start = point;
		this.target = target;
	}

	getStart() {
		return this.start;
	}

	getStartTarget() {
		return this.target;
	}

	clearStart() {
		this.start = null;
		this.target = null;
	}

	private displacement(point: DrawerPoint, direction: DrawerPhysicalSwipeDirection) {
		if (!this.start) return 0;
		const axis = axisOf(direction);
		return (this.start[axis] - point[axis]) * signOf(direction);
	}

	private crossDisplacement(point: DrawerPoint, direction: DrawerPhysicalSwipeDirection) {
		if (!this.start) return 0;
		const cross = axisOf(direction) === 'y' ? 'x' : 'y';
		return point[cross] - this.start[cross];
	}

	track(point: DrawerPoint, direction: DrawerPhysicalSwipeDirection) {
		const axis = axisOf(direction);
		const value = point[axis];
		const now = performance.now();
		if (this.gestureStartAxis === null) {
			this.gestureStartAxis = value;
			this.gestureStartTime = now;
			this.gestureSign = signOf(direction);
		}
		this.samples.push({ axis: value, time: now });
		const cutoff = now - VELOCITY_WINDOW_MS;
		while (this.sampleStart < this.samples.length && this.samples[this.sampleStart].time < cutoff) {
			this.sampleStart += 1;
		}
		if (this.sampleStart >= SAMPLE_COMPACT_THRESHOLD) {
			this.samples = this.samples.slice(this.sampleStart);
			this.sampleStart = 0;
		}
		if (this.samples.length - this.sampleStart < MIN_VELOCITY_SAMPLES) {
			this.velocity = 0;
			return;
		}
		const oldest = this.samples[this.sampleStart];
		const newest = this.samples[this.samples.length - 1];
		const elapsed = newest.time - oldest.time;
		if (elapsed <= 0) {
			this.velocity = 0;
			return;
		}
		const velocity = (((newest.axis - oldest.axis) * this.gestureSign) / elapsed) * 1000;
		this.velocity = Number.isFinite(velocity) ? velocity : 0;
	}

	getReleaseVelocity() {
		const now = performance.now();
		if (this.samples.length - this.sampleStart >= MIN_VELOCITY_SAMPLES) {
			const last = this.samples[this.samples.length - 1];
			if (now - last.time <= MAX_RELEASE_VELOCITY_AGE_MS) return this.velocity ?? 0;
		}
		const last = this.samples[this.samples.length - 1];
		if (this.gestureStartAxis !== null && this.gestureStartTime !== null && last) {
			const elapsed = Math.max(last.time - this.gestureStartTime, MIN_GESTURE_DURATION_MS);
			const velocity = (((last.axis - this.gestureStartAxis) * this.gestureSign) / elapsed) * 1000;
			return Number.isFinite(velocity) ? velocity : 0;
		}
		return this.velocity ?? 0;
	}

	resetVelocity() {
		this.samples = [];
		this.sampleStart = 0;
		this.velocity = null;
		this.gestureStartAxis = null;
		this.gestureStartTime = null;
		this.gestureSign = 1;
	}

	reset() {
		this.dragOffset = null;
		this.clearStart();
		this.resetVelocity();
	}

	setDragOffset(
		point: DrawerPoint,
		activeSnapOffset: number,
		direction: DrawerPhysicalSwipeDirection
	) {
		if (!this.start) {
			this.dragOffset = null;
			return;
		}
		let delta = this.displacement(point, direction) - activeSnapOffset;
		if (delta > 0) delta = Math.sqrt(delta);
		this.dragOffset = -delta;
	}

	setSwipeOpenOffset(
		point: DrawerPoint,
		contentSize: number,
		direction: DrawerPhysicalSwipeDirection
	) {
		if (!this.start) {
			this.dragOffset = null;
			return;
		}
		const openDisplacement = this.displacement(point, direction);
		let offset = contentSize - Math.max(0, openDisplacement);
		if (offset < 0) offset = -Math.sqrt(Math.abs(offset));
		this.dragOffset = offset;
	}

	canStartDrag(
		point: DrawerPoint,
		target: Node | null,
		container: HTMLElement | null,
		preventDragOnScroll: boolean,
		direction: DrawerPhysicalSwipeDirection
	) {
		const resolvedTarget = this.target ?? target;
		if (!this.start || !container) return false;
		if (isDragExempt(resolvedTarget, axisOf(direction))) return false;
		const delta = this.displacement(point, direction);
		if (!preventDragOnScroll) return Math.abs(delta) >= DRAG_START_THRESHOLD;
		if (Math.abs(delta) < DRAG_START_THRESHOLD) return false;
		if (Math.abs(this.crossDisplacement(point, direction)) > Math.abs(delta) * CROSS_AXIS_BIAS) {
			const crossDirection = isVerticalSwipeDirection(direction) ? 'right' : 'down';
			const cross = scrollSlack(resolvedTarget, container, crossDirection);
			if (cross.forward > SCROLL_SLACK_GATE || cross.backward > SCROLL_SLACK_GATE) return false;
		}
		const slack = scrollSlack(resolvedTarget, container, direction);
		if (delta > 0 && slack.forward > SCROLL_SLACK_GATE) return false;
		if (delta < 0 && slack.backward > SCROLL_SLACK_GATE) return false;
		return true;
	}

	private adjustVelocityForDisplacement(velocity: number, displacement: number) {
		const displacementSign = Math.sign(displacement);
		const velocitySign = Math.sign(velocity);
		if (
			displacementSign !== 0 &&
			Math.abs(displacement) >= RELEASE_DISPLACEMENT_TRUST_PX &&
			velocitySign !== 0 &&
			velocitySign !== displacementSign
		) {
			return 0;
		}
		return velocity;
	}

	private projectedOffset(velocity: number, from: number) {
		let target = from;
		if (Math.abs(velocity) >= SNAP_VELOCITY_THRESHOLD) {
			target += clamp(velocity, -MAX_SNAP_VELOCITY, MAX_SNAP_VELOCITY) * SNAP_VELOCITY_MULTIPLIER;
			target = Math.max(0, target);
		}
		return target;
	}

	resolveSnapPointOnRelease(
		snapPoints: DrawerResolvedSnapPoint[],
		activeSnapPoint: DrawerResolvedSnapPoint | null,
		sequential: boolean,
		contentSize: number
	): DrawerSnapPoint | null {
		const dragOffset = this.dragOffset;
		if (dragOffset === null) return snapPoints[0]?.value ?? 1;
		const releaseVelocity = this.getReleaseVelocity();
		if (sequential && activeSnapPoint) {
			const ordered = [...snapPoints].sort((a, b) => a.offset - b.offset);
			let currentIndex = 0;
			let closest = Math.abs(activeSnapPoint.offset - ordered[0].offset);
			for (let index = 1; index < ordered.length; index += 1) {
				const distance = Math.abs(activeSnapPoint.offset - ordered[index].offset);
				if (distance < closest) {
					closest = distance;
					currentIndex = index;
				}
			}
			const current = ordered[currentIndex];
			const delta = dragOffset - current.offset;
			const dragDirection = Math.sign(delta);
			const velocity = this.adjustVelocityForDisplacement(releaseVelocity, delta);
			const velocityDirection = Math.sign(velocity);
			let targetPoint = current;
			let targetOffset = dragOffset;
			if (
				dragDirection !== 0 &&
				velocityDirection === dragDirection &&
				Math.abs(velocity) >= SNAP_VELOCITY_THRESHOLD
			) {
				const adjacent = Math.min(Math.max(currentIndex + dragDirection, 0), ordered.length - 1);
				if (adjacent !== currentIndex) {
					targetPoint = ordered[adjacent];
					targetOffset = targetPoint.offset;
				} else if (dragDirection > 0) {
					return null;
				}
			} else if (delta > SEQUENTIAL_THRESHOLD) {
				const next = ordered[Math.min(currentIndex + 1, ordered.length - 1)];
				if (next) {
					targetPoint = next;
					targetOffset = next.offset;
				}
			} else if (delta < -SEQUENTIAL_THRESHOLD) {
				const previous = ordered[Math.max(currentIndex - 1, 0)];
				if (previous) {
					targetPoint = previous;
					targetOffset = previous.offset;
				}
			}
			if (Math.abs(targetOffset - contentSize) < Math.abs(targetOffset - targetPoint.offset)) return null;
			return targetPoint.value;
		}
		const restOffset = activeSnapPoint?.offset ?? 0;
		const velocity = this.adjustVelocityForDisplacement(releaseVelocity, dragOffset - restOffset);
		return findClosestSnapPoint(this.projectedOffset(velocity, dragOffset), snapPoints)?.value ?? null;
	}

	shouldDismissOnRelease(
		contentSize: number | null,
		snapPoints: DrawerResolvedSnapPoint[],
		restOffset: number
	) {
		const dragOffset = this.dragOffset;
		if (dragOffset === null || contentSize === null) return false;
		const velocity = this.adjustVelocityForDisplacement(this.getReleaseVelocity(), dragOffset - restOffset);
		if (contentSize - dragOffset <= 0) return true;
		const closest = findClosestSnapPoint(this.projectedOffset(velocity, dragOffset), snapPoints);
		if (!closest) return false;
		const target = this.projectedOffset(velocity, dragOffset);
		return Math.abs(target - contentSize) < Math.abs(target - closest.offset);
	}

	shouldOpenOnRelease(
		contentSize: number | null,
		swipeVelocityThreshold: number,
		openThreshold: number
	) {
		const dragOffset = this.dragOffset;
		if (dragOffset === null || contentSize === null) return false;
		const visibleSize = contentSize - dragOffset;
		const visibleRatio = visibleSize / contentSize;
		let velocity = this.getReleaseVelocity();
		if (
			visibleRatio < OPEN_SWIPE_HIDDEN_VISIBLE_RATIO &&
			velocity < 0 &&
			Math.abs(velocity) < swipeVelocityThreshold * OPEN_SWIPE_HIDDEN_VELOCITY_MULTIPLIER
		) {
			velocity = 0;
		}
		if (
			visibleRatio > OPEN_SWIPE_REVEALED_VISIBLE_RATIO &&
			velocity > 0 &&
			Math.abs(velocity) < OPEN_SWIPE_REVEALED_OPPOSING_MAX_ABS_VELOCITY
		) {
			velocity = 0;
		}
		return (velocity < 0 && Math.abs(velocity) >= swipeVelocityThreshold) || visibleSize >= contentSize * openThreshold;
	}

	getSwipeStrength(targetOffset: number, restOffset: number | null = null) {
		const dragOffset = this.dragOffset;
		if (dragOffset === null) return 1;
		let velocity = this.getReleaseVelocity();
		if (restOffset !== null) velocity = this.adjustVelocityForDisplacement(velocity, dragOffset - restOffset);
		const distance = Math.abs(dragOffset - targetOffset);
		const absVelocity = Math.abs(velocity);
		if (absVelocity <= 0 || distance <= 0) return 1;
		const estimatedTimeMs = (distance / absVelocity) * 1000;
		const normalized = clamp(estimatedTimeMs / SWIPE_STRENGTH_MAX_DURATION_MS, 0, 1);
		return SWIPE_STRENGTH_MIN_SCALAR + normalized * 0.9;
	}
}
