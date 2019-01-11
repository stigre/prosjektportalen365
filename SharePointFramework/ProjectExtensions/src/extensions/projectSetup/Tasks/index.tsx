import CheckHubAssosication from './CheckHubAssosication';
import SetupPages from './SetupPages';
import SetupViews from './SetupViews';
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

const Tasks = [new ApplyTemplate()];

export { Tasks };
