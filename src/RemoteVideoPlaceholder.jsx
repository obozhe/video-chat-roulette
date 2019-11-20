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

  render() {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fafafa' }}>
          {this.props.searching ? (
            <div>
              <h1>searching...</h1>
              <Loop className="rotating" style={{ width: '50px', height: '50px' }} />
            </div>
          ) : (
            <div>
              <h1>Welcome to VideoChat Roulette!</h1>
              <h3>online users: {this.state.usersCount}</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}
