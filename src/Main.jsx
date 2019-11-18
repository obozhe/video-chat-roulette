import React from 'react';
import Next from '@material-ui/icons/SkipNext';
import RemoteVideo from './RemoteVideo';
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
    this.localVideo = React.createRef();
  }

  componentDidMount() {
    this.state.client.registerCommonHandler(this.onConnected, this.onStrangerDisconnect);

    const gotMedia = stream => {
      this.stream = stream;
      var video = this.localVideo.current;
      if ('srcObject' in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
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
    console.log('DISCONNECT');
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
            {this.state.toId && (
              <RemoteVideo
                client={this.state.client}
                toId={this.state.toId}
                initiator={this.state.initiator}
                stream={this.stream}
              />
            )}
          </div>
          <div className="video local">
            <video ref={this.localVideo} height="100%" autoPlay muted={true}></video>
          </div>
        </div>
        <div className="buttons-area">
          <button
            className="start"
            style={{ backgroundColor: this.state.start ? '#fd4545' : '#51fd6d' }}
            onClick={() => this.toogleStart()}
          >
            {this.state.start ? 'Stop' : 'Start'}
          </button>
          {this.state.start && (
            <button className="next" onClick={() => this.clickNext()}>
              <Next />
            </button>
          )}
          <span>
            connected:{' '}
            <div className="circle" style={{ backgroundColor: this.state.toId ? '#51fd6d' : '#fd4545' }}></div>
          </span>
        </div>
      </div>
    );
  }
}
