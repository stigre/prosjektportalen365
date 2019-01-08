declare interface IProjectPhasesWebPartStrings {
  SettingsGroupName: string;
  ViewsGroupName: string;
  LookAndFeelGroupName: string;
  PersistedPhasePropertyBagKey: string;
  PhaseFieldFieldLabel: string;
  AutomaticReloadFieldLabel: string;
  ReloadTimeoutFieldLabel: string;
  FontSizeFieldLabel: string;
  GutterFieldLabel: string;
  UpdateViewsDocumentsFieldLabel: string;
  UpdateViewsTasksFieldLabel: string;
  UpdateViewsRisksFieldLabel: string;
  ConfirmPhaseChangeFieldLabel: string;
  PhaseSubTextPropertyFieldLabel: string;
  ConfirmPhaseDialogTitle: string;
  ConfirmPhaseDialogSubText: string;
  PhaseChangedMessage: string;
  PageReloadMessage: string;
  WebPartNotConfiguredMessage: string;
  DocumentsListName: string;
  RiskRegisterListName: string;
  TasksListName: string;
  Yes: string;
  No: string;
  CheckPointsMarkedAsText: string;
  GoToPhaseChecklist: string;
}

declare module 'ProjectPhasesWebPartStrings' {
  const strings: IProjectPhasesWebPartStrings;
  export = strings;
}
