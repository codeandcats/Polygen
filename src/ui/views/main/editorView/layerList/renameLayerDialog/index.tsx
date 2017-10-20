import * as React from 'react';
import { Button, ControlLabel, Form, FormControl, Modal } from 'react-bootstrap';

interface RenameLayerDialogProps {
	layerName: string;
	isVisible: boolean;
	onAccept: (layerName: string) => void;
	onCancel: () => void;
}

interface RenameLayerDialogState {
	layerName: string;
}

export class RenameLayerDialog extends React.Component<RenameLayerDialogProps, RenameLayerDialogState> {
	private static LAYER_NAME_INPUT_ID = 'renameLayerDialog_LayerName';

	public componentWillReceiveProps(props: RenameLayerDialogProps) {
		this.setState({
			layerName: props.layerName || ''
		});
	}

	private setFocusToInput() {
		const input = document.getElementById(RenameLayerDialog.LAYER_NAME_INPUT_ID);
		if (input) {
			input.focus();
		}
	}

	private accept(event: React.FormEvent<Form> | React.MouseEvent<Button>) {
		event.preventDefault();

		if (!this.state.layerName) {
			return;
		}

		this.props.onAccept(this.state.layerName);
	}

	private cancel() {
		this.props.onCancel();
	}

	public render() {
		const layerName = (this.state && this.state.layerName || '') + '';
		const isValid = !!layerName.trim();

		return (
			<Modal show={ this.props.isVisible } onHide={ () => this.props.onCancel() } >
				<Modal.Header>
					<h2>Rename layer</h2>
				</Modal.Header>
				<Modal.Body>
					<Form horizontal onSubmit={ event => this.accept(event) }>
						<ControlLabel>Layer name</ControlLabel>
						<FormControl
							id={ RenameLayerDialog.LAYER_NAME_INPUT_ID }
							ref={ () => this.setFocusToInput() }
							value={ layerName }
							onChange={ event => this.setState({ layerName: (event.target as HTMLInputElement).value }) }
						/>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle='primary' onClick={ event => this.accept(event) } disabled={ !isValid }>OK</Button>
					<Button onClick={ () => this.cancel() }>Cancel</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
