import React from 'react';
import { saveAs } from 'file-saver';
import FileListItem from './FileListItem';
import { post } from './helpers';


const FileList = props => {
  const onClick = (fileName, peers) => {
    // TODO: switch this to split the request between up to five peers
    const conn = props.peer.connect(peers[0]);

    conn.on('open', () => {
      console.log('request connected');
      const request = {
        type: 'file',
        fileName
      };
  
      conn.send(request);
    })

    conn.on('data', response => {
      console.log(response);
      if (response.type === 'file') {
        const file = new File([response.file], response.fileName);
        props.fs.root.getFile(file.name, { create: true, exclusive: true }, fe => {
          fe.createWriter(fw => {
            fw.onwriteend = () => {
              props.refreshLocalList();
              // After downloading files, let server know that others can download from this peer
              post('file', { peerId: props.peerId, fileName: file.name })
            }
            fw.write(file);
            saveAs(file);
            conn.close();
          });
        });
      }
    });
  }


  return (
    <div>
      <h3>Peer File List:</h3>
      {props.files.map(file => {
        const peers = file.peers.filter(peerId => peerId !== props.peerId);
        if (peers.length > 0) {
          return (
            <FileListItem
              key={file.fileName}
              file={file.fileName}
              peers={peers}
              onClick={onClick}
            />
          )
        }
        return false;
      })}
    </div>
  );
};

export default FileList;