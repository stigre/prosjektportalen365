import ProjectListModel from './ProjectListModel';

export interface IProjectListData {
  projects?: ProjectListModel[];
  fields?: { [key: string]: string };
}

export interface IProjectListState {
  isLoading: boolean;
  data?: IProjectListData;
  searchTerm?: string;
  showProjectInfo?: ProjectListModel;
}
