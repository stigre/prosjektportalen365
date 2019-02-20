import * as React from 'react';
import { IModalLinkProps } from './IModalLinkProps';
import { IModalLinkState } from './IModalLinkState';
import { autobind } from '@uifabric/utilities/lib';

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
        onClick={this.showModalDialog}
      >
      {this.props.label}
      </a>
    );
  }

  @autobind
  private showModalDialog(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    event.stopPropagation();
    this.props.showModalDialog();
  }

}
