import React from 'react';

const FileListItem = props => (
  <div onClick = {() => props.onClick(props.file, props.peers)}>
    <p>{`${props.file}`}</p>
  </div>
);

export default FileListItem;