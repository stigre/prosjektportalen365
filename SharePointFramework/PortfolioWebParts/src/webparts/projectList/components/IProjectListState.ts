import ProjectListModel from './ProjectListModel';
import Phase from '../models/Phase';

export interface IProjectListData {
  projects?: ProjectListModel[];
  fields?: { [key: string]: string };
}

export interface IProjectListState {
  isLoading: boolean;
  data?: IProjectListData;
  searchTerm?: string;
  projects: any[];
  phases: Phase[];
  showProjectInfo?: ProjectListModel;
}
