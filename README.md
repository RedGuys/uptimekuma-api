# UptimeKuma-api

Supports UptimeKuma versions from 1.13.1 to 1.23.10

## Installation

```bash
npm install uptimekuma-api
```

## Usage

### Start pushing
```js
let kuma = new UptimeKuma("https://kuma.url/");

kuma.startPushing("push code",60);
```

### Stop pushing
```js
kuma.cancelPushing();
```

### Get statuses
```js
for (let x of (await kuma.status())) {
    for (let monitor of x.monitors) {
        console.log(monitor.name + " " + monitor.heartbeats[1].status+ " - " + (monitor.uptime*100) + "%");
    }
}
```