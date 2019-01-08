import Phase from "../models/Phase";

export interface IProjectPhasesState {
  isLoading: boolean;
  currentPhase?: string;
  phases?: Array<Phase>;
  checkPointStatuses?: { [termGuid: string]: { [status: string]: number } };
  confirmPhase?: string;
  isChangingPhase?: boolean;
  showPhaseChangeMessage?: boolean;
  phaseMouseOver?: { htmlElement: EventTarget & HTMLDivElement, model: Phase };
}
