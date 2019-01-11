import * as React from 'react';
import { Modal } from "office-ui-fabric-react/lib/Modal";
import { IProjectInfoProps } from './IProjectInfoProps';

export default class ProjectInfo extends React.Component<IProjectInfoProps, {}> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Modal isOpen={this.props.showProjectInfo !== undefined} isBlocking={false} isDarkOverlay={true} onDismiss={this.props.onDismiss}>
            <div>ProjectInfo</div>
          </Modal>
    );
  }
}
