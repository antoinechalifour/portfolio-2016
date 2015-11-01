import Mustache from 'Mustache';

export default class {
  constructor(params) {
    ({
      projects: this.projects,
      template: this.template,
      el: this.el,
    } = params);

    Mustache.parse(this.template);
  }

  render() {
    this.projects.forEach(project => {
      project.src = `img/${project.img}`;
      const rendered = Mustache.render(this.template, project);
      const node = document.createElement('div');
      node.className = 'col-mb-12 col-6 project-item';
      node.innerHTML = rendered;
      this.el.appendChild(node);
    });
  }
}
