import * as React from 'react';
import styles from '../ProjectList.module.scss';
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
import { UtilityMethod } from '@pnp/sp';
import { getParent } from '@uifabric/utilities/lib';


const ProjectCard = (props: IProjectCardProps): JSX.Element => {
  const fallbackIconProps = { iconName: 'History', styles: { root: { fontSize: 50, color: "rgb(51, 51, 51)", opacity: 0.5 } } };
  const previewImage: IDocumentCardPreviewImage = {
    previewImageSrc: props.project.Logo,
    previewIconProps: props.project.Logo ? null : fallbackIconProps,
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
      <DocumentCardLocation location={props.project.Phase} />
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
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export default ProjectCard;
