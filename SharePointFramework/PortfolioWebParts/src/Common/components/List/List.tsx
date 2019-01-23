import * as React from 'react';
import styles from './List.module.scss';
import * as strings from 'CommonStrings';
import { IListProps } from './IListProps';
import { IListState } from './IListState';

export default class List extends React.Component<IListProps, IListState> {

  constructor(props) {
    super(props);

  }

  public async componentDidMount() {

  }

  public render() {
    return (
      <div></div>
    );
  }


}
