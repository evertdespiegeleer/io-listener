import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { createPythonProcess } from "./python-process.ts";
import EventEmitter from "node:events";

type BaseEventData = {
    downKeysSet: Set<string>;
    downKeys: string[];
}

type KeyEventData = BaseEventData & {
    direction: 'down' | 'up';
    key: string;
}

type EventMap = {
    keyDown: [event: KeyEventData];
    keyUp: [event: KeyEventData];
    activeKeysUpdate: [event: BaseEventData];
};

type EventType = keyof EventMap;

export class KeyboardListener extends EventEmitter<EventMap> {
    private downKeysSet: Set<string> = new Set<string>();

    constructor() {
        super();
    }

    private process: ChildProcessWithoutNullStreams | undefined;

    async listen () {
        this.process = await createPythonProcess()
        console.log('Python process started');
        this.process.stdout.on('data', (data) => {
            const dataString = data.toString().trim()
        
            const direction = dataString.split(' ')[0] as 'down' | 'up';
            const key = dataString.split(' ')[1]?.replaceAll(/'/g, '');
        
            this.handleKeyAction(key, direction)
        });
    }

    stop () {
        if (this.process) {
            this.process.kill();
            this.process = undefined;
        }
    }

    private handleKeyAction(key: string, direction: 'down' | 'up') {
        if (direction === 'down') {
            this.downKeysSet.add(key);
        } else if (direction === 'up') {
            this.downKeysSet.delete(key);
        }

        const baseEventData: BaseEventData = {
            downKeysSet: this.downKeysSet,
            downKeys: Array.from(this.downKeysSet)
        }

        const keyEventData: KeyEventData = {
            ...baseEventData,
            direction,
            key
        }

        if (direction === 'down') {
            this.emit('keyDown', keyEventData);
        }
        if (direction === 'up') {
            this.emit('keyUp', keyEventData);
        }
        this.emit('activeKeysUpdate', baseEventData);
    }

    override on<E extends EventType>(event: E, listener: (...args: EventMap[E]) => void): this {
        return super.on(event, listener as any);
    }

    override emit<E extends EventType>(event: E, ...args: EventMap[E]): boolean {
        return super.emit(event, ...(args as any));
    }
}
