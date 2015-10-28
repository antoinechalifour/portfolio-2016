import SkillController from './SkillController';

window.onload = function(){
  try {
    var skillController = new SkillController();
    skillController.init();
    skillController.animate();
  } catch(e){
    document.getElementById('skill-container').style.display = 'none';  
  }
};