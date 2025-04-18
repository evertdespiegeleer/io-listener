import { KeyboardListener } from "../src/main.ts";

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