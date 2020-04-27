import React from 'react';
import { deleteReq } from './helpers';

const LocalFileListItem = props => {

  const deleteFile = e => {
    props.fs.root.getFile(props.file.name, {}, fe => {
      fe.remove(() => {
        deleteReq('file', {file: props.file.name, peerId: props.peerId })
        props.refreshLocalList();
      });
    });
    e.target.value = null;
  }

  const pStyle = {
    color: 'navy',
    marginBottom: 0
  };

  return (
    <div>
      <p style={pStyle} onClick = {() => props.onClick(props.file)}>{props.file.name}</p>
      <button onClick={deleteFile}>Delete File</button>
    </div>
  );

}

export default LocalFileListItem;