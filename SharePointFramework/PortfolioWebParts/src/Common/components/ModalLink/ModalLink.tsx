import * as React from 'react';
import { IModalLinkProps } from './IModalLinkProps';
import { IModalLinkState } from './IModalLinkState';

export default class ModalLink extends React.Component<IModalLinkProps, IModalLinkState> {

  constructor(props) {
    super(props);

    this.state = {
      showModalDialog: false
    };
  }

  public render() {
    return (
      <a
        href={this.props.url}
        hidden={this.props.hidden}
        id={this.props.id}
      >
      </a>
    );
  }

}
