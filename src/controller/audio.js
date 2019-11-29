import Between from 'between.js'

const clientID = 'jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS'

export default class AudioWare {

    constructor(settings = {}, playNext = () => {}) {

        this.playNext = playNext

        this.settings = Object.assign({
            autoplay: true,
            volume: 0.8,
            crossfadeTime: 2000
        }, settings)

        this.audioTracks = [new Audio(), new Audio()]

        for (let audio of this.audioTracks) {
            audio.volume = 0;
            audio.preload = 'none'

            audio.pause()

            audio.addEventListener('ended', () => {
                if (this.settings.autoplay) {
                    this.playNext()
                }
            })
        }
    }

    addAudioTrack() {
        this.audioTracks.push(new Audio())
    }

    play(trackID) {

        let url = `https://api.soundcloud.com/tracks/${trackID}/stream?client_id=${clientID}`

        let onePlayed = false

        for (let audio of this.audioTracks) {

            if (audio.paused && !onePlayed) {
                audio.src = url
                this.animatePlay(audio)
                onePlayed = true
            } else {
                console.log('pause')
                this.animatePause(audio)
            }

        }
    }

    stop() {
        for (let audio of this.audioTracks) {
            audio.pause()
            audio.currentTime = 0
        }
    }

    setVolume(volume) {

        this.settings.volume = volume

        for (let audio of this.audioTracks) {

            if (audio.paused) continue

            audio.volume = this.settings.volume
        }
    }

    animatePause(audio) {
        setTimeout(() => {
            new Between(audio.volume, 0).time(this.settings.crossfadeTime).easing(Between.Easing.Cubic.InOut).on('update', (value) => {
                audio.volume = value
            }).on('complete', (value) => {
                audio.pause()
                audio.currentTime = 0
            })
        }, 1)
    }

    animatePlay(audio) {

        setTimeout(() => {
            audio.play()

            let animation = new Between(0, this.settings.volume).time(this.settings.crossfadeTime).easing(Between.Easing.Cubic.InOut).on('update', (value) => {
                audio.volume = value
            })
        }, 1)
    }

}
