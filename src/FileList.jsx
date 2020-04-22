import React from 'react';
import FileListItem from './FileListItem';

// This should probably be defined in app.js and be passed in as a prop
const onClick = (fileName, peers) => {
  // Insert request for peer file stuff here
  console.log(fileName);
  console.log(peers);
}

const FileList = props => (
  <div>
    <h3>File List:</h3>
    {props.files.map(file => <FileListItem key={file.fileName} file={file.fileName} peers={file.peers} onClick={onClick} />)}
  </div>
);

export default FileList;