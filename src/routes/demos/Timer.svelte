<script lang="ts">
	import { Timer, TimerActionTrigger, TimerControl, TimerSegments } from '../../lib/index';
</script>

<Timer targetMs={60 * 60 * 1000} startMs={40 * 60 * 1000}>
	<TimerSegments />
	<TimerControl>
		<TimerActionTrigger action="start">Start</TimerActionTrigger>
		<TimerActionTrigger action="resume">Resume</TimerActionTrigger>
		<TimerActionTrigger action="pause">Pause</TimerActionTrigger>
		<TimerActionTrigger action="reset">Reset</TimerActionTrigger>
	</TimerControl>
</Timer>
