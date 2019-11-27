import Between from 'between.js';

const clientID = 'jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS'

export default class Track {

    constructor(data) {
        this.data = data

        let url = `https://api.soundcloud.com/tracks/${this.data.id}/stream?client_id=${clientID}`
        this.audio = new Audio(url)
        this.audio.volume = 0;
        this.audio.preload = 'none'
    }

    play(volume = 0.8) {

        this.audio.play()

        setTimeout(() => {
            new Between(0, volume).time(900).easing(Between.Easing.Cubic.InOut).on('update', (value) => {
                this.audio.volume = value
            }).on('complete', () => {
                console.log(`${this.data.id} started`)
            });
        }, 1)
    }

    stop() {
        setTimeout(() => {
            new Between(this.audio.volume, 0).time(2000).easing(Between.Easing.Cubic.InOut).on('update', (value) => {
                this.audio.volume = value
            }).on('complete', (value) => {
                this.audio.pause()
                this.audio.currentTime = 0
                console.log(`${this.data.id} stopped`)
            });
        }, 1)
    }

    setVolume(newVolume) {
        console.log(this.audio.volume, newVolume)
        new Between(this.audio.volume, newVolume).time(200).easing(Between.Easing.Cubic.InOut).on('update', (value) => {
            this.audio.volume = value
        }).on('complete', () => {
            console.log(`${this.data.id} volume changed`)
        });
    }
}
