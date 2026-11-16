import { render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import QrCodeBasic from './harness/QrCodeBasic.svelte';
import QrCodeHarness from './harness/QrCodeHarness.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

describe('QrCode', () => {
	test('renders the Ark contract', () => {
		render(QrCodeBasic, { props: {} });

		const root = $('[data-scope="qr-code"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('qr-code-root');
		expect(root.id).toMatch(/^qrcode:.+:root$/);
		expect(root.style.getPropertyValue('--qrcode-pixel-size')).toBe('5px');

		const frame = $('[data-part="frame"]')!;
		expect(frame.getAttribute('data-slot')).toBe('qr-code-frame');
		expect(frame.getAttribute('viewBox')).toBe('0 0 115 115');
		expect(root.style.getPropertyValue('--qrcode-width')).toBe('115px');

		const pattern = $('[data-part="pattern"]')!;
		expect(pattern.getAttribute('data-slot')).toBe('qr-code-pattern');
		expect(pattern.getAttribute('d')?.startsWith('M5,5h5v5h-5z')).toBe(true);

		const overlay = $('[data-part="overlay"]')!;
		expect(overlay.getAttribute('data-slot')).toBe('qr-code-overlay');
		expect(overlay.style.position).toBe('absolute');

		const trigger = $('[data-part="download-trigger"]')!;
		expect(trigger.getAttribute('data-slot')).toBe('qr-code-download-trigger');
		expect(trigger.getAttribute('type')).toBe('button');
	});

	test('renders a square frame sized by pixelSize', () => {
		render(QrCodeBasic, { props: { pixelSize: 2 } });

		const frame = $('[data-part="frame"]')!;
		const [, , width, height] = frame.getAttribute('viewBox')!.split(' ').map(Number);
		expect(width).toBe(height);
		expect(width).toBe(46);
	});

	test('encodes string values through the api', async () => {
		const { findByTestId } = render(QrCodeHarness, { props: {} });

		const pattern = $('[data-part="pattern"]')!;
		const initial = pattern.getAttribute('d');
		expect(initial?.length).toBeGreaterThan(0);

		(await findByTestId('next')).click();
		await vi.waitFor(() => {
			expect($('[data-part="pattern"]')!.getAttribute('d')).not.toBe(initial);
		});
		expect(document.querySelector('[data-part="value"]')!.textContent).toBe('rta ui 2');
	});

	test('serializes the frame to a data URL', async () => {
		const { findByTestId } = render(QrCodeHarness, { props: {} });

		(await findByTestId('data-url')).click();
		await vi.waitFor(() => {
			const output = document.querySelector('[data-part="data-url"]')!.textContent ?? '';
			expect(output.startsWith('data:image/svg+xml')).toBe(true);
		});
	});
});
