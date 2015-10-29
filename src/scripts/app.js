import Detector from 'Detector';
import skills from './skills';
import projects from './projects';
import SkillControllerMobile from './SkillControllerMobile';
import SkillControllerWebGL from './SkillControllerWebGL';
import ProjectsController from './ProjectsController';
import ContactController from './ContactController';

window.onload = function(){
  let width = window.innerWidth;

  new ContactController({
    email: document.getElementById('contact-email'),
    name: document.getElementById('contact-name'),
    message: document.getElementById('contact-message'),
    button: document.getElementById('contact-submit')
  });

  new ProjectsController({
    projects: projects,
    template: document.getElementById('template-project').innerHTML,
    el: document.getElementById('projects-row')
  }).render();

  var skillEl = document.getElementById('skill-container');
  if(Detector.webgl && width > 800) {
    skillEl.className += ' skill-webgl';
    var skillControllerWebGL = new SkillControllerWebGL({
      skills,
      el: skillEl
    });
    skillControllerWebGL.init();
    skillControllerWebGL.animate();
  } else {
    skillEl.className += ' skill-canvas';
    var skillControllerMobile = new SkillControllerMobile({
      skills,
      el: skillEl
    });
    skillControllerMobile.init();
  }
};