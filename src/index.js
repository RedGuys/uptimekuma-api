const client = require("axios").default;
const EventEmitter = require("events");

module.exports = class UptimeKumaApi extends EventEmitter {

    _pushTimers = {};
    _baseURL;

    constructor(baseURL = "") {
        super();
        this._baseURL = baseURL.endsWith("/") ? baseURL : baseURL + "/";
    }

    push(url) {
        let params = {status:"up",msg:"OK",ping:undefined};
        this.emit("prePush", url, params);
        client.get(url,{params}).then(res => {
            this.emit("pushSuccessful", url);
        }).catch(err => {
            this.emit("pushFailed", url, err);
        });
    }

    startPushing(code, interval = 60) {
        if (this._pushTimers[code])
            this._pushTimers[code].cancel();
        this._pushTimers[code] = setInterval(() => {
            this.push(this._baseURL+"api/push/"+code);
        }, interval * 1000);
        this.push(this._baseURL+"api/push/"+code);
    }

    cancelPushing(code = undefined) {
        if(code) {
            if (this._pushTimers[code])
                this._pushTimers[code].cancel();
        } else {
            for (let code in this._pushTimers) {
                if (this._pushTimers.hasOwnProperty(code)) {
                    this._pushTimers[code].cancel();
                }
            }
        }
    }

    async status(name = "default") {
        let resp = await client.get(this._baseURL + "api/status-page/"+name);
        let heartBeats = (await client.get(this._baseURL + "api/status-page/heartbeat/"+name)).data;
        let result = [];
        for (let srcCategory of resp.data.publicGroupList) {
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