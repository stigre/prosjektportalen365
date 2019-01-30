import { ICalloutProps } from 'office-ui-fabric-react/lib/Callout';
import Phase from '../../models/Phase';

export interface IProjectPhaseCalloutProps extends ICalloutProps {
    phase: { htmlElement: EventTarget & HTMLDivElement, model: Phase };
    isCurrentPhase: boolean;
    phaseSubTextProperty: string;
    onChangePhase: (phase: Phase) => void;
}