# UptimeKuma-api

Supports UptimeKuma versions from 1.13.1 to 1.23.13

## Installation

```bash
npm install uptimekuma-api
```

## Pushing usage

### Start pushing
```js
let kuma = new UptimeKuma("https://kuma.url/");

kuma.startPushing("push code",60);
```

### Stop pushing
```js
kuma.cancelPushing("push code");
```
or to stop all pushes
```js
kuma.cancelPushing();
```

### Push custom data
```js
kuma.on("prePush", (url, params) => {
    params.msg = "test";
    params.status = "down";
});
```

## Status pages usage

### Get statuses
```js
for (let x of (await kuma.status())) {
    for (let monitor of x.monitors) {
        console.log(monitor.name + " " + monitor.heartbeats[1].status+ " - " + (monitor.uptime*100) + "%");
    }
}
```

## Dashboard usage

### Login to dashboard
```js
await kuma.login("username", "password");
```

### Get database size
```js
console.log(await kuma.getDatabaseSize());
```