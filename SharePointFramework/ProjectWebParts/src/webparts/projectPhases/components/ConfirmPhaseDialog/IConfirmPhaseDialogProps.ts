
export interface IConfirmPhaseDialogProps {
    phase: string;
    callbackFunction: (result: boolean) => void;
    isBlocking: boolean;
    isChangingPhase: boolean;
}