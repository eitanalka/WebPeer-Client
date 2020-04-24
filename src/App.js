import React, { Component } from 'react';
import './App.css';
import { fileServerURL } from '.';
import PeerComponentDemo from './PeerComponentDemo';
import FileList from './FileList';
import LocalFileList from './LocalFileList';

const REQUEST_BYTES = 1024*1024*50; // 50 MB

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      fileSystem: null,
      localFiles: []
    }
  }

  onInitFs = fs => {
    this.setState({ fileSystem: fs });
    const dir = fs.root.createReader();
      dir.readEntries((files) => {
        this.setState({ localFiles: files });
      })
  }

  requestQuotaErrorHandler = (e) => {
    console.log('Error', e);
  }

  componentDidMount() {
    fetch(`${fileServerURL}/file`)
      .then(res => res.json())
      .then((result) => this.setState({ files: result, }), (error) => console.log(error));

    navigator.webkitPersistentStorage.requestQuota(REQUEST_BYTES, grantedBytes => {  
        window.webkitRequestFileSystem('Persistent', grantedBytes, this.onInitFs, this.requestQuotaErrorHandler);
      }, e => { console.log('Error', e); }
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <PeerComponentDemo />
          {this.state.files.length > 0 && <FileList files={this.state.files}/>}
          {this.state.localFiles.length > 0 && <LocalFileList files={this.state.localFiles} />}
        </header>
      </div>
    );
  }
}

export default App;
