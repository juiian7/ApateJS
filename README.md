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
## Events
There are a few events which will help to run your game:
|     Name      |                               Time of execution                              |    Parameters    |
|---------------|------------------------------------------------------------------------------|------------------|
| `start`       | Once the game is running                                                     | -                |
| `update`      | Called every tick (~230 ticks per second, depends on browser limit)          | delta: `number` (Time since last call) |
| `draw`        | Called every frame (~60 times per second, depends on browsers refresh rate)  | -                |
| `click`       | Triggered on mouse click                                                     | info: `{isLeftClick: boolean}`|
| `mouseDown`   | Triggered when left mouse button is pressed down                             | -                |
| `mouseUp`     | Triggered when left mouse button is released                                 | -                |
| `btnDown`     | Triggered when any key pressed down                                          | keyInfo: `{key: string, shift: boolean, metaKey: boolean}`|
| `btnUp`       | Triggered when any key is released                                           | keyInfo: `{key: string, shift: boolean, metaKey: boolean}`|

You can register to the events like this:
```js
apate.on('update', (delta) => { ... });
```
or simply
```js
apate.update = (delta) => { ... };
```
