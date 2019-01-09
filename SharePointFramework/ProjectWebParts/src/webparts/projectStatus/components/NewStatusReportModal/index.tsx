import * as React from 'react';
import styles from './NewStatusReportModal.module.scss';
import { INewStatusReportModalProps, INewStatusReportModalField } from './INewStatusReportModalProps';
import { INewStatusReportModalState } from './INewStatusReportModalState';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import * as strings from 'ProjectStatusWebPartStrings';

export default class NewStatusReportModal extends React.Component<INewStatusReportModalProps, INewStatusReportModalState> {
    constructor(props: INewStatusReportModalProps) {
        super(props);
        this.state = { model: {} };
        console.log(props.fields);
    }

    public render(): React.ReactElement<INewStatusReportModalProps> {
        console.log(this.state.model);
        return (
            <Modal isOpen={true} onDismiss={this.props.onDismiss}>
                <div className={styles.newStatusReportModal}>
                    <div className={styles.newStatusReportModalHeader}>Ny statusrapport</div>
                    {this.props.fields.map(fld => {
                        switch (fld.fieldType) {
                            case 'text': {
                                return (
                                    <div className={styles.newStatusReportModalField}>
                                        <TextField label={fld.title} onChanged={value => this.onFieldUpdated(fld, value)} />
                                    </div>
                                );
                            }
                            case 'note': {
                                return (
                                    <div className={styles.newStatusReportModalField}>
                                        <TextField
                                            label={fld.title}
                                            multiline={true}
                                            onChanged={value => this.onFieldUpdated(fld, value)} />
                                    </div>
                                );
                            }
                            case 'choice': {
                                const options = [
                                    {
                                        key: '',
                                        text: '',
                                    },
                                    ...fld.choices.map(text => ({ key: text, text })),
                                ];
                                return (
                                    <div className={styles.newStatusReportModalField}>
                                        <Dropdown
                                            label={fld.title}
                                            options={options}
                                            onChanged={opt => this.onFieldUpdated(fld, opt.key.toString())} />
                                    </div>
                                );
                            }
                            default: {
                                return null;
                            }
                        }
                    })}
                    <div className={styles.newStatusReportModalFooter}>
                        <PrimaryButton text={strings.SaveText} onClick={this.onSave} />
                    </div>
                </div>
            </Modal>
        );
    }

    @autobind
    private onFieldUpdated(field: INewStatusReportModalField, value: string) {
        const model = { ...this.state.model };
        model[field.fieldName] = value;
        this.setState({ model });
    }

    @autobind
    private onSave() {
        this.props.onSave(this.state.model);
    }
}
