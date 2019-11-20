import React, { Component } from 'react';
import Loop from '@material-ui/icons/Loop';

export default class RemoteVideoPlaceholder extends Component {
  constructor(props) {
    super(props);

    this.state = { usersCount: 0 };

    this.getOnlineUsers = this.getOnlineUsers.bind(this);
  }
  componentDidMount() {
    this.props.getOnlineUsers(this.getOnlineUsers);
    this.props.registerOnlineUsers(this.getOnlineUsers);
  }

  getOnlineUsers(usersCount) {
    this.setState({ usersCount });
  }

  renderPlaceholder() {
    if (this.props.searching && !this.props.disconnected) {
      return (
        <div>
          <h1>
            searching...{' '}
            <span role="img" aria-label="thinking">
              &#129300;
            </span>{' '}
          </h1>
          <Loop className="rotating" style={{ width: '50px', height: '50px' }} />
        </div>
      );
    }

    if (this.props.searching && this.props.disconnected) {
      return (
        <div>
          <h1>
            Stranger disconnected{' '}
            <span role="img" aria-label="surprised">
              &#128550;
            </span>
          </h1>
          <h3>
            Click 'next' for continue!{' '}
            <span role="img" aria-label="badboy">
              &#128526;
            </span>
          </h3>
        </div>
      );
    }

    if (!this.props.searching) {
      return (
        <div>
          <h1>
            Welcome to VideoChat Roulette!{' '}
            <span role="img" aria-label="tongue">
              &#128539;
            </span>
          </h1>
          <h3>online users: {this.state.usersCount}</h3>
        </div>
      );
    }
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fafafa' }}>{this.renderPlaceholder()}</div>
      </div>
    );
  }
}
