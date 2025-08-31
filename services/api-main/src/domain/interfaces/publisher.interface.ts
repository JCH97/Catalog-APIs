export interface IPublisher {
    publish: (channel: string, msg: string) => Promise<void>;
}
