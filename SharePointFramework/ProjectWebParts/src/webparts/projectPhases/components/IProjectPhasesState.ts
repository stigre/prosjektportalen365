import Phase from "../models/Phase";
import { ChecklistData } from "./ChecklistData";

export interface IProjectPhasesData {
  phases?: Array<Phase>;
  currentPhase?: Phase;  
  checklistData?:ChecklistData;
  phaseTextField?: string;
}

export interface IProjectPhasesState {
  isLoading: boolean;
  data: IProjectPhasesData;
  confirmPhase?: Phase;
  isChangingPhase?: boolean;
  phaseMouseOver?: { htmlElement: EventTarget & HTMLDivElement, model: Phase };
}
