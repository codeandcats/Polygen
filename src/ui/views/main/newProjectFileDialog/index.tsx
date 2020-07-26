import * as React from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  Modal,
} from 'react-bootstrap';
import titleCase = require('titlecase');
import { ApplicationState } from '../../../../shared/models/applicationState';
import { Size } from '../../../../shared/models/size';
import { hideWebDialog } from '../../../actions/dialogs/hideWebDialog';
import { updateWebDialogFields } from '../../../actions/dialogs/updateWebDialogFields';
import { openNewProjectFile } from '../../../actions/editor/openNewProjectFile';
import { Store } from '../../../reduxWithLessSux/store';

export interface NewProjectFileDialogProps {
  store: Store<ApplicationState>;
}

export interface NewProjectFileDialogState {}

export class NewProjectFileDialog extends React.Component<
  NewProjectFileDialogProps,
  NewProjectFileDialogState
> {
  private accept(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    const width = this.getDimensionValueIfValid('width');
    const height = this.getDimensionValueIfValid('height');

    if (width && height) {
      const dimensions = { width, height };
      openNewProjectFile(this.props.store, { dimensions });
      hideWebDialog(this.props.store);
    }
  }

  private cancel() {
    hideWebDialog(this.props.store);
  }

  private getDimensionValueIfValid(dimension: keyof Size): number | undefined {
    const state = this.props.store.getState();
    const dialog = state.dialogs.web;
    if (!dialog || dialog.dialogType !== 'newProjectFile') {
      return undefined;
    }

    const value = dialog.dimensions[dimension];

    if (value === '' || value == null) {
      return undefined;
    }

    const numericValue = +value;
    if (isNaN(numericValue) || numericValue < 1) {
      return undefined;
    }

    return numericValue;
  }

  private setDimension(
    dimension: keyof Size,
    event: React.FormEvent<FormControl>
  ) {
    const state = this.props.store.getState();
    const dialog = state.dialogs.web;
    if (!dialog || dialog.dialogType !== 'newProjectFile') {
      return;
    }

    const { value } = event.target as HTMLInputElement;
    updateWebDialogFields(this.props.store, {
      dimensions: {
        ...dialog.dimensions,
        [dimension]: value,
      },
    });
  }

  private getDimensionControl(dimension: keyof Size) {
    const state = this.props.store.getState();
    const dialog = state.dialogs.web;

    if (!dialog || dialog.dialogType !== 'newProjectFile') {
      return undefined;
    }

    return (
      <FormGroup>
        <Col sm={2} as={Form.Label}>
          {titleCase(dimension)}
        </Col>
        <Col sm={10}>
          <FormControl
            type="number"
            className="text-right"
            value={`${dialog.dimensions[dimension] || 0}`}
            onChange={(event: React.FormEvent<FormControl>) =>
              this.setDimension(dimension, event)
            }
            min="1"
            style={{ maxWidth: 150 }}
          />
        </Col>
      </FormGroup>
    );
  }

  public render() {
    const state = this.props.store.getState();
    const isVisible =
      !!state.dialogs.web && state.dialogs.web.dialogType === 'newProjectFile';
    const isWidthValid = !!this.getDimensionValueIfValid('width');
    const isHeightValid = !!this.getDimensionValueIfValid('height');
    const isSubmitEnabled = isWidthValid && isHeightValid;

    return (
      <Modal show={isVisible} onHide={() => this.cancel()}>
        <Modal.Header>
          <h2>Create new file</h2>
        </Modal.Header>
        <Modal.Body>
          <Form
            inline
            onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
              this.accept(event)
            }
          >
            {this.getDimensionControl('width')}
            {this.getDimensionControl('height')}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              this.accept(event)
            }
            disabled={!isSubmitEnabled}
          >
            OK
          </Button>
          <Button onClick={() => this.cancel()}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
