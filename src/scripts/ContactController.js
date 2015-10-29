export default class {
  constructor(params){
    ({
      email: this.email,
      name: this.name,
      message: this.message,
      button: this.button
    } = params);

    this.button.addEventListener('click', this.submit.bind(this));
  }

  submit(){
    console.log(`Sending message ${this.message.value} from ${this.name.value} <${this.email.value}>`);
  }
};