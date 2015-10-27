import THREE from 'three';
import skills from './skills';
import SkillVizualizer from './SkillVizualizer';

var el = document.getElementById('skill-container');
var width = el.offsetWidth;
var height = el.offsetHeight;
var radius = 10;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 50);
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

var vizualizer = new SkillVizualizer(skills, el, scene, camera, renderer);
vizualizer.init();

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.addEventListener('change', vizualizer.render.bind(vizualizer));