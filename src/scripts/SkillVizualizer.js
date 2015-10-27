import {nearestPow2} from './utils';

var SPHERE_COLOR = 0x6D6D6D;
var SPHERE_OPACITY = 0.08;
var AXIS_COLOR = 0x333333;
var AXIS_LINEWIDTH = 3;
var FACE_COLOR = 0x671722;
var AMBIENT_LIGHT_COLOR = 0xFAFAFA;
var DIRECTIONAL_LIGHT_COLOR1 = 0xFFFFFF;
var DIRECTIONAL_LIGHT_COLOR2 = 0xFFFFFF;

export default class {
  constructor(skills, el, scene, camera, renderer) {
    this.isRendering = false;
    this.skills = skills;
    this.el = el;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  computeSkillsPoints (radius) {
    // Here we use fibonnaci's spiral to compute their position on the sphere
    const fi = (Math.sqrt(5) + 1) / 2 - 1;
    const k = fi * Math.PI;

    this.skills.forEach((skill, i) => {
      let longitude = k * (i + 1);
      let latitude = Math.asin(-1 + 2 * (i + 1) / this.skills.length);
      let ratio = skill.value / 100;

      skill.axe = {};
      skill.point = {};
      skill.axe.x = radius * Math.cos(latitude) * Math.cos(longitude);
      skill.axe.y = radius * Math.cos(latitude) * Math.sin(longitude);
      skill.axe.z = radius * Math.sin(latitude);
      skill.point.x = skill.axe.x * ratio;
      skill.point.y = skill.axe.y * ratio;
      skill.point.z = skill.axe.z * ratio;
    });
  }

  /**
   * Generates all axis starting from origin to all skills maximum points on sphere.
   * @return {undefined}
   */
  generateAxis() {
    var material = new THREE.LineBasicMaterial({
      color: AXIS_COLOR,
      linewidth: AXIS_LINEWIDTH
    });
    var origin = new THREE.Vector3(0, 0, 0);

    this.skills.forEach((skill) => {
      let axe = skill.axe;
      let geometry = new THREE.Geometry();
      geometry.vertices.push(origin);
      geometry.vertices.push(new THREE.Vector3(axe.x * 1.05, axe.y * 1.05, axe.z * 1.05));
      let line = new THREE.Line(geometry, material);

      this.scene.add(line);
    });
  }

  generateLabels(radius) {
    let textHeight = 12;
    let actualFontSize = 0.90;

    this.skills.forEach(skill => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      ctx.font = `normal 200 ${textHeight}px sans-serif`;
      ctx.save();
      let textWidth = ctx.measureText(skill.name).width;
      canvas.height = nearestPow2(textHeight);
      canvas.width = nearestPow2(textWidth);
      ctx.restore();
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.name, textWidth / 2, textHeight / 2);

      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      let material = new THREE.SpriteMaterial({
        map: texture
      });

      let mesh = new THREE.Sprite(material);
      let axe = skill.axe;
      mesh.position.set(axe.x * 1.06, axe.y * 1.06, axe.z * 1.06);
      mesh.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);

      this.scene.add(mesh);
    });
  }

  /**
   * Generates a sphere centered on origin with given radius
   * @return {undefined}
   */
  generateSphere(radius, opacity) {
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshBasicMaterial({
      color: SPHERE_COLOR,
      wireframe: true
    });
    material.opacity = opacity;
    material.transparent = true;
    var sphere = new THREE.Mesh(geometry, material);
    this.scene.add(sphere);
  }

  generateTriangles() {
    var skills = this.skills;
    skills.forEach(s1 => {
      let p1 = s1.point;
      skills.forEach(s2 => {
        let p2 = s2.point;
        skills.forEach(s3 => {
          let p3 = s3.point;
          let geometry = new THREE.Geometry();

          geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
          geometry.vertices.push(new THREE.Vector3(p2.x, p2.y, p2.z));
          geometry.vertices.push(new THREE.Vector3(p3.x, p3.y, p3.z));

          geometry.faces.push(new THREE.Face3( 0, 1, 2 ));
          geometry.computeFaceNormals();

          let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: FACE_COLOR
          }));
          this.scene.add(mesh);
        });
      });
    });
  }

  generateLights() {
    var ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR);
    var positions = [{
      x: 0, y: 1, z: 0, color: DIRECTIONAL_LIGHT_COLOR1
    }, {
      x: 0, y: -1, z: 0, color: DIRECTIONAL_LIGHT_COLOR2
    }];

    positions.forEach(position => {
      var plotLight = new THREE.DirectionalLight(position.color);
      plotLight.position.set(position.x, position.y, position.z).normalize();

      this.scene.add(plotLight);
    });
    this.scene.add(ambientLight);
  }

  toggleRendering() {
    this.isRendering = !this.isRendering;
  }

  init() {
    var width = this.el.offsetWidth;
    var height = this.el.offsetHeight;
    var min = (width > height) ? height : width;
    var radius = min * 0.02;
    this.camera.position.z = radius * 1.8;

    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement);
    this.computeSkillsPoints(radius);
    this.generateSphere(radius, SPHERE_OPACITY);
    this.generateSphere(radius * 0.75, SPHERE_OPACITY * 0.4);
    this.generateAxis();
    this.generateLabels(radius);
    this.generateTriangles();
    this.generateLights();
    this.isRendering = true;
    this.render();
  }

  render(e) {
    this.renderer.render(this.scene, this.camera);
  }
};