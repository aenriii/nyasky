
export interface Store<T> {
    get(): T
    set(value: T): void
    update(cb: (value: T) => T): void
    subscribe(cb: (value: T) => void): () => void
}

export interface RecordStore<K, V> {
    get(key: K): V
    set(key: K, value: V): void
    update(key: K, cb: (value: V) => V): void
    subscribe(key: K, cb: (value: V, oldValue?: V) => void): () => void
    subscribeAll(cb: (key: K, value: V, oldValue?: V) => void): () => void
}