let musicObject = {}

function toggleInstrument(e) {
    var audio = document.getElementById('audio')
    if (!audio.paused) {
        var instrument = e.innerHTML

        if (e.getAttribute('data') === 'off') {
            e.style.setProperty('opacity', 1)
            e.setAttribute('data', 'on')
        } else {
            e.style.setProperty('opacity', 0.6)
            e.setAttribute('data', 'off')
        }

        if (instrument in musicObject) {
            musicObject[instrument].push(audio.currentTime)
        } else {
            musicObject[instrument] = [audio.currentTime]
        }
    }
}

// function showResults() {
//     Object.keys(musicObject).forEach(key => {
//         document.getElementById('results').innerHTML += '<p>' + key + ': ' + musicObject[key] + '</p>'
//     })
// }

window.onload = function() {
    var file = document.getElementById('thefile');
    var audio = document.getElementById('audio');
    
    file.onchange = function() {
        musicObject = {}

        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
    
        var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext('2d');
    
        src.connect(analyser);
        analyser.connect(context.destination);
    
        analyser.fftSize = 256;
    
        var bufferLength = analyser.frequencyBinCount;
    
        var dataArray = new Uint8Array(bufferLength);
    
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
    
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
    
        function renderFrame() {
            requestAnimationFrame(renderFrame);
    
            x = 0;
    
            analyser.getByteFrequencyData(dataArray);
    
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2
                
                var r = barHeight + (25 * (i/bufferLength));
                var g = 50 * (i/bufferLength);
                var b = 250;
        
                ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        
                x += barWidth + 1;
            }
        }
    
        audio.play();
        renderFrame();
        };
  };