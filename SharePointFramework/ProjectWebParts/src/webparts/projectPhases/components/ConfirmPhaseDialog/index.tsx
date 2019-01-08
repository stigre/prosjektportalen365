import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { IConfirmPhaseDialogProps } from "./IConfirmPhaseDialogProps";
import * as format from 'string-format';
import * as strings from 'ProjectPhasesWebPartStrings';

// ConfirmPhaseDialog
const ConfirmPhaseDialog = (props: IConfirmPhaseDialogProps) => {
    return (
        <Dialog
            hidden={false}
            onDismiss={e => props.callbackFunction(false)}
            dialogContentProps={{
                type: DialogType.normal,
                title: strings.ConfirmPhaseDialogTitle,
                subText: format(strings.ConfirmPhaseDialogSubText, props.phase),
            }}
            modalProps={{ isBlocking: props.isBlocking }}>
            {props.isChangingPhase
                ? (
                    <DialogFooter>
                        <Spinner />
                    </DialogFooter>
                )
                : (
                    <DialogFooter>
                        <PrimaryButton onClick={e => props.callbackFunction(true)} text='Yes' />
                        <DefaultButton onClick={e => props.callbackFunction(false)} text='No' />
                    </DialogFooter>
                )}
        </Dialog>
    );
};

export default ConfirmPhaseDialog;