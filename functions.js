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

    array.length % 2 === 0 ? [] : array.splice(-1, 1)

    while (array.length > 0) {
        const chunk = array.splice(0, 2)
        chunkedTimes.push(chunk)
    }

    chunkedTimes.forEach(times => {
        playTimes.push(times[1] - times[0])
    })

    let playTime = playTimes.reduce((a, b) => a + b, 0)

    return convertSecondsToMinutes(playTime)
}

function createCsv() {
    var Dj = document.getElementById('djName').value.replace(/\W+/g, ' ')

    const rows = [['Element', 'Total Play Time', 'Total Times Selected', 'Song Length', 'Date', 'Number of Elements', 'DJ', 'Start Time', 'Stop Time']]

    rows.push(['', '', '', musicObject['duration'], new Date().toISOString().split('T')[0], Object.keys(musicObject).length - 1, Dj])

    Object.keys(musicObject).forEach(key => {
        if (key != 'duration') {
            let timesCopy = [...musicObject[key]]
            let timesClicked = Math.round(musicObject[key].length / 2)
            let startStopTime = musicObject[key].map(item => convertSecondsToMinutes(item))

            rows.push([key, getTotalPlayTimeOfInstrument(timesCopy), timesClicked, '', '', '', '', startStopTime])
        }
    })

    let csvContent = 'data:text/csv;charset=utf-8,'
        + rows.map(e => e.join(',')).join('\n')

    return csvContent
}

function downloadCsv() {
    var csvContent = createCsv()

    var file = document.getElementById('thefile')
    var encodedUri = encodeURI(csvContent)
    var link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', file.value.split('-')[1] + '.csv')
    document.body.appendChild(link)
    
    link.click()
}

function emailCsv() {
    var csvContent = createCsv()
    var encodedUri = encodeURI(csvContent)

    mail('valeriejane@cabanalibre.com', 'Analyzed song', encodedUri, 'gideon@cabanalibre.com')
}

function emptyObject() {
    musicObject = {}
}

function convertSecondsToMinutes(audioSeconds) {
    let minutes = Math.floor(audioSeconds / 60)
    let seconds = Math.round(audioSeconds - minutes * 60)

    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds

    return minutes + ':' + seconds
}

window.onload = function() {
    var file = document.getElementById('thefile')
    var audio = document.getElementById('audio')

    file.onchange = function() {
        musicObject = {}

        var files = this.files
        audio.src = URL.createObjectURL(files[0])

        audio.addEventListener('loadedmetadata', function() {
            musicObject['duration'] = convertSecondsToMinutes(audio.duration)
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
                barHeight = dataArray[i] * 2.5
                
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