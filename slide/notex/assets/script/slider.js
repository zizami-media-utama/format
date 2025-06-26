/**
 * Talkslider auto narator format
 * Copyright@2025 Al Muhdil karim
 * PT Lektor Media Utama
 */

// SPEAK VARIABLE
const synth  = window.speechSynthesis;
const voices = synth.getVoices();
let playstat = true;
let autoplay = true;
let language = document.getElementById('voice');


// GLOBAL VARIABLE
let page_audio = document.getElementById('main-chanel');
let page_timer = document.getElementById('progressbar');
let page_progs = document.getElementById('progrestime');



// PREPARATION
window.location.hash = '';                                                  // clean url hash, because of url hash cause error for audio 
impress().init();                                                           // load impress slide engine
synth.cancel();                                                             // clean old session of utterence and start fresh session



// MAIN SOURCE
let speak_lang = ()=> {                                                     // populate the voice options.
 
	let langtop = speechSynthesis.getVoices();                              // Fetch the available voices. 
  	langtop.forEach(function(voice, i) {
        option = document.createElement('option');                          // Create a new option element.
        option.value = voice.name;                                          // Set the options value and text.
        option.innerText = option.value.replace("Google", "");
        language.appendChild(option);                                       // Set the options value and text.
	});
}

speak_lang();                                                               // loads voices asynchronously.
window.speechSynthesis.onvoiceschanged = function(e) { speak_lang(); };


let speak_main = (text)=> {

    let narator = new SpeechSynthesisUtterance(text);                       // create a speech synthesis
                
    if ( language.value ) {
		narator.voice = synth.getVoices().filter(function(voice) { return voice.name == language.value; })[0];
    }
    else {
        narator.voice = voices[0];                                          // Choose a specific voice
        narator.lang  = "id";                                               // setup narator langguage
	}

    synth.speak(narator);       

    narator.addEventListener("end", (event) => {
        if ( autoplay === true) { impress().next(); }
    });

    narator.addEventListener("error", (event) => {
        console.log('Robot got error or cant reach data');
    });

    console.log(text);                                                      // render console source data
}


let speak_load = async (posts) => {

    let value = posts.replace('step-','slide-');
    let named = value;
    let files = 'assets/source/'+named+'.txt';
    let losts = 'Maaf saya tidak menemukan data apapun untuk slide ini'

    try {
        const response = await fetch(files);
        if (response.ok) {
            fetch(files).then(response => response.text())
            .then(data => { 
                speak_main(data);
            })
        } else {
            speak_main( losts );
            if (response.status === 404) throw new Error('404, Not found');             // Custom message for failed HTTP codes
            if (response.status === 500) throw new Error('500, internal server error'); // Custom message for failed HTTP codes   
            throw new Error(response.status);                                           // For any other server error
        }
    } 
    catch (error) { 
        console.error('Fetch', error); 
    }
}


// MAIN CONTROL

let control_play = ()=> {
    let plays = document.getElementById('pend-icon');
    let icon = plays.getAttribute('data-play');
    plays.src = icon
    page_progs.classList.add('active');
}


let control_stop = ()=> {
    let plays = document.getElementById('pend-icon');
    let icon = plays.getAttribute('data-pause');
    plays.src = icon
    page_progs.classList.add('active');
}


let control_auto = ()=> {
    let mutes = document.getElementById('mute-icon');
    let icon = mutes.getAttribute('data-unmute');
    mutes.src = icon
}


let control_comm = ()=> {
    let mutes = document.getElementById('mute-icon');
    let icon = mutes.getAttribute('data-muted');
    mutes.src = icon
}


let control_init = ()=> {
    document.getElementById('panel').classList.remove('slide-on-stop');
    document.getElementById('panel').classList.add('slide-on-play');
}


let control_exit = ()=> {
    document.getElementById('panel').classList.remove('slide-on-play');
    document.getElementById('panel').classList.add('slide-on-stop');
}


let control_next = ()=> {
    impress().next();
}


let control_prev = ()=> {
    impress().prev()
}


let screens_full = ()=> {

    let main = document.getElementById("we-slide");
    let init = document.getElementById("full-icon");

    if (document.fullscreenElement) {
        let icon = init.getAttribute('data-maxs');
        init.src = icon;
        document.exitFullscreen()

    } else {
        let icon = init.getAttribute('data-mins');
        init.src = icon;
        if (main.requestFullscreen) {
            main.requestFullscreen();
        } else if (main.webkitRequestFullscreen) { /* Safari */
            main.webkitRequestFullscreen();
        } else if (main.msRequestFullscreen) { /* IE11 */
            main.msRequestFullscreen();
        }
    }
}


// EVENT LISTENER 
document.addEventListener("impress:stepenter", function(event) {
    
    let posts = event.target.id;

    if ( posts !== "step-1" ) {
        control_init();
        synth.cancel();     
        speak_load(posts);
    }
    else {
        synth.cancel();     
        control_exit();
    }
});


// check user agent
function useragent() {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// PLAYER CONTROL

document.getElementById('play-slide').addEventListener('click', (event)=> {

    event.preventDefault(); 

    if (useragent()) {
        screens_full(); impress().next();
        
    } else {
       impress().next();
    }
})


// autoplay
document.getElementById('auto-play').addEventListener("click", (event)=>{
    event.preventDefault(); 

     if ( autoplay == true ) {
        autoplay = false;
        control_comm();
    }
    else {
        autoplay = true;
        control_auto();
    }
})


// play audio
document.getElementById('pend-audio').addEventListener("click", (event)=>{
    event.preventDefault();

    if (playstat == true ) {
        synth.pause();
        playstat = false;
        control_play();
    }
    else {
        synth.resume();
        playstat = true;
        control_stop();
    }
})


// next slide
document.getElementById('next-slide').addEventListener("click", (event)=>{
    event.preventDefault();
    synth.cancel();
    control_next(); 
})


// prev slide
document.getElementById('prev-slide').addEventListener("click", (event)=>{
    event.preventDefault();
    synth.cancel();
    control_prev(); 
})


// full screen
document.getElementById('full-slide').addEventListener("click", (event)=>{
    event.preventDefault(); screens_full();
})



// auto fullscreen


if (isMobileUserAgent()) {
    screens_full();
    console.log("Mobile device detected (based on User Agent)");
} else {
    console.log("Desktop device detected (based on User Agent)");
}