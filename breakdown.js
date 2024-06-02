const gifFrames = require('gif-frames');
const fs = require('fs');
const path = require('path');

gifFrames({ url: "loveheart.gif", frames: 'all' })
.then(frameData => {
    frameData.forEach(function (frame) {
        frame.getImage().pipe(fs.createWriteStream(path.join(__dirname, 'frames', `frame-${frame.frameIndex}.png`)));
        
    })
})
