import * as React from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { hideWebDialog } from '../../../../../actions/dialogs/hideWebDialog';
import { updateWebDialogFields } from '../../../../../actions/dialogs/updateWebDialogFields';
import { renameLayer } from '../../../../../actions/editor/document/layer/renameLayer';
import { Store } from '../../../../../reduxWithLessSux/store';

interface RenameLayerDialogProps {
  store: Store<ApplicationState>;
}

export class RenameLayerDialog extends React.Component<
  RenameLayerDialogProps,
  {}
> {
  private static LAYER_NAME_INPUT_ID = 'renameLayerDialog_LayerName';

  private accept(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    const state = this.props.store.getState();
    const web = state.dialogs.web;

    if (!web || web.dialogType !== 'renameLayer') {
      return;
    }

    const { layerIndex, layerName } = web;

    renameLayer(this.props.store, {
      layerIndex,
      layerName,
    });
    hideWebDialog(this.props.store);
  }

  private cancel() {
    hideWebDialog(this.props.store);
  }

  private focusLayerName() {
    const element = document.getElementById(
      RenameLayerDialog.LAYER_NAME_INPUT_ID
    );
    if (element) {
      element.focus();
    }
  }

  public render() {
    const state = this.props.store.getState();
    const dialog = state.dialogs.web;

    let isVisible: boolean;
    let layerName: string;
    let layerIndex: number;

    if (dialog && dialog.dialogType === 'renameLayer') {
      isVisible = true;
      layerIndex = dialog.layerIndex;
      layerName = dialog.layerName;
    } else {
      isVisible = false;
      layerIndex = -1;
      layerName = '';
    }

    const isValid = !!layerName.trim();

    return (
      <Modal
        autoFocus={true}
        onHide={() => this.cancel()}
        // onShow={() => this.focusLayerName()}
        show={isVisible}
      >
        <Modal.Header>
          <h2>Rename layer</h2>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
              this.accept(event)
            }
          >
            <Form.Label>Layer name</Form.Label>
            <FormControl
              id={RenameLayerDialog.LAYER_NAME_INPUT_ID}
              onChange={(event: React.FormEvent<any>) =>
                this.updateLayerName(event)
              }
              value={layerName}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              this.accept(event)
            }
            disabled={!isValid}
          >
            OK
          </Button>
          <Button onClick={() => this.cancel()}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  private updateLayerName(event: React.FormEvent<FormControl>) {
    event.preventDefault();
    const layerName = (event.target as HTMLInputElement).value;
    updateWebDialogFields(this.props.store, {
      layerName,
    });
  }
}
