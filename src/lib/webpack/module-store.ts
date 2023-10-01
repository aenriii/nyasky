import { RecordStore } from "@utils/store";
import { webpackCache } from ".";
import { Logger } from "@utils/logger";

class ModuleStore implements RecordStore<number, unknown> {
    private get _modules(): Record<number, unknown> {
        return webpackCache
    };
    private _subscribers: Record<number, ((value: unknown, oldValue?: unknown) => void)[]> = {};
    private _allSubscribers: ((key: number, value: unknown, oldValue?: unknown) => void)[] = [];
    private logger = new Logger("ModuleStore");
    private _cache: Record<any, number[]> = {};
    get(key: number): unknown {
        return this._modules[key];
    }
    set(key: number, value: unknown): void {
        this.logger.warn("Setting module with key", key, "to", value ?? "undefined");
        let oldValue = this._modules[key];
        this._modules[key] = value;
        this._subscribers[key]?.forEach(cb => cb(value, oldValue));
        this._allSubscribers.forEach(cb => cb(key, value, oldValue));
    }
    update(key: number, cb: (value: unknown) => unknown): void {
        this.logger.warn("Updating module with key", key);
        this.set(key, cb(this.get(key)));
    }
    subscribe(key: number, cb: (value: unknown, oldValue?: unknown) => void): () => void {
        if (this._subscribers[key] == void 0) {
            this._subscribers[key] = [];
        }
        this._subscribers[key].push(cb);
        return () => {
            this._subscribers[key] = this._subscribers[key].filter(v => v != cb);
        }
    }
    subscribeAll(cb: (key: number, value: unknown, oldValue?: unknown) => void): () => void {
        this._allSubscribers.push(cb);
        return () => {
            this._allSubscribers = this._allSubscribers.filter(v => v != cb);
        }
    }

    find<T>(filter: (mod: any) => boolean, bypassCache: boolean = false): T {
        if (!bypassCache && this._cache[filter.toString()] != void 0) {
            return this._cache[filter.toString()].map(v => this.get(v))?.[0] as T;
        }
        let results: number[] = [];
        for (let key in this._modules) {
            let value = this._modules[key];
            if (filter(value)) {
                return this.get(Number(key)) as T;
            }
        }
        return void 0 as T;
    }
    findAll<T>(filter: (mod: any) => boolean, bypassCache: boolean = false): T[] {
        if (!bypassCache && this._cache[filter.toString()] != void 0) {
            return this._cache[filter.toString()].map(v => this.get(v)) as T[];
        }
        let results: number[] = [];
        for (let key in this._modules) {
            let value = this._modules[key];
            if (filter(value)) {
                results.push(Number(key));
            }
        }
        return results.map(v => this.get(v)) as T[];
    }

    findByProps<T>(...props: string[]): T {
        return this.find<T>(mod => props.every(prop => mod[prop] != void 0));
    }
    findAllByProps<T>(...props: string[]): T[] {
        return this.findAll<T>(mod => props.every(prop => mod[prop] != void 0));
    }

    findByDisplayName<T>(name: string): T {
        return this.find<T>(mod => mod.displayName == name);
    }
    findAllByDisplayName<T>(name: string): T[] {
        return this.findAll<T>(mod => mod.displayName == name);
    }

    findByCode<T>(...codes: (string | RegExp)[]): T {
        return this.find<T>(mod => codes.every(code => {
            if (typeof code == "string") {
                return mod.toString().includes(code);
            } else {
                return code.test(mod.toString());
            }
        }));
    }

    findAllByCode<T>(...codes: (string | RegExp)[]): T[] {
        return this.findAll<T>(mod => codes.every(code => {
            if (typeof code == "string") {
                return mod.toString().includes(code);
            } else {
                return code.test(mod.toString());
            }
        }));
    }
}
export default new ModuleStore();