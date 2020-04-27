import React from 'react';

const style = {
  marginTop: '5px',
  marginBottom: '3px'
}

const FileListItem = props => (
  <div onClick = {() => props.onClick(props.file, props.peers)}>
    <p style={style}>{`${props.file}`}</p>
  </div>
);

export default FileListItem;