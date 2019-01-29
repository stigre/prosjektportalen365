import IGroupByOption from '../../../common/interfaces/IGroupByOption';
import IExcelExportConfig from '../../../common/interfaces/IExcelExportConfig';
import * as strings from 'ExperienceLogWebPartStrings';
import { SPHttpClient } from '@microsoft/sp-http';

export interface IExperienceLogProps {
  spHttpClient: SPHttpClient;
  absoluteUrl: string;
  serverRelativeUrl: string;
  groupByOptions: IGroupByOption[];
  excelExportEnabled: boolean;
  excelExportConfig: IExcelExportConfig;
}

export const ExperienceLogDefaultProps: Partial<IExperienceLogProps> = {
  groupByOptions: [{ name: 'Prosjekt', key: 'SiteTitle' }],
  excelExportEnabled: true,
  excelExportConfig: {
      fileNamePrefix: strings.ExcelExportFileNamePrefix,
      sheetName: "Sheet A",
      buttonLabel: strings.ExcelExportButtonLabel,
      buttonIcon: "ExcelDocument",
  },
};
