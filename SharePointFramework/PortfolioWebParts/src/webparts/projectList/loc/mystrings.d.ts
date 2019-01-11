declare interface IProjectListWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  NotSet: string;
  LoadingProjectsLabel: string;
  ProjectOwner: string;
  ProjectManager: string;
  SearchBoxPlaceholderText: string;
  NoSearchResults: string;
  Loading: string;
}

declare module 'ProjectListWebPartStrings' {
  const strings: IProjectListWebPartStrings;
  export = strings;
}
