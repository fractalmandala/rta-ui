import { describe, expect, it } from 'vitest';
import { qrEncode, qrPatternPath } from '../src/lib/components/qr-code/qr-encode';

const darkCount = (matrix: ReturnType<typeof qrEncode>) =>
	matrix.data.flat().filter((module) => module).length;

describe('qrEncode', () => {
	it('matches reference matrices', () => {
		const cases: Array<[string, Parameters<typeof qrEncode>[1], [number, number, number, number]]> = [
			['hello world', {}, [23, 1, 0, 232]],
			['HELLO', { ecc: 'H' }, [23, 1, 3, 220]],
			['0123456789', { ecc: 'M', boostEcc: true }, [23, 1, 6, 224]],
			[
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
				{},
				[51, 8, 1, 1243],
			],
		];

		for (const [value, encoding, [size, version, mask, dark]] of cases) {
			const matrix = qrEncode(value, encoding);
			expect({ size: matrix.size, version: matrix.version, mask: matrix.maskPattern }).toEqual({
				size,
				version,
				mask,
			});
			expect(darkCount(matrix)).toBe(dark);
		}
	});

	it('adds the requested quiet-zone border', () => {
		const matrix = qrEncode('x', { border: 4 });
		expect(matrix.size).toBe(29);
		expect(matrix.data[0].every((module) => !module)).toBe(true);
		expect(matrix.data[4].slice(0, 4).every((module) => !module)).toBe(true);
	});

	it('builds a path with one square per dark module', () => {
		const matrix = qrEncode('hello world', { border: 0 });
		const path = qrPatternPath(matrix, 10);
		expect(path.startsWith('M')).toBe(true);
		expect(path.split('M').length - 1).toBe(darkCount(matrix));
		expect(path).toContain('M0,0h10v10h-10z');
	});
});
