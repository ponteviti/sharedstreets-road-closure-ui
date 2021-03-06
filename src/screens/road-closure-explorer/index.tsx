import * as React from 'react';
import { connect } from 'react-redux';
import SharedStreetsHeader from '../../components/sharedstreets-header';
// import RoadClosureMap from '../../containers/road-closure-map';
import { RootState } from '../../store/configureStore';
import './road-closure-explorer.css';

import { FocusStyleManager } from "@blueprintjs/core";
import RoadClosureHeaderMenu from 'src/containers/road-closure-header-menu';
import RoadClosureSavedDataViewer from 'src/containers/road-closure-saved-data-viewer';
import {
  ACTIONS,
  loadAllRoadClosures,
} from '../../store/road-closure';

FocusStyleManager.onlyShowFocusOnTabs();

export interface IRoadClosureExplorerProps {
  isShowingRoadClosureOutputViewer: boolean,
  explore: boolean,
  match: any,
  setOrgName: (payload: string) => void
  loadAllRoadClosures: () => void
};

class RoadClosureExplorer extends React.Component<IRoadClosureExplorerProps, any> {
  public componentDidMount() {
    if (this.props.match.params.org) {
      Promise.resolve(this.props.setOrgName(this.props.match.params.org))
      .then(() => this.props.loadAllRoadClosures())
    }
  }

  public render() {
    return (
      <div className="SHST-Road-Closure-Explorer">
        <SharedStreetsHeader>
          <RoadClosureHeaderMenu explore={true} />
        </SharedStreetsHeader>
        <div className="SHST-Container">
          <RoadClosureSavedDataViewer />
        </div>
      </div>
    );
  }
}

export default connect<{}, {}, IRoadClosureExplorerProps>(
  (state: RootState) => ({
    isShowingRoadClosureOutputViewer: state.roadClosure.isShowingRoadClosureOutputViewer,
  }), 
  {
    loadAllRoadClosures,
    setOrgName: ACTIONS.SET_ORG_NAME,
  }
)(RoadClosureExplorer) as React.ComponentClass<{}>;