import skills from './skills';
import projects from './projects';
import SkillController from './SkillController';
import ProjectsController from './ProjectsController';

window.onload = function(){
  var projectsController = new ProjectsController({
    projects: projects,
    template: document.getElementById('template-project').innerHTML,
    el: document.getElementById('projects-row')
  });

  projectsController.render();

  try {
    var skillController = new SkillController({
      skills,
      el: document.getElementById('skill-container')
    });
    skillController.init();
    skillController.animate();
  } catch(e){
    document.getElementById('skill-container').style.display = 'none';  
  }
};