// Simple Optional type helper. Returns the value if provided or null otherwise.
export type Optional<T> = T | null;

export const Optional = <T>(v: T | null): Optional<T> => v;