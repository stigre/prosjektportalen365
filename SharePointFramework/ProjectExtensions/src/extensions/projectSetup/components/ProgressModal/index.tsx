import * as React from 'react';
import styles from './ProgressModal.module.scss';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { IProgressModalProps } from './IProgressModalProps';

export default class ProgressModal extends React.Component<IProgressModalProps, {}> {
    public render(): React.ReactElement<IProgressModalProps> {
        return (
            <Modal
                isOpen={true}
                onDismiss={this.props.onDismiss}
                isBlocking={true}
                isDarkOverlay={true}>
                <div className={styles.progressModal}>
                    <ProgressIndicator {...this.props.progressIndicatorProps} />
                </div>
            </Modal>
        );
    }
}

export { IProgressModalProps };