import * as React from 'react';
import { Rectangle } from '../../../../../shared/models/rectangle';
import { Fps } from '../../../../utils/fps';
import { drawTransparencyTiles } from '../../../../utils/graphics';
import * as styles from './styles';

interface CanvasProps {
	width: number;
	height: number;
}

interface CanvasState {
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
	private fps = new Fps();
	private canvas: HTMLCanvasElement | null;

	public componentDidMount() {
		if (this.canvas) {
			requestAnimationFrame(() => this.renderFrame());
		}
	}

	public componentWillUnmount() {
		this.canvas = null;
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
				ref={ el => this.setCanvasElement(el) }
			>
			</canvas>
		);
	}
}
