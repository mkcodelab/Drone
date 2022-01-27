// let cloudGeom = new THREE.Geometry();

let clouds = TL.load("cloud10.png");
clouds.magFilter = THREE.LinearMipMapLinearFilter;
clouds.minFilter = THREE.LinearMipMapLinearFilter;

let fog = new THREE.Fog(0x4584b4, -100, 3000);

material = new THREE.ShaderMaterial({
  uniforms: {
    map: { type: "t", value: clouds },
    fogColor: { type: "c", value: fog.color },
    fogNear: { type: "f", value: fog.near },
    fogFar: { type: "f", value: fog.far },
  },
  vertexShader: document.getElementById("vs").textContent,
  fragmentShader: document.getElementById("fs").textContent,
  depthWrite: false,
  depthTest: false,
  transparent: true,
});

let plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

for (var i = 0; i < 8000; i++) {
  plane.position.x = Math.random() * 1000 - 500;
  plane.position.y = -Math.random() * Math.random() * 200 - 15;
  plane.position.z = i;
  plane.rotation.z = Math.random() * Math.PI;
  plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
  scene.add(plane);
  console.log('cloud added');
  // THREE.GeometryUtils.merge(geometry, plane);
}

// mesh = new THREE.Mesh(cloudGeom, material);
// scene.add(mesh);

// mesh = new THREE.Mesh(cloudGeom, material);
// mesh.position.z = -8000;
// scene.add(mesh);
