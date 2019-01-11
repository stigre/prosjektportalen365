import CheckHubAssosication from './CheckHubAssosication';
import PlannerConfiguration from './PlannerConfiguration';
import SetupProjectInformation from './SetupProjectInformation';
import ApplyTemplate from './ApplyTemplate';
export * from './BaseTask';

// export const Tasks = [
//     CheckHubAssosication,
//     SetupPages,
//     SetupViews,
//     PlannerConfiguration,
//     SetupProjectInformation,
// ];

const Tasks = [
    new CheckHubAssosication(),
    new PlannerConfiguration(),
    new SetupProjectInformation(),
    new ApplyTemplate(),
];

export { Tasks };
