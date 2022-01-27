//MATERIALS AND TEXTURELOADER
//define materials here!!!

const TL = new THREE.TextureLoader();

const waterTexture = TL.load("waterTexture/Water_002_COLOR.jpg");
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(4, 4);

const waterTextureNorm = TL.load("waterTexture/Water_002_NORM.jpg");
waterTextureNorm.wrapS = THREE.RepeatWrapping;
waterTextureNorm.wrapT = THREE.RepeatWrapping;
waterTextureNorm.repeat.set(4, 4);

const waterTextureDisp = TL.load("waterTexture/Water_002_DISP.png");
// waterTextureDisp.wrapS = THREE.RepeatWrapping;
// waterTextureDisp.wrapT = THREE.RepeatWrapping;
// waterTextureDisp.repeat.set(4, 4);

const waterMat = new THREE.MeshPhongMaterial({
  map: waterTexture,
  normalMap: waterTextureNorm,
  displacementMap: waterTextureDisp,
  displacementScale: 0.1,
  color: 0xFFFF88,
  shininess: 200,
  transparent: true,
  opacity: .2,
  side: THREE.DoubleSide, //inside texture
  
});

//dopasuj te kolory jasniejsze, bardziej jaskrawe
//moze uzyj THREE.Color hsl
const blueBalls = new THREE.MeshPhongMaterial({
  map: TL.load("waterTexture/Water_002_COLOR.jpg"),
  normalMap: TL.load("waterTexture/Water_002_NORM.jpg"),
  displacementMap: TL.load("waterTexture/Water_002_DISP.png"),
  displacementScale: 0.1,
  color: 0xDDEEFF,
  shininess: 100,
  transparent: true,
  opacity: .2,
  
});

const alienSkin = new THREE.MeshPhongMaterial({
  map: TL.load("alienTexture/Abstract_Organic_002_COLOR.jpg"),
  normalMap: TL.load("alienTexture/Abstract_Organic_002_NORM.jpg"),
  displacementMap: TL.load("alienTexture/Abstract_Organic_002_DISP.png"),
  color: 0xFF3377,
  displacementScale: 0.1,
  shininess: 120,
  transparent: true,
  opacity: .8,
  
});
//light
const redLightMat = new THREE.MeshBasicMaterial({
  color: 0xFF5555,
  transparent: true,
  opacity: .6,
})

const metalTexture = TL.load("textures/Metal_Panels_009_basecolor.jpg");
metalTexture.wrapS = THREE.RepeatWrapping;
metalTexture.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(8, 8);

const metalTextureNorm = TL.load("textures/Metal_Panels_009_normal.jpg");
metalTextureNorm.wrapS = THREE.RepeatWrapping;
metalTextureNorm.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(8, 8);

const metalTextureDisp = TL.load("textures/Metal_Panels_009_height.png");
metalTextureDisp.wrapS = THREE.RepeatWrapping;
metalTextureDisp.wrapT = THREE.RepeatWrapping;
metalTextureDisp.repeat.set(8, 8);

const metalMaterial = new THREE.MeshPhongMaterial({
  map: metalTexture,
  normalMap: metalTextureNorm,
  displacementMap: metalTextureDisp,
  // metalnessMap: new THREE.TextureLoader().load('Metal_Damaged_001_metallic.jpg'),
  displacementScale: 0.1,
  shininess: 100,
  // color: 0xFFFFFF,
});

const metalMaterialFlat = new THREE.MeshPhongMaterial({
  map: TL.load("textures/Metal_Panels_009_height.png"),
  normalMap: TL.load("textures/Metal_Panels_009_normal.jpg"),
  shininess: 100
})

//repeating texture is more complex
const steelTexture = TL.load("steel.jpg")
steelTexture.wrapS = THREE.RepeatWrapping;
steelTexture.wrapT = THREE.RepeatWrapping;
steelTexture.repeat.set(4, 4);
const steelMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 100,
  map: steelTexture,
  //normal map
  // normalMap: new THREE.TextureLoader().load('normalMap.png')
});

const cloudMat = new THREE.SpriteMaterial({
  map: TL.load("cloud10.png"),
  alphaTest: 0.1,
  color: 0x66AA77,
  transparent: true,
  opacity: 0.5,
})
//dodaj jakies fajne textury
const rechargeFieldMat = new THREE.MeshPhongMaterial ({
  color: 0x00FF00,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide,
})

// const dustMat = new THREE.PointsMaterial({
//   color: col,
//   map: TL.load("dust.png"),
//   transparent: true,
//   opacity: 0.4,
//   // sizeAttenuation: true,
// })