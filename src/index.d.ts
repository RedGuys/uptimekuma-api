export default class UptimeKumaApi {
    constructor();

    startPushing(url:string, interval?:number);
    cancelPushing();

    on(event: "pushSuccessful", handle: (url: string) => void);
    on(event: "pushFailed", handle: (url: string, err: Error) => void);
}
