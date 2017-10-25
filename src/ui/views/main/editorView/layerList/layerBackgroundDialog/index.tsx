import * as fs from 'fs';
import * as React from 'react';
import {
	Button, ButtonGroup, Col, ControlLabel,
	Form, FormControl, FormGroup, Modal, Thumbnail
} from 'react-bootstrap';
import * as uuid from 'uuid/v4';
import { ImageSource } from '../../../../../../shared/models/imageSource';
import { Nullable } from '../../../../../../shared/models/nullable';
import { ImageCache } from '../../../../../models/imageCache';
import * as mainStyles from '../../../styles';
import * as styles from './styles';

export interface LayerBackgroundDialogProps {
	imageSource: Nullable<ImageSource>;
	isVisible: boolean;
	onAccept: (imageSource: Nullable<ImageSource>) => void;
	onCancel: () => void;
}

export interface LayerBackgroundDialogState {
	imageSource: Nullable<ImageSource>;
}

export class LayerBackgroundDialog extends React.Component<LayerBackgroundDialogProps, LayerBackgroundDialogState> {
	private imageCache: Nullable<ImageCache>;
	private fileInput: Nullable<HTMLInputElement>;

	constructor(props: LayerBackgroundDialogProps, context?: any) {
		super(props, context);
		this.state = {
			imageSource: props.imageSource
		};
	}

	private accept(event: React.FormEvent<Form> | React.MouseEvent<Button>) {
		event.preventDefault();
		this.props.onAccept(this.state.imageSource);
	}

	private cancel() {
		this.props.onCancel();
	}

	public componentWillMount() {
		this.imageCache = new ImageCache();
	}

	public componentWillUnmount() {
		if (this.imageCache) {
			this.imageCache.clear();
			this.imageCache = undefined;
		}
	}

	public componentWillReceiveProps(nextProps: LayerBackgroundDialogProps) {
		const { imageSource } = nextProps;
		this.setState({
			imageSource
		});
	}

	private removeImage() {
		this.setState({
			imageSource: undefined
		});
	}

	public render() {
		const cachedImage = (
			this.imageCache &&
			this.state.imageSource &&
			this.imageCache.getImage(this.state.imageSource)
		);

		const removeImageButton = (
			this.state.imageSource ?
			<Button
				bsStyle='danger'
				className={ mainStyles.buttonSpaceLeft }
				onClick={ () => this.removeImage() }
			>Remove Image</Button> :
			null
		);

		return (
			<Modal show={ this.props.isVisible } onHide={ () => this.props.onCancel() } >
				<Modal.Header>
					<h2>Layer background image</h2>
				</Modal.Header>
				<Modal.Body>
					<Form
						className={ styles.layerBackgroundImageForm }
						encType='multipart/form-data'
						onSubmit={ event => this.accept(event) }
					>
						<FormGroup className='text-center'>
							<Button onClick={ () => this.showFilePicker() }>Select Image</Button>
							{ removeImageButton }
							<div style={ { width: 0, height: 0, overflow: 'hidden' } }>
								<input
									accept='image/*'
									onChange={ () => this.updateImage() }
									ref={ el => this.fileInput = el }
									type='file'
								/>
							</div>
						</FormGroup>
						{
							cachedImage ?
							<FormGroup className='text-center'>
								<Thumbnail
									alt='Image preview'
									href='#'
									src={ cachedImage.objectUrl }
								/>
							</FormGroup> :
							null
						}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle='primary' onClick={ event => this.accept(event) }>OK</Button>
					<Button onClick={ () => this.cancel() }>Cancel</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	private showFilePicker() {
		if (this.fileInput) {
			this.fileInput.click();
		}
	}

	private updateImage() {
		if (this.fileInput && this.fileInput.files && this.fileInput.files.length === 1) {
			const file = this.fileInput.files[0] as File & { path: string };

			const buffer = fs.readFileSync(file.path, null);

			const imageSource: ImageSource = {
				id: uuid(),
				data: buffer.toString('base64')
			};

			this.setState({
				imageSource
			});

			this.fileInput.form.reset();
		}
	}
}
