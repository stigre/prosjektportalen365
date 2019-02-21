import * as React from 'react';
import styles from './ResourceAllocation.module.scss';
import { IResourceAllocationProps } from './IResourceAllocationProps';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';

export default class ResourceAllocation extends React.Component<IResourceAllocationProps, {}> {
  public render(): React.ReactElement<IResourceAllocationProps> {
    return (
      <div className={styles.resourceAllocation}>
        <div className={styles.container}>
         <CommandBar items={[]} />
        </div>
      </div>
    );
  }
}
