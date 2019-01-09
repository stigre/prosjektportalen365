import Phase from "../models/Phase";

export interface IProjectPhasesState {
  isLoading: boolean;
  currentPhase?: Phase;
  phases?: Array<Phase>;
  checkPointStatuses?: { [termGuid: string]: { [status: string]: number } };
  confirmPhase?: Phase;
  isChangingPhase?: boolean;
  showPhaseChangeMessage?: boolean;
  phaseMouseOver?: { htmlElement: EventTarget & HTMLDivElement, model: Phase };
  phaseTextField?: string;
}
