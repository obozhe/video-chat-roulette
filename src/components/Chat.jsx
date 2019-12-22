import React from 'react';
import Send from '@material-ui/icons/Send';

import './../css/Chat.css';

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      input: '',
      client: this.props.client,
      typing: false,
      toId: '',
      initiator: null
    };

    this.onInput = this.onInput.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.onStopTyping = this.onStopTyping.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.onStrangerDisconnect = this.onStrangerDisconnect.bind(this);

    // this.updateChatHistory = this.updateChatHistory.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
  }

  componentDidMount() {
    this.state.client.registerChatHandler(this.onMessageReceived, this.onTyping, this.onStopTyping);
    this.state.client.registerCommonHandler(this.onConnected, this.onStrangerDisconnect);
    const chat = document.getElementById('chat');
    chat.style.height = `${chat.offsetHeight}px`;
  }

  componentWillUnmount() {
    this.state.client.unRegisterCommonHandler();
    this.state.client.unRegisterChatHandler();
  }

  componentDidUpdate() {
    this.scrollChatToBottom();
  }

  onMessageReceived(msg) {
    this.setState({ messages: [...this.state.messages, msg] });
  }

  onTyping(user) {
    if (!this.state.typing) {
      this.setState({ typing: user });
    }
  }

  onStopTyping() {
    if (this.state.typing) {
      this.setState({ typing: false });
    }
  }

  onConnected({ toId, initiator }) {
    this.setState({ toId, initiator });
  }

  onStrangerDisconnect() {
    this.setState({ toId: '', messages: [], input: '' });
  }

  onInput(e) {
    if (!this.state.typing) {
      this.state.client.startTyping(this.state.toId);
    }
    const value = e.target.value;
    setTimeout(() => {
      if (value === this.state.input) {
        this.state.client.stopTyping(this.state.toId);
      }
    }, 700);
    this.setState({
      input: e.target.value
    });
  }

  onSendMessage() {
    if (!this.state.input || !this.state.toId) return;
    this.state.client.message({ id: this.state.toId, msg: this.state.input });
    this.setState({ input: '' });
    this.state.client.stopTyping(this.state.toId);
  }

  onEnterDown(e) {
    e.preventDefault();
    this.onSendMessage();
  }

  scrollChatToBottom() {
    this.panel.scrollTo(0, this.panel.scrollHeight);
  }

  renderMessage(msg, i) {
    const user = msg.sender === this.state.client.getId() ? 'You' : 'Stranger';
    if (user === 'You') {
      return (
        <li key={i} className="message-wrap right">
          <div className="message-text">{msg.msg}</div>
          <div className="message-sender">{user}</div>
        </li>
      );
    } else {
      return (
        <li key={i} className="message-wrap">
          <div className="message-sender">{user}</div>
          <div className="message-text">{msg.msg}</div>
        </li>
      );
    }
  }

  render() {
    return (
      <div id="chat" className="chat">
        <div
          className="messages"
          ref={panel => {
            this.panel = panel;
          }}
        >
          <ul>
            {this.state.messages.map((msg, i) => this.renderMessage(msg, i))}
            <li key={-1}>
              <div
                className={`typing ${
                  this.state.typing && this.state.typing !== this.state.client.getId() ? '' : 'hide'
                }`}
              >
                <span>Stranger is typing</span>
                <div className="is-typing">
                  <div className="o1"></div>
                  <div className="o2"></div>
                  <div className="o3"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="input">
          <input
            type="text"
            onChange={this.onInput}
            value={this.state.input}
            onKeyPress={e => (e.key === 'Enter' ? this.onEnterDown(e) : null)}
          />
          <button onClick={() => this.onSendMessage()}>
            <Send />
          </button>
        </div>
      </div>
    );
  }
}
