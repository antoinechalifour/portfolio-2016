import THREE from 'three';
import Detector from 'Detector';
import SkillVisualizer from './SkillVisualizer';
import skills from './skills';

export default class {
  constructor() {
    if(!Detector.webgl) throw new Error('WebGL is not supported');
    this.el = document.getElementById('skill-container');
    var width = this.el.offsetWidth;
    var height = this.el.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 50);
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.visualizer = new SkillVisualizer(skills, this.el, this.scene, this.camera, this.renderer);
    this.controls = new THREE.TrackballControls(this.camera, this.el);
  }

  init() {
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 3;
    this.visualizer.init();
    this.controls.addEventListener('change', this.visualizer.render.bind(this.visualizer));
    window.addEventListener('resize', this.onresize.bind(this));
  }

  animate(){
    window.requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
  }

  onresize(){
    var width = this.el.offsetWidth;
    var height = this.el.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.controls.handleResize();
    this.visualizer.render();
  }
}