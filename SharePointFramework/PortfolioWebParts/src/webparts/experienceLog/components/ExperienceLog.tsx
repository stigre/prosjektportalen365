import * as React from 'react';
import styles from './ExperienceLog.module.scss';
import { IExperienceLogProps, ExperienceLogDefaultProps } from './IExperienceLogProps';
import List from '../../../Common/components/List/List';

export default class ExperienceLog extends React.Component<IExperienceLogProps, {}> {

  public static defaultProps = ExperienceLogDefaultProps;

  constructor(props) {
    super(props);


  }

  public render(): React.ReactElement<IExperienceLogProps> {
    return (
      <List
        showCommandBar={true}
        groupByOptions={this.props.groupByOptions}
        excelExportEnabled={this.props.excelExportEnabled}
        excelExportConfig={this.props.excelExportConfig}
      />
    );
  }
}
