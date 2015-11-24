import View from 'ampersand-view'
import Microm from 'microm'
import xhr from 'xhr'
import {v4 as uuid} from 'uuid'
import _contains from 'lodash.contains'

let audios = [];

export default View.extend({
  autoRender: true,
  template: `
    <div>
      <a data-hook="record">Record</a>
    </div>
  `,
  initialize () {
    this.microm = new Microm();
    this.socket = io.connect('https://3coasts.ngrok.com/');
    this.socket.on('audio', function(id){
      if (_contains(audios, id)) return;
      let audio = new Audio();
      audio.setAttribute('src', `https://3coasts.ngrok.com/audio/${id}`);
      audio.play();
    });
  },
  events: {
    'mousedown [data-hook=record]': 'startRecording',
    'mouseup [data-hook=record]': 'stopRecording'
  },
  startRecording () {
    this.microm.record();
  },
  stopRecording () {
    this.microm.stop().then(function(mp3) {
      var fd = new FormData();
      var id = uuid();
      audios.push(id);
      fd.append('Content-Type', 'audio/mp3');
      fd.append('Content-Length', mp3.blob.size);
      fd.append('id', id);
      fd.append('data', mp3.blob);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://3coasts.ngrok.com/audio', true);
      xhr.send(fd);
    });
  }
});

