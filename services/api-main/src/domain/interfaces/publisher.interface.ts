export interface Publisher {
    publish: (channel: string, msg: string) => Promise<void>;
}
