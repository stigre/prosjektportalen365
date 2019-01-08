
export interface IConfirmPhaseDialogProps {
    phase: string;
    onConfirm: (result: boolean) => void;
    isBlocking: boolean;
    isChangingPhase: boolean;
}