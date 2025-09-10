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
    private current: State<T>;

    public add(name: T, state: State<T>): this {
        if (this.map[name]) throw new Error(`State "${name}" already exists!`);
        this.map[name] = state;

        if (!this.current) {
            this.current = state;
            this.current.enter();
        }

        return this;
    }

    public remove(name: string): boolean {
        if (!this.map[name] || this.map[name] == this.current) return false;

        delete this.map[name];
        return true;
    }

    public change(name: string, ...args: any[]) {
        if (!this.map[name]) throw new Error(`State "${name}" doesn't exists!`);

        this.current.exit();
        this.current = this.map[name];
        this.current.enter(...args);
    }

    public update(input: Input, delta: number) {
        if (!this.current) throw new Error(`No current state selected! Are states added to this machine?`);

        const state = this.current.input(input);
        if (state) {
            if (typeof state == "string") this.change(state);
            else this.change(state.name, ...(state.args || []));
        }
        this.current.update(delta);
    }
}

export { Machine, State, Transition };
