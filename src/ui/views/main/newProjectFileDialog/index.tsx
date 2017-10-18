import * as React from 'react';
import { Button, ButtonGroup, Col, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';
import { Size } from '../../../../shared/models/size';

export interface NewProjectFileDialogProps {
	defaultSize: Size;
	isVisible: boolean;
	onAccept: (size: Size) => void;
	onCancel: () => void;
}

export interface NewProjectFileDialogState {
	fields: { [k in keyof Size]: string | number | undefined | null };
}

export class NewProjectFileDialog extends React.Component<NewProjectFileDialogProps, NewProjectFileDialogState> {
	constructor(props: NewProjectFileDialogProps, context?: any) {
		super(props, context);
		this.state = {
			fields: { ...props.defaultSize }
		};
	}

	private accept() {
		const width = this.getDimensionValueIfValid('width');
		const height = this.getDimensionValueIfValid('height');

		console.log({ width, height });

		if (width && height) {
			this.props.onAccept({ width, height });
		}
	}

	private cancel() {
		this.props.onCancel();
	}

	private getDimensionValueIfValid(dimension: keyof Size): number | undefined {
		const value = this.state.fields[dimension];

		if (value === '' || value == null) {
			return undefined;
		}

		const numericValue = +value;
		if (isNaN(numericValue) || numericValue < 1) {
			return undefined;
		}

		return numericValue;
	}

	private setDimension(dimension: keyof Size, event: React.FormEvent<FormControl>) {
		const { value } = (event.target as HTMLInputElement);
		this.setState(previousState => ({
			fields: {
				...previousState.fields,
				[dimension]: value
			}
		}));
	}

	private getDimensionControl(dimension: keyof Size) {
		return (
			<FormGroup>
				<Col sm={2} componentClass={ControlLabel}>{ dimension[0].toUpperCase() + dimension.substr(1) }</Col>
				<Col sm={10}>
					<FormControl
						type='number'
						className='text-right'
						value={ this.state.fields[dimension] || 0 }
						onChange={ event => this.setDimension(dimension, event) }
						min='1'
						style={ { maxWidth: 150 } }
					/>
				</Col>
			</FormGroup>
		);
	}

	public render() {
		const isWidthValid = !!this.getDimensionValueIfValid('width');
		const isHeightValid = !!this.getDimensionValueIfValid('height');
		const isSubmitEnabled = isWidthValid && isHeightValid;

		return (
			<Modal show={ this.props.isVisible } onHide={ () => this.props.onCancel() } >
				<Modal.Header>
					<h2>Create new file</h2>
				</Modal.Header>
				<Modal.Body>
					<Form horizontal onSubmit={ () => this.accept() }>
						{ this.getDimensionControl('width') }
						{ this.getDimensionControl('height') }
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle='primary' onClick={ () => this.accept() } disabled={ !isSubmitEnabled }>OK</Button>
					<Button onClick={ () => this.cancel() }>Cancel</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
