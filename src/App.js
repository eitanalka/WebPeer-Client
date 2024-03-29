import React, { Component } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { saveAs } from 'file-saver';
import './App.css';
import { fileServerURL, socketServerURL } from '.';
import { post } from './helpers';
import FileList from './FileList';
import LocalFileList from './LocalFileList';
import FileUpload from './FileUpload';
import DirectSend from './DirectSend';

const REQUEST_BYTES = 1024*1024*50; // 50 MB

const connectionSettings = {
  host: 'localhost',
  port: 9000,
  path: '/peerserver'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.peer = null;

    this.state = {
      files: [],
      fs: null,
      localFiles: [],
      peerId: null
    }
  }

  refreshLocalList = () => {
    if (this.state.fs) {
      const dir = this.state.fs.root.createReader();
      dir.readEntries(files => {
        this.setState({ localFiles: files });
        if (this.state.peerId) {
          files.forEach(file => {
            file.file(async f => {
              const arrbuf = await f.arrayBuffer();
              const uintarr = new Uint8Array(arrbuf)
              post('file', {
                fileName: file.name,
                peerId: this.state.peerId,
                file: uintarr.join()
              });
            })
          });
        }
      });
    }
  }

  refreshPeerFileList = () => {
    fetch(`${fileServerURL}/file`)
    .then(res => res.json())
    .then(result => {
      this.setState({ files: result, });
    }, (error) => console.log(error));
  }

  onInitFs = fs => {
    this.setState({ fs });
    this.refreshLocalList();
  }

  requestQuotaErrorHandler = (e) => {
    console.log('Error', e);
  }

  componentDidMount() {
    // Get list of peer files
    this.refreshPeerFileList();

    // Setup file system
    navigator.webkitPersistentStorage.requestQuota(REQUEST_BYTES, grantedBytes => {  
        window.webkitRequestFileSystem('Persistent', grantedBytes, this.onInitFs, this.requestQuotaErrorHandler);
      }, e => { console.log('Error', e); }
    );

    // Setup peer
    this.peer = new Peer(connectionSettings);

    // This is to get the id of the user's peer from the server
    this.peer.on('open', (id) => {
      this.setState(() => ({ peerId: id}));
      

      // Socket connection
      const socket = io(socketServerURL);
      socket.on('connect', () => {
        // Allows server to keep track of connected peers
        socket.emit('peerid', id);
      });

      // Occurs when server receives peerid
      socket.on('peerrec', () => {
        this.refreshLocalList();
      });

      socket.on('updatefiles', () => {
        // Server notifies client whenever a change to the peer files have changed
        this.refreshPeerFileList();
      });
    });

    // This is for receiving file requests and responding with file
    this.peer.on('connection', conn => {
      conn.on('open', () => {
        console.log('connection opened')
      });

      conn.on('data', request => {
        console.log(request);
        if (request.type === 'file') {
          this.state.fs.root.getFile(request.fileName, {}, fe => {
            fe.file(file => {
              const partSize = file.size/request.div;
              const offset = request.part * partSize;
              conn.send({
                type: 'file',
                fileName: request.fileName,
                file: file.slice(offset, offset+partSize)
              });
            });
          }, e => {
            console.log('error', e);
            conn.close();
          });
        } else if (request.type === 'file-direct') {
          const file = new File([request.file], request.fileName);
          saveAs(file);
          conn.close();
        }
      });
    });

    this.peer.on('error', e => console.log(e));
  }

  render() {
    return (
      <div>
        <h1>WebPeer</h1>
        {this.state.peerId && <h3>Your Peer ID is: {this.state.peerId}</h3>}
        {this.state.files.length > 0 && this.state.peerId &&
          <FileList files={this.state.files} localFiles={this.state.localFiles} fs={this.state.fs} refreshLocalList={this.refreshLocalList.bind(this)} peer={this.peer} peerId={this.state.peerId} />}
        {this.state.localFiles.length > 0 && this.state.fs && this.state.peerId &&
          <LocalFileList files={this.state.localFiles} fs={this.state.fs} refreshLocalList={this.refreshLocalList.bind(this)} peerId={this.state.peerId} />}
        {this.state.fs && this.state.peerId && <FileUpload fs={this.state.fs} refreshLocalList={this.refreshLocalList.bind(this)} peerId={this.state.peerId} />}
        {this.state.peerId && <DirectSend peer={this.peer} />}
      </div>
    );
  }
}

export default App;
