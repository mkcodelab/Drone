const scene = new THREE.Scene();
// 🎥 camera setup
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
// turn camera to the right place
camera.position.set(1, 1, 4);
camera.lookAt(0, 1, 0);

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

// const controls = new THREE.OrbitControls(camera, renderer.domElement);








//ship movement

let flyingEngaged = false;
let booster = false;
let boosterAcceleration = 0.02;

let defaultSpd = 10;

let maxSpd = 400;
let maxSpdNoBooster = 400;
let maxSpdBooster = 600;

let acceleration = 1.05;
let currentSpd = defaultSpd;
let isAccelerating = false;

let defaultRollSpeed = 0.8;
let maxRollSpeed = 4;
let rollAcceleration = 1.02;
let currentRollSpeed = defaultRollSpeed;
let isRolling = false;
let engineSound = false;
let brake = false;

//todo update roll speed to be accelerated / decelerated
// KEYDOWN EVENT
addEventListener("keydown", (e) => {
  // console.log('pressed: ' + e.key)

  //accelerate
  if (flyingEngaged && e.key === "w") {
    isAccelerating = true;
    if (currentSpd < maxSpd) {
      if (booster) {
        currentSpd *= (acceleration + boosterAcceleration);
      } else {
        currentSpd *= acceleration
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
    brake = true;
  }

  
});

//KEYUP EVENT
addEventListener("keyup", (e) => {
  // console.log('released: ' + e.key)
  
  // if (flyingEngaged) {
  //   if (e.key === 'Shift') {
  //     console.log('shift released')
  //     maxSpeed = maxSpdNoBooster;
  //   }
  // }

  //shift key for speedup
  if (flyingEngaged) {
    if (e.key === "Shift") {
      // console.log("shift pressed");
      booster = !booster;
      console.log("booster: " + booster)
      if (booster) {
        //update max speed to idk 600, after release update to old value
        maxSpd = maxSpdBooster;
        updateFullStatus(DBbooster, "Booster: ON")

      } else {
        maxSpd = maxSpdNoBooster;
        updateFullStatus(DBbooster, "Booster: OFF")

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
      currentSpd = defaultSpd;
      flyControls.autoForward = false;
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
      updateFullStatus(DBstatus, "Engine Started!");
      flyControls.autoForward = true;
      playAudio(engineOn);
      return;
    }



    //rolling decelerate
    // release q or e keys
    if (flyingEngaged) {
      if (e.key === "q") {
        console.log(e.key);
        isRolling = false;

        // if (currentRollSpd >= defaultRollSpeed) {
        //   currentRollSpd -= rollVelocity;
        // }
      }
      if (e.key === "e") {
        console.log(e.key);
        isRolling = false;
      }
    }
  }

  //slowing down
  //add some dividing for loosing speed effect
  //releasing w key
  if (e.key === "w") {
    isAccelerating = false;

    // if (currentSpd >= defaultSpd) {
    //   currentSpd -= acceleration;
    // }
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
let spaceWarpFov = 0.5; //higher is faster

// function updateRollingSpeed() {
//   flyControls.rollSpeed = currentRollSpeed;

// }

function upadateFlyingSpeed() {

  // reset the values
  if (currentSpd > maxSpd) {
    currentSpd = maxSpd;
  }
  // update flying speed and rolling speed
  if (brake && currentSpd > defaultSpd) {
    currentSpd -= 3;
  }

  flyControls.movementSpeed = currentSpd;
  // flyControls.rollSpeed = currentRollSpeed;

  if (flyingEngaged) {
    updateEngineFrequency(currentSpd);
    // updateVelocityStatus();
    updateFullStatus(DBVelocity, `Velocity: ${Math.round(currentSpd)}`);
    //calculating fov based on velocity
    let newFOV = 55 + currentSpd * normalFov;
    updateFOV(newFOV);
  }
  if (!flyingEngaged) {
    flyControls.movementSpeed = defaultSpd;
    flyControls.rollSpeed = defaultRollSpeed;
    currentRollSpeed = defaultRollSpeed;
  }
}

function changeFlyDragging() {
  flyControls.dragToLook = !flyControls.dragToLook;
}



// MAP ***********************************************************************************


// opakuj tworzenie mapy w jakąś funkcję
// mapa moglaby skladac się z różnych wielkości obiektów rozmieszczonych w przestrzeni
// jakąś nawigację możnaby do tego dorzucić i by było coś fajnego;



//skybox

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  "skybox/xpos.png",
  "skybox/xneg.png",
  "skybox/ypos.png", //top
  "skybox/yneg.png", //bottom
  "skybox/zpos.png",
  "skybox/zneg.png",
]);
scene.background = texture;

// texture loader
const TL = new THREE.TextureLoader();

let baseColor = 0xaaffaa;
// try to change color of the material
const boxMaterial = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  shininess: 90,
  map: TL.load("steel.jpg"),
});

const steelMaterial = new THREE.MeshPhongMaterial({
  color: 0x11cc55,
  shininess: 100,
  map: TL.load("steel.jpg"),
  //normal map
  // normalMap: new THREE.TextureLoader().load('normalMap.png')
});

const metalMaterial = new THREE.MeshPhongMaterial({
  map: TL.load("Metal_Damaged_001_basecolor.jpg"),
  normalMap: TL.load("Metal_Damaged_001_normal.jpg"),
  displacementMap: TL.load("Metal_Damaged_001_height.png"),
  // metalnessMap: new THREE.TextureLoader().load('Metal_Damaged_001_metallic.jpg'),
  displacementScale: 0.1,
  shininess: 100,
});

const alienSkin = new THREE.MeshPhongMaterial({
  map: TL.load("alienTexture/Abstract_Organic_002_COLOR.jpg"),
  normalMap: TL.load("alienTexture/Abstract_Organic_002_NORM.jpg"),
  displacementMap: TL.load("alienTexture/Abstract_Organic_002_DISP.png"),
  displacementScale: 0.1,
  shininess: 100,
});

const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  metalMaterial
);
sphere1.position.set(-2, 3, 3);
// scene.add(sphere1);

// box.castShadow = box2.castShadow = box3.castShadow = true;
// box.receiveShadow = box2.reciveShadow = box3.reciveShadow = true;

function addBox(w, h, d, x, y, z, material) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mat = material;
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
}



// BASE
// outpost x1
// addBox(20, 1, 40, 0, 0, 0, metalMaterial);

const terrainGeom = new THREE.PlaneGeometry(256, 256, 256, 256);
// const terrainMaterial = new THREE.MeshBasicMaterial( {color: 0x927856} );
const terrain = new THREE.Mesh(terrainGeom, metalMaterial);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

function addSphere(r, ws, hs, x, y, z, material) {
  const geometry = new THREE.SphereGeometry(r, ws, hs);
  const mat = material;

  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
}

// x -
// y - height
// z -

for (let i = 0; i < 500; i++) {
  x = Math.random() * 1000 - 500;
  y = Math.random() * 1000;
  z = Math.random() * 1000 - 550;
  r = Math.random() * 10;

  addSphere(r, 32, 32, x, y, z, alienSkin);
}

//trying to be more object oriented

// class Cube {
//   constructor(size, col, x, y, z) {
//     this.size = size;
//     this.col = col;
//     this.x = x;
//     this.y = y;
//     this.z = z;
//     this.geom = new THREE.BoxGeometry(size, size, size);
//     this.boxMaterial = new THREE.MeshPhongMaterial({
//       color: this.col,
//       shininess: 90,
//     });

//   }
//   init() {
//     const cube = new THREE.Mesh(this.geom, this.boxMaterial);
//     cube.set(this.x, this.y, this.z);
//   }
//   update() {

//   }
// }

// const Cube1 = new Cube(2, 0x1111CC, 0, 0, 0);
// Cube1.init();

// addBox(5, 5, 0.2, 0xffffff, 0, 0, 0);

// for (let i = 0; i < 4; i++) {
//   addBox(i + 0.2, i + 0.2, .2, 0x77CCAA, i / 2, i * 2 , i * 1.5)
// }

// 💡💡💡💡💡💡 light setup

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);

// const greenLight = new THREE.DirectionalLight(0x00ff00, 5);
// greenLight.position.set(15, 10, 2);
// greenLight.castShadow = true;
// scene.add(greenLight);

const light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(0, 5000, 5000);
scene.add(light);



// GAME LOOP ====================================================================================

let delta = 0;
function update() {
  delta += 0.1;
}

function animate() {
  requestAnimationFrame(animate);
  update();

  //slowing down
  //but i have to override standard behaviour after releasing W key.
  //it stops down the movement

  if (!isAccelerating && currentSpd >= defaultSpd) {
    currentSpd -= acceleration / 2;
  }

  //jesli przestaje sie krecic i obecna predkosc obrotu jest wieksza niz defaultowa
  // dont work too good
  if (flyingEngaged) {
    if (!isRolling && currentRollSpeed > defaultRollSpeed) {
      currentRollSpeed -= rollAcceleration;
    }
    console.log("isRolling: " + isRolling);
  }

  upadateFlyingSpeed();

  // console.log('roll speed: ' + currentRollSpeed.toFixed(2));
  flyControls.update(0.01);
  renderer.render(scene, camera);
}
animate();
