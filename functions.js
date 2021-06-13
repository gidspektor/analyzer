var musicObject = {}

document.getElementById('upload').addEventListener('change', (e) => {
    musicObject = {}
    var files = e.target.files
    document.getElementById('audio').setAttribute('src', URL.createObjectURL(files[0]))
})

function togglePlay(e) {
    var audio = document.getElementById('audio')
    var isPlaying = e.getAttribute('data')

    if (isPlaying === 'on') {
        audio.pause()
        e.setAttribute('data', 'off')
    } else {
        audio.play()
        e.setAttribute('data', 'on')
    }
}

function toggleInstrument(e) {
    var audio = document.getElementById('audio')
    if (!audio.paused) {
        var instrument = e.innerHTML

        if (e.getAttribute('data') === 'off') {
            e.style.setProperty('background-color', 'purple')
            e.setAttribute('data', 'on')
        } else {
            e.style.setProperty('background-color', '')
            e.setAttribute('data', 'off')
        }

        if (instrument in musicObject) {
            musicObject[instrument].push(audio.currentTime)
        } else {
            musicObject[instrument] = [audio.currentTime]
        }

    }
}

function showResults() {
    Object.keys(musicObject).forEach(key => {
        document.getElementById('results').innerHTML += '<p>' + key + ': ' + musicObject[key] + '</p>'
    })
}
