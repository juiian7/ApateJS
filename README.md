# ApateJS
A simple 2D retro game engine with runs directly in your browser.

## Usage

```js
import { apate } from './apatejs/apate.js';
```

**NOTE:**
* Include javascript game file as module
* Import after body or use defer

```html
<script type="module" src="main.js" defer></script>
```

## Hello World!

```js
import { apate } from './apatejs/apate.js';

let white = {
    r: 255,
    g: 255,
    b: 255
}

apate.on('draw', () => {
  apate.screen.text(1, 1, 'Hello World!', white);
});

apate.run();
```