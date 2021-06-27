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

function getTotalPlayTimeOfInstrument(array) {
    const chunkedTimes = []
    const playTimes = []

    while (array.length > 0) {
        const chunk = array.splice(0, 2)
        chunkedTimes.push(chunk)
    }

    chunkedTimes.forEach(times => {
        playTimes.push(times[1] - times[0])
    })

    return playTimes.reduce((a, b) => a + b, 0)
}

function createCsv() {
    var Dj = document.getElementById('djName').value.replace(/\W+/g, ' ')

    const rows = [['Instrument', 'Total Play Time', 'Song Length', 'Date', 'Number of Instruments', 'DJ', 'Start Time', 'Stop Time']]

    rows.push(['', '', musicObject['duration'], new Date().toISOString().split('T')[0], Object.keys(musicObject).length - 1, Dj])

    Object.keys(musicObject).forEach(key => {
        if (key != 'duration') {
            let timesCopy = [...musicObject[key]]
            rows.push([key, getTotalPlayTimeOfInstrument(timesCopy), '', '', '', '', musicObject[key]])
        }
    })

    let csvContent = 'data:text/csv;charset=utf-8,'
        + rows.map(e => e.join(',')).join('\n')

    return csvContent
}

function downloadCsv() {
    csvContent = createCsv()

    var file = document.getElementById('thefile')
    var encodedUri = encodeURI(csvContent)
    var link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', file.value.split('-')[1] + '.csv')
    document.body.appendChild(link)
    
    link.click()
}

function emailCsv() {
    // Email server code here
}

function emptyObject() {
    musicObject = {}
}

window.onload = function() {
    var file = document.getElementById('thefile')
    var audio = document.getElementById('audio')

    file.onchange = function() {
        musicObject = {}

        var files = this.files
        audio.src = URL.createObjectURL(files[0])

        audio.addEventListener('loadedmetadata', function() {
            var minutes = Math.floor(audio.duration / 60)
            var seconds = Math.round(audio.duration - minutes * 60)
            musicObject['duration'] = minutes + ':' + seconds
        })

        var context = new AudioContext()
        var src = context.createMediaElementSource(audio)
        var analyser = context.createAnalyser()
    
        var canvas = document.getElementById('canvas')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        var ctx = canvas.getContext('2d')
    
        src.connect(analyser)
        analyser.connect(context.destination)
    
        analyser.fftSize = 256
    
        var bufferLength = analyser.frequencyBinCount
    
        var dataArray = new Uint8Array(bufferLength)
    
        var WIDTH = canvas.width
        var HEIGHT = canvas.height
    
        var barWidth = (WIDTH / bufferLength) * 2.5
        var barHeight
        var x = 0
    
        function renderFrame() {
            requestAnimationFrame(renderFrame)
    
            x = 0
    
            analyser.getByteFrequencyData(dataArray)
    
            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, WIDTH, HEIGHT)
    
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2.3
                
                var r = barHeight + (25 * (i/bufferLength))
                var g = 50 * (i/bufferLength)
                var b = 250
        
                ctx.fillStyle = 'rgb(' + b + ',' + g + ',' + r + ')'
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)
        
                x += barWidth + 1
            }
        }
    
        audio.play()
        renderFrame()
        }
  }