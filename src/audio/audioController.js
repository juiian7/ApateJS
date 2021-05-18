//

export default class AudioController {
    constructor() {
        this.audios = {};

        var AudioContext = window.AudioContext || window.webkitAudioContext;

        /**
         * @type {AudioContext}
         */
        this.audioCtx = new AudioContext();
    }

    /**
     * @param {string} name
     * @param {string} info
     */
    createAudio(name, info) {
        let a = stringToAudio(info);
        let noteDuration = 1000 / a.notesPerSecond;

        let gain = this.audioCtx.createGain();
        gain.gain.value = 0.3;

        let oscillators = [];
        for (let i = 0; i < a.tracks.length; i++) {
            oscillators.push(this.audioCtx.createOscillator());
            oscillators[i].connect(gain);
        }
        console.log(a.tracks);

        this.audios[name] = {
            tracks: a.tracks,
            oscillators,
            gain,
            noteDuration
        };
    }

    play(name) {
        if (this.audios[name]) {
            let audio = this.audios[name];

            audio.gain.connect(this.audioCtx.destination);
            console.log('started');

            for (let i = 0; i < audio.oscillators.length; i++) {
                audio.oscillators[i].frequency.setValueAtTime(0, 0);
                audio.oscillators[i].start(0);
            }
            let i = 0;
            let tact = setInterval(() => {
                for (let j = 0; j < audio.oscillators.length; j++) {
                    audio.oscillators[j].frequency.setValueAtTime(audio.tracks[j][i], 0);
                }

                i++;
                if (i == audio.tracks[0].length) {
                    clearInterval(tact);
                    for (let i = 0; i < audio.oscillators.length; i++) {
                        audio.oscillators[i].stop();
                        console.log('stoped');
                    }
                }
            }, audio.noteDuration);
        } else {
            console.error('No audio found with the name: ' + name);
        }
    }
}

const pianoKeys = {
    c: 16.35,
    cs: 17.32,
    d: 18.35,
    ds: 19.45,
    e: 20.6,
    f: 21.83,
    fs: 23.12,
    g: 24.5,
    gs: 25.96,
    a: 27.5,
    as: 29.14,
    h: 30.87,
    b: 30.87
};

function stringToAudio(s) {
    let audio = {
        notesPerSecond: 4,
        tracks: [],
        duration: 0
    };

    let marker = s.split('#');
    let stringTracks = [];
    for (let i = 0; i < marker.length; i++) {
        if (marker[i].toLowerCase().startsWith('track')) {
            let stringTrack = marker[i].substring(marker[i].indexOf('\n') + 1);
            stringTracks.push(stringTrack.replaceAll('\n', ' ').replaceAll(/\s+/g, ' ').trim());
        } else if (marker[i].toLowerCase().startsWith('speed')) {
            audio.notesPerSecond = marker[i].replaceAll('speed', '').trim();
        }
    }

    for (let i = 0; i < stringTracks.length; i++) {
        let st = stringTracks[i].split(' ');
        let track = [];

        for (let j = 0; j < st.length; j++) {
            let sound = st[j];
            if (sound == '-') track.push(0);
            else if (sound == '.') track.push(track[track.length - 1]);
            else {
                let m = sound[sound.length - 1];
                let n = sound.replace(m, '');
                if (pianoKeys[n]) {
                    track.push(pianoKeys[n] * Math.pow(m, 2));
                } else {
                    console.error('Error in music file!');
                    track.push(0);
                }
            }
        }

        console.log(track);
        audio.tracks.push(track);

        let l = track.length / audio.notesPerSecond;
        audio.duration = audio.duration >= l ? audio.duration : l;
    }
    return audio;
}
