export default class UptimeKumaApi {
    constructor(baseURL: string);

    /**
     * Starts pushing heartbeats to the server
     * @param code The monitor code
     * @param interval The interval in seconds
     */
    startPushing(code: string, interval?: number);

    cancelPushing();

    on(event: "pushSuccessful", handle: (url: string) => void);
    on(event: "pushFailed", handle: (url: string, err: Error) => void);
    on(event: "prePush", handle: (url: string, params: {status:"up"|"down",msg:string,ping?:number}) => void);

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
