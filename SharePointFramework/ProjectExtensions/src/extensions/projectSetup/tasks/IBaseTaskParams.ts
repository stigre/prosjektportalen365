import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IProjectSetupApplicationCustomizerProperties } from '../IProjectSetupApplicationCustomizerProperties';
import IProjectSetupApplicationCustomizerData from '../IProjectSetupApplicationCustomizerData';

export interface IBaseTaskParams {
    context: ApplicationCustomizerContext;
    properties: IProjectSetupApplicationCustomizerProperties;
    data: IProjectSetupApplicationCustomizerData;
    entity?: any;
}