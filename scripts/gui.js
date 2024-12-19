import GUI from '../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';

let gui, guiCam;
const guiEnable = true;

const guiObject = {
  fireBoolean: true,
  smokeBoolean: true,
  feBoolean: true,
  pauseBoolean: false,
  value1: 1, 
  value2: 1, 
  value3: .6, 
  value4: .01, 
  color: { r: 0.01, g: 0.01, b: 0.01 },
};

function addGUI() {
  if(guiEnable) {
	gui = new GUI();
    guiCam = gui.addFolder('FireAR');

    // guiCam.add( guiObject, 'value1', 1, textureCount, 1 ).name('Texture');
    // guiCam.add( guiObject, 'value2', 0, 1 ).name('Box Brightness');
    guiCam.add( guiObject, 'value3', 0, 10 ).name('Scene Brightness');  
    // guiCam.add( guiObject, 'value4', 0, 1 ).name('Camera Damping');
    guiCam.addColor( guiObject, 'color', 255 );
    guiCam.add( guiObject, 'fireBoolean' ).name('Fire');  
    guiCam.add( guiObject, 'smokeBoolean' ).name('Smoke');  
    guiCam.add( guiObject, 'feBoolean' ).name('Fire Extinguisher');  
    guiCam.add( guiObject, 'pauseBoolean' ).name('Pause');  


    gui.onChange( event => {
      console.log(event.property)
      if (event.property == 'feBoolean' && guiObject.feBoolean == true)
        playFeAnimations();
      else
        stopFeAnimations();
    } );
  }
}

// addGUI();

export { guiObject };