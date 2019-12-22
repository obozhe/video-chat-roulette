import React from 'react';
import Buttons from './Buttons';
import RemoteVideo from './RemoteVideo';
import RemoteVideoPlaceholder from './RemoteVideoPlaceholder';
import Chat from './Chat';

import './../css/Main.css';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      client: this.props.client,
      start: false,
      toId: '',
      initiator: null,
      disconnected: false,
      localVideo: null
    };

    this.onConnected = this.onConnected.bind(this);
    this.onStrangerDisconnect = this.onStrangerDisconnect.bind(this);

    this.stream = null;
    this.localVideo = React.createRef();
  }

  componentDidMount() {
    this.state.client.registerCommonHandler(this.onConnected, this.onStrangerDisconnect);
    this.getStream();
  }

  componentDidUpdate() { }

  componentWillUnmount() {
    this.state.client.unRegisterCommonHandler();
  }

  onConnected({ toId, initiator }) {
    this.setState({ toId, initiator });
  }

  onStrangerDisconnect() {
    this.setState({ toId: '', initiator: null, disconnected: true });
  }

  clickNext() {
    this.state.client.startSearch(this.state.toId);
    this.setState({ toId: '', initiator: null, disconnected: false });
  }

  toogleStart() {
    if (this.state.start) {
      this.state.client.stop(this.state.toId);
      this.setState({ start: false, toId: '', initiator: null, disconnected: false });
    } else {
      this.state.client.startSearch();
      this.setState({ start: true });
    }
  }

  getStream() {
    const gotMedia = stream => {
      this.setState({ localVideo: true });
      this.stream = stream;
      if ('srcObject' in this.localVideo.current) {
        this.localVideo.current.srcObject = this.stream;
      } else {
        this.localVideo.current.src = window.URL.createObjectURL(this.stream);
      }
    };

    navigator.getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
      navigator.getUserMedia({ video: true, audio: true }, gotMedia, () => this.setState({ localVideo: false }));
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(gotMedia)
        .catch(() => this.setState({ localVideo: false }));
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
              />
            ) : (
                <RemoteVideoPlaceholder
                  registerOnlineUsers={this.state.client.registerOnlineUsers}
                  getOnlineUsers={this.state.client.getOnlineUsers}
                  searching={!this.state.toId && this.state.start}
                  disconnected={this.state.disconnected}
                />
              )}
          </div>
          <div id="local" className="video local">
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#fafafa'
              }}
            >
              {this.state.localVideo ? (
                <video ref={this.localVideo} autoPlay muted playsInline></video>
              ) : (
                  <div>
                    <h1>
                      we can't get your camera{' '}
                      <span role="img" aria-label="surprised">
                        &#128546;
                    </span>
                    </h1>
                    <h3>
                      but you still can use this app{' '}
                      <span role="img" aria-label="surprised">
                        &#128527;
                    </span>
                    </h3>
                    <h3>or try again to give us access to your camera</h3>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="bottom-area">
          <Buttons
            searching={!this.state.toId && this.state.start}
            connected={this.state.toId ? true : false}
            disconnected={this.state.disconnected}
            start={() => this.toogleStart()}
            next={() => this.clickNext()}
          />
          <Chat client={this.state.client} />
        </div>
      </div>
    );
  }
}
