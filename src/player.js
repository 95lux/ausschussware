const ctx = new AudioContext();
let audio;

fetch("https://api.soundcloud.com/tracks/312964077/stream?jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS")
    .then(data => data.arrayBuffer())
