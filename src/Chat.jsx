import React from 'react';
import socket from './socket';
import './Chat.css';

export default class Chatroom extends React.Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      input: '',
      client: socket(),
      typing: false
    };

    this.onInput = this.onInput.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.onStopTyping = this.onStopTyping.bind(this);

    // this.updateChatHistory = this.updateChatHistory.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
  }

  componentDidMount() {
    this.state.client.registerHandler(this.onMessageReceived, this.onTyping, this.onStopTyping);
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

  componentDidUpdate() {
    this.scrollChatToBottom();
  }

  componentWillUnmount() {
    this.state.client.unregisterHandler();
  }

  onInput(e) {
    if (!this.state.typing) {
      this.state.client.startTyping();
    }
    const value = e.target.value;
    setTimeout(() => {
      if (value === this.state.input) {
        this.state.client.stopTyping();
      }
    }, 700);
    this.setState({
      input: e.target.value
    });
  }

  onSendMessage() {
    if (!this.state.input) return;
    this.state.client.message(this.state.input);
    this.setState({ input: '' });
    this.state.client.stopTyping();
  }

  onEnterDown(e) {
    e.preventDefault();
    this.onSendMessage();
  }

  scrollChatToBottom() {
    this.panel.scrollTo(0, this.panel.scrollHeight);
  }

  renderMessage(msg, i) {
    const user = msg.user === this.state.client.getId() ? 'You' : 'Stranger';
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
      <div className="chatArea">
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
                  <div className="o4"></div>
                  <div className="o5"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <textarea
          type="text"
          wrap="hard"
          onChange={this.onInput}
          value={this.state.input}
          onKeyPress={e => (e.key === 'Enter' ? this.onEnterDown(e) : null)}
        />
      </div>
    );
  }
}
