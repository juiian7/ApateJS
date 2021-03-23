# ApateJS
A simple 2D retro game engine which runs directly in your browser.

## Usage

```js
import { apate } from './apatejs/apate.js';
```

**NOTE:**
* Include javascript game file as a module
* Import after body or use defer

```html
<script type="module" src="main.js" defer></script>
```

## Hello World!

```js
import { apate } from './apatejs/apate.js';

apate.on('draw', () => {
  apate.screen.text(1, 1, 'Hello World!', apate.colors.white);
});

apate.run();
```
