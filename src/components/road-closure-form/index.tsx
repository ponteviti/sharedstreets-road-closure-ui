import {
  Button,
  ButtonGroup,
  Card,
  // Classes,
  FormGroup,
  InputGroup,
  Popover,
  Position,
  // Spinner,
  // Radio,
  // RadioGroup,
} from '@blueprintjs/core';
import {
  DateRangePicker,
  TimePrecision,
} from '@blueprintjs/datetime';
// import {
//   getType
// } from '@turf/invariant';
import {
  // forEach,
  // difference,
  // forOwn,
  isEmpty,
} from 'lodash';
import * as React from 'react';
// import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
// import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import { RoadClosureStateItem } from 'src/models/RoadClosureStateItem';
import { IRoadClosureState } from 'src/store/road-closure';
import RoadClosureBottomActionBar from '../road-closure-bottom-action-bar';
// import RoadClosureFormStreetsTable from '../road-closure-form-streets-table';
import RoadClosureFormStreetsGroups from '../road-closure-form-streets-groups';

import '../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../../../node_modules/normalize.css/normalize.css'
import './road-closure-form.css';


export interface IRoadClosureFormProps {
  addNewSelection: () => void,
  deleteStreetSegment: (payload: any) => void,
  deselectRoadClosure: () => void,
  nextSelection: () => void,
  previousSelection: () => void,
  inputChanged: (payload: any) => void,
  roadClosure: IRoadClosureState,
  currentRoadClosureItem: RoadClosureStateItem,
  streetnameToReferenceId: any,
  toggleStreetSegmentDirection: () => void,
  viewRoadClosureOutput: () => void,
};
class RoadClosureForm extends React.Component<IRoadClosureFormProps, any> {
  constructor(props: IRoadClosureFormProps) {
    super(props);
    this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeReference = this.handleChangeReference.bind(this);
    this.handleChangeSubtype = this.handleChangeSubtype.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleStreetMouseover = this.handleStreetMouseover.bind(this);
    this.renderDateButtonText = this.renderDateButtonText.bind(this);
    this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
  }

  public handleDeleteStreetSegment(e: any) {
    this.props.deleteStreetSegment(e.target.parentElement.parentElement.id);
    return;
  }

  public handleChangeStreetName(e: any): any {
    this.props.inputChanged({
      key: 'street',
      // referenceId: this.props.streetnameToReferenceId[e.target.id],
      referenceId: e.target.id,
      street: e.target.value,
    });
  }

  public handleChangeDescription(e: any) {
    this.props.inputChanged({
      description: e.target.value,
      key: 'description',
    });
  }

  public handleChangeReference(e: any) {
    this.props.inputChanged({
      key: 'reference',
      reference: e.target.value
    });
  }

  public handleChangeSubtype(e: any) {
    if (e.target.value === this.props.currentRoadClosureItem.form.subtype) {
      this.props.inputChanged({
        key: 'subtype',
        subtype: null
      });
    } else {      
      this.props.inputChanged({
        key: 'subtype',
        subtype: e.target.value
      });
    }
  }

  public handleChangeTime(e: [Date | undefined, Date | undefined]) {
    this.props.inputChanged({
      key: 'startTime',
      startTime: e[0],
    });
    this.props.inputChanged({
      endTime: e[1],
      key: 'endTime',
    })
  }

  public handleStreetMouseover(e: any) {
    return;
  }

  public handleSave() {
    this.props.deselectRoadClosure();
  }

  public renderDateButtonText() {
    let output = "Click to pick start and end time";
    if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.form.startTime && this.props.currentRoadClosureItem.form.endTime) {
      output = this.props.currentRoadClosureItem.form.startTime + " - " + this.props.currentRoadClosureItem.form.endTime;
    } else if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.form.startTime) {
      output = this.props.currentRoadClosureItem.form.startTime + " - " + "?"
    } else if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.form.endTime) {
      output = "?" + " - " + this.props.currentRoadClosureItem.form.endTime;
    }
    return output;
  }

  public renderEmptyMatchedStreetsTable() {
    return <div className="SHST-Matched-Streets-Table-Empty bp3-non-ideal-state">
      <div className="bp3-non-ideal-state-visual">
        <span className="bp3-icon bp3-icon-arrow-right" />
      </div>
      <h4 className="bp3-heading">No streets selected</h4>
      <div>To start entering a road closure, click two (or more) points along the length of the affected street(s).</div>
    </div>;
  }

  public render() {
    // const currentSelectionIndex = this.props.roadClosure.currentSelectionIndex;
    const currentMatchedStreets = this.props.currentRoadClosureItem.matchedStreets;

    return (
        <div
          className="SHST-Road-Closure-Form"
        >
            <Card>
              {
                isEmpty(this.props.currentRoadClosureItem.form.street) ?
                this.renderEmptyMatchedStreetsTable() :
                <RoadClosureFormStreetsGroups
                  currentMatchedStreetsFeatures={currentMatchedStreets.features}
                  currentMatchedStreetsGroups={currentMatchedStreets.contiguousFeatureGroups}
                  currentMatchedStreetsGroupsGeometryIdPathMap={currentMatchedStreets.geometryIdPathMap}
                  currentMatchedStreetsGroupsDirections={currentMatchedStreets.contiguousFeatureGroupsDirections}
                  geometryIdDirectionFilter={this.props.currentRoadClosureItem.geometryIdDirectionFilter}
                  deleteStreetSegment={this.props.deleteStreetSegment}
                  inputChanged={this.props.inputChanged}
                  toggleStreetSegmentDirection={this.props.toggleStreetSegmentDirection}
                  streets={this.props.currentRoadClosureItem.form.street}
                />
              }
            </Card>
            <FormGroup
              label="Start and end time"
              labelInfo="(required)"  
            >
              <Popover
                content={              
                  <DateRangePicker
                    shortcuts={false}
                    timePrecision={TimePrecision.MINUTE}
                    onChange={this.handleChangeTime}
                  />
                }
                position={Position.BOTTOM}>
                <Button text={this.renderDateButtonText()} />
              </Popover>
            </FormGroup>
            <FormGroup
              label="Description"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  placeholder={"Enter a description here..."}
                  onChange={this.handleChangeDescription}
                  value={this.props.currentRoadClosureItem.form.description}
              />
            </FormGroup>
            <FormGroup
              label="Reference"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  placeholder={"Enter a organization reference name here..."}
                  onChange={this.handleChangeReference}
                  value={this.props.currentRoadClosureItem.form.reference}
              />
            </FormGroup>
            <FormGroup
              label="Sub Type"
              labelInfo={"(optional)"}>
              <div className="bp3-select">
                <select
                  value={this.props.currentRoadClosureItem.form.subtype}
                  onChange={this.handleChangeSubtype}>
                  <option defaultChecked={true} value={''}>Choose a subtype...</option>
                  <option value="ROAD_CLOSED_HAZARD">ROAD_CLOSED_HAZARD</option>
                  <option value="ROAD_CLOSED_CONSTRUCTION">ROAD_CLOSED_CONSTRUCTION</option>
                  <option value="ROAD_CLOSED_EVENT">ROAD_CLOSED_EVENT</option>
                </select>
              </div>
            </FormGroup>
            <RoadClosureBottomActionBar>
                <ButtonGroup
                  fill={true}
                >
                  <Button
                    large={true}
                    text={"View Output"}
                    intent={"success"}
                    onClick={this.props.viewRoadClosureOutput}
                  />
                </ButtonGroup>
              </RoadClosureBottomActionBar>
        </div>
    );
  }
}

export default RoadClosureForm;
