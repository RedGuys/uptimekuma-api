export default class UptimeKumaApi {
    /**
     * Creates a new instance of the UptimeKumaApi class
     * @param baseURL
     */
    constructor(baseURL: string);

    /**
     * Starts pushing heartbeats to the server
     * @param code The monitor code
     * @param interval The interval in seconds
     */
    startPushing(code: string, interval?: number);

    /**
     * Stops pushing heartbeats to the server
     * @param code The monitor code, if not specified, all monitors will be stopped
     */
    cancelPushing(code?: string);

    on(event: "pushSuccessful", handle: (url: string) => void);
    on(event: "pushFailed", handle: (url: string, err: Error) => void);
    on(event: "prePush", handle: (url: string, params: {status:"up"|"down",msg:string,ping?:number}) => void);

    /**
     * Gets the status of public monitors
     * @param name The name of target status page
     */
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
