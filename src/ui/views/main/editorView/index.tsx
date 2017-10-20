import * as React from 'react';
import {
	Alert, Badge, Button, ButtonGroup, Col, ControlLabel,
	Grid, ListGroup, ListGroupItem, Panel, Row
} from 'react-bootstrap';
import { ApplicationState } from '../../../../shared/models/applicationState';
import { Store } from '../../../reduxWithLessSux/store';
import { Canvas } from './canvas/index';
import { EditorToolbar } from './editorToolbar';
import { LayerList } from './layerList';
import * as styles from './styles';

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
			<div className={ styles.editorView }>
				<div className={ styles.bodyRow }>
					<div className={ styles.bodyCell }>
						<Grid>
							<Row>
								<Col xs={8} sm={9}>
									<Row>
										<Col xs={12}>
											<EditorToolbar />
										</Col>
									</Row>
									<Row>
										<Col xs={12}>
											<Canvas />
										</Col>
									</Row>
								</Col>
								<Col xs={4} sm={3}>
									<LayerList store={this.props.store} />
								</Col>
							</Row>
						</Grid>
					</div>
				</div>
				<div className={ styles.footerRow }>
					<div className={ styles.footerCell }>
						<Grid>
							<Panel>
								Points <Badge>{ layer.points.length }</Badge>
							</Panel>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}
