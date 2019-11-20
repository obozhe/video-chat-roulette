import React from 'react';
import Buttons from './Buttons';
import RemoteVideo from './RemoteVideo';
import RemoteVideoPlaceholder from './RemoteVideoPlaceholder';
import Chat from './Chat';

import './Main.css';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      client: this.props.client,
      start: false,
      toId: '',
      initiator: null
    };

    this.onConnected = this.onConnected.bind(this);
    this.onStrangerDisconnect = this.onStrangerDisconnect.bind(this);

    this.stream = null;
    this.dimensions = {};
    this.localVideo = React.createRef();
  }

  componentDidMount() {
    console.log(document.getElementById('local').offsetHeight);

    const dimensions = {
      width: document.getElementById('local').offsetWidth,
      height: document.getElementById('local').offsetHeight
    };
    this.dimensions = dimensions;
    console.log(dimensions);
    this.localVideo.current.width = dimensions.width;
    this.localVideo.current.height = dimensions.height;
    console.log(this.localVideo.current.width, this.localVideo.current.height);
    console.log(document.getElementById('local').offsetHeight);

    this.state.client.registerCommonHandler(this.onConnected, this.onStrangerDisconnect);
    const gotMedia = stream => {
      this.stream = stream;
      if ('srcObject' in this.localVideo.current) {
        this.localVideo.current.srcObject = stream;
      } else {
        this.localVideo.current.src = window.URL.createObjectURL(stream);
      }
    };

    navigator.getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
      navigator.getUserMedia({ video: true, audio: true }, gotMedia, err => console.error(err));
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(gotMedia)
        .catch(err => console.error(err));
    }
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  onConnected({ toId, initiator }) {
    this.setState({ toId, initiator });
  }

  onStrangerDisconnect() {
    //TODO: плэйсхолдер с надписью чувак отключился нажмите далее для продолжения поиска
    this.setState({ toId: '', initiator: null });
  }

  clickNext() {
    this.state.client.startSearch(this.state.toId);
  }

  toogleStart() {
    if (this.state.start) {
      this.state.client.stop(this.state.toId);
      this.setState({ start: false, toId: '', initiator: null });
    } else {
      this.state.client.startSearch();
      this.setState({ start: true });
    }
  }

  render() {
    return (
      <div className="main">
        <div className="video-area">
          <div className="video remote">
            {this.state.toId ? (
              <RemoteVideo
                client={this.state.client}
                toId={this.state.toId}
                initiator={this.state.initiator}
                stream={this.stream}
                dimensions={this.dimensions}
              />
            ) : (
              <RemoteVideoPlaceholder
                registerOnlineUsers={this.state.client.registerOnlineUsers}
                getOnlineUsers={this.state.client.getOnlineUsers}
                searching={!this.state.toId && this.state.start}
              />
            )}
          </div>
          <div id="local" className="video local">
            <video ref={this.localVideo} autoPlay muted={true}></video>
          </div>
        </div>
        <div className="bottom-area">
          <Buttons
            searching={!this.state.toId && this.state.start}
            connected={this.state.toId ? true : false}
            start={() => this.toogleStart()}
            next={() => this.clickNext()}
          />
          <Chat client={this.state.client} />
        </div>
      </div>
    );
  }
}
