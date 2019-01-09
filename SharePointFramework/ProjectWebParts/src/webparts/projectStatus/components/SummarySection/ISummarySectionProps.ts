import { IStatusSectionBaseProps } from "../StatusSectionBase/IStatusSectionBaseProps";
import { IProjectInformationProps } from "../../../projectInformation/components/IProjectInformationProps";

export interface ISummarySectionProps extends IStatusSectionBaseProps {
    projectInformation: any;
}