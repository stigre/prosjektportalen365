import PlannerConfiguration from './PlannerConfiguration';
import SetupProjectInformation from './SetupProjectInformation';
import ApplyTemplate from './ApplyTemplate';
import CopyListData from './CopyListData';
import { BaseTask } from './BaseTask';
export * from './BaseTask';

const Tasks: BaseTask[] = [
    new PlannerConfiguration(),
    new SetupProjectInformation(),
    new ApplyTemplate(),
    new CopyListData(),
];
export { Tasks };