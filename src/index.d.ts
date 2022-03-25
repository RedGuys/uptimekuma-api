export default class UptimeKumaApi {
    constructor(baseURL: string);

    startPushing(code: string, interval?: number);

    cancelPushing();

    on(event: "pushSuccessful", handle: (url: string) => void);
    on(event: "pushFailed", handle: (url: string, err: Error) => void);

    status(name?:string): Promise<[{
        id: number,
        name: string,
        weight: number, monitors: [{
            id: number,
            name: string,
            uptime: number,
            heartbeats: [{
                status: number,
                time: string,
                msg: string,
                ping: number
            }]
        }]
    }]>;
}
