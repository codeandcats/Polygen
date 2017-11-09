import deepEqual = require('deep-equal');
import * as React from 'react';
import {
	Button, Checkbox, Col, ControlLabel, Form, FormControl,
	FormGroup, HelpBlock, InputGroup, Modal
} from 'react-bootstrap';
import titleCase = require('titlecase');
import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { getWebDialogState } from '../../../../../../shared/models/dialogs';
import { Nullable } from '../../../../../../shared/models/nullable';
import { clamp } from '../../../../../../shared/utils/math';
import { tuple } from '../../../../../../shared/utils/tuple';
import { hideWebDialog } from '../../../../../actions/dialogs/hideWebDialog';
import { updateWebDialogFields } from '../../../../../actions/dialogs/updateWebDialogFields';
import { updatePolygonColors } from '../../../../../actions/editor/document/layer/polygons/updatePolygonColors';
import { setLayerSettings } from '../../../../../actions/editor/document/layer/setLayerSettings';
import { ImageCache } from '../../../../../models/imageCache';
import { Store } from '../../../../../reduxWithLessSux/store';
import * as mainStyles from '../../../styles';
import * as styles from './styles';

const LAYER_THRESHOLD_FIELD_NAMES = tuple('opacity', 'transparency');

type LayerThresholdFieldName = typeof LAYER_THRESHOLD_FIELD_NAMES[number];

interface LayerSettingsDialogProps {
	store: Store<ApplicationState>;
	imageCache: ImageCache;
}

const DEFAULT_THRESHOLD_VALUE = .5;

export class LayerSettingsDialog extends React.Component<LayerSettingsDialogProps, {}> {
	private accept(event: React.FormEvent<Form>) {
		event.preventDefault();

		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return;
		}

		setLayerSettings(this.props.store, {
			layerIndex: dialog.layerIndex,
			opacityThreshold: (
				dialog.thresholds.opacity.enabled ?
				dialog.thresholds.opacity.value :
				undefined
			),
			transparencyThreshold: (
				dialog.thresholds.transparency.enabled ?
				dialog.thresholds.transparency.value :
				undefined
			)
		});

		updatePolygonColors(this.props.store, {
			imageCache: this.props.imageCache
		});

		hideWebDialog(this.props.store);
	}

	private cancel() {
		hideWebDialog(this.props.store);
	}

	private getThresholdFieldState(fieldName: LayerThresholdFieldName) {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return {
				enabled: false,
				value: DEFAULT_THRESHOLD_VALUE
			};
		}

		return {
			...dialog.thresholds[fieldName]
		};
	}

	private isTransparencyThresholdGreaterThanOpacityThreshold() {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return false;
		}

		return (
			dialog.thresholds.opacity.enabled &&
			dialog.thresholds.transparency.enabled &&
			dialog.thresholds.transparency.value > dialog.thresholds.opacity.value
		);
	}

	private isValid() {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return false;
		}

		return (
			!this.isTransparencyThresholdGreaterThanOpacityThreshold() &&
			(!dialog.thresholds.opacity.enabled || !isNaN(dialog.thresholds.opacity.value)) &&
			(!dialog.thresholds.transparency.enabled || !isNaN(dialog.thresholds.transparency.value))
		);
	}

	private updateThresholdField(fieldName: LayerThresholdFieldName, event: React.FormEvent<FormControl>) {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return;
		}

		const threshold = {
			...dialog.thresholds[fieldName],
			value: clamp(0, 100, Math.round((event.target as HTMLInputElement).valueAsNumber)) / 100
		};

		updateWebDialogFields(this.props.store, {
			thresholds: {
				...dialog.thresholds,
				[fieldName]: threshold
			}
		});
	}

	private updateThresholdFieldEnabled(fieldName: LayerThresholdFieldName, event: React.FormEvent<Checkbox>) {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return;
		}

		const threshold = {
			...dialog.thresholds[fieldName],
			enabled: (event.target as HTMLInputElement).checked
		};

		updateWebDialogFields(this.props.store, {
			thresholds: {
				...dialog.thresholds,
				[fieldName]: threshold
			}
		});
	}

	public render() {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		const isVisible = !!dialog;

		return (
			<Modal onHide={ () => this.cancel() } show={ isVisible }>
				<Modal.Header>
					<h2>Layer settings</h2>
				</Modal.Header>
				<Modal.Body>
					<Form className={ styles.settingsForm } horizontal onSubmit={ event => this.accept(event) }>
						{
							this.renderThresholdField(
								'transparency',
								'Any polygon with an opacity value less than this ' +
								'value will be rendered completely transparent'
							)
						}
						{
							this.renderThresholdField(
								'opacity',
								'Any polygon with an opacity value greater than or equal ' +
								'to this value will be rendered completely opaque'
							)
						}
						{ this.renderThresholdValidationMessage() }
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						bsStyle='primary'
						disabled={ !this.isValid() }
						onClick={ event => this.accept(event) }
					>OK</Button>
					<Button onClick={ () => this.cancel() }>Cancel</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	private renderThresholdField(fieldName: LayerThresholdFieldName, helpText: string) {
		const dialog = getWebDialogState(this.props.store.getState(), 'layerSettings');
		if (!dialog) {
			return undefined;
		}

		const threshold = dialog.thresholds[fieldName];
		const isEnabled = threshold.enabled;
		const value = threshold.value;

		return (
			<FormGroup className={ mainStyles.spaceBelow }>
				<Checkbox
					className='icon-space-right col-xs-4 col-xs-offset-1'
					checked={ isEnabled }
					inline
					onChange={ event => this.updateThresholdFieldEnabled(fieldName, event) }
				>{ titleCase(fieldName) } Threshold</Checkbox>
				<InputGroup className='col-sm-3'>
					<FormControl
						disabled={ !isEnabled }
						min={ 0 }
						max={ 100 }
						onChange={ event => this.updateThresholdField(fieldName, event) }
						type='number'
						value={ isNaN(value) ? '' : clamp(0, 100, Math.round((value * 100))) }
					/>
					<InputGroup.Addon>%</InputGroup.Addon>
				</InputGroup>
				<Col xs={ 10 } xsOffset={ 1 }>
					<HelpBlock>{ helpText }</HelpBlock>
				</Col>
			</FormGroup>
		);
	}

	private renderThresholdValidationMessage() {
		if (this.isTransparencyThresholdGreaterThanOpacityThreshold()) {
			return (
				<FormGroup validationState='error'>
					<Col xs={ 10 } xsOffset={ 1 }>
						<HelpBlock>Transparency threshold cannot be greater than opacity threshold</HelpBlock>
					</Col>
				</FormGroup>
			);
		}

		return undefined;
	}
}
