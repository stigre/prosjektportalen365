import ProjectListModel from "../ProjectListModel";

interface IProjectCardProps {
    project: ProjectListModel;
    onClickHref: string;
    showProjectInfo: (evt: any) => void;
/*     fields: { [key: string]: string };
    className: string;
    tileWidth: number;
    tileImageHeight: number; */
}

export default IProjectCardProps;
