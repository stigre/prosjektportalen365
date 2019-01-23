import * as React from 'react';
import styles from './ExperienceLog.module.scss';
import { IExperienceLogProps } from './IExperienceLogProps';
import List from '../../../Common/components/List/List';

export default class ExperienceLog extends React.Component<IExperienceLogProps, {}> {
  public render(): React.ReactElement<IExperienceLogProps> {
    return (
      <List />
    );
  }
}
