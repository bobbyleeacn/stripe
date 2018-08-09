import React from 'react';


export default class TabList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

  
  selectTitle(title) {
    this.setState({
      selected: title
    });
  }
  

  render() {
    const { children } = this.props;
    const selected = this.state.selected || React.Children.toArray(children)[0].props.title;
    const headers = React.Children.map(children, (child) => {
      const { title } = child.props;
      return (
      <li className="bp3-tab" role="tab" aria-selected={selected === title} onClick={() => {this.selectTitle(title);}}>
        {child.props.title}
      </li>);
    })

    // panel text
    const panels = React.Children.map(children, (child) => {
      const { title } = child.props;
      // cloneElement allows us to add 'hidden' prop true or false based on if title is selected
      return React.cloneElement(child, { hidden: (title !== selected) },);
    });

    return (
      <div className="bp3-tabs">
          <ul className="bp3-tab-list" 
            role="tablist">
            {headers}
          </ul>
          {panels}
      </div>
    );
  }
}