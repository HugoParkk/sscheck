let url = 'https://script.google.com/macros/s/AKfycbz2fhg1c1OGz-0eX-8Tjwz0likHmyUT8xI8wYRuIptctS4Ej6ZT/exec';
const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors');
const fetch = require("node-fetch");

const socket = require('http').createServer(app);
const io = require('socket.io')(socket);

const port = 8000;

app.use('/css', express.static('./css'));
app.use('/js', express.static('./js'));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page.html')
});

io.on('connection', (socket) => {
    socket.on('pushInput', (data) => {
        console.log('pushInput in')
        fetch(url, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => console.log(res));

        let options = {
            url: url,
            method: 'GET',
            body: data,
            json: true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
        };
        // request.get(options, (error, response, body) => {
        //     socket.emit('apiSuccess', body);
        //     console.log(body);

        //     if (error) {
        //         console.log(error)
        //     }
        // });
    });
});

socket.listen(port, () => {
    console.log(`${port}번 포트에서 웹서버 실행중`);
    console.log(`http://localhost:${port}/`)
});