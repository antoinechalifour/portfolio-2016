import Detector from 'Detector';
import google from 'google';
import skills from './skills';
import projects from './projects';
import sentences from './sentences';
import HeroController from './HeroController';
import SkillControllerMobile from './SkillControllerMobile';
import SkillControllerWebGL from './SkillControllerWebGL';
import ProjectsController from './ProjectsController';
import ContactController from './ContactController';

window.onload = () => {
  const width = window.innerWidth;

  new HeroController({
    sentences,
    writer: document.getElementById('hero-writer'),
    cursor: document.getElementById('hero-cursor'),
  });

  new ContactController({
    email: document.getElementById('contact-email'),
    name: document.getElementById('contact-name'),
    message: document.getElementById('contact-message'),
    button: document.getElementById('contact-submit'),
    toast: document.getElementById('toast'),
  });

  new ProjectsController({
    projects,
    template: document.getElementById('template-project').innerHTML,
    el: document.getElementById('projects-row'),
  }).render();

  const skillEl = document.getElementById('skill-container');
  if(Detector.webgl && width > 800) {
    skillEl.className += ' skill-webgl';
    const skillControllerWebGL = new SkillControllerWebGL({
      skills,
      el: skillEl,
    });
    skillControllerWebGL.init();
    skillControllerWebGL.animate();
  }
  else {
    skillEl.className += ' skill-canvas';
    const skillControllerMobile = new SkillControllerMobile({
      skills,
      el: skillEl,
    });
    skillControllerMobile.computeDimenstions();
    skillControllerMobile.init();
  }

  google.load('maps', '3', {
    callback: () => {
      const latLng = {
        lat: 56.8538316,
        lng: 14.8303912,
      };

      const map = new google.maps.Map(document.getElementById('map-container'), {
        center: latLng,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        zoom: 8,
        styles: [{
          'elementType': 'geometry',
          'stylers': [{
            'hue': '#ff4400',
          }, {
            'saturation': -68,
          }, {
            'lightness': -4,
          }, {
            'gamma': 0.72,
          }],
        }, {
          'featureType': 'road',
          'elementType': 'labels.icon',
        }, {
          'featureType': 'landscape.man_made',
          'elementType': 'geometry',
          'stylers': [{
            'hue': '#0077ff',
          }, {
            'gamma': 3.1,
          }],
        }, {
          'featureType': 'water',
          'stylers': [{
            'hue': '#00ccff',
          }, {
            'gamma': 0.44,
          }, {
            'saturation': -33,
          }],
        }, {
          'featureType': 'poi.park',
          'stylers': [{
            'hue': '#44ff00',
          }, {
            'saturation': -23,
          }],
        }, {
          'featureType': 'water',
          'elementType': 'labels.text.fill',
          'stylers': [{
            'hue': '#007fff',
          }, {
            'gamma': 0.77,
          }, {
            'saturation': 65,
          }, {
            'lightness': 99,
          }],
        }, {
          'featureType': 'water',
          'elementType': 'labels.text.stroke',
          'stylers': [{
            'gamma': 0.11,
          }, {
            'weight': 5.6,
          }, {
            'saturation': 99,
          }, {
            'hue': '#0091ff',
          }, {
            'lightness': -86,
          }],
        }, {
          'featureType': 'transit.line',
          'elementType': 'geometry',
          'stylers': [{
            'lightness': -48,
          }, {
            'hue': '#ff5e00',
          }, {
            'gamma': 1.2,
          }, {
            'saturation': -23,
          }],
        }, {
          'featureType': 'transit',
          'elementType': 'labels.text.stroke',
          'stylers': [{
            'saturation': -64,
          }, {
            'hue': '#ff9100',
          }, {
            'lightness': 16,
          }, {
            'gamma': 0.47,
          }, {
            'weight': 2.7,
          }],
        }],
      });

      const marker = new google.maps.Marker({
        position: latLng,
        map,
        url: 'https://goo.gl/photos/a4VppzWdvHkxx584A',
      });

      google.maps.event.addListener(marker, 'click', () => {
        window.open(marker.url, '_blank');
      });
    },
  });
};
