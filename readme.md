# io-listener

`io-listener` is a node.js library that provides a simple way to listen for global keyboard events.

## Platform limitations
The library is a wrapper around the excellent [pynput](https://github.com/moses-palmer/pynput) Python library. A Python based executable is bundled with the library. 3 platforms are supported:

- Windows (win32)
- Linux (linux)
- MacOS (darwin)

The library is not supported on other platforms.

## Installation

```sh
npm install io-listener
```

## Usage

```ts
import { KeyboardListener } from "io-listener";

const listener = new KeyboardListener()
await listener.listen()

console.log('Listening for key events...')

listener.on('keyDown', (event) => {
    console.log('Key Down:', event.key);
})

listener.on('keyDown', (event) => {
    if (event.downKeysSet.has('Key.cmd') && event.downKeysSet.has('a')) {
        console.log('Command + A pressed');
    }
})

// listener.stop()
```

## Development

Prepare the repository:

```sh
./scripts/dev-init.sh
```

Build the Python executable:

```sh
./scripts/local-build-python.sh
```

Build the library code:

```sh
npm run build
```
