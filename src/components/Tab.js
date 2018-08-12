import React from 'react';


const Tab = (props) => {  
  return (
    <div className="bp3-tab-panel" aria-hidden={props.hidden}>
      <br /><br />{props.children}
    </div>);
}

export default Tab;

