const client = require("axios").default;
const EventEmitter = require("events");
const {io} = require("socket.io-client");

module.exports = class UptimeKumaApi extends EventEmitter {

    _pushTimers = {};
    _baseURL;

    constructor(baseURL = "") {
        super();
        this._baseURL = baseURL.endsWith("/") ? baseURL : baseURL + "/";
    }

    push(url) {
        let params = {status: "up", msg: "OK", ping: undefined};
        this.emit("prePush", url, params);
        client.get(url, {params}).then(res => {
            this.emit("pushSuccessful", url);
        }).catch(err => {
            this.emit("pushFailed", url, err);
        });
    }

    startPushing(code, interval = 60) {
        if (this._pushTimers[code])
            this._pushTimers[code].cancel();
        this._pushTimers[code] = setInterval(() => {
            this.push(this._baseURL + "api/push/" + code);
        }, interval * 1000);
        this.push(this._baseURL + "api/push/" + code);
    }

    cancelPushing(code = undefined) {
        if (code) {
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
        let resp = await client.get(this._baseURL + "api/status-page/" + name);
        let heartBeats = (await client.get(this._baseURL + "api/status-page/heartbeat/" + name)).data;
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

    async connect() {
        this._socket = io(this._baseURL, {
            transports: ["websocket"],
            upgrade: true
        });
        this._socket.onAny((event, ...args) => {
            this.processMessage(event, ...args);
        });
        return new Promise((resolve, reject) => {
            this._socket.on("connect", () => {
                this._socket.emit("login", {
                    username: this._username,
                    password: this._password,
                    token: ""
                }, () => {
                    resolve();
                });
            });
            this._socket.on("connect_error", (err) => {
                reject(err);
            });
        });
    }

    async processMessage(event, ...args) {
        switch (event) {
            case "430": {
                this.emit("login", data[0]);
                break;
            }
        }
    }

    async handleReconnect() {
        this.connect();
    }

    async login(username, password) {
        this._username = username;
        this._password = password;
        await this.connect();
    }

    getDatabaseSize() {
        return new Promise((resolve, reject) => {
            this._socket.emit("getDatabaseSize", (args) => {
                if (args.ok)
                    resolve(args.size);
                else
                    reject(args.error);
            });
        });
    }
}