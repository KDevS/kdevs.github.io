import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

const statsEnable = true;

const stats = () => {
  if (statsEnable){
    const stats1 = new Stats();
    stats1.showPanel(0);
    const stats2 = new Stats();
    stats2.showPanel(1);
    stats2.dom.style.cssText = 'position:absolute;top:0px;left:80px;';
    const stats3 = new Stats();
    stats3.showPanel(2);
    stats3.dom.style.cssText = 'position:absolute;top:0px;left:160px;';
    document.body.appendChild(stats1.dom);
    document.body.appendChild(stats2.dom);
    document.body.appendChild(stats3.dom);
    
    function statsUpdate() {
      requestAnimationFrame(statsUpdate);
      stats1.update();
      stats2.update();
      stats3.update();
    }statsUpdate();
  }
}; 

// stats();