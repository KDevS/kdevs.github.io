// Three JS Modules
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { AnimationMixer } from "three";

// Post Processing
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from '../node_modules/three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Debugging Tools
// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// Particle System File
import { getParticleSystem } from "./getParticleSystem.js";
import { guiObject } from "./gui.js";

let camera, scene, renderer, composer, controls, model
let modelCircle, baseCircle;
// let gui, guiCam;

let mixerSmoke, mixerFire, mixerFE
let modelSmoke, modelFire, modelFE, modelWood
const clock = new THREE.Clock();
let deltaTime

// const statsEnable = false;
// const guiEnable = true;
const toneMapping = THREE.ACESFilmicToneMapping;
const antialiasing = false;
const AmbientOcclusion = false;

const loader = new GLTFLoader().setPath( '/assets/3D/' );
const texLoader = new THREE.TextureLoader().setPath( '/assets/textures/' )
const hdriLoader = new RGBELoader().setPath( '/assets/hdri/' )

const fileFE = 'FE.glb'
const fileBase = 'circle.glb'

let fireEffect, smokeEffect, feEffect
let velocityRotation = new THREE.Vector3()
let FEAnimations

let pinRemoved = false;
let fireEnable = true;
let smokeEnable = true;
let feEnable = false;
let fireExtinguished = false;
let swipeStarted = false;
let swipeFinished = false;

const fireRateValue = 30;
const smokeRateValue = 10;
const feRateValue = 1000;

let fireRate = fireRateValue;
let smokeRate = smokeRateValue;
let feRate = feRateValue;

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({color: 0x000000,});

// Fire Particles
const fireSpawn = new THREE.Mesh(cubeGeometry, cubeMaterial);
fireSpawn.position.set(0, -0.2, 0)
fireSpawn.scale.set(.1, .1, .1);

const fireSpeed = .5;
const fireRotationSpeed = 10;
const fireVelocity = new THREE.Vector3(0, .3, 0);
const fireDelta = 0.01;
const fireOutTime = 10000;

let fireDeltaVal = 0;

// Smoke Particles
const smokeSpawn = new THREE.Mesh(cubeGeometry, cubeMaterial);
smokeSpawn.position.set(0, -0.2, 0)
smokeSpawn.scale.set(.1, .1, .1);

const smokeSpeed = .5;
const smokeRotationSpeed = 10;
const smokeVelocity = new THREE.Vector3(0, .3, 0);
const smokeDelta = 0.01;
const smokeOutTime = 20000;

let smokeDeltaVal = 0;

// Fire Extinguisher Particles
const feSpawn = new THREE.Mesh(cubeGeometry, cubeMaterial);
feSpawn.position.set(.2, 0, 0)
feSpawn.scale.set(.1, .1, .1);

const feSpeed = .5;
const feRotationSpeed = 10;
const feVelocity = new THREE.Vector3(0, 1, 0);
const FeRotation = new THREE.Vector3(.6, 0, 0);
const feOutTime = 25000;

let cameraRotationInit = new THREE.Vector3(0, 0, 0);
let cameraRotationFinal = new THREE.Vector3(0, 0, 0);

let timeLimit = 60;
const timeLimitPractice = 120;
const timeLimitTest = 60;
const heroTimeLeftLimit = 20;

let feRoot = []

let rayCaster, mouse;
// let intersects;

// -------------------- GUI --------------------  

/* const guiObject = {
  fireBoolean: true,
  smokeBoolean: true,
  feBoolean: true,
  pauseBoolean: false,
  value1: 1, 
  value2: 1, 
  value3: .6, 
  value4: .01, 
  color: { r: 0.01, g: 0.01, b: 0.01 },
}; */

//addGUI();

init();

function init() {
  // ------------------- Set BG Camera Feed ----------------
  const video = document.querySelector('video');
  
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  
  const constraints = {
	  audio: false,
	  video: {
		  facingMode: 'environment'
	  }
  };
  
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {video.srcObject = stream});
  
  // ------------------- Scene Setup -----------------------

  const container = document.createElement( 'div' );
  container.setAttribute('id', 'gfxMain');
  // document.body.appendChild( container );
  const containerMain = document.getElementById('mainContainer');
  containerMain.appendChild( container );

  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 2000 );
  // camera.position.set( 0, .5, 1.5 );
  camera.position.set( 0.1, .5, 1.5 );

  scene = new THREE.Scene();
  
  // -------------------- Click Event ------------------
  
  rayCaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // -------------------- Particles --------------------


  fireEffect = getParticleSystem({
    camera,
    emitter: fireSpawn,
    parent: scene,
    rate: fireRate,
    texture: './assets/img/fire.png',
    radius: .0001,
    maxLife: 2,
    // maxLife: 10,
    maxSize: 4,
    // maxSize: 10,
    maxVelocity: fireVelocity,
    colorA: new THREE.Color(0xffffff),
    colorB: new THREE.Color(0xff8080),
    alphaMax: 1.0,
  });

  smokeEffect = getParticleSystem({
    camera,
    emitter: smokeSpawn,
    parent: scene,
    rate: smokeRate,
    texture: './assets/img/smoke.png',
    radius: .0001,
    maxLife: 4,
    // maxLife: 10,
    maxSize: 3.5,
    // maxSize: 10,
    maxVelocity: smokeVelocity,
    colorA: new THREE.Color(0x000000),
    colorB: new THREE.Color(0xffffff),
    alphaMax: 0.8,
    // alphaMax: 1,
  });

  feEffect = getParticleSystem({
    camera,
    emitter: feSpawn,
    parent: scene,
    rate: feRate,
    texture: './assets/img/smoke.png',
    radius: .01,
    maxLife: .8,
    maxSize: 2,
    maxVelocity: feVelocity,
    colorA: new THREE.Color(0x000000),
    colorB: new THREE.Color(0xffffff),
    alphaMax: 0.8,
  });

  // -------------------- Import Assets --------------------

  // FE
  loader.load(fileFE, async function ( gltf ) {

    modelFE = gltf.scene;
    // modelFE.scale.set( .1,.1,.1 );
    modelFE.position.set( 0,1,-1 );

    modelFE.traverse((child) => {
      if (child.isMesh) {
          child.castShadow = true;
          // child.receiveShadow = true;
      }
	  // console.log("FE child: " + child.name);
      if (child.name === 'Fire_Extinguisher_Base') {
        feRoot[0] = child;
        // console.log('feRoot[0] : ', feRoot[0]);
      }
      if (child.name === 'FE_Origin') {
        feRoot[1] = child;
        feRoot[1].rotation.set(FeRotation.x + feRoot[1].rotation.x, FeRotation.y + feRoot[1].rotation.y, FeRotation.z + feRoot[1].rotation.z);
        // feRoot[1].rotation.add(FeRotation);
        // console.log('feRoot[1] : ', feRoot[1]);
      }
	  if (child.name === 'Mesh006_6') {
        feRoot[2] = child;
        // console.log('feRoot[0] : ', feRoot[0]);
      }
    });

    await renderer.compileAsync( modelFE, camera, scene );

    // gltf.animations.name = 'FEAnimation';
    
    mixerFE = new AnimationMixer(modelFE);
    mixerFE.loop = false;
    FEAnimations = gltf.animations;

    scene.add( modelFE );
    // console.log('modelFE : ', modelFE);
    // console.log(gltf.animations);
    // console.log('mixerFE : ', mixerFE);
  } );
  
 // ------------------- Render Starts --------------------------------  

  renderer = new THREE.WebGLRenderer( { antialias: antialiasing, alpha: true } );
  // renderer.setClearAlpha(0.0);
  // renderer.setClearColor(0x000000, 0);
  // renderer.autoClear = false;
  renderer.setPixelRatio( window.devicePixelRatio );
  // scene.background = null;
  // renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1 : window.devicePixelRatio); // Optimize for mobile
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = toneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild( renderer.domElement );
  
  // console.log("ThreeJS version: " + THREE.REVISION);

  // ---------------------------- controls --------------------------------

  controls = new OrbitControls( camera, renderer.domElement );
  // controls.addEventListener( 'change', render );

  controls.target.set( 0, .1, 0);

  // controls.minDistance = .5;
  controls.minDistance = 2.15;
  
  // controls.maxDistance = .9;
  controls.maxDistance = 2.15;
  controls.update();
  // controls.maxDistance = 20.1;

  controls.enableDamping = true;
  // controls.dampingFactor = guiObject.value4;
  controls.dampingFactor = 0.04;
  controls.rotateSpeed = 0.07;

  controls.autoRotate = false;
  controls.autoRotateSpeed = 2;

  controls.enablePan = false;
  controls.maxTargetRadius = .1;
  // controls.maxPolarAngle = Math.PI / 1.9;
  controls.minPolarAngle = 0.72;
  controls.maxPolarAngle = 0.75;
  
  controls.minAzimuthAngle = 2.95;
  controls.maxAzimuthAngle = -2.95;
  
  controls.update();
  
  // ---------------------------- scene --------------------------------

  window.addEventListener( 'resize', onWindowResize );
  renderer.domElement.addEventListener( 'click', onClick, true );
  renderer.domElement.addEventListener( 'mousedown', onMouseDown, true );
  renderer.domElement.addEventListener( 'mouseup', onMouseUp, true );

  // Studio lighting setup

  const HemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 5 );
  scene.add( HemisphereLight );

  const helperHemisphereLight = new THREE.HemisphereLightHelper( HemisphereLight, 5 );

  // Ambient Light (fill light)
  const ambientLight = new THREE.AmbientLight(0xaaaaff, 2); 
  scene.add(ambientLight);

  // Key Light (main light source)
  const keyLight = new THREE.RectAreaLight(0x333333, 20, 20, 20); 
  keyLight.position.set(5, 5, 5); 
  // keyLight.castShadow = true; 
  scene.add(keyLight);
  
  // Fill Light
  const fillLight = new THREE.DirectionalLight(0xffffff, 8);
  fillLight.position.set(-5, 5, 10);
  fillLight.castShadow = true;
  fillLight.shadow.mapSize.width = 2000;
  fillLight.shadow.mapSize.height = 2000;
  fillLight.lookAt(0, 0, 0);
  scene.add(fillLight);

  // Back Light (rim light)
  const backLight = new THREE.DirectionalLight(0xffffff, 1);
  backLight.position.set(0, 10, -10);
  backLight.castShadow = false;
  scene.add(backLight);

  const helperBackLight = new THREE.DirectionalLightHelper( backLight, 2 );

  // Back Light (rim light)
  const backLight2 = new THREE.DirectionalLight(0xffffff, 15);
  backLight2.position.set(-5, 10, -10);
  backLight2.castShadow = false;
  scene.add(backLight2);
  
  //
  // timeLimit = parent.getApplicationMode() == 0 ? timeLimitPractice : timeLimitTest;
  // countDownClock(timeLimit, 'seconds');

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  composer.setSize(window.innerWidth, window.innerHeight); // Update composer size

  render();

}

function onClick(event) 
{
	event.preventDefault();
	
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	
	rayCaster.setFromCamera(mouse, camera);
	
	var intersects = rayCaster.intersectObject(modelFE, true);
	// intersects = rayCaster.intersectObject(modelFE, true);
	
	if (intersects.length > 0)
	{
		console.log("Model clicked: " + intersects[0].object.name);
		
		if ((intersects[0].object.name == 'Mesh006_1' || intersects[0].object.name == 'Spring') && !pinRemoved)
		{
			playAnimation(2);
			setTimeout(function() { togglePinRemovedState(true); }, 1000);
			parent.updateInstruction();
		}
		// else if (intersects[0].object.name == 'Handle' && pinRemoved && !feEnable)
		else if (intersects[0].object.name == 'Handle' && pinRemoved && swipeFinished && !feEnable)
		{
			playAnimation(1);
			setTimeout(function() { toggleFESpray(true); }, 1000);
			parent.updateInstruction();
			//
			swipeStarted = swipeFinished = false;
		}
	}
}

function onMouseDown(event) 
{
	event.preventDefault();
	
	// if(intersects.length == 0 || intersects[0].object.name != 'Mesh006')
	// {
		// return;
	// }
	
	// console.log("swipeStarted: " + swipeStarted + ", ApplicationMode(): " + parent.getApplicationMode() + ", InstructionIndex(): " + parent.getInstructionIndex());
	if (!pinRemoved || swipeStarted || parent.getInstructionIndex() != 2)
	{
		return;
	}
	
	swipeStarted = true;
	
	cameraRotationInit = camera.rotation;
}

function onMouseUp(event) 
{
	event.preventDefault();
	
	// console.log("swipeStarted: " + swipeStarted + ", swipeFinished: " + swipeFinished + ", ApplicationMode(): " + parent.getApplicationMode() + ", InstructionIndex(): " + parent.getInstructionIndex());
	
	if (!pinRemoved || !swipeStarted || swipeFinished || parent.getInstructionIndex() != 2)
	{
		return;
	}
	
	// event.preventDefault();
	cameraRotationFinal = camera.rotation;
	
	// if (cameraRotationFinal != cameraRotationInit)
	// {
		// swipeStarted = false;
		swipeFinished = true;
		parent.updateInstruction();
	// }
}

function playAnimation(index)
{
	var clip = FEAnimations[index];
	clip.loop = false;
	
	var action = mixerFE.clipAction(clip);
	action.setLoop(THREE.LoopOnce);
	action.clampWhenFinished = true;
	// action.stop();
	action.play();
}

function toggleFESpray(flag)
{
	feEnable = flag;
	
	initFireOutTimer();
}

function initFireOutTimer()
{
	setTimeout(function() { fireEnable = false; }, fireOutTime);
	setTimeout(function() { smokeEnable = false; }, smokeOutTime);
	setTimeout(function() { feEnable = false; }, feOutTime);
	setTimeout(function() { fireExtinguished = true; }, feOutTime + 1500);
}

function togglePinRemovedState(flag)
{
	pinRemoved = flag;
}

function playFeAnimations() {
  FEAnimations.forEach((clip3) => {
    console.log('clip3: ', clip3)
    clip3.loop = false
    mixerFE.clipAction(clip3).play();
  });
}

function stopFeAnimations() {
  FEAnimations.forEach((clip3) => {
    console.log('clip3: ', clip3)
    clip3.loop = false
    mixerFE.clipAction(clip3).stop();
  });
}


function animate() {
  requestAnimationFrame(animate);

  deltaTime = clock.getDelta();
  
  controls.update();
  controls.dampingFactor = guiObject.value4;

  renderer.render( scene, camera );

  if (composer) {
    composer.render();
  }

  if(mixerSmoke) {
    mixerSmoke.update(deltaTime);
    // console.log('mixerSmoke : ', mixerSmoke);
  }
  if(mixerFire) {
    // console.log('mixerFire : ', mixerFire);
  }
  if(mixerFE && modelFE) {
    mixerFE.update(deltaTime);
  }

  if(baseCircle)
  modelCircle.children[0].material.color = new THREE.Color(guiObject.color.r, guiObject.color.g, guiObject.color.b);

  if(!guiObject.pauseBoolean) {
   // fireEffect.update(deltaTime * fireSpeed, fireRate);
   fireEffect.update(deltaTime * fireSpeed, fireRate, fireDeltaVal);
   // smokeEffect.update(deltaTime * smokeSpeed, smokeRate);
   smokeEffect.update(deltaTime * smokeSpeed, smokeRate, smokeDeltaVal);
   feEffect.update(deltaTime * feSpeed, feRate);
  }

  fireRate = guiObject.fireBoolean && fireEnable ? fireRateValue : 0;
  smokeRate = guiObject.smokeBoolean && smokeEnable ? smokeRateValue : 0;
  feRate = guiObject.feBoolean && feEnable ? feRateValue : 0;

  // console.log('feRate : ', feRate);

  if(feRoot.length) {
    // feSpawn.position.copy(feRoot[0].position).add(feRoot[1].position)

    // FE Model Origin + Local Location of Hose
    // feSpawn.position.copy(modelFE.position).add(feRoot[0].position).sub(new THREE.Vector3(0,.1,0))
    feSpawn.position.copy(modelFE.position).add(feRoot[1].position).sub(new THREE.Vector3(0, -.03, -.23))
    // feVelocity.copy(feRoot[0].rotation).sub(feRoot[1].rotation).add(new THREE.Vector3(.6,-1,0))
    // feVelocity.copy(feRoot[0].rotation).add(new THREE.Vector3(0,0,1))
    velocityRotation.copy(modelFE.rotation)
    velocityRotation.normalize();
    // feVelocity.copy(velocityRotation).add(new THREE.Vector3(0,-1,1))
    feVelocity.copy(velocityRotation).add(new THREE.Vector3(0,-1.5,1))
    // console.log(velocityRotation)
	// console.log("modelFE.position :: x: " + modelFE.position.x + ", y: " + modelFE.position.y + ", feRoot[0].position :: x: " + feRoot[0].position.x + ", y: " + feRoot[0].position.y);
  }

  // modelFE.rotation.y += .01

  renderer.toneMappingExposure = guiObject.value3;
  
  // console.log("polar: " + controls.getPolarAngle() + ", azimuth: " + controls.getAzimuthalAngle() + ", distance: " + controls.getDistance());
}

// Start animation
animate();


//timer
const countDownClock = (number = 100, format = 'seconds') => {
  
  // const d = document;
  const d = parent.document;
  // const daysElement = d.querySelector('.days');
  // const hoursElement = d.querySelector('.hours');
  const minutesElement = d.querySelector('.minutes');
  const secondsElement = d.querySelector('.seconds');
  let countdown;
  convertFormat(format);
  
  
  function convertFormat(format) {
    switch(format) {
      case 'seconds':
        return timer(number);
      case 'minutes':
        return timer(number * 60);
	  case 'hours':
        return timer(number * 60 * 60);
      case 'days':
        return timer(number * 60 * 60 * 24);             
    }
  }

  function timer(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;

    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);

	  displayTimeLeft(secondsLeft);

      if(secondsLeft <= 0) {
        clearInterval(countdown);
		setTimeout( function() { timeLimitReached(); }, 1000);
        return;
      };
	  
	  if (fireExtinguished)
	  {
		  clearInterval(countdown);
		  setTimeout( function() { fireExtinguishedHandler(secondsLeft); }, 3000);
		  return;
	  }

      // displayTimeLeft(secondsLeft);
	  //
	  
	  var delta = feEnable ? -1 : 1;
	  
	  updateFire(delta);
	  updateSmoke(delta);
	  
	  /* if (!feEnable)
	  {
		  updateFire(1);
		  updateSmoke(1);
	  } */
	  
	  //
    },1000);
  }

  function displayTimeLeft(seconds) {
    // daysElement.textContent = Math.floor(seconds / 86400);
    // hoursElement.textContent = Math.floor((seconds % 86400) / 3600);
	var minutes = Math.floor((seconds % 86400) % 3600 / 60);
    // minutesElement.textContent = Math.floor((seconds % 86400) % 3600 / 60);
    minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
    secondsElement.textContent = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
  }
}


/*
  start countdown
  enter number and format
  days, hours, minutes or seconds
*/
timeLimit = parent.getApplicationMode() == 0 ? timeLimitPractice : timeLimitTest;
countDownClock(timeLimit, 'seconds');

function timeLimitReached()
{
	// console.log("Time limit reached! The fire is beyond control now. Please try again.");
	
	var mode = parent.getApplicationMode();
	var index = parent.getInstructionIndex();
	
	var popUpStr;
	
	if (mode == 0)
	{
		popUpStr = "practice_failure_popup";
	}
	else if (mode == 1)
	{
		popUpStr = (index >= parent.getInstructionLimit()) ? "test_timeout_popup" : "test_failure_popup";
	}
	
	// parent.updateInstruction();
	parent.resetARUI();
	window.parent.unloadARFrame();
	// window.parent.showPopup("practice_failure_popup");
	window.parent.showPopup(popUpStr);
}

function fireExtinguishedHandler(secondsLeft)
{
	// console.log("Congratulations! You have successfully extinguished the fire!");
	var mode = parent.getApplicationMode();
	var popUpStr;
	
	if (mode == 0)
	{
		popUpStr = "practice_success_popup";
	}
	else if (mode == 1)
	{
		popUpStr = secondsLeft >= heroTimeLeftLimit ? "test_success_popup" : "test_failure_partial_popup";
	}

	
	// parent.updateInstruction();
	parent.resetARUI();
	window.parent.unloadARFrame();
	// window.parent.showPopup("practice_success_popup");
	window.parent.showPopup(popUpStr);
}

function updateFire(value)
{
	fireDeltaVal += value > 0 ? fireDelta : -fireDelta;
}

function updateSmoke(value)
{
	smokeDeltaVal += value > 0 ? smokeDelta : -smokeDelta;
}