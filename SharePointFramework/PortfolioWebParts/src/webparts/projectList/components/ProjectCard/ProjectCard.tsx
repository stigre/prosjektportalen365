import * as React from 'react';
import styles from '../ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import IProjectCardProps from './IProjectCardProps';
import { DocumentCard, DocumentCardPreview, DocumentCardTitle, DocumentCardLocation, DocumentCardActivity, DocumentCardActions, DocumentCardType, IDocumentCardPreviewImage } from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from 'office-ui-fabric-react/lib/Image';

const ProjectCard = ({ project, onClickHref, showProjectInfo, fallbackPreviewImage }: IProjectCardProps): JSX.Element => {
  const previewImage: IDocumentCardPreviewImage = {
    previewImageSrc: project.Logo ? project.Logo : fallbackPreviewImage,
    imageFit: ImageFit.cover,
    height: 140,
    width: 200
  };

  return (
    <DocumentCard
      className={styles.projectCard}
      type={DocumentCardType.normal}
      onClickHref={onClickHref}    >
      <DocumentCardPreview previewImages={[previewImage]} />
      <DocumentCardTitle title={project.Title} shouldTruncate={false} />
      <DocumentCardLocation location={project.Phase || strings.NotSet} />
      <DocumentCardActivity activity={strings.ProjectOwner} people={[{ name: project.Owner.Title, profileImageSrc: getUserPhoto(project.Owner.Email) }]} />
      <DocumentCardActivity activity={strings.ProjectManager} people={[{ name: project.Manager.Title, profileImageSrc: getUserPhoto(project.Manager.Email) }]} />
      <DocumentCardActions
        actions={
          [{
            iconProps: { iconName: "AlignCenter" },
            onClick: event => {
              event.preventDefault();
              event.stopPropagation();
              showProjectInfo();
            },
          },
          ]}
        views={project.Views}
      />
    </DocumentCard>
  );
};

function getUserPhoto(email: string, size = "L"): string {
  return `/_layouts/15/userphoto.aspx?size=${size}&accountname=${email}`;
}

export default ProjectCard;
