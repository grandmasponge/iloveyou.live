const fs = require('fs');
const path = require('path');
const asciify = require('asciify-image');
const http = require('http');
const { Readable } = require('stream');


function PngToAscii() {
  
    let images = fs.readdirSync(path.join(__dirname, 'frames'));
    let asciiImage = [];
    images.forEach(function (image) {
        asciify(path.join(__dirname, 'frames', image), { fit: 'box', width: 50, height: 50 }, function (err, asciified) {
            if (err) throw err;
            asciiImage.push(asciified);
            console.log(asciified);
        });
    })

    return asciiImage;

}

function pipeStream(stream) {
    let frames = PngToAscii();
    let i = 0;

    return setInterval(() => {
        stream.push(`\x1b[2J\x1b[3J\x1b[H`);

        stream.push(frames[i]);

        i = (i + 1) % frames.length;
    }, 100)
}

const server = http.createServer((req, res) => {
    if (req.headers &&
        req.headers['user-agent'] &&
        !req.headers['user-agent'].includes('curl')
     ) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>I love you becca</h1>');
        res.write('<p>but for this go to your mac and run</p>')
        res.write('<code> curl iloveyou.grandmasponge.me </code>')
        return res.end();
    }

    const stream = new Readable();
    stream._read = () => {};

    stream.pipe(res);
    const interval = pipeStream(stream);

    req.on('close', () => {
        stream.destroy();
        clearInterval(interval);
      });
  
})


const port = 3000;

server.listen(port,err => {
    if(err) throw err;
    console.log(`Server running on port http://localhost:${port}`);
});




