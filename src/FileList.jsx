import React from 'react';
import { saveAs } from 'file-saver';
import FileListItem from './FileListItem';
import { post } from './helpers';


const FileList = props => {
  const onClick = (fileName, peers) => {
    const data = peers.map(() => null);

    const isDataFull = () => {
      for (let i = 0; i < data.length; i++) {
        if (!data[i]) return false;
      }

      return true;
    }

    for (let i = 0; i < data.length; i++) {
      const conn = props.peer.connect(peers[i]);

      conn.on('open', () => {
        console.log('request connected');
        const request = {
          type: 'file',
          fileName,
          div: data.length,
          part: i
        };

        conn.send(request);
      })
  
      conn.on('data', response => {
        console.log(response);
        if (response.type === 'file') {
          data[i] = response.file;
          if (isDataFull()) {
            const file = new File(data, response.fileName);
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
        }
      });
    }
  }

  const containsFile = (file) => {
    for (let i = 0; i < props.localFiles.length; i++) {
      if (file.fileName === props.localFiles[i].name) return true;
    }

    return false;
  }


  return (
    <div>
      <h3>Peer File List:</h3>
      {props.files.map(file => {
        if (!containsFile(file) && file.peers.length > 0) {
          return (
            <FileListItem
              key={file.fileName}
              file={file.fileName}
              peers={file.peers}
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