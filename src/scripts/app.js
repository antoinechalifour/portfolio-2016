import THREE from 'three';
import skills from './skills';
import SkillVizualizer from './SkillVizualizer';

var el = document.getElementById('skill-container');
var width = el.offsetWidth;
var height = el.offsetHeight;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 50);
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

var vizualizer = new SkillVizualizer(skills, el, scene, camera, renderer);
vizualizer.init();

var controls = new THREE.TrackballControls(camera);
controls.noZoom = true;
controls.rotateSpeed = 3;
controls.addEventListener('change', _ => {
  vizualizer.render();
});

function animate(){
  window.requestAnimationFrame(animate);
  controls.update();
}

animate();
window.controls = controls;