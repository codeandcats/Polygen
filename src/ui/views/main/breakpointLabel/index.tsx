import * as React from 'react';

interface BootstrapLabelProps {
}

interface BootstrapLabelState {
}

export class BootstrapLabel extends React.Component<BootstrapLabelProps, BootstrapLabelState> {
  public render() {
    return (
      <div style={ { position: 'absolute', right: 10, bottom: 10, opacity: .5 } }>
        <span className='label label-primary visible-xs-inline'>Extra Small</span>
        <span className='label label-info visible-sm-inline'>Small</span>
        <span className='label label-warning visible-md-inline'>Medium</span>
        <span className='label label-danger visible-lg-inline'>Large</span>
      </div>
    );
  }
}
