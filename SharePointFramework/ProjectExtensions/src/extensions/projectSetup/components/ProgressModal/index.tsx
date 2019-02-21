import * as React from 'react';
import styles from './ProgressModal.module.scss';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
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
                    <div className={styles.progressModalBody}>
                        <div className={styles.modalTitle}>Setter opp prosjektområdet</div>
                        <div className={styles.progressIcon}>
                            <Icon iconName={this.props.iconName} style={{ fontSize: 42, display: 'block', textAlign: 'center' }} />
                        </div>
                        <div className={styles.progressIndicator}>
                            <ProgressIndicator label={this.props.text} description={this.props.subText} />
                        </div>
                    </div>
                    {this.props.taskParams.entity && <EditPropertiesLink editFormUrl={this.props.taskParams.entity.editFormUrl} />}
                </div>
            </Modal>
        );
    }
}

export { IProgressModalProps };