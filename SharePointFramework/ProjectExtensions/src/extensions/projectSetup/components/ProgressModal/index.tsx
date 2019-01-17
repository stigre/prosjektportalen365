import * as React from 'react';
import styles from './ProgressModal.module.scss';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { IProgressModalProps } from './IProgressModalProps';
import EditPropertiesLink from './EditPropertiesLink';

export default class ProgressModal extends React.Component<IProgressModalProps, {}> {
    public render(): React.ReactElement<IProgressModalProps> {
        return (
            <Modal
                isOpen={true}
                onDismiss={this.props.onDismiss}
                isBlocking={this.props.isBlocking}
                isDarkOverlay={this.props.isDarkOverlay}>
                <div className={styles.progressModal}>
                    <ProgressIndicator {...this.props.progressIndicatorProps} />
                    {this.props.taskParams.entity && <EditPropertiesLink editFormUrl={this.props.taskParams.entity.editFormUrl} />}
                </div>
            </Modal>
        );
    }
}

export { IProgressModalProps };