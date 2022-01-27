let engineOff = new Audio("generic_sounds/acid5.wav");
let engineOn = new Audio("generic_sounds/teleport.wav");
let blast = new Audio("generic_sounds/acid6.wav");
let menu = new Audio("generic_sounds/itempick1.wav");
let windAmbient = new Audio("generic_sounds/wind1.wav");
windAmbient.loop = true;

function playAudio(audio) {
  audio.play();
}

//🚀🛸🚀

// todo add booster effect
// on off sound and accelerate fx.
// ENGINE SOUND EFFECT
// add ascending and descending sound fx R key / F key
//
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// let engineFrequency = 0;


// master gain
let masterGain = audioCtx.createGain();
masterGain.gain.value = 0.1;
masterGain.connect(audioCtx.destination);
//gain of the engine
let engineGain = audioCtx.createGain();
engineGain.gain.value = 0.7;
engineGain.connect(audioCtx.destination);

let boosterRandomFreq = 100;

//  filters
let from = 300;
let to = 30000;
let geometricMean = Math.sqrt(from * to);

let filter = audioCtx.createBiquadFilter();
filter.type = 'bandpass';
filter.frequency.value = geometricMean;
filter.Q.value = geometricMean / (to - from);
filter.connect(engineGain)

let biquadFilter = audioCtx.createBiquadFilter();
console.log(biquadFilter);
biquadFilter.frequency = 400;
biquadFilter.connect(engineGain);

let oscillator1 = null;
let oscillator2 = null;
let oscillator3 = null;

function updateEngineFrequency (freq) {
  oscillator1.frequency.value = (freq + Math.floor(Math.random() * boosterRandomFreq)) / 2
  oscillator2.frequency.value = (freq + Math.floor(Math.random() * 50)) 
  oscillator3.frequency.value = (freq + Math.floor(Math.random() * 50))
}

function createEngineSound() {
  console.log('engine sound on')

  let osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 0;
  osc.connect(biquadFilter);

  let osc2 = audioCtx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 0;
  osc2.connect(biquadFilter);

  let osc3 = audioCtx.createOscillator();
  osc3.type = "triangle";
  osc3.frequency.value = 0;
  osc3.connect(biquadFilter);

  oscillator1 = osc;
  oscillator2 = osc2;
  oscillator3 = osc3;
  
  osc.start(0);
  osc2.start(0);
  osc3.start(0);
}
function deleteEngineSound() {
  console.log("engine sound off");

  oscillator1.stop();
  oscillator1.disconnect();
  oscillator2.stop();
  oscillator2.disconnect();
  oscillator3.stop();
  oscillator3.disconnect();
 
}
