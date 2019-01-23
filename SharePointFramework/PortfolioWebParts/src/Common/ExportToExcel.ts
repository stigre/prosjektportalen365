export interface IExcelExportSheet {
  name?: string;
  data: Array<any[]>;
}

export interface IExcelExportSettings {
  sheets: IExcelExportSheet[];
  fileName: string;
  options?: any;
}

export enum ExcelExportStatus {
  Idle,
  Exporting,
}
