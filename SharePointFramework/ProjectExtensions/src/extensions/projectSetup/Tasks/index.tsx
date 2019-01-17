import PlannerConfiguration from './PlannerConfiguration';
import SetupProjectInformation from './SetupProjectInformation';
import ApplyTemplate from './ApplyTemplate';
import CopyListData from './CopyListData';
export * from './BaseTask';

const Tasks = [
    new PlannerConfiguration(),
    new SetupProjectInformation(),
    new ApplyTemplate(),
    new CopyListData(),
];

export { Tasks };
