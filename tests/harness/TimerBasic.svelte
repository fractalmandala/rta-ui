<script lang="ts">
	import { Timer, TimerActionTrigger, TimerControl, TimerSegments } from '../../src/lib/index';

	let { autoStart = undefined, startMs = undefined }: {
		autoStart?: boolean;
		startMs?: number;
	} = $props();
</script>

<Timer {autoStart} {startMs}>
	<TimerSegments />
	<TimerControl>
		<TimerActionTrigger action="start">Start</TimerActionTrigger>
		<TimerActionTrigger action="pause">Pause</TimerActionTrigger>
		<TimerActionTrigger action="resume">Resume</TimerActionTrigger>
		<TimerActionTrigger action="reset">Reset</TimerActionTrigger>
		<TimerActionTrigger action="restart">Restart</TimerActionTrigger>
	</TimerControl>
</Timer>
