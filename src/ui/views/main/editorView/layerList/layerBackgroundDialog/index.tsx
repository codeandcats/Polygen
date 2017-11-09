import * as fs from 'fs';
import * as React from 'react';
import {
	Button, ButtonGroup, Col, ControlLabel,
	Form, FormControl, FormGroup, Modal, Thumbnail
} from 'react-bootstrap';
import * as uuid from 'uuid/v4';
import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { getWebDialogState } from '../../../../../../shared/models/dialogs';
import { ImageSource } from '../../../../../../shared/models/imageSource';
import { LayerImageSourceDialogState } from '../../../../../../shared/models/layerImageSourceDialogState';
import { Nullable } from '../../../../../../shared/models/nullable';
import { hideWebDialog } from '../../../../../actions/dialogs/hideWebDialog';
import { updateWebDialogFields } from '../../../../../actions/dialogs/updateWebDialogFields';
import { setLayerImage } from '../../../../../actions/editor/document/layer/setLayerImage';
import { ImageCache } from '../../../../../models/imageCache';
import { Store } from '../../../../../reduxWithLessSux/store';
import * as mainStyles from '../../../styles';
import * as styles from './styles';

export interface LayerBackgroundDialogProps {
	store: Store<ApplicationState>;
}

export class LayerBackgroundDialog extends React.Component<LayerBackgroundDialogProps, {}> {
	private imageCache: Nullable<ImageCache>;
	private fileInput: Nullable<HTMLInputElement>;

	private accept(event: React.FormEvent<Form> | React.MouseEvent<Button>) {
		event.preventDefault();
		const state = this.props.store.getState();
		const dialog = state.dialogs.web;

		if (!dialog || dialog.dialogType !== 'layerImageSource') {
			return;
		}

		const { imageSource, layerIndex } = dialog;

		setLayerImage(this.props.store, {
			imageSource,
			layerIndex
		});

		hideWebDialog(this.props.store);
	}

	private cancel() {
		hideWebDialog(this.props.store);
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

	private removeImage() {
		updateWebDialogFields(this.props.store, {
			imageSource: undefined
		});
	}

	public render() {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerImageSource');

		let imageSource: Nullable<ImageSource> = null;
		let isVisible: boolean = false;

		if (dialog) {
			imageSource = dialog.imageSource;
			isVisible = true;
		}

		const cachedImage = (
			this.imageCache &&
			imageSource &&
			this.imageCache.getImage(imageSource)
		);

		const removeImageButton = (
			imageSource ?
			<Button
				bsStyle='danger'
				className={ mainStyles.buttonSpaceLeft }
				onClick={ () => this.removeImage() }
			>Remove Image</Button> :
			undefined
		);

		return (
			<Modal show={ isVisible } onHide={ () => this.cancel() } >
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
							undefined
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

			updateWebDialogFields(this.props.store, {
				imageSource
			});

			this.fileInput.form.reset();
		}
	}
}
