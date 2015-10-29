var BAR_HEIGHT = 25;
var BAR_MARGIN = 5;
var BAR_COLOR = '#943232';
var FIXED_MARGIN = 20;

export default class {
  constructor(params) {
    ({
      skills: this.skills,
      el: this.el
    } = params);

    this.velocity = 1;
    this.acceleration = 1;
    this.currentWidth = 1;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    var height = this.skills.length * (BAR_HEIGHT + BAR_MARGIN) + FIXED_MARGIN * 2 - BAR_MARGIN;
    this.canvas.width = this.el.offsetWidth;
    this.canvas.height = height;
    this.el.appendChild(this.canvas);
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = `${BAR_HEIGHT/2}px "Raleway"`;

    this.skills.sort((a, b) => {
      return a.value < b.value;
    });
    
    this.skills.forEach(skill => {
      skill.name.replace(' ', '\n');
    });

    var maxLabelWidth = 0;

    this.skills.forEach(skill => {
      let measured = this.ctx.measureText(skill.name).width;
      if(measured > maxLabelWidth) {
        maxLabelWidth = measured;
      }
    });
    this.offset = maxLabelWidth + BAR_HEIGHT;

    window.addEventListener('resize', () => {
      this.render(this.el.offsetWidth);
    });

    window.addEventListener('scroll', () => {
      let scrolled = window.pageYOffset;
      let elTop = this.el.getBoundingClientRect().top;
      if(scrolled >= elTop) {
        this.render(this.el.offsetWidth);

      }
    });
  }

  render(width){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var doneLoading = true;
    this.ctx.beginPath();
    this.skills.forEach((skill, i) => {
      let ratio = skill.value / 100;
      let barWidth = (width - this.offset) * ratio * .9;

      if(this.currentWidth < barWidth) {
        doneLoading = false;
        barWidth = this.currentWidth;
      }

      let y = i * (BAR_HEIGHT + BAR_MARGIN) + FIXED_MARGIN;
      this.ctx.rect(this.offset, y, barWidth, BAR_HEIGHT);
      this.ctx.fillText(skill.name, this.offset - 10, y + BAR_HEIGHT / 2);
      this.ctx.stroke();
    });

    this.ctx.stroke();
    this.ctx.closePath();

    this.currentWidth += this.velocity;
    this.velocity += this.acceleration;

    if(!doneLoading){
      window.requestAnimationFrame(this.render.bind(this, width));
    }
  }
};