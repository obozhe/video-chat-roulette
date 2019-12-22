import React from 'react';
import Peer from 'simple-peer';

export default class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stream: false };

    this.peer = null;
    this.bindProps = () => {
      this.peer.on('signal', this.onSignal);
      this.peer.on('stream', this.onStream);
    };
    this.onSignal = this.onSignal.bind(this);
    this.onStream = this.onStream.bind(this);

    this.remoteVideo = React.createRef();
  }

  componentDidMount() {
    this.peer = new Peer({ initiator: this.props.initiator, stream: this.props.stream });
    this.bindProps();
    const peer = this.peer;
    this.props.client.registerPeerSignal(signal => {
      peer.signal(signal);
    });
  }

  sendSignal(signal) {
    this.peer.signal(signal);
  }

  componentWillUnmount() {
    this.props.client.unRegisterPeerSignal();
    this.peer.destroy();
  }

  onSignal(data) {
    this.props.client.sendSignal({ toId: this.props.toId, signal: data });
  }

  onStream(stream) {
    this.setState({ stream: true });
    if ('srcObject' in this.remoteVideo.current) {
      this.remoteVideo.current.srcObject = stream;
    } else {
      this.remoteVideo.current.src = window.URL.createObjectURL(stream);
    }
  }

  render() {
    return (
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
        {this.state.stream ? (
          <video ref={this.remoteVideo} height="100%" autoPlay playsInline></video>
        ) : (
            <h1>
              You are connected but stranger don't want you to see him{' '}
              <span role="img" aria-label="surprised">
                &#128546;
            </span>
            </h1>
          )}
      </div>
    );
  }
}
