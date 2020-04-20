import React, { Component } from 'react';
import Peer from 'peerjs';

// You need to run the node server for this to work
const connectionSettings = {
  host: 'localhost',
  port: 9000,
  path: '/peerserver'
};

class PeerComponentDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peerId: '',
      connPeerIdInput: '',
      conn: null,
      message: '',
      receivedMessage: ''
    }
  }

  componentDidMount() {
    this.peer = new Peer(connectionSettings);

    // This is to get the id of the user's peer from the server
    this.peer.on('open', (id) => {
      this.setState(() => ({ peerId: id}));
    });
    
    // This is for peer receiving connection
    // For our project the peer receiving the connection will be the one sending back the file
    // For this example I'm just sending string back and forth
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        console.log('connected');
        this.setState(() => ({ conn }));
      });

      conn.on('data', (message) => {
        this.setState(() => ({receivedMessage: `${this.state.receivedMessage}\n${message}`}));
      })
    });

  }
  
  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  onConnectionSubmit = event => {
    event.preventDefault();
    let { connPeerIdInput } = this.state;

    // This is for the user initiating the connection
    const conn = this.peer.connect(connPeerIdInput);

    conn.on('open', () => {
      console.log('connected');
      this.setState(() => ({ conn }));
    });

    // The user initiating the connection will request a file from the connected peer
    conn.on('data', (message) => {
      this.setState(() => ({receivedMessage: `${this.state.receivedMessage}\n${message}`}));
    })

    this.setState(() => ({
      connPeerId: connPeerIdInput,
      connPeerIdInput: '',
      conn
    }));
  };

  onConnPeerIdChange = event => {
    const connPeerIdInput = event.target.value;
    this.setState(() => ({ connPeerIdInput }));
  }

  onSendMessageSubmit = event => {
    event.preventDefault();
    let { message } = this.state;

    this.state.conn.send(message);

    this.setState(() => ({
      message: ''
    }));
  };

  onMessageChange = event => {
    const message = event.target.value;
    this.setState(() => ({ message }));
  }

  render() {
    return (
      <div>
        <p>{`Peer Id: ${this.state.peerId}`}</p>
        {this.state.conn && (
          <div>
            <p className="connected">Connected</p>
            <p>{`Received message: ${this.state.receivedMessage}`}</p>
          </div>
        )}
        {!this.state.conn && (
          <form onSubmit={this.onConnectionSubmit}>
              <input
                type="text"
                className="text-input"
                name="connPeerIdInput"
                placeholder="Connection Peer Id"
                autoFocus
                value={this.state.connPeerIdInput}
                onChange={event => this.onConnPeerIdChange(event)}
                required
              />
            <input className="button" type="submit" value="Submit" />
          </form>)}
        {this.state.conn && (
        <form onSubmit={this.onSendMessageSubmit}>
            <input
              type="text"
              className="text-input"
              name="message"
              placeholder="Send Message"
              autoFocus
              value={this.state.message}
              onChange={event => this.onMessageChange(event)}
              required
            />
          <input className="button" type="submit" value="Submit" />
        </form>)}
      </div>
    )
  }
}

export default PeerComponentDemo;