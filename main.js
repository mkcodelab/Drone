// import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
// import { BackSide } from "three";
// const { BackSide } = require("three");

//node_modules\three\examples\jsm\postprocessing\EffectComposer.js
const scene = new THREE.Scene();
// 🎥 camera setup
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  2200
);
// turn camera to the right place
camera.position.set(0, 0, 0);
// camera.fov = 50;
// camera.zoom = 1;
camera.lookAt(1, 0, 1);

function logCameraCoords(cam) {
  console.log(cam.position.x, cam.position.y, cam.position.z);
}

//do the dynamic fov by acceleration
function updateFOV(fov) {
  camera.fov = fov;
  camera.updateProjectionMatrix();
}

// resize
addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setClearColor(0x222222);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const composer = new EffectComposer( renderer );

// const controls = new THREE.OrbitControls(camera, renderer.domElement);








//ship movement

let flyingEngaged = false;
let booster = false;
let boosterAcceleration = 0.05;

let defaultSpd = 0;
let currentAltitude = 0;

let maxSpd = 60;
let maxSpdNoBooster = 60;
let maxSpdBooster = 120;

// old acceleration with multiply was 1.03
let acceleration = 0.2;
let currentSpd = defaultSpd;
let isAccelerating = false;

let defaultRollSpeed = 0.8;
let maxRollSpeed = 4;
let rollAcceleration = 1.02;
let currentRollSpeed = defaultRollSpeed;
let isRolling = false;
let engineSound = false;
let brake = false;
let slowingFactor = 0.07;

let defaultDiminish = 1.001;
let currentDiminish = 1;

let currentEnergy = 100;
let maxEnergy = 100;
let lowEneTreshold = 20;
let energyDepletion = 0.001;
let energyDepAcceleration = 0.008;
let energyDepBoost = 0.020;
let recharge = 0.01;

//vital functions
//charging inside base and so on

function updateEnergy() {

  if (Math.round(camera.position.x) == 0 
  && Math.round(camera.position.y) == 0
  && Math.round(camera.position.z) == 0 
  && currentEnergy < maxEnergy) {
    currentEnergy += recharge;
    console.log('charging');

  }
  if(energy <= lowEneTreshold) {
    console.log('Low Energy, return to base NOW');
  }
  if (flyingEngaged && isAccelerating && booster) {
    currentEnergy -= energyDepBoost;
  } 
  else if (flyingEngaged && isAccelerating) {
    currentEnergy -= energyDepAcceleration;
  }
  else if (flyingEngaged) {
    currentEnergy -= energyDepletion;
  }
  // do the percentage of currentEnergy
  updateFullStatus(DBenergy, `Energy: ${Math.round(currentEnergy)} %`)

}

//todo update roll speed to be accelerated / decelerated
// KEYDOWN EVENT
addEventListener("keydown", (e) => {
  // console.log('pressed: ' + e.key)
  // console.log(Math.round(camera.rotation._x))
  // if (camera.rotation._x > 0 && camera.rotation._x < 1) {
  //   console.log("E")
  // }
  //accelerate
  if (flyingEngaged && e.key === "w") {
    isAccelerating = true;
    if (currentSpd < maxSpd) {
      if (booster) {
        currentSpd += (acceleration + boosterAcceleration);
      } else {
        currentSpd += acceleration;
        
        
      }

    }
  }

  if ((flyingEngaged && e.key === "q") || e.key === "e") {
    isRolling = true;
    if (currentRollSpeed < maxRollSpeed) {
      currentRollSpeed *= rollAcceleration;
    }
  }
  if (flyingEngaged && e.key === "s") {
    // console.log("brake pressed");
    // currentSpd -= 0.1;
    brake = true;
  }

  
});
function openMenu() {
  document.querySelector('#inventory').classList.toggle('inv-open');
  console.log('menu opened')
  playAudio(menu);
}

//KEYUP EVENT
addEventListener("keyup", (e) => {
  // console.log('released: ' + e.key)

  if (e.key === "i") {
    openMenu();
  }

  //shift key for speedup BOOSTER ON / OFF
  if (flyingEngaged) {
    if (e.key === "Shift") {
      booster = !booster;

      if (booster) {
        //update max speed to idk 600, after release update to old value
        maxSpd = maxSpdBooster;
        engineGain.gain.value = 1.5;
        // freq amplitude up
        boosterRandomFreq = 300;
        acceleration = 1;
        updateFullStatus(DBbooster, "Booster: Active")

      } else {
        maxSpd = maxSpdNoBooster; //here i have to change the behaviour of instant cutting speed
        engineGain.gain.value = 0.7;
        boosterRandomFreq = 100;
        acceleration = 0.2;
        updateFullStatus(DBbooster, "Booster: Inactive")

      }
    }
  }

  if (e.key === "s") {
    brake = false;
  }
  //ENGINE ON / OFF ***************************
  if (e.key === " ") {
    if (flyingEngaged) {
      flyingEngaged = false;
      // currentSpd = defaultSpd;
      if(currentSpd < 1) {
        flyControls.autoForward = false;
        defaultSpd = 1;
      }
      body.style.cursor = "crosshair";
      changeFlyDragging();
      //ui update
      // updateStatus("Engine Shutdown!");
      updateFullStatus(DBstatus, "Engine Shutdown!");
      //sound effect
      playAudio(engineOff);
      // engine sound effect off

      if (engineSound == true) {
        engineSound = false;
        deleteEngineSound();
      }

      return;
    }
    if (!flyingEngaged) {
      flyingEngaged = true;

      // engine sound effect
      if (engineSound == false) {
        engineSound = true;
        // console.log('engine Sound started')
        createEngineSound();
      }
      changeFlyDragging();

      body.style.cursor = "none";
      // updateStatus("Engine Started!");
      updateFullStatus(DBstatus, "Engine Running!");
      flyControls.autoForward = true;
      playAudio(engineOn);
      return;
    }

    //rolling decelerate release q or e keys
    if (flyingEngaged) {
      if (e.key === "q") {
        console.log(e.key);
        isRolling = false;
      }
      if (e.key === "e") {
        console.log(e.key);
        isRolling = false;
      }
    }
  }

  //releasing w key and slowing down
  if (e.key === "w") {
    isAccelerating = false;
  }
});

//if engine on play sinevawe form with pitch based on speed

//mouse event
let mouseLeft = false;
let mouseMiddle = false;
let mouseRight = false;

addEventListener("mousedown", (e) => {
  console.log(e.button);
  if (e.button === 1) {
    mouseMiddle = true;
    console.log("pressed middle mouse btn");
    playAudio(blast);
    //todo some shooting
  }
});
addEventListener("mouseup", (e) => {
  if (e.button === 1) {
    mouseMiddle = false;
    console.log("released middle mouse btn");
  }
});

// DASHBOARD UI ********************************************************************************

let dashboard = document.querySelector("#dashboard");
let DBVelocity = document.querySelector("#velocity");
let DBstatus = document.querySelector("#status");
let DBbooster = document.querySelector("#booster");
let DBaltitude = document.querySelector('#altitude');
let DBcoords = document.querySelector('#coords');
let DBenergy = document.querySelector('#energy');

let body = document.body;

// function updateStatus(msg) {
//   DBstatus.innerHTML = `Status: ${msg}`;
// }

function updateFullStatus(element, msg){
  element.innerHTML = msg
}

// function updateVelocityStatus() {
//   DBVelocity.innerHTML = `Velocity: ${Math.round(currentSpd)}`;
// }


//windshield
let windshieldBtn = document.querySelector("#windshield");
let glass = document.querySelector(".glass");
windshieldBtn.addEventListener("click", toggleWindshield);
function toggleWindshield() {
  glass.classList.toggle("closed");
}




// FLY CONTROLS *******************************************************************************

const flyControls = new THREE.FlyControls(camera, renderer.domElement);
flyControls.dragToLook = true;
flyControls.movementSpeed = currentSpd;
// flyControls.rollSpeed = currentRollSpeed;
flyControls.rollSpeed = 1;
flyControls.autoForward = false;
// console.log(flyControls);

let normalFov = 0.06;
let spaceWarpFov = 0.3; //higher is faster

// function updateRollingSpeed() {
//   flyControls.rollSpeed = currentRollSpeed;

// }


// Main flying update function
function upadateFlyingSpeed() {
  // slowing down just floating
  if (!isAccelerating && currentSpd >= defaultSpd) {
    // currentSpd -= acceleration / 2;
    currentSpd -= slowingFactor;
  }

  // reset the values
  if (currentSpd > maxSpd) {
    //change the behaviour of boosted speed and turned off booster
    // if !booster
    currentSpd = maxSpd;
  }
  // BRAKES
  if (brake && currentSpd > defaultSpd) {
    currentSpd *= 0.99;
  }

  flyControls.movementSpeed = currentSpd;
  // flyControls.rollSpeed = currentRollSpeed;

  if (flyingEngaged) {
    updateEngineFrequency(currentSpd);
    // updateVelocityStatus();
    //calculating fov based on velocity
  }
  if (!flyingEngaged) {
    // flyControls.movementSpeed = defaultSpd;
    flyControls.rollSpeed = defaultRollSpeed;
    currentRollSpeed = defaultRollSpeed;
  }

  // altitude update
  let newFOV = 55 + currentSpd * spaceWarpFov;
  updateFOV(newFOV);
  updateFullStatus(DBVelocity, `Velocity: ${Math.round(currentSpd) * 2} km/h`);
  updateFullStatus(DBaltitude, `Altitude: ${Math.round(camera.position.y /2)}`);
}




function changeFlyDragging() {
  flyControls.dragToLook = !flyControls.dragToLook;
}


// ***************************************************************************************
// Loading section, textures, meshes, materials and geometries

// MAP ***********************************************************************************


// opakuj tworzenie mapy w jakąś funkcję
// mapa moglaby skladac się z różnych wielkości obiektów rozmieszczonych w przestrzeni
// jakąś nawigację możnaby do tego dorzucić i by było coś fajnego;

//materialsy poszły do innego pliku

//skybox

const loader = new THREE.CubeTextureLoader();
const clouds = loader.load([
  "skybox/xpos.png",
  "skybox/xneg.png",
  "skybox/ypos.png", //top
  "skybox/yneg.png", //bottom
  "skybox/zpos.png",
  "skybox/zneg.png",
  
  // "skybox/stormydays_ft.png",
  // "skybox/stormydays_bk.png",
  // "skybox/stormydays_up.png",
  // "skybox/stormydays_dn.png",
  // "skybox/stormydays_rt.png",
  // "skybox/stormydays_lf.png",
]);
scene.background = clouds;

// texture loader
// const TL = new THREE.TextureLoader();


let baseColor = 0xaaffaa;
// try to change color of the material
const boxMaterial = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  shininess: 90,
  map: TL.load("steel.jpg"),
});


// const vignetteSprite = new THREE.Sprite( vignetteMat );
// vignetteSprite.scale.set(2, 1, 1);
// vignetteSprite.position.set(1, 1, 1);
// scene.add(vignetteSprite);

// function stickVignetteToCam(vig) {
//   let x = camera.position.x - 1;
//   let y = camera.position.y - 0.5;
//   let z = camera.position.z -1;
//   vig.position.set(x, y, z);
// }

// stickVignetteToCam(vignetteSprite);


// const cloudSprite = new THREE.Sprite( cloudMat );
// cloudSprite.position.set(1, 1, 1);
// scene.add(cloudSprite);

//CLOUDS AND PARTICLES ########################################
// adding cloud layer below 0 altitude

//x - width
//y - height
//z - depth
const cloudGroup = new THREE.Group();

for (let i = 0; i < 5000; i++) {
  let x = Math.random() * 10000 - 5000;
  let y = Math.random() * 500 - 200;
  let z = Math.random() * 10000 - 5000;
  let r = Math.random() * 250 + 300;

  const cloud = new THREE.Sprite( cloudMat );
  cloud.position.set(x, y, z)
  cloud.scale.set(r, r);
  cloudGroup.add(cloud);
}
cloudGroup.position.set( 0, -200, 0);
scene.add(cloudGroup);

//add some weird balls of lightning via sprite technique

// more randomized clouds
//do some array with diff cloud textures;
//REMEMBER ABOUT THE DIMMING LIGHT, AS THE ALTITUDE LOWERS
//TODO: OVERALL LIGHT STRENGTH DIMMS WITH THE ALTITUDE
// AND SOME COUNTERPART FOR GOING HIGH IN ATMOSPHERE
// LIGHT NOT ONLY DARKENS BUT CHANGES COLOUR FROM WHITE, BY DEAD GREEN TO DEEP BLUE
//unfortunatley it has no effect to the skybox at all...

//  \/ \/ put here some high quality textures not this crap \/ \/
const cloudTextureArray = [
  "cloud10.png",
  "cloud11.png",
  "cloud12.png",
  "cloud13.png",
]

//i can pass values such as height, colour, size
//and use them in those randomizations
//height, global scale, local scale
//add material in variables and use it randomly

function randomizedClouds(height, globalScale, localScale) {
  const RandomCloudGroup = new THREE.Group();

  for (let i = 0; i < 2000; i++) {

    //randomize coordinates
    let x = Math.random() * 10000 - 5000; //global scale x axis
    let y = (Math.random() * 600) - 1400; //switch to height , y axis |||  let y = (Math.random() * height) - 1200;
    let z = Math.random() * 10000 - 5000; //global scale z axis
    let r = Math.random() * 550 + 400; //local scale, texture size

    //random texture for spirte
    let texture = cloudTextureArray[Math.round(Math.random() * cloudTextureArray.length)];
    // let url = "" if in other folder than root
    //declaring sprite material with loaded texture
    //randomize opacity
    //a bit of colour randomization random hex geenration of some sort!
    // let opacity = Math.random() + 0.1;
    const cloudMat = new THREE.SpriteMaterial({
      map: TL.load(texture),
      color: 0x66AAAA,
      transparent: true,
      // alphaTest: 0.2,
      opacity: 0.3,
    })

    const cloud = new THREE.Sprite( cloudMat );
    cloud.position.set(x, y, z)
    cloud.scale.set(r, r);
    RandomCloudGroup.add(cloud)

  }
  RandomCloudGroup.position.set(0, -400, 0)
  scene.add(RandomCloudGroup);
}

randomizedClouds();



// do something about stupid square points!
function createDustCloud() {
  // let dust;
  const dustParticlesQuantity = 1000000;
  let positions = [];
  const col = new THREE.Color(`hsl(180, 80%, 60%)`);

  //dust geometry
  const dustGeom = new THREE.BufferGeometry();

  //dust material
  const dustMat = new THREE.PointsMaterial({
    color: col,
    map: TL.load("dust3.png"),
    transparent: true,
    alphaTest: 0.4, //xd one little thing changes everything from square to circle!!!!!
    opacity: 0.8,
    size: 0.5,
    sizeAttenuation: true,
  })
  
  
  for (let i = 0; i < dustParticlesQuantity; i++) {
    //changing colors wont work because of the new THREE.Points, it takes dustMat once as argument.
    // let lightness = Math.floor(Math.random() * 50);
    // let hue = Math.floor(Math.random() * 180 + 100);
    // col.setHSL(hue, 100, lightness);
    // dustMat.color = col
    //ale pomysł był całkiem ok xd
    //randomize coords
    const x = Math.random() * 5000 - 2500;
    const y = (Math.random() * 600 ) - 1200;
    const z =  Math.random() * 5000 - 2500;

    positions.push(x, y, z);

  }
 
 
  dustGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const dustMesh = new THREE.Points(dustGeom, dustMat);
  scene.add(dustMesh);

}

createDustCloud()



//fog
const fogColor = 0x668855
// const fogColor = 0xFFFFFF
// scene.fog = new THREE.Fog(fogColor, 0.01, 200);
// scene.fog = new THREE.FogExp2( fogColor, 0.05);


// const sphere1 = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 16, 16),
//   metalMaterial
// );
// sphere1.position.set(-2, 3, 3);
// scene.add(sphere1);

// box.castShadow = box2.castShadow = box3.castShadow = true;
// box.receiveShadow = box2.reciveShadow = box3.reciveShadow = true;
//group is destination 
function addBox(w, h, d, x, y, z, material, group) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mat = material;
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  group.add(mesh);
}


function addCylinder(rt, rb, segments, h, x, y, z, material, group) {
  // add segment value
  const geom = new THREE.CylinderGeometry(rt, rb, h, segments, 2);
  
  const mat = material;
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);
  group.add(mesh);
}


//add light function
function addPointLight(x, y, z, color, intensity, group, distance, decay, helper) {
  const light = new THREE.PointLight(color, intensity, distance, decay);
  light.position.set(x, y, z);
  group.add(light);
  //helper option
  if(helper) {
    const helper = new THREE.PointLightHelper(light, 1);
    group.add(helper);
  }
 
}


// BASE
// outpost x1
// addBox(20, 1, 40, 0, 0, 0, metalMaterial);
const base = new THREE.Group();

// addBox(0.2, 1, 5, 1, 0, 0, steelMaterial, base);
// addBox(0.2, 1, 5, 3, 0, 0, steelMaterial, base);
// addBox(10, 0.5, 10, 0, 0, 0, steelMaterial, base);

// addBox(10, 2, 0.5, 0, 1, 5, steelMaterial, base)


// radius top, radius bottom, segments, height, coords

addCylinder(0.1, 0.5, 16, 15, 0, 8.5, 0, metalMaterial, base);
//base base xd
//recharge field
//cap
const rechargerSides = 32;
addCylinder(2, 2.05, rechargerSides, 0.1, 0, 1, 0, metalMaterialFlat, base)
addCylinder(2, 2, rechargerSides, 2, 0, 0, 0, rechargeFieldMat, base);
addPointLight(0, 0, 0, 0xAAFFAA, 10, base, 20, 20)
addCylinder(2.05, 2.1, rechargerSides, 0.1, 0, -0.7, 0, metalMaterialFlat, base)

//patyk

addCylinder(20, 21, 64, 1.5, 0, -1.5, 0, metalMaterial, base);

//engine
addCylinder(8, 5, 16, 5, 0, -4, 0, metalMaterial, base);


// addPointLight(8, 1, 10, 0xCCCCFF, 10, base, true);

const baseLightCol = 0xFF0000;
//lights and light meshes
addPointLight(10, 1, 10, baseLightCol, 10, base, 10, 10,);
addPointLight(10, -3, 10, baseLightCol, 10, base, 10, 10,);
addCylinder(0.2, 0.2, 8, 2, 10, 1, 10, redLightMat, base);
addCylinder(0.4, 0.4, 8, 2, 10, -1, 10, metalMaterialFlat, base);

addPointLight(-10, 1, 10, baseLightCol, 10, base, 10, 10,);
addPointLight(-10, -3, 10, baseLightCol, 10, base, 10, 10,);
addCylinder(0.2, 0.2, 8, 2, 10, 1, -10, redLightMat, base);
addCylinder(0.4, 0.4, 8, 2, 10, -1, -10, metalMaterialFlat, base);

addPointLight(10, 1, -10, baseLightCol, 10, base, 10, 10, );
addPointLight(10, -3, -10, baseLightCol, 10, base, 10, 10,);
addCylinder(0.2, 0.2, 8, 2, -10, 1, 10, redLightMat, base);
addCylinder(0.4, 0.4, 8, 2, -10, -1, 10, metalMaterialFlat, base);

addPointLight(-10, 1, -10, baseLightCol, 10, base, 10, 10,);
addPointLight(-10, -3, -10, baseLightCol, 10, base, 10, 10,);
addCylinder(0.2, 0.2, 8, 2, -10, 1, -10, redLightMat, base);
addCylinder(0.4, 0.4, 8, 2, -10, -1, -10, metalMaterialFlat, base);



// addPointLight(0, -11, 0, 0x9999FF, 10, base, 20, 20, true);

const engineLight = new THREE.PointLight(0x9999FF, 10, 20, 10);
engineLight.position.set(0, -10, 0);
base.add(engineLight);

// const baseLightHelper = new THREE.PointLightHelper(baseLight1, 1);
// base.add(baseLightHelper);

// const baseLightHelper2 = new THREE.PointLightHelper(baseLight2, 1);
// base.add(baseLightHelper2);


base.position.set(0, 0, 0);
scene.add(base)


let wobble = 0;
let wobbleDelta
function animateBaseLight() {
  wobble += Math.sin(wobbleDelta)
  baseLight.position.set(1, 5 + wobble, 0);
}
// const terrainGeom = new THREE.PlaneGeometry(256, 256, 256, 256);
// // const terrainMaterial = new THREE.MeshBasicMaterial( {color: 0x927856} );
// const terrain = new THREE.Mesh(terrainGeom, metalMaterial);
// terrain.rotation.x = -Math.PI / 2;
// scene.add(terrain);



//grouping spheres, addSphere has new parameter
const floatingGas1 = new THREE.Group();
//zmmniejsz wysokosc rozstrzalu zielonego gazu, dodaj niebieski gaz głębiej
//nawet taki mocno świecący phongMat
function addSphere(r, ws, hs, x, y, z, material, group) {
  const geometry = new THREE.SphereGeometry(r, ws, hs);
  const mat = material;
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  group.add(mesh);
  scene.add(group);
  // scene.add(mesh);
}

// x -
// y - height
// z -
for (let i = 0; i < 500; i++) {
  let x = Math.random() * 5000 - 2500;
  let y = Math.random() * 1200 - 700;
  let z = Math.random() * 5000 - 2550;
  let r = Math.random() * 40;

  addSphere(r, 32, 32, x, y, z, waterMat, floatingGas1);
}

//blue shiny balls xd
//trying to add some lights

const floatingBlueGas = new THREE.Group();

for (let i = 0; i < 200; i++) {
  let x = Math.random() * 5000 - 2500;
  let y = Math.random() * 1200 - 2000;
  let z = Math.random() * 5000 - 2550;
  let r = Math.random() * 40 + 20;

  addSphere(r, 32, 8, x, y, z, blueBalls, floatingBlueGas);
  // addPointLight(0, 0, 0, 0xCCCCFF, 10, floatingGas1);
}

//do randomized gas balls function

// small balls
// for (let i = 0; i < 2000; i++) {
//   let x = Math.random() * 5000 - 2500;
//   let y = Math.random() * 100 - 200;
//   let z = Math.random() * 5000 - 2550;
//   let r = Math.random() * 2;

//   addSphere(r, 32, 32, x, y, z, alienSkin, floatingGas1)

// }



// 💡💡💡💡💡💡 LIGHTS  💡💡💡💡💡💡 light setup

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);

// const greenLight = new THREE.DirectionalLight(0x00ff00, 5);
// greenLight.position.set(15, 10, 2);
// greenLight.castShadow = true;
// scene.add(greenLight);

// DO SOME LIGHT ENGINE THAT CORRESPONDES TO ALTITUDE

const NormalLight = 0xCCDDAA;
const GreenLight = 0xCCEEAA;
const DeepBlue = 0x66EEFF;
const GlobalLight = new THREE.DirectionalLight(GreenLight, 0.9, 0);

GlobalLight.position.set(0, 5000, 5000);
scene.add(GlobalLight);

//color.setRGB(r, g, b);
function updateMainLight(altitude) {
  //find some tricks to change color by hex
  let color = 

  GlobalLight.color = color;

}



const bluePointLight = new THREE.SpotLight(0x0000FF, 2, 10, 45, 5, 10);
bluePointLight.position.set(2, 5, 2);
// scene.add(bluePointLight);
//light helper
const pointLightHelper = new THREE.SpotLightHelper( bluePointLight, 1)
// scene.add(pointLightHelper);


const flashlight = new THREE.SpotLight(0xffffff, 50, 20, 10, 20, 20);
flashlight.position.set(0,0,2);
//add some invisible box or sth and point the light to it
flashlight.target = camera;
camera.add(flashlight);
// flashlight.rotateZ(180)

console.log(flashlight)

const flashlightHelper = new THREE.SpotLightHelper( flashlight, 0xffff00 );
// scene.add( flashlightHelper );

//tint color update , screen effect
const tint = document.querySelector('#screenEffect');
const vignette = document.querySelector('#vignette');
// camera.position.y
const screenEffect = {
   h : 120,
   s : 100,
   l : 50,
   a : 0.05
}
function updateTint(altitude) {
  let h = Math.abs(altitude) / 10;
  // if (altitude <= -200 && screenEffect.h < 200) {
  //   //add altitude to the equation
  // }

  screenEffect.h = 120 + h;
  screenEffect.l = -h / 100;
  screenEffect.a = h / 500;
  vignette.style.opacity = h / 100;
  tint.style.backgroundColor = `hsla(
    ${screenEffect.h},
    ${screenEffect.s}%,
    ${screenEffect.l}%,
    ${screenEffect.a}
    )`;
  // console.log('h:', h.toFixed(2), 'hue: ', screenEffect.h.toFixed(2));
}


function updateCameraLightMatrix () {
  flashlight.position.x = camera.position.x -1;
  flashlight.position.y = camera.position.y -1;
  flashlight.position.z = camera.position.z -1;
  
  // flashlight.lookAt(camera.target);
  // console.log(camera.target)

  flashlight.updateMatrix();
  flashlight.updateMatrixWorld();  
}


// GAME LOOP ====================================================================================

function updateCoordinates() {
  let x = Math.round(camera.position.x)
  let y = Math.round(camera.position.y)
  let z = Math.round(camera.position.z)
  updateFullStatus(DBcoords, `Coordinates: X: ${x}, Y: ${y}, Z: ${z}`);
}

let delta = 0;
function update() {
  delta += 0.1;
}

playAudio(windAmbient);

function animate() {
  requestAnimationFrame(animate);
  // update();

  //slowing down
  //but i have to override standard behaviour after releasing W key.
  //it stops down the movement

  // if (!isAccelerating && currentSpd >= defaultSpd) {
  //   // currentSpd -= acceleration / 2;
  //   currentSpd -= slowingFactor;
  // }

  //jesli przestaje sie krecic i obecna predkosc obrotu jest wieksza niz defaultowa
  // dont work too good
  // if (flyingEngaged) {
  //   if (!isRolling && currentRollSpeed > defaultRollSpeed) {
  //     currentRollSpeed -= rollAcceleration;
  //   }
  //   console.log("isRolling: " + isRolling);
  // }
  // animateBaseLight();
  updateCoordinates();
  upadateFlyingSpeed();
  updateTint(camera.position.y)
  updateEnergy();
  // updateCameraLightMatrix()
  // flashlight.updateMatrix();
  // console.log('roll speed: ' + currentRollSpeed.toFixed(2));
  flyControls.update(0.01);
  renderer.render(scene, camera);
  // composer.render(scene, camera);
  // logCameraCoords(camera);
// stickVignetteToCam(vignetteSprite);

}
animate();



//todo
//add auto leveling to x axis / make rotation indicator
// little moving globe in front of the camera, indicates the 
// map and objects, some kind of navigation
//add SpotLight in front of the camera

/* const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight ); */

//ważne

//napraw cofanie
//najpeirw hamuj potem cofaj, dodaj ifa który bedzie sprwadzal
//prędkość
//if currentSpd > 0 wtedy cofaj.



//dodaj więcej ośiwetlenia, w chmurach itp... sprawdz czy da sie robic volumetric clouds
//randomowe oswietlenie kolorami zieleni i niebieskiego , sprawdz jak to zadziala


//trying to be more object oriented

// class Cube extends THREE.BoxGeometry {
//   // constructor(size, col, x, y, z) {
//   //   this.size = size;
//   //   this.col = col;
//   //   this.x = x;
//   //   this.y = y;
//   //   this.z = z;
//   //   this.geom = new THREE.BoxGeometry(size, size, size);
//   //   this.boxMaterial = new THREE.MeshPhongMaterial({
//   //     color: this.col,
//   //     shininess: 90,
//   //   });

//   // }
  
//   init() {
//     const cube = new THREE.Mesh(this.geom, this.boxMaterial);
//     cube.set(this.x, this.y, this.z);
//   }
//   update() {

//   }
// }

// const Cube1 = new Cube(2, 0x1111CC, 0, 0, 0);
// Cube1.init();