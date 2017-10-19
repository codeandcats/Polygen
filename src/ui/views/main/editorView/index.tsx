import * as React from 'react';
import {
	Alert, Badge, Button, ButtonGroup, Col, ControlLabel,
	Grid, ListGroup, ListGroupItem, Panel, Row
} from 'react-bootstrap';
import { ApplicationState } from '../../../../shared/models/applicationState';
import { Store } from '../../../reduxWithLessSux/store';
import { LayerList } from './layerList';

export interface EditorViewProps {
	store: Store<ApplicationState>;
}

export interface EditorViewState {
}

export class EditorView extends React.Component<EditorViewProps, EditorViewState> {
	public render() {
		const { activeEditorIndex, editors } = this.props.store.getState();
		const editor = editors[activeEditorIndex];
		const layer = editor.projectFile.layers[editor.selectedLayerIndex];

		return (
			<div style={ { display: 'table', width: '100%', height: '100%', position: 'absolute' } }>
				<div style={ { display: 'table-row' } }>
					<div style={ { display: 'table-cell' } }>
						<Grid>
							<Row>
								<Col xs={12}>
									<ControlLabel style={ { marginRight: 10 } }>Tools</ControlLabel>
									<ButtonGroup>
										<Button>Add Point</Button>
										<Button>Delete Selection</Button>
									</ButtonGroup>
								</Col>
							</Row>
							<Row>
								<Col xs={8} sm={9}>
									<div style={ { background: 'yellow', width: '100%', height: 400 } }>
									</div>
								</Col>
								<Col xs={4} sm={3}>
									<LayerList store={this.props.store} />
								</Col>
							</Row>
						</Grid>
					</div>
				</div>
				<div style={ { display: 'table-row' } }>
					<div style={ { display: 'table-cell', height: 70 } }>
						<Grid>
							<Panel style={ { marginBottom: 0 } }>
								Points <Badge>{ layer.points.length }</Badge>
							</Panel>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}
