import ProjectPropertyModel from "../models/ProjectPropertyModel";

export interface IProjectInformationState {
  isLoading: boolean;
  properties: ProjectPropertyModel[];
}
