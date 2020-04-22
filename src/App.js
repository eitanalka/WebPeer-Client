import React, { Component } from 'react';
import './App.css';
import { fileServerURL } from '.';
import PeerComponentDemo from './PeerComponentDemo';
import FileList from './FileList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    }
  }

  componentDidMount() {
    fetch(`${fileServerURL}/file`)
      .then(res => res.json())
      .then((result) => this.setState({ files: result, }), (error) => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <PeerComponentDemo />
          {this.state.files.length > 0 && <FileList files={this.state.files}/>}
        </header>
      </div>
    );
  }
}

export default App;
