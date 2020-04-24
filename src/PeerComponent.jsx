import React, { Component } from 'react';
import Peer from 'peerjs';

// You need to run the node server for this to work
const connectionSettings = {
  host: 'localhost',
  port: 9000,
  path: '/peerserver'
};

class PeerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peerId: '',
      connPeerIdInput: '',
      conn: null,
      message: '',
      receivedFile: null,
      receivedName: '',
      file: null,
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

        conn.on('data', (data) => {
            console.log(data);
            var f = new File([data.file], data.name)
            this.setState(() => ({receivedFile: `${f}`}));
            //this.setState(() => ({receivedName: `${data.name}`}))
        });

        /*let index = this.state.receivedMessage.indexOf('\n');
        if (index != -1) {
            this.setState({
                receivedTitle: this.state.receivedMessage.substring(0, index)            
            });
            let len = this.state.receivedMessage.length;
            this.setState({
                receivedMessage: this.state.receivedMessage.substring(index+1, len)
            });
        }
        console.log(this.state.receivedTitle + '\n\n\n\n');
        console.log(this.state.receivedMessage);*/
        
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
    conn.on('data', (data) => {
        console.log(data);
            let f = new File([data.file], data.name)
            this.setState(() => ({receivedFile: `${f}`}));
            //this.setState(() => ({receivedName: `${data.name}`}))
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

  onFileChange = f => {
    this.setState({ file: f });
  }

  handleSendFile = () => {
    let send = {
        file: this.state.file,
        name: this.state.file.name
    }
    this.state.conn.send(send);

    /*let fileReader = new FileReader();

    const handleFileRead = (e) => {
        let content = this.state.file.name + '\n';
        content = content + fileReader.result;
        //console.log(content);
        this.state.conn.send(content);

        this.setState({
            file: null
        });
    }
    
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(this.state.file);*/
  }

  render() {
    return (
      <div>
        <p>{`Peer Id: ${this.state.peerId}`}</p>
        {this.state.conn && (
          <div>
            <p className="connected">Connected</p>            
            <p>{`Received file: ${this.state.receivedFile}`}</p>
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
            <div>
                <input type="file" name="file" onChange={e => this.onFileChange(e.target.files[0])}/>
                <button onClick={this.handleSendFile}>Send file</button>
            </div>
        )}
      </div>
    )
  }
}

export default PeerComponent;