declare interface ICommonStrings {
  Loading: string;
  MissingProperties: string;
  NoProperties: string;
  ProjectLinkText: string;
  ProjectStatusLinkText: string;
  NoGrouping: string;
}

declare module 'CommonStrings' {
  const strings: ICommonStrings;
  export = strings;
}
