import { ajax } from './utils';

const toastInvalidEmail = '<i class="fa fa-ban error"></i> It seems like your email adress is invalid.';
const toastInvalidMessage = '<i class="fa fa-ban error"></i> Please enter your message.';
const toastMessageSent = '<i class="fa fa-check-circle-o sent"></i> Your message has been sent!';
const regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export default class {
  constructor(params) {
    ({
      email: this.email,
      name: this.name,
      message: this.message,
      button: this.button,
      toast: this.toast,
    } = params);

    this.button.addEventListener('click', this.checkForm.bind(this));
  }

  checkForm() {
    const email = this.email.value;
    const name = this.name.value;
    const message = this.message.value;

    if(!this.button.disabled && regexEmail.test(email) && message !== '') {
      this.submit({
        email,
        name,
        message,
      });
    }
    else if(!regexEmail.test(email)) {
      this.showToastMessage(toastInvalidEmail);
    }
    else if(message === '') {
      this.showToastMessage(toastInvalidMessage);
    }
  }

  submit(params) {
    this.button.innerHTML = 'Sending...';
    this.button.disabled = true;
    ajax({
      method: 'post',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        key: 'w2-glaHkpJdJRnzlHoRHdw',
        message: {
          'from_email': params.email,
          to: [{
            email: 'antoine.chalifour@gmail.com',
            name: 'Antoine Chalifour',
            type: 'to',
          }],
          subject: `[PORTFOLIO] New message from ${params.name}<${params.email}>`,
          text: params.message,
        },
      },
    })
    .then(this.handleResponse.bind(this))
    .catch(this.handleError.bind(this));
  }

  handleResponse() {
    this.resetButton();
    this.email.value = '';
    this.name.value = '';
    this.message.value = '';
    this.showToastMessage(toastMessageSent);
  }

  handleError() {
    this.resetButton();
    this.showToastMessage(toastInvalidEmail);
  }

  resetButton() {
    this.button.innerHTML = 'Let\'s go!';
    this.button.disabled = false;
  }

  showToastMessage(string) {
    this.toast.innerHTML = string;
    this.toast.style.display = 'block';

    if(this.t) {
      clearTimeout(this.t);
    }

    this.t = setTimeout(() => {
      this.toast.style.display = 'none';
    }, 3000);
  }
}
