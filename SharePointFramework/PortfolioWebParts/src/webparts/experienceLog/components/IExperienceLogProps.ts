import IGroupByOption from '../../../Common/interfaces/IGroupByOption';
import IExcelExportConfig from '../../../Common/interfaces/IExcelExportConfig';
import * as strings from 'ExperienceLogWebPartStrings';

export interface IExperienceLogProps {
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
