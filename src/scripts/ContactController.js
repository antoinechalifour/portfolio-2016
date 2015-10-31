import { ajax } from './utils';

var toastInvalidEmail = '<i class="fa fa-ban error"></i> It seems like your email adress is invalid.';
var toastInvalidMessage = '<i class="fa fa-ban error"></i> Please enter your message.';
var toastMessageSent = '<i class="fa fa-check-circle-o sent"></i> Your message has been sent!';
var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export default class {
  constructor(params){
    ({
      email: this.email,
      name: this.name,
      message: this.message,
      button: this.button,
      toast: this.toast
    } = params);

    this.button.addEventListener('click', this.checkForm.bind(this));
  }

  checkForm(){
    var email = this.email.value;
    var name = this.name.value;
    var message = this.message.value;

    if(!this.button.disabled && regexEmail.test(email) && message !== '') {
      this.submit({
        email,
        name,
        message
      });
    } else if(!regexEmail.test(email)) {
      this.showToastMessage(toastInvalidEmail);
    } else if(message === '') {
      this.showToastMessage(toastInvalidMessage);
    }
  }

  submit(params){
  this.button.innerHTML = 'Sending...';
  this.button.disabled = true;
    ajax({
      method: 'post',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        key: 'w2-glaHkpJdJRnzlHoRHdw',
        message: {
          from_email: params.email,
          to: [{
            email: 'antoine.chalifour@gmail.com',
            name: 'Antoine Chalifour',
            type: 'to'
          }],
          subject: `[PORTFOLIO] New message from ${params.name}<${params.email}>`,
          text: params.message
        }
      }
    })
    .then(this.handleResponse.bind(this))
    .catch(this.handleError.bind(this));
  }

  handleResponse(response) {
    this.resetButton();
    this.email.value = '';
    this.name.value = '';
    this.message.value = '';
    this.showToastMessage(toastMessageSent);
  }

  handleError(error) {
    this.resetButton();
    this.showToastMessage(toastInvalidEmail);
  }

  resetButton() {
    this.button.innerHTML = 'Let\'s go!';
    this.button.disabled = false;
  }

  showToastMessage(string){
    this.toast.innerHTML = string;
    this.toast.style.display = 'block';

    if(this.t) {
      clearTimeout(this.t);
    }

    this.t = setTimeout(_ => {
      this.toast.style.display = 'none';
    }, 3000);
  }
};