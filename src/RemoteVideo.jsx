import React from 'react';
import Peer from 'simple-peer';

import './Main.css';

export default class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);

    this.peer = null;
    this.bindProps = () => {
      this.peer.on('error', this.onError);
      this.peer.on('signal', this.onSignal);
      this.peer.on('stream', this.onStream);
      this.peer.on('data', raw => this.onData(JSON.stringify(raw.toString())));
      this.peer.on('connect', this.onConnect);
    };
    this.onSignal = this.onSignal.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onStream = this.onStream.bind(this);
    this.onError = this.onError.bind(this);
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
    console.log('DESTROYED');
    //this.peer.destroy();
  }

  onSignal(data) {
    this.props.client.sendSignal({ toId: this.props.toId, signal: data });
  }

  onConnect() {
    console.log('CONNECT');
  }

  onStream(stream) {
    console.log('GOT STREAM!!!');
    var video = document.querySelector('video');
    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      video.src = window.URL.createObjectURL(stream);
    }
  }

  onError(err) {
    console.log('PEER ERROR', err);
  }

  render() {
    return <video height="100%" autoPlay></video>;
  }
}
