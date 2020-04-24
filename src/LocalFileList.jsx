import React from 'react';
import { saveAs } from 'file-saver';
import LocalFileListItem from './LocalFileListItem';

// This should probably be defined in app.js and be passed in as a prop
const onClick = (fileEntry) => {
  // Insert request for peer file stuff here
  fileEntry.file(f => saveAs(f));
}

const LocalFileList = props => (
  <div>
    <h3 style={{color: "pink"}}>Local File List:</h3>
    {props.files.map(file => <LocalFileListItem key={file.name} file={file} onClick={onClick} />)}
  </div>
);

export default LocalFileList;