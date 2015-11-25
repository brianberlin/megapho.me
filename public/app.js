import View from 'ampersand-view'
import {v4 as uuid} from 'uuid'
import Collection from 'ampersand-collection'
import State from 'ampersand-state'
import Microm from 'microm'
import _get from 'lodash.get'
import domReady from 'domready'

const MainView = View.extend({
  autoRender: true,
  template: `
    <div>
      <a href="#" data-hook="record">Record</a>
    </div>
  `,
  props: {
    room: {
      type: 'string',
      default () {
        return window.location.search && window.location.search.split('?')[1]
      }
    }
  },
  bindings: {
  },
  initialize () {

    this.microm = new Microm();

    this.webrtc = this.createWebRtc();

    this.webrtc.connection.on('message', (msg) => {
      if (msg.type === 'audio')
        this.play(msg.payload.data)
    });

    if (this.room) // join room
      this.joinRoom();
    else
      this.createRoom();

  },
  events: {
    'mousedown [data-hook=record]': 'startRecording',
    'mouseup [data-hook=record]': 'stopRecording'
  },
  startRecording () {
    this.microm.record();
  },
  stopRecording () {
    this.microm.stop().then((mp3) => this.sendToAll(mp3.blob));
  },
  createWebRtc () {
    return new SimpleWebRTC({
      localVideoEl: '',
      remoteVideosEl: '',
      autoRequestMedia: false,
      debug: true,
      receiveMedia: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: false
        }
      }
    })
  },
  joinRoom () {
    this.webrtc.joinRoom(this.room)
  },
  createRoom () {
    this.room = uuid();
    this.webrtc.createRoom(this.room, function (err, name) {
      console.log(' create room cb', arguments);
      if (err) return console.log(err);
      var newUrl = location.pathname + '?' + name;
      history.replaceState({foo: 'bar'}, null, newUrl);
    });
  },
  sendToAll (blob) {
    var view = this;
    var reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      view.webrtc.sendToAll('audio', { data: reader.result });
    }
  },
  play (data) {
    let audio = new Audio();
    audio.setAttribute('src', data);
    audio.play();
  }
});

domReady(() => {
  new MainView({ el: document.body });
});
