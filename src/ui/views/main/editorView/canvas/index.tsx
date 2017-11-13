import * as KeyCode from 'key-code';
import * as React from 'react';
import { Editor } from '../../../../../shared/models/editor';
import { Nullable } from '../../../../../shared/models/nullable';
import { Point } from '../../../../../shared/models/point';
import { Rectangle } from '../../../../../shared/models/rectangle';
import { Size } from '../../../../../shared/models/size';
import { ImageCache } from '../../../../models/imageCache';
import { MouseButtons } from '../../../../models/mouseButton';
import { TOOL_BY_NAME } from '../../../../models/tools';
import { CanvasMouseButtonsState, CanvasMouseState, Tool, ToolHelper } from '../../../../models/tools/common';
import { PointTool } from '../../../../models/tools/pointTool';
import { Fps } from '../../../../utils/fps';
import { renderDocument, renderTool, renderTransparencyTiles, runInTransaction } from '../../../../utils/graphics';
import { MouseTrap } from '../../../../utils/mouseTrap';
import * as styles from './styles';

interface CanvasProps {
	width: number;
	height: number;
	editor: Editor;
	imageCache: ImageCache;

	onAddPoint: (point: Point) => void;
	onDeleteSelection: () => void;
	onMoveSelection: (moveBy: Point) => void;
	onSelectAll: () => void;
	onSelectPoints: (pointIndices: number[]) => void;
	onSetPan: (point: Point) => void;
}

interface CanvasState {
	mouse: CanvasMouseState | undefined;
	toolState: any | undefined;
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
	private canvas: Nullable<HTMLCanvasElement>;
	private canvasMouseTrap: Nullable<MouseTrap>;
	private animationFrameTimer: Nullable<number>;
	private fps = new Fps();
	private helper: ToolHelper = {
		actions: {
			addPoint: point => this.props.onAddPoint(point),
			selectPoints: pointIndices => this.props.onSelectPoints(pointIndices),
			setPan: point => this.props.onSetPan(point)
		},
		getEditor: () => this.props.editor,
		getImageCache: () => this.props.imageCache,
		getMouseCursor: () => (this.canvas && this.canvas.style.cursor) || '',
		setMouseCursor: cursor => {
			if (this.canvas && this.canvas.style.cursor !== cursor) {
				this.canvas.style.cursor = cursor;
			}
		},
		getPixelRatio: () => window.devicePixelRatio,
		getToolState: () => this.state && this.state.toolState,
		setToolState: (stateOrCallback: any | ((state: any) => any)) => {
			if (typeof stateOrCallback === 'function') {
				this.setState(state => {
					return {
						toolState: stateOrCallback(state && state.toolState)
					};
				});
			} else {
				this.setState({
					toolState: stateOrCallback
				});
			}
		},
		translation: {
			documentToViewPort: point => {
				const editor = this.props.editor;

				const documentHalfSize: Size = {
					width: editor.document.dimensions.width / 2,
					height: editor.document.dimensions.height / 2
				};

				point = {
					x: point.x * documentHalfSize.width,
					y: point.y * documentHalfSize.height
				};

				const canvasCenter: Point = {
					x: this.props.width / 2,
					y: this.props.height / 2
				};

				const result: Point = {
					x: canvasCenter.x + editor.viewPort.pan.x + (point.x * editor.viewPort.zoom),
					y: canvasCenter.y + editor.viewPort.pan.y + (point.y * editor.viewPort.zoom),
				};

				return result;
			},
			viewPortToDocument: point => {
				const editor = this.props.editor;

				const documentHalfSize: Size = {
					width: editor.document.dimensions.width / 2,
					height: editor.document.dimensions.height / 2
				};

				const canvasCenter: Point = {
					x: this.props.width / 2,
					y: this.props.height / 2
				};

				const result: Point = {
					x: ((point.x - canvasCenter.x - editor.viewPort.pan.x) / editor.viewPort.zoom) / documentHalfSize.width,
					y: ((point.y - canvasCenter.y - editor.viewPort.pan.y) / editor.viewPort.zoom) / documentHalfSize.height
				};

				return result;
			}
		}
	};

	constructor(props: CanvasProps, context: any) {
		super(props, context);
		this.state = {
			mouse: undefined,
			toolState: undefined
		};
	}

	public componentDidMount() {
		if (this.canvas) {
			this.animationFrameTimer = requestAnimationFrame(() => this.renderFrame());
		}
	}

	public componentWillUnmount() {
		this.canvas = null;
		if (this.animationFrameTimer) {
			cancelAnimationFrame(this.animationFrameTimer);
		}
	}

	public shouldComponentUpdate(nextProps: CanvasProps) {
		const willDimensionsChange = (
			this.props.width !== nextProps.width ||
			this.props.height !== nextProps.height
		);

		const currentToolName = this.props.editor && this.props.editor.selectedToolName;
		const nextToolName = nextProps.editor && nextProps.editor.selectedToolName;
		if (currentToolName !== nextToolName && !nextToolName) {
			this.helper.setMouseCursor('default');
		}

		return willDimensionsChange;
	}

	private getSelectedTool(): Tool<any> | undefined {
		if (this.props.editor.selectedToolName) {
			return TOOL_BY_NAME[this.props.editor.selectedToolName];
		}
	}

	private getMouseState(event: MouseEvent): CanvasMouseState | undefined {
		if (this.canvas) {
			const viewPortPoint = {
				x: event.offsetX,
				y: event.offsetY
			};

			const documentPoint = this.helper.translation.viewPortToDocument(viewPortPoint);

			const buttons = {
				left: event.buttons === MouseButtons.left,
				middle: event.buttons === MouseButtons.middle,
				right: event.buttons === MouseButtons.right
			};

			const result = {
				buttons,
				viewPortPoint,
				documentPoint
			};

			return result;
		}

		return undefined;
	}

	private keyDown(event: React.KeyboardEvent<HTMLCanvasElement>) {
		const SMALL_MOVE_MULTIPLIER = 1;
		const LARGE_MOVE_MULTIPLIER = 5;

		const editor = this.props.editor;

		const getMoveAmount = (direction: Point): Point => {
			const canvasMoveDistanceInPixels =
				event.shiftKey ?
				LARGE_MOVE_MULTIPLIER :
				SMALL_MOVE_MULTIPLIER;

			const documentMoveDistanceInPixels = canvasMoveDistanceInPixels * editor.viewPort.zoom;

			const amount = {
				x: direction.x * (documentMoveDistanceInPixels / (editor.document.dimensions.width / 2)),
				y: direction.y * (documentMoveDistanceInPixels / (editor.document.dimensions.height / 2))
			};

			return amount;
		};

		if (!event.altKey) {
			switch (event.keyCode) {
				case KeyCode.LEFT:
					this.props.onMoveSelection(getMoveAmount({ x: -1, y: 0 }));
					event.preventDefault();
					break;

				case KeyCode.RIGHT:
					this.props.onMoveSelection(getMoveAmount({ x: 1, y: 0 }));
					event.preventDefault();
					break;

				case KeyCode.UP:
					this.props.onMoveSelection(getMoveAmount({ x: 0, y: -1 }));
					event.preventDefault();
					break;

				case KeyCode.DOWN:
					this.props.onMoveSelection(getMoveAmount({ x: 0, y: 1 }));
					event.preventDefault();
					break;
			}
		}
	}

	private mouseDown = (event: MouseEvent): void => {
		const mouse = this.getMouseState(event);
		if (!mouse) {
			return;
		}

		this.setState({ mouse });

		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseDown(this.helper, mouse);
		}
	}

	private mouseMove = (event: MouseEvent): void => {
		const mouse = this.getMouseState(event);
		if (!mouse) {
			return;
		}

		this.setState({ mouse });

		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseMove(this.helper, mouse);
		}
	}

	private mouseUp = (event: MouseEvent): void => {
		const mouse = this.getMouseState(event);
		if (!mouse) {
			return;
		}

		this.setState({
			mouse: {
				...mouse,
				buttons: {
					left: false,
					middle: false,
					right: false
				}
			}
		});

		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseUp(this.helper, mouse);
		}
	}

	private renderFps(context: CanvasRenderingContext2D, pixelRatio: number) {
		runInTransaction(context, () => {
			context.scale(pixelRatio, pixelRatio);

			const text = `${ Math.round(this.fps.getAverage()) } FPS`;

			const fontSize = 10;
			context.font = `sans serif ${fontSize}px`;
			const height = fontSize + 6;
			const width = context.measureText(text).width + 6;

			context.fillStyle = 'rgba(0, 0, 0, .5)';
			context.fillRect(3, 3, width, height);

			context.fillStyle = '#fff';
			context.textBaseline = 'top';
			context.fillText(text, 6, 6, width);
		});
	}

	private renderFrame() {
		this.animationFrameTimer = undefined;

		if (!this.canvas) {
			return;
		}

		const editor = this.props.editor;

		this.fps.tick();

		const canvasBounds = {
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height
		};

		const context = this.canvas.getContext('2d');
		if (!context) {
			return;
		}

		runInTransaction(context, () => {
			const pixelRatio = window.devicePixelRatio;

			renderTransparencyTiles(context, canvasBounds, 20, pixelRatio);

			renderDocument(context, canvasBounds, editor, this.props.imageCache, pixelRatio);

			const tool = this.getSelectedTool();
			if (tool) {
				renderTool(context, canvasBounds, this.helper, tool);
			}

			this.renderFps(context, pixelRatio);
		});

		this.animationFrameTimer = requestAnimationFrame(() => this.renderFrame());
	}

	private setCanvasElement(canvas: HTMLCanvasElement | null) {
		if (canvas === this.canvas) {
			return;
		}

		if (this.canvasMouseTrap) {
			this.canvasMouseTrap.release();
			this.canvasMouseTrap = null;
		}

		this.canvas = canvas;

		if (this.canvas) {
			this.canvasMouseTrap = new MouseTrap(this.canvas);
			this.canvasMouseTrap.on('mousedown', this.mouseDown);
			this.canvasMouseTrap.on('mousemove', this.mouseMove);
			this.canvasMouseTrap.on('mouseup', this.mouseUp);
		}
	}

	public render() {
		const width = this.props.width * window.devicePixelRatio;
		const height = this.props.height * window.devicePixelRatio;
		const style = (
			window.devicePixelRatio === 1 ?
			undefined :
			{ width: this.props.width, height: this.props.height }
		);

		return (
			<canvas
				className={ styles.canvas }
				width={ width }
				height={ height }
				style={ style }
				onKeyDown={ event => this.keyDown(event) }
				ref={ el => this.setCanvasElement(el) }
				tabIndex={-1}
			>
			</canvas>
		);
	}
}
