<script lang="ts">
  import { Typeset } from '../../lib/index';
</script>

<Typeset>
  <h1>Typeset</h1>
  <p>
    Unstyled HTML becomes readable prose. Every child is styled by the typeset root, so markdown
    output needs no per-tag classes.
  </p>
  <h2>Nested headings</h2>
  <ul>
    <li>Lists keep their markers</li>
    <li>Code spans such as <code>cn()</code> stay inline</li>
  </ul>
  <blockquote>A quiet quote.</blockquote>
  <pre><code>const value = 1;</code></pre>
</Typeset>
