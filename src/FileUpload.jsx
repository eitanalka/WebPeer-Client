import React, { Component } from 'react';
import { post } from './helpers';

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    }
  }


  handleFileChosen = async (file) => {
    const arrbuf = await file.arrayBuffer();
    const uintarr = new Uint8Array(arrbuf);
    const response = await post('file/check', {
      fileName: file.name,
      file: uintarr.join()
    });

  
    if (response.ok) {
      this.props.fs.root.getFile(file.name, { create: true, exclusive: true }, fe => {
        fe.createWriter(fw => {
          fw.onwriteend = async () => {
            this.props.refreshLocalList();
            post('file', {
              peerId: this.props.peerId,
              fileName: file.name,
              file: uintarr.join()
            });
          }
          fw.write(file);
        });
      });
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    const style = {
      marginTop: '10px',
    };

    const h3Style = {
      marginBottom: '0px'
    }

    const errorStyle = {
      color: 'red'
    };
  
    return (
      <div style={style}>
        <h3 style={h3Style}>Upload File:</h3>
        <input 
          type="file"
          id="file"
          onChange={e => { this.handleFileChosen(e.target.files[0]); e.target.value = null;}}
        />
        {this.state.error && <p style={errorStyle}>A different file with the same file name already exists.</p>}
      </div>
    );
  }
};

export default FileUpload;