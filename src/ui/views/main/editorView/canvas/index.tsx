import * as React from 'react';
import { Editor } from '../../../../../shared/models/editor';
import { Point } from '../../../../../shared/models/point';
import { Rectangle } from '../../../../../shared/models/rectangle';
import { MouseButton } from '../../../../models/mouseButton';
import { TOOL_BY_NAME } from '../../../../models/tools';
import { CanvasMouseEvent, CanvasMouseEventButtons, Tool, ToolHelper } from '../../../../models/tools/common';
import { PointTool } from '../../../../models/tools/pointTool';
import { Fps } from '../../../../utils/fps';
import { renderProjectFile, renderTool, renderTransparencyTiles } from '../../../../utils/graphics';
import * as styles from './styles';

interface CanvasProps {
	width: number;
	height: number;
	editor: Editor;

	onAddPoint: (point: Point) => void;
	onSetPan: (point: Point) => void;
}

interface CanvasMouseButtonsState {
	left: boolean;
	middle: boolean;
	right: boolean;
}

interface CanvasMouseState {
	buttons: CanvasMouseButtonsState;
	projectFilePoint: Point;
	viewPortPoint: Point;
}

interface CanvasState {
	mouse: CanvasMouseState | undefined;
	toolState: any | undefined;
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
	private canvas: HTMLCanvasElement | null;
	private animationFrameTimer: number | undefined;
	private fps = new Fps();
	private helper: ToolHelper = {
		actions: {
			addPoint: point => this.props.onAddPoint(point),
			setPan: point => this.props.onSetPan(point)
		},
		getEditor: () => this.props.editor,
		getMouseCursor: () => (this.canvas && this.canvas.style.cursor) || '',
		setMouseCursor: cursor => {
			if (this.canvas && this.canvas.style.cursor !== cursor) {
				this.canvas.style.cursor = cursor;
			}
		},
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
			projectFileToViewPort: point => {
				const editor = this.props.editor;

				const halfCanvasWidth = this.props.width / 2;
				const halfCanvasHeight = this.props.height / 2;

				const result: Point = {
					x: halfCanvasWidth + editor.viewPort.pan.x + (point.x * editor.viewPort.zoom),
					y: halfCanvasHeight + editor.viewPort.pan.y + (point.y * editor.viewPort.zoom),
				};

				return result;
			},
			viewPortToProjectFile: point => {
				const halfCanvasWidth = this.props.width / 2;
				const halfCanvasHeight = this.props.height / 2;

				const editor = this.props.editor;

				const result: Point = {
					x: (point.x - halfCanvasWidth - editor.viewPort.pan.x) / editor.viewPort.zoom,
					y: (point.y - halfCanvasHeight - editor.viewPort.pan.y) / editor.viewPort.zoom
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
		return willDimensionsChange;
	}

	private getSelectedTool(): Tool<any> | undefined {
		if (this.props.editor.selectedToolName) {
			return TOOL_BY_NAME[this.props.editor.selectedToolName];
		}
	}

	private getMouseState(
		event: React.MouseEvent<HTMLCanvasElement>,
		shouldCaptureButtons: boolean
	): CanvasMouseState | undefined {
		if (this.canvas) {
			const $canvas = $(this.canvas);
			const offset = $canvas.offset();
			if (offset) {
				const WIERD_LEFT_OFFSET = 1;

				const viewPortPoint = {
					x: event.clientX - offset.left - WIERD_LEFT_OFFSET,
					y: event.clientY - offset.top
				};

				const projectFilePoint = this.helper.translation
					.viewPortToProjectFile(viewPortPoint);

				const existingStateButtons: CanvasMouseButtonsState | undefined = (
					(this.state.mouse || {} as Partial<CanvasMouseState>).buttons
				);

				const buttons = shouldCaptureButtons ? {
					left: event.button === MouseButton.left,
					middle: event.button === MouseButton.middle,
					right: event.button === MouseButton.right
				} : existingStateButtons || {
					left: false,
					middle: false,
					right: false
				};

				return {
					buttons,
					viewPortPoint,
					projectFilePoint
				};
			}
		}

		return undefined;
	}

	private mouseDown(event: React.MouseEvent<HTMLCanvasElement>): void {
		const mouse = this.getMouseState(event, true);
		if (!mouse) {
			return;
		}

		this.setState({ mouse });

		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseDown(this.helper, mouse);
		}
	}

	private mouseMove(event: React.MouseEvent<HTMLCanvasElement>): void {
		const mouse = this.getMouseState(event, false);
		if (!mouse) {
			return;
		}

		this.setState({ mouse });

		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseMove(this.helper, mouse);
		}
	}

	private mouseUp(event: React.MouseEvent<HTMLCanvasElement>): void {
		const mouse = this.getMouseState(event, true);
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

	private renderFps(context: CanvasRenderingContext2D) {
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

		renderTransparencyTiles(context, canvasBounds, 10);

		renderProjectFile(context, canvasBounds, editor);

		const tool = this.getSelectedTool();
		if (tool) {
			renderTool(context, canvasBounds, this.helper, tool);
		}

		this.renderFps(context);

		this.animationFrameTimer = requestAnimationFrame(() => this.renderFrame());
	}

	private setCanvasElement(canvas: HTMLCanvasElement | null) {
		this.canvas = canvas;
	}

	public render() {
		return (
			<canvas
				className={styles.canvas}
				width={ this.props.width }
				height={ this.props.height }
				onMouseDown={ event => this.mouseDown(event) }
				onMouseMove={ event => this.mouseMove(event) }
				onMouseUp={ event => this.mouseUp(event) }
				ref={ el => this.setCanvasElement(el) }
				tabIndex={-1}
			>
			</canvas>
		);
	}
}
