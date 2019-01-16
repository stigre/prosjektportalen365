import ProjectPropertyModel from "../models/ProjectPropertyModel";

export interface IProjectInformationData {
  properties?: ProjectPropertyModel[];
  editFormUrl?: string;
  itemId?: number;
}

export interface IProjectInformationState {
  isLoading: boolean;
  data?: IProjectInformationData;
}
