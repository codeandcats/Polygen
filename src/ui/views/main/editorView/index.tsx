import assertNever from 'assert-never';
import * as $ from 'jquery';
import * as React from 'react';
import {
	Alert, Badge, Button, ButtonGroup, Col, ControlLabel,
	Grid, ListGroup, ListGroupItem, Panel, Row
} from 'react-bootstrap';
import { ApplicationState } from '../../../../shared/models/applicationState';
import { Nullable } from '../../../../shared/models/nullable';
import { Size } from '../../../../shared/models/size';
import { addPoint } from '../../../actions/editor/document/layer/points/addPoint';
import { moveSelectedPoints } from '../../../actions/editor/document/layer/points/moveSelectedPoints';
import { removeSelection } from '../../../actions/editor/document/layer/points/removeSelection';
import { selectAllPoints } from '../../../actions/editor/document/layer/points/selectAllPoints';
import { selectPoints } from '../../../actions/editor/document/layer/points/selectPoints';
import { updatePolygonColors } from '../../../actions/editor/document/layer/polygons/updatePolygonColors';
import { selectTool } from '../../../actions/editor/selectTool';
import { setPan } from '../../../actions/editor/setPan';
import { ImageCache } from '../../../models/imageCache';
import { Store } from '../../../reduxWithLessSux/store';
import { getCurrentBreakpointType } from '../../../utils/bootstrap';
import * as mainStyles from '../styles';
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
	private static readonly DEFAULT_CANVAS_SIZE = Object.freeze({
		width: 100,
		height: 100
	});

	private canvasContainer: Nullable<HTMLDivElement>;
	private updateCanvasSizeCount = 0;
	private windowResized = () => this.updateCanvasSize();

	private imageCache = new ImageCache();

	constructor(props: EditorViewProps, context: any) {
		super(props, context);
		this.state = {
			canvasSize: EditorView.DEFAULT_CANVAS_SIZE
		};
	}

	public componentDidMount() {
		$(window).on('resize', this.windowResized);
	}

	public componentWillUnmount() {
		$(window).off('resize', this.windowResized);
	}

	private updateCanvasSize() {
		if (!this.canvasContainer) {
			return;
		}

		const canvasSize = {
			width: window.innerWidth - styles.LAYER_LIST_WIDTH,
			height: this.canvasContainer.offsetHeight
		};

		const hasSizedChanged = (
			this.state.canvasSize.width !== canvasSize.width ||
			this.state.canvasSize.height !== canvasSize.height
		);

		if (hasSizedChanged) {
			this.setState({
				canvasSize
			});
		}
	}

	public removeSelection() {
		removeSelection(this.props.store, { imageCache: this.imageCache });
	}

	public render() {
		const { activeEditorIndex, editors } = this.props.store.getState();
		const editor = editors[activeEditorIndex];
		const layer = editor.document.layers[editor.selectedLayerIndex];

		return (
			<div className={ styles.editorContainer }>
				<div className={ styles.editorBody }>
					<div className={ styles.editorBodyMain }>
						<div className={ styles.editorBodyMainHeader }>
						<EditorToolbar
							selectedToolName={ editor.selectedToolName }
							onSelectTool={ toolName => selectTool(this.props.store, { toolName }) }
						/>
						</div>
						<div
							className={ styles.editorBodyMainCanvasContainer }
							ref={ element => this.setCanvasContainer(element) }
						>
							<Canvas
								editor={ editor }
								width={ this.state.canvasSize.width }
								height={ this.state.canvasSize.height }
								imageCache={ this.imageCache }
								onAddPoint={ point => addPoint(this.props.store, { point, imageCache: this.imageCache }) }
								onDeleteSelection={ () => removeSelection(this.props.store, { imageCache: this.imageCache }) }
								onMoveSelection={ moveBy => {
									moveSelectedPoints(this.props.store, { moveBy, imageCache: this.imageCache });
								} }
								onSelectAll={ () => selectAllPoints(this.props.store) }
								onSelectPoints={ pointIndices => selectPoints(this.props.store, { pointIndices }) }
								onSetPan={ point => setPan(this.props.store, { pan: point }) }
							/>
						</div>
					</div>
					<div className={ styles.editorBodyRight }>
						<LayerList imageCache={ this.imageCache } store={ this.props.store } />
					</div>
				</div>
				<div className={ styles.editorFooter }>
					<span className={ mainStyles.spaceRight }>Points: <Badge>{ layer.points.length }</Badge></span>
					<span>Polygons: <Badge>{ layer.polygons.length }</Badge></span>
				</div>
			</div>
		);
	}

	private setCanvasContainer(element: Nullable<HTMLDivElement>) {
		this.canvasContainer = element;

		if (this.canvasContainer) {
			this.updateCanvasSize();
		}
	}

	public updatePolygonColors() {
		updatePolygonColors(this.props.store, {
			imageCache: this.imageCache
		});
	}
}
