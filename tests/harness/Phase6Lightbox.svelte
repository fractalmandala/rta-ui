<script lang="ts">
	import {
		Lightbox,
		LightboxBackdrop,
		LightboxBody,
		LightboxCaption,
		LightboxCloseIcon,
		LightboxCloseTrigger,
		LightboxContent,
		LightboxCounter,
		LightboxDescription,
		LightboxDownloadTrigger,
		LightboxFooter,
		LightboxGallery,
		LightboxHeader,
		LightboxImage,
		LightboxNextTrigger,
		LightboxPositioner,
		LightboxPrevTrigger,
		LightboxThumbnails,
		LightboxTitle,
		LightboxTrigger,
		LightboxViewport,
		LightboxZoomTrigger,
		type LightboxIndexChangeDetails,
		type LightboxSource,
		type LightboxZoomChangeDetails
	} from '../../src/lib/components/lightbox/index';

	const defaultSources: LightboxSource[] = [
		{ src: 'https://example.test/one.jpg', alt: 'One', caption: 'The first image' },
		{ src: 'https://example.test/two.jpg', alt: 'Two', caption: 'The second image' },
		{ src: 'https://example.test/three.jpg', alt: 'Three', caption: 'The third image' }
	];

	let {
		sources = defaultSources,
		index = $bindable(0),
		zoom = $bindable(1),
		loop = false,
		closeOnClick = false,
		onIndexChange,
		onOpenChange,
		onZoomChange
	}: {
		sources?: LightboxSource[];
		index?: number;
		zoom?: number;
		loop?: boolean;
		closeOnClick?: boolean;
		onIndexChange?: (details: LightboxIndexChangeDetails) => void;
		onOpenChange?: (details: { open: boolean }) => void;
		onZoomChange?: (details: LightboxZoomChangeDetails) => void;
	} = $props();
</script>

<Lightbox
	{sources}
	bind:index
	bind:zoom
	{loop}
	aria-label="Photo gallery"
	{onIndexChange}
	{onOpenChange}
	{onZoomChange}
>
	<LightboxTrigger>Open gallery</LightboxTrigger>
	<LightboxBackdrop />
	<LightboxPositioner>
		<LightboxContent>
			<LightboxHeader>
				<LightboxTitle>Wedding photos</LightboxTitle>
				<LightboxDescription>Three images from the ceremony</LightboxDescription>
			</LightboxHeader>
			<LightboxBody>
				<LightboxGallery>
					<LightboxPrevTrigger />
					<LightboxViewport>
						<LightboxImage {closeOnClick} />
					</LightboxViewport>
					<LightboxNextTrigger />
				</LightboxGallery>
				<LightboxThumbnails />
			</LightboxBody>
			<LightboxFooter>
				<LightboxCounter />
				<LightboxCaption />
				<LightboxZoomTrigger />
				<LightboxDownloadTrigger />
				<LightboxCloseTrigger>Close</LightboxCloseTrigger>
			</LightboxFooter>
			<LightboxCloseIcon />
		</LightboxContent>
	</LightboxPositioner>
</Lightbox>

<output data-testid="index">{index}</output>
<output data-testid="zoom">{zoom}</output>
