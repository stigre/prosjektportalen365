import * as React from 'react';
import styles from '../ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import IProjectCardProps from './IProjectCardProps';
import { DocumentCard, DocumentCardTitle, DocumentCardLocation, DocumentCardActivity, DocumentCardActions, DocumentCardType } from "office-ui-fabric-react/lib/DocumentCard";

export default ({ project, onClickHref, showProjectInfo }: IProjectCardProps): JSX.Element => {
  return (
    <DocumentCard
      className={styles.projectCard}
      type={DocumentCardType.normal}
      onClickHref={onClickHref}    >
      <DocumentCardTitle title={project.Title} shouldTruncate={false} />
      <DocumentCardLocation location={project.Phase || strings.NotSet} />
      <DocumentCardActivity
        activity={strings.ProjectOwner}
        people={project.Owner ? [{ name: project.Owner.Title, profileImageSrc: getUserPhoto(project.Owner.Email) }] : []} />
      <DocumentCardActivity
        activity={strings.ProjectManager}
        people={project.Manager ? [{ name: project.Manager.Title, profileImageSrc: getUserPhoto(project.Manager.Email) }] : []} />
      <DocumentCardActions actions={[{ iconProps: { iconName: "OpenInNewWindow" }, onClick: showProjectInfo }]} />
    </DocumentCard>
  );
};

function getUserPhoto(email: string, size = "L"): string {
  return `/_layouts/15/userphoto.aspx?size=${size}&accountname=${email}`;
}
