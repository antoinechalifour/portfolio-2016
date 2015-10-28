import Mustache from 'Mustache';

export default class {
  constructor(params) {
    var templateEl;
    ({
      projects: this.projects, 
      template: this.template,
      el: this.el
    } = params);

    Mustache.parse(this.template);
  }

  render() {
    this.projects.forEach(project => {
      project.src = `img/${project.img}`;
      let rendered = Mustache.render(this.template, project);
      let node = document.createElement('div');
      node.className = 'col-mb-12 col-6 project-item';
      node.innerHTML = rendered;
      this.el.appendChild(node);
    });
  }
}