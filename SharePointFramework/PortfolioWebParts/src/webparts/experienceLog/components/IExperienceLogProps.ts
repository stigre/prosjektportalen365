import IGroupByOption from '../../../common/interfaces/IGroupByOption';
import IExcelExportConfig from '../../../common/interfaces/IExcelExportConfig';
import * as strings from 'ExperienceLogWebPartStrings';
import { SPHttpClient } from '@microsoft/sp-http';
import { IListProps } from '../../../common/components/List/IListProps';

export interface IExperienceLogProps extends IListProps {
  hubSiteId: string;
  spHttpClient: SPHttpClient;
  absoluteUrl: string;
  serverRelativeUrl: string;
  groupByOptions: IGroupByOption[];
  excelExportEnabled: boolean;
  excelExportConfig: IExcelExportConfig;
}

export const ExperienceLogDefaultProps: Partial<IExperienceLogProps> = {
  columns: [
    {
      key: 'Title',
      fieldName: 'Title',
      name: strings.TitleColumnDisplayName,
      minWidth: 220
    },
    {
      key: 'SiteTitle',
      fieldName: 'SiteTitle',
      name: strings.SiteTitleColumnDisplayName,
      minWidth: 100,
      isResizable: true
    },
    {
      key: 'GtProjectLogDescriptionOWSMTXT',
      fieldName: 'Description',
      name: strings.DescriptionColumnDisplayName,
      minWidth: 100,
      isResizable: true
    },
    {
      key: 'GtProjectLogResponsibleOWSCHCS',
      fieldName: 'Responsible',
      name: strings.ResponsibleColumnDisplayName,
      minWidth: 100,
      isResizable: true
    },
    {
      key: 'GtProjectLogConsequenceOWSMTXT',
      fieldName: 'Consequence',
      name: strings.ConsequenceColumnDisplayName,
      minWidth: 100,
      isResizable: true
    },
    {
      key: 'GtProjectLogRecommendationOWSMTXT',
      fieldName: 'Recommendation',
      name: strings.RecommendationColumnDisplayName,
      minWidth: 100,
      isResizable: true
    },
    {
      key: 'GtProjectLogActorsOWSCHCM',
      fieldName: 'Actors',
      name: strings.ActorsColumnDisplayName,
      minWidth: 100,
      isResizable: true
    }
  ],
  groupByOptions: [{ name: 'Prosjekt', key: 'SiteTitle' }],
  excelExportEnabled: true,
  excelExportConfig: {
    fileNamePrefix: strings.ExcelExportFileNamePrefix,
    sheetName: "Sheet A",
    buttonLabel: strings.ExcelExportButtonLabel,
    buttonIcon: "ExcelDocument",
  },
};
