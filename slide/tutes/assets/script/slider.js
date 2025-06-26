const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.getElementById("speakup");
const voiceSelect = document.querySelector("select");
synth.cancel();       
let voices;

function loadVoices() {
  voices = synth.getVoices();
  for (const [i, voice] of voices.entries()) {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = i;
    voiceSelect.appendChild(option);
  }
}

// in Google Chrome the voices are not ready on page load
if ("onvoiceschanged" in synth) {
  synth.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

inputForm.onsubmit = (event) => {
  event.preventDefault();


    let ttsRecorder = new SpeechSynthesisRecorder({
    text: inputTxt.value, 
    utteranceOptions: {
        voice: "english-us espeak",
        lang: "en-US",
        pitch: .75,
        rate: 1,
        volume: 1
    }
    });


ttsRecorder.start()
  .then(tts => tts.audioBuffer())
  .then(({tts, data}) => {
    // `data` : `AudioBuffer`
    let source = tts.audioContext.createBufferSource();
    source.buffer = data;
    source.connect(tts.audioContext.destination);
    source.start()
  })



};

