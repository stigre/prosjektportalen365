import Phase from "../models/Phase";
import { CheckPointStatus } from "./CheckPointStatus";

export interface IProjectPhasesState {
  isLoading: boolean;
  currentPhase?: Phase;
  phases?: Array<Phase>;
  checkPointStatus?:CheckPointStatus;
  confirmPhase?: Phase;
  isChangingPhase?: boolean;
  showPhaseChangeMessage?: boolean;
  phaseMouseOver?: { htmlElement: EventTarget & HTMLDivElement, model: Phase };
  phaseTextField?: string;
}
