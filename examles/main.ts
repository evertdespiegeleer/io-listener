import { KeyboardListener } from "../dist/main.js";

const listener = new KeyboardListener()
await listener.listen()
console.log('Listening for key events...')
listener.on('activeKeysUpdate', (event) => {
    if (event.downKeysSet.has('Key.cmd') && event.downKeysSet.has('a')) {
        console.log('Command + A pressed');
        listener.stop()
    }
})
