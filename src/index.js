const client = require("axios").default;
const EventEmitter = require("events");

module.exports = class UptimeKumaApi extends EventEmitter {

    _pushTimer;
    _baseURL;

    constructor(baseURL = "") {
        super();
        this._baseURL = baseURL.endsWith("/") ? baseURL : baseURL + "/";
    }

    push(url) {
        client.get(url).then(res => {
            this.emit("pushSuccessful", url);
        }).catch(err => {
            this.emit("pushFailed", url, err);
        });
    }

    startPushing(code, interval = 60) {
        if (this._pushTimer)
            this._pushTimer.cancel();
        this._pushTimer = setInterval(() => {
            this.push(this._baseURL+"api/push/"+code);
        }, interval * 1000);
        this.push(this._baseURL+"api/push/"+code);
    }

    cancelPushing() {
        if (this._pushTimer)
            this._pushTimer.cancel();
    }

    async status() {
        let resp = await client.get(this._baseURL + "api/status-page/monitor-list");
        let heartBeats = (await client.get(this._baseURL + "api/status-page/heartbeat")).data;
        let result = [];
        for (let srcCategory of resp.data) {
            let targetCategory = {id: srcCategory.id, name: srcCategory.name, weight: srcCategory.weight, monitors: []};
            for (let srcMonitor of srcCategory.monitorList) {
                targetCategory.monitors.push({
                    id: srcMonitor.id,
                    name: srcMonitor.name,
                    uptime: heartBeats.uptimeList[srcMonitor.id + "_24"],
                    heartbeats: heartBeats.heartbeatList[srcMonitor.id]
                });
            }
            result.push(targetCategory);
        }
        return result;
    }
}