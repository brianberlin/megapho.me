import MainView from './main-view'
import bind from 'lodash.bind'
import fastclick from 'fastclick'
import domReady from 'domready'

domReady(() => {
  fastclick.attach(document.body);
  window.view = new MainView({ el: document.body });
});

