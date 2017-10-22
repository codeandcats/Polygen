import * as React from 'react';
import { Editor } from '../../../../../shared/models/editor';
import { Point } from '../../../../../shared/models/point';
import { Rectangle } from '../../../../../shared/models/rectangle';
import { TOOL_BY_NAME } from '../../../../models/tools';
import { Tool, ToolHelper } from '../../../../models/tools/common';
import { PointTool } from '../../../../models/tools/pointTool';
import { Fps } from '../../../../utils/fps';
import { drawProjectFile, drawTransparencyTiles } from '../../../../utils/graphics';
import * as styles from './styles';

interface CanvasProps {
	width: number;
	height: number;
	editor: Editor;

	onAddPoint: (point: Point) => void;
}

interface CanvasState {
	toolState: any;
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
	private fps = new Fps();
	private canvas: HTMLCanvasElement | null;
	private helper: ToolHelper = {
		addPoint: point => this.props.onAddPoint(point),
		getEditor: () => this.props.editor,
		getMouseCursor: () => (this.canvas && this.canvas.style.cursor) || '',
		setMouseCursor: cursor => {
			if (this.canvas && this.canvas.style.cursor !== cursor) {
				this.canvas.style.cursor = cursor;
			}
		},
		getToolState: () => this.state.toolState,
		setToolState: (toolState: any) => {
			this.setState({
				toolState
			});
		}
	};

	constructor(props: CanvasProps, context: any) {
		super(props, context);
	}

	public componentDidMount() {
		if (this.canvas) {
			requestAnimationFrame(() => this.renderFrame());
		}
	}

	public componentWillUnmount() {
		this.canvas = null;
	}

	private getSelectedTool(): Tool<any> | undefined {
		if (this.props.editor.selectedToolName) {
			return TOOL_BY_NAME[this.props.editor.selectedToolName];
		}
	}

	private mouseDown(event: React.MouseEvent<HTMLCanvasElement>): void {
		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseDown(this.helper, event);
		}
	}

	private mouseMove(event: React.MouseEvent<HTMLCanvasElement>): void {
		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseDown(this.helper, event);
		}
	}

	private mouseUp(event: React.MouseEvent<HTMLCanvasElement>): void {
		const tool = this.getSelectedTool();
		if (tool) {
			tool.mouseDown(this.helper, event);
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
		if (!this.canvas) {
			return;
		}

		const editor = this.props.editor;

		this.fps.tick();

		const rect = {
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height
		};

		const context = this.canvas.getContext('2d');
		if (!context) {
			return;
		}

		drawTransparencyTiles(context, rect, 10);

		drawProjectFile(context, rect, editor);

		this.renderFps(context);

		requestAnimationFrame(() => this.renderFrame());
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
			>
			</canvas>
		);
	}
}
