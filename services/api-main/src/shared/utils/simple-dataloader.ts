// Simple per-request DataLoader implementation.
// It batches multiple load calls within the same microtask into a single batch function call.
// This avoids requiring an external dependency like `dataloader`.

export type BatchFunction<K, V> = (keys: readonly K[]) => Promise<(V | null)[]>;

/**
 * SimpleDataLoader batches calls to `.load(key)` and caches results for the duration
 * of a single request. Each unique key will only be queried once per request.
 */
export class SimpleDataLoader<K, V> {
  private batchFn: BatchFunction<K, V>;
  private cache: Map<K, Promise<V | null>> = new Map();
  private queue: { key: K; resolve: (value: V | null) => void; reject: (error: unknown) => void }[] = [];
  private scheduled = false;

  constructor(batchFn: BatchFunction<K, V>) {
    this.batchFn = batchFn;
  }

  /**
   * Loads a value by key. If the key has already been loaded in this request, the cached value
   * is returned. Otherwise the key is queued for batch loading.
   */
  public load(key: K): Promise<V | null> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    const promise = new Promise<V | null>((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      if (!this.scheduled) {
        this.scheduled = true;
        queueMicrotask(() => this.flush());
      }
    });
    this.cache.set(key, promise);
    return promise;
  }

  /**
   * Executes the batch function for all queued keys and resolves or rejects each pending promise.
   */
  private async flush() {
    this.scheduled = false;
    const batch = this.queue;
    this.queue = [];
    const keys = batch.map((item) => item.key);
    try {
      const results = await this.batchFn(keys);
      for (let i = 0; i < batch.length; i++) {
        batch[i].resolve(results[i] ?? null);
      }
    } catch (err) {
      for (const item of batch) {
        item.reject(err);
      }
    }
  }
}