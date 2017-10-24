import assertNever from 'assert-never';
import * as $ from 'jquery';
import * as React from 'react';
import {
	Alert, Badge, Button, ButtonGroup, Col, ControlLabel,
	Grid, ListGroup, ListGroupItem, Panel, Row
} from 'react-bootstrap';
import { ApplicationState } from '../../../../shared/models/applicationState';
import { Size } from '../../../../shared/models/size';
import { addPoint } from '../../../actions/editor/projectFile/layer/points/addPoint';
import { selectPoints } from '../../../actions/editor/projectFile/layer/points/selectPoints';
import { selectTool } from '../../../actions/editor/selectTool';
import { setPan } from '../../../actions/editor/setPan';
import { Store } from '../../../reduxWithLessSux/store';
import { getCurrentBreakpointType } from '../../../utils/bootstrap';
import { Canvas } from './canvas/index';
import { EditorToolbar } from './editorToolbar';
import { LayerList } from './layerList';
import * as styles from './styles';

export interface EditorViewProps {
	store: Store<ApplicationState>;
}

export interface EditorViewState {
	canvasSize: Size;
}

export class EditorView extends React.Component<EditorViewProps, EditorViewState> {
	private static EDITOR_BODY_ROW_ID = 'editorBodyRow';
	private static EDITOR_CONTAINER_COLUMN_ID = 'editorContainerColumn';

	private updateCanvasSizeCount = 0;
	private windowResized = () => {
		this.updateCanvasSize();
	}

	constructor(props: EditorViewProps, context: any) {
		super(props, context);
		this.state = {
			canvasSize: {
				width: 100,
				height: 100
			}
		};
	}

	public componentDidMount() {
		$(window).on('resize', this.windowResized);
	}

	public componentWillUnmount() {
		$(window).off('resize', this.windowResized);
	}

	private getCanvasSize() {
		let canvasLength: number | undefined;

		const editorContainerColumn = $('#' + EditorView.EDITOR_CONTAINER_COLUMN_ID);
		if (editorContainerColumn.length) {
			canvasLength = editorContainerColumn.width();
		}

		if (!canvasLength) {
			const breakpointType = getCurrentBreakpointType();
			switch (breakpointType) {
				case 'xs':
					canvasLength = 400;
					break;

				case 'sm':
					canvasLength = 532;
					break;

				case 'md':
				case 'lg':
					canvasLength = 720;
					break;

				// case 'lg':
				// 	canvasLength = 870;
				// 	break;

				default:
					return assertNever(breakpointType);
			}
		}

		canvasLength = Math.ceil(canvasLength);

		return {
			width: canvasLength,
			height: canvasLength
		};
	}

	private updateCanvasSize() {
		const canvasSize = this.getCanvasSize();

		if (
			this.state.canvasSize.width !== canvasSize.width ||
			this.state.canvasSize.height !== canvasSize.height
		) {
			this.setState({
				canvasSize
			});
		}
	}

	public render() {
		const { activeEditorIndex, editors } = this.props.store.getState();
		const editor = editors[activeEditorIndex];
		const layer = editor.projectFile.layers[editor.selectedLayerIndex];

		return (
			<div className={ styles.editorView }>
				<div className={ styles.bodyRow }>
					<div
						className={ styles.bodyCell }
						id={ EditorView.EDITOR_BODY_ROW_ID }
						ref={ () => this.updateCanvasSize() }
					>
						<Grid fluid>
							<Row>
								<Col xs={8} sm={9}>
									<Row>
										<Col xs={12}>
											<EditorToolbar
												selectedToolName={ editor.selectedToolName }
												onSelectTool={ toolName => selectTool(this.props.store, { toolName }) }
											/>
										</Col>
									</Row>
									<Row>
										<Col xs={12} id={ EditorView.EDITOR_CONTAINER_COLUMN_ID } ref={ () => this.updateCanvasSize() }>
											<Canvas
												editor={ editor }
												width={ this.state.canvasSize.width }
												height={ this.state.canvasSize.height }
												onAddPoint={ point => addPoint(this.props.store, {
													editorIndex: activeEditorIndex,
													layerIndex: editor.selectedLayerIndex,
													point
												}) }
												onSelectPoints={ pointIndices => selectPoints(this.props.store, { pointIndices }) }
												onSetPan={ point => setPan(this.props.store, { pan: point }) }
											/>
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
						<Grid fluid>
							<Panel>
								Points: { layer.points.length }
							</Panel>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}
