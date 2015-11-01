import THREE from 'three';
import { nearestPow2 } from './utils';

const SPHERE_COLOR = 0x6D6D6D;
const SPHERE_OPACITY = 0.08;
const AXIS_COLOR = 0x333333;
const AXIS_LINEWIDTH = 3;
const FACE_COLOR = 0x671722;
const AMBIENT_LIGHT_COLOR = 0xFAFAFA;
const DIRECTIONAL_LIGHT_COLOR1 = 0xFFFFFF;
const DIRECTIONAL_LIGHT_COLOR2 = 0xFFFFFF;

export default class {
  constructor(skills, el, scene, camera, renderer) {
    this.isRendering = false;
    this.skills = skills.sort((a, b) => {
      return a.value < b.value;
    });
    this.el = el;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  computeSkillsPoints(radius) {
    const fi = (Math.sqrt(5) + 1) / 2 - 1;
    const k = fi * Math.PI;

    this.skills.forEach((skill, i) => {
      const longitude = k * (i + 1);
      const latitude = Math.asin(-1 + 2 * (i + 1) / this.skills.length);
      const ratio = skill.value / 100;

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
    const material = new THREE.LineBasicMaterial({
      color: AXIS_COLOR,
      linewidth: AXIS_LINEWIDTH,
    });
    const origin = new THREE.Vector3(0, 0, 0);

    this.skills.forEach((skill) => {
      const axe = skill.axe;
      const geometry = new THREE.Geometry();
      geometry.vertices.push(origin);
      geometry.vertices.push(new THREE.Vector3(axe.x * 1.05, axe.y * 1.05, axe.z * 1.05));
      const line = new THREE.Line(geometry, material);

      this.scene.add(line);
    });
  }

  generateLabels() {
    const textHeight = 32;
    const actualFontSize = 0.5;

    this.skills.forEach(skill => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `bold ${textHeight}px arial`;
      const textWidth = ctx.measureText(skill.name).width;
      const height = canvas.height = nearestPow2(textHeight);
      const width = canvas.width = nearestPow2(textWidth);
      ctx.font = `bold ${textHeight}px arial`;
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.name, width / 2, height / 2);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
      });

      const mesh = new THREE.Sprite(material);
      const axe = skill.axe;
      mesh.position.set(axe.x * 1.1, axe.y * 1.1, axe.z * 1.1);
      // mesh.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);
      mesh.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);

      this.scene.add(mesh);
    });
  }

  generateSphere(radius, opacity) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: SPHERE_COLOR,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    material.opacity = opacity;
    material.transparent = true;
    this.scene.add(sphere);
  }

  /**
   * TODO optimize. e.g. implement Quick Hull...
   * @return {undefined}
   */
  generateTriangles() {
    const skills = this.skills;
    skills.forEach(s1 => {
      const p1 = s1.point;
      skills.forEach(s2 => {
        const p2 = s2.point;
        skills.forEach(s3 => {
          const p3 = s3.point;
          const geometry = new THREE.Geometry();

          geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
          geometry.vertices.push(new THREE.Vector3(p2.x, p2.y, p2.z));
          geometry.vertices.push(new THREE.Vector3(p3.x, p3.y, p3.z));

          geometry.faces.push(new THREE.Face3(0, 1, 2));
          geometry.computeFaceNormals();

          const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: FACE_COLOR,
          }));
          this.scene.add(mesh);
        });
      });
    });
  }

  generateLights() {
    const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR);
    const positions = [{
      x: 0, y: 1, z: 0, color: DIRECTIONAL_LIGHT_COLOR1,
    }, {
      x: 0, y: -1, z: 0, color: DIRECTIONAL_LIGHT_COLOR2,
    }];

    positions.forEach(position => {
      const plotLight = new THREE.DirectionalLight(position.color);
      plotLight.position.set(position.x, position.y, position.z).normalize();

      this.scene.add(plotLight);
    });
    this.scene.add(ambientLight);
  }

  toggleRendering() {
    this.isRendering = !this.isRendering;
  }

  init() {
    const width = this.el.offsetWidth;
    const height = this.el.offsetHeight;
    const min = (width > height) ? height : width;
    const radius = min * 0.01;
    this.camera.position.z = radius * 1.9;

    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement);
    this.computeSkillsPoints(radius);
    this.generateSphere(radius, SPHERE_OPACITY);
    // this.generateSphere(radius * 0.75, SPHERE_OPACITY * 0.4);
    this.generateAxis();
    this.generateLabels(radius);
    this.generateTriangles();
    this.generateLights();
    this.isRendering = true;
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
