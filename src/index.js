const client = require("axios").default;
const EventEmitter = require("events");

module.exports = class UptimeKumaApi extends EventEmitter {

    _pushTimer;

    constructor() {
        super();
    }

    push(url) {
        client.get(url).then(res => {
            this.emit("pushSuccessful", url);
        }).catch(err => {
            this.emit("pushFailed", url, err);
        });
    }

    startPushing(url, interval=60) {
        if(this._pushTimer)
            this._pushTimer.cancel();
        this._pushTimer = setInterval(() => {
            this.push(url);
        }, interval*1000);
        this.push(url);
    }

    cancelPushing() {
        if(this._pushTimer)
            this._pushTimer.cancel();
    }
}