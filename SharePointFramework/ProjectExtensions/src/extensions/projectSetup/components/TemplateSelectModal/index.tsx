import * as React from 'react';
import styles from './TemplateSelectModal.module.scss';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { ITemplateSelectModalProps } from './ITemplateSelectModalProps';
import { ITemplateSelectModalState } from './ITemplateSelectModalState';
import * as strings from 'ProjectSetupApplicationCustomizerStrings';
import ProjectTemplate from '../../models/ProjectTemplate';

export default class TemplateSelectModal extends React.Component<ITemplateSelectModalProps, ITemplateSelectModalState> {
    constructor(props: ITemplateSelectModalProps) {
        super(props);
        this.state = { selectedTemplate: props.templates[0] };
    }

    public render(): React.ReactElement<ITemplateSelectModalProps> {
        return (
            <Modal
                isOpen={true}
                onDismiss={this.props.onDismiss}
                isBlocking={true}
                isDarkOverlay={true}>
                <div className={styles.templateSelectModal}>
                    <div className={styles.templateSelectModalTitle}>{strings.TemplateSelectModalTitle}</div>
                    <div className={styles.templateSelectModalDropdown}>
                        <Dropdown
                            defaultSelectedKey='0'
                            onChanged={this.onTemplateSelected}
                            options={this.getTemplateOptions()} />
                    </div>
                    <DefaultButton text={strings.RunText} onClick={this.submit} />
                </div>
            </Modal>
        );
    }

    @autobind
    private submit() {
        this.props.onTemplateSelected(this.state.selectedTemplate);
    }

    @autobind
    private onTemplateSelected(opt: IDropdownOption) {
        this.setState({ selectedTemplate: (opt.data as ProjectTemplate) });
    }

    private getTemplateOptions(): IDropdownOption[] {
        return this.props.templates.map((template, idx) => {
            return {
                key: `${idx}`,
                text: template.title,
                data: template,
            };
        });
    }
}
