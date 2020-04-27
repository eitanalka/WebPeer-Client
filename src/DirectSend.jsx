import React, { Component } from 'react';

class DirectSend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conn: null,
      recPeerId: '',
      recPeerIdInput: ''
    }
  }

  onConnectionSubmit = event => {
    event.preventDefault();
    let { recPeerIdInput } = this.state;

    // This is for the user initiating the connection
    const conn = this.props.peer.connect(recPeerIdInput);

    conn.on('open', () => {
      console.log('connected');
      this.setState(() => ({ conn }));
    });

    // Receiver received the message
    conn.on('close', () => {
      this.setState({
        conn: null,
        recPeerIdInput: '',
        recPeerId: ''
      });
    })

    this.setState(() => ({
      recPeerId: recPeerIdInput,
      recPeerIdInput: '',
      conn
    }));
  };

  onRecPeerIdChange = event => {
    const recPeerIdInput = event.target.value;
    this.setState(() => ({ recPeerIdInput }));
  }

  handleFileChosen = file => {
    this.state.conn.send({
      type: 'file-direct',
      fileName: file.name,
      file
    });
  }

  render() {
    const h3Style = {
      marginBottom: '3px'
    }

    const connectedStyle = {
      color: 'green',
      marginTop: '0px'
    };


    return (
      <div>
        <h3 style={h3Style}>Send Direct:</h3>
        {this.state.conn && (
          <div>
            <p style={connectedStyle}>Connected. You can now send the file.</p>
          </div>
        )}
        {!this.state.conn && (
          <form onSubmit={this.onConnectionSubmit}>
              <input
                type="text"
                name="recPeerIdInput"
                placeholder="Receiver Peer Id"
                value={this.state.recPeerIdInput}
                onChange={event => this.onRecPeerIdChange(event)}
                required
              />
            <input className="button" type="submit" value="Submit" />
          </form>)}
        {this.state.conn && (
          <input 
            type="file"
            id="file-direct"
            onChange={e => { this.handleFileChosen(e.target.files[0]); e.target.value = null;}}
          />
        )}
      </div>
    )
  }
}

export default DirectSend;