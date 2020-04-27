import React from 'react';
import { post } from './helpers';

const FileUpload = props => {
  const handleFileChosen = (file, e) => {
    props.fs.root.getFile(file.name, { create: true, exclusive: true }, fe => {
      fe.createWriter(fw => {
        fw.onwriteend = () => {
          props.refreshLocalList();
          post('file', { peerId: props.peerId, fileName: file.name })
        }
        fw.write(file);
      });
    });
    e.target.value = null;
  }

  const style = {
    marginTop: '10px'
  }

  return (
    <div style={style}>
      <input 
        type="file"
        id="file"
        onChange={e => handleFileChosen(e.target.files[0], e)}
      />
    </div>
  );
};

export default FileUpload;