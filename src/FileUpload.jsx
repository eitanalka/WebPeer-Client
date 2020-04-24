import React from 'react';

const FileList = props => {

  const handleFileChosen = file => {
    const fileReader = new FileReader();

    console.log("file", file)

    const onInitFs = (fs) => {
      console.log(fs);
      console.log('Opened file system: ' + fs.name);

      fs.root.getFile(file.name, { create: true, exclusive: true }, fe => {
        fe.createWriter(fw => {
          fw.write(file);
        })
      });

      const dir = fs.root.createReader();
      dir.readEntries((results) => console.log(results))
    }

    const errorHandler = (e) => {
      console.log('Error', e);
    }

    var requestedBytes = 1024*1024*10;

    navigator.webkitPersistentStorage.requestQuota (
      requestedBytes, function(grantedBytes) {  
        window.webkitRequestFileSystem('Persistent', grantedBytes, onInitFs, errorHandler);
  
      }, e => { console.log('Error', e); }
    );
  }

  return (
    <div>
      <input 
        type="file"
        id="file"
        onChange={e => handleFileChosen(e.target.files[0])}
      />
    </div>
  );
};

export default FileList;