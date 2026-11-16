<script lang="ts">
	import {
		Lightbox,
		LightboxBackdrop,
		LightboxBody,
		LightboxCaption,
		LightboxCloseIcon,
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
		type LightboxSource
	} from '../../lib/components/lightbox/index';

	const sources: LightboxSource[] = [
		{
			src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
			alt: 'A lake at dusk',
			caption: 'Lake at dusk'
		},
		{
			src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
			alt: 'A mountain trail',
			caption: 'Mountain trail'
		},
		{
			src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
			alt: 'Fog in a forest',
			caption: 'Fog in a forest'
		}
	];

	let index = $state(0);
	let zoom = $state(1);
</script>

<Lightbox {sources} bind:index bind:zoom loop aria-label="Photo gallery">
	<LightboxTrigger>Open gallery</LightboxTrigger>
	<LightboxBackdrop />
	<LightboxPositioner>
		<LightboxContent>
			<LightboxHeader>
				<LightboxTitle>Landscapes</LightboxTitle>
				<LightboxDescription>Arrow keys move between images.</LightboxDescription>
			</LightboxHeader>
			<LightboxBody>
				<LightboxGallery>
					<LightboxPrevTrigger />
					<LightboxViewport>
						<LightboxImage />
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
			</LightboxFooter>
			<LightboxCloseIcon />
		</LightboxContent>
	</LightboxPositioner>
</Lightbox>
