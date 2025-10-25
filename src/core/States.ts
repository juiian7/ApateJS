import { Input } from "./Input.js";

type Transition<T> = { name: T; args?: any[] } | T | void;
interface State<T extends string = string> {
    enter(...args: any[]): void;
    input(input: Input): Transition<T>;
    update(delta: number): void;
    exit(): void;
}

class Machine<T extends string = string> {
    private map: { [name: string]: State<T> } = {};
    private currentName: T;
    private global?: State<T>;

    public get current(): T {
        return this.currentName;
    }

    public add(name: T, state: State<T>): this {
        if (this.map[name]) throw new Error(`State "${name}" already exists!`);
        this.map[name] = state;

        if (!this.currentName) {
            this.currentName = name;
            this.map[this.currentName].enter();
        }

        return this;
    }

    public setGlobal(state: State<T>): this {
        this.global = state;
        return this;
    }

    public remove(name: T): boolean {
        if (!this.map[name] || name == this.currentName) return false;

        delete this.map[name];
        return true;
    }

    public change(name: T, ...args: any[]) {
        if (!this.map[name]) throw new Error(`State "${name}" doesn't exists!`);

        this.map[this.currentName].exit();
        this.currentName = name;
        this.map[this.currentName].enter(...args);
    }

    public update(input: Input, delta: number) {
        if (!this.currentName) throw new Error(`No current state selected! Are states added to this machine?`);

        const state = (this.global && this.global.input(input)) || this.map[this.currentName].input(input);
        if (state) {
            if (typeof state == "string") this.change(state);
            else this.change(state.name, ...(state.args || []));

            this.map[this.currentName].input(input);
        }
        this.map[this.currentName].update(delta);
        if (this.global) this.global.update(delta);
    }
}

export { Machine, State, Transition };
