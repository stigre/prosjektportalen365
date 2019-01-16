//#region Imports
import * as React from "react";
import { ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import IChangingPhaseViewProps from "./IChangingPhaseViewProps";
import IChangingPhaseViewState from "./IChangingPhaseViewState";
//#endregion

/**
 * Changing phase view
 */
export default class ChangingPhaseView extends React.Component<IChangingPhaseViewProps, IChangingPhaseViewState> {
    public static displayName = "ChangingPhaseView";

    /**
     * Constructor
     *
     * @param {IChangingPhaseViewProps} props Props
     */
    constructor(props: IChangingPhaseViewProps) {
        super(props);
    }

    public render(): JSX.Element {
        // return (
        //     <ProgressIndicator
        //         label={progressLabel}
        //         description={String.format(progressDescription, this.props.newPhase.Name)}
        //         percentComplete={this.state.percentComplete} />
        // );
        return <ProgressIndicator label={''} description={''} />;
    }
}
