import axios from 'axios'

export default class Soundcloud {

    constructor(clientID, userID) {

        this.cliendID = client_id
        this.userID = userID

        this.baseURL = `https://api.soundcloud.com`

        this.url = `${this.baseURL}/users/${userID}/tracks?client_id=${clientID}&linked_partitioning=1`
    }

    normalizeAndLoadTrack(track) {

        let artwork = track.artwork_url
            ? track.artwork_url
            : track.user.avatar_url

        artwork = artwork.replace("large", "t500x500")

        let data = {
            artwork,
            id: track.id
        }

        let img = new Image()
        img.src = data.artwork

        // add image to array if data preloaded
        img.onload = () => {
            let loadedTracks = this.state.loadedTracks

            loadedTracks.push(data)

            this.setState({ loadedTracks })
        }

        return data
    }

    async loadTracks(url) {
        let { data } = await axios.get(url)

        let tracks = this.state.tracks

        if (data.hasOwnProperty('next_href')) {
            this.loadTracks(data.next_href)
        }
    }
}
