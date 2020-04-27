import React from 'react';
import { saveAs } from 'file-saver';
import LocalFileListItem from './LocalFileListItem';

// This should probably be defined in app.js and be passed in as a prop
const onClick = (fileEntry) => {
  fileEntry.file(f => saveAs(f));
}

const LocalFileList = props => (
  <div>
    <h3 style={{color: "navy"}}>Local File List:</h3>
    {props.files.map(file => 
      <LocalFileListItem 
        key={file.name} 
        file={file} 
        onClick={onClick} 
        fs={props.fs} 
        refreshLocalList={props.refreshLocalList}
        peerId={props.peerId}
      />
    )}
  </div>
);

export default LocalFileList;