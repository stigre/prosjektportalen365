import * as React from 'react';
import styles from '../ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import IProjectCardProps from './IProjectCardProps';
import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardLocation,
  DocumentCardActivity,
  DocumentCardActions,
  DocumentCardType,
  IDocumentCardPreviewImage
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { IUserDetails } from '../ProjectListModel';

const ProjectCard = (props: IProjectCardProps): JSX.Element => {
  const previewImage: IDocumentCardPreviewImage = {
    previewImageSrc: props.project.Logo ? props.project.Logo : `${props.absoluteUrl}/SiteAssets/pp/img/ICO-Global-Project-11.png`,
    imageFit: ImageFit.cover,
    accentColor: stringToColor(props.project.Phase),
    height: 140,
    width: 200
  };

  return (
    <DocumentCard
      className={styles.projectCard}
      type={DocumentCardType.normal}
      onClickHref={props.onClickHref}
    >
      <DocumentCardPreview previewImages={[previewImage]} />
      <DocumentCardTitle title={props.project.Title} shouldTruncate={false} />
      <DocumentCardLocation location={props.project.Phase || strings.NotSet} />
      <DocumentCardActivity activity={strings.ProjectOwner} people={[getOwner(props.project, props.absoluteUrl)]} />
      <DocumentCardActivity activity={strings.ProjectManager} people={[getManager(props.project, props.absoluteUrl)]} />
      <DocumentCardActions
        actions={
          [{
            iconProps: { iconName: "AlignCenter" },
            onClick: e => {
              e.preventDefault();
              e.stopPropagation();
              props.showProjectInfo(e);
            },
          },
          ]}
        views={props.project.Views}
      />
    </DocumentCard>
  );
};

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

function getOwner(obj, rootUrl: string): IUserDetails {
  let email = "";
  let name = strings.NotSet;
  if (obj.Owner) [email, name] = obj.Owner.split("|");
  const profileImageSrc = userPhoto(rootUrl, email);
  return { name, email, profileImageSrc };
}

function getManager(obj, rootUrl: string): IUserDetails {
  let email = "";
  let name = strings.NotSet;
  if (obj.Manager) [email, name] = obj.Manager.split("|");
  const profileImageSrc = userPhoto(rootUrl, email);
  return { name, email, profileImageSrc };
}

function userPhoto(rootUrl: string, email: string, size = "L"): string {
  return `${rootUrl}/_layouts/15/userphoto.aspx?size=${size}&accountname=${email}`;
}

export default ProjectCard;
