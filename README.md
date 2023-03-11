# requests-example
Frontend and backend communication example


Post data on frontend:
```js
let xml = new XMLHttpRequest();

function POSTdata(msg) {
xml.open('POST', 'x', true);
xml.send(msg);}
```


Receive data on server:
```js
request.on('data', (chunk) => {
        if (request.url == "/x") {
            console.log(chunk.toString());
        }
    });
```
