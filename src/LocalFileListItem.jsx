import React from 'react';

const LocalFileListItem = props => (
  <div onClick = {() => props.onClick(props.file)}>
    <p style={{color: "pink"}}>{props.file.name}</p>
  </div>
);

export default LocalFileListItem;