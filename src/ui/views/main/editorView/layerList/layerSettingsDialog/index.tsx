import * as classNames from 'classnames';
import * as React from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Modal,
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

const DEFAULT_THRESHOLD_VALUE = 0.5;

export class LayerSettingsDialog extends React.Component<
  LayerSettingsDialogProps,
  {}
> {
  private accept(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    if (!dialog) {
      return;
    }

    setLayerSettings(this.props.store, {
      layerIndex: dialog.layerIndex,
      opacityThreshold: dialog.thresholds.opacity.enabled
        ? dialog.thresholds.opacity.value
        : undefined,
      transparencyThreshold: dialog.thresholds.transparency.enabled
        ? dialog.thresholds.transparency.value
        : undefined,
    });

    updatePolygonColors(this.props.store, {
      imageCache: this.props.imageCache,
    });

    hideWebDialog(this.props.store);
  }

  private cancel() {
    hideWebDialog(this.props.store);
  }

  private getThresholdFieldState(fieldName: LayerThresholdFieldName) {
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    if (!dialog) {
      return {
        enabled: false,
        value: DEFAULT_THRESHOLD_VALUE,
      };
    }

    return {
      ...dialog.thresholds[fieldName],
    };
  }

  private isTransparencyThresholdGreaterThanOpacityThreshold() {
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
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
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    if (!dialog) {
      return false;
    }

    return (
      !this.isTransparencyThresholdGreaterThanOpacityThreshold() &&
      (!dialog.thresholds.opacity.enabled ||
        !isNaN(dialog.thresholds.opacity.value)) &&
      (!dialog.thresholds.transparency.enabled ||
        !isNaN(dialog.thresholds.transparency.value))
    );
  }

  private updateThresholdField(
    fieldName: LayerThresholdFieldName,
    event: React.FormEvent<FormControl>
  ) {
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    if (!dialog) {
      return;
    }

    const threshold = {
      ...dialog.thresholds[fieldName],
      value:
        clamp(
          0,
          100,
          Math.round((event.target as HTMLInputElement).valueAsNumber)
        ) / 100,
    };

    updateWebDialogFields(this.props.store, {
      thresholds: {
        ...dialog.thresholds,
        [fieldName]: threshold,
      },
    });
  }

  private updateThresholdFieldEnabled(
    fieldName: LayerThresholdFieldName,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    if (!dialog) {
      return;
    }

    const threshold = {
      ...dialog.thresholds[fieldName],
      enabled: (event.target as HTMLInputElement).checked,
    };

    updateWebDialogFields(this.props.store, {
      thresholds: {
        ...dialog.thresholds,
        [fieldName]: threshold,
      },
    });
  }

  public render() {
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    const isVisible = !!dialog;

    return (
      <Modal onHide={() => this.cancel()} show={isVisible}>
        <Modal.Header>
          <h2>Layer settings</h2>
        </Modal.Header>
        <Modal.Body>
          <Form
            className={styles.settingsForm}
            inline
            onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
              this.accept(event)
            }
            validated={false}
          >
            {this.renderThresholdField(
              'transparency',
              'Any polygon with an opacity value less than this ' +
                'value will be rendered completely transparent'
            )}
            {this.renderThresholdField(
              'opacity',
              'Any polygon with an opacity value greater than or equal ' +
                'to this value will be rendered completely opaque'
            )}
            {this.renderThresholdValidationMessage()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!this.isValid()}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              this.accept(event)
            }
          >
            OK
          </Button>
          <Button onClick={() => this.cancel()}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  private renderThresholdField(
    fieldName: LayerThresholdFieldName,
    helpText: string
  ) {
    const dialog = getWebDialogState(
      this.props.store.getState(),
      'layerSettings'
    );
    if (!dialog) {
      return undefined;
    }

    const checkboxName = `${fieldName}-checkbox`;
    const inputName = `${fieldName}-input`;
    const threshold = dialog.thresholds[fieldName];
    const isEnabled = threshold.enabled;
    const value = threshold.value;

    return (
      <FormGroup
        className={classNames(mainStyles.spaceBelow, 'col-12')}
        controlId={checkboxName}
      >
        <Form.Check
          checked={isEnabled}
          type="checkbox"
          label={titleCase(fieldName) + ' Threshold'}
          className={classNames('col-6', styles.checkbox)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            this.updateThresholdFieldEnabled(fieldName, event)
          }
        />
        <InputGroup className="col-6">
          <FormControl
            id={inputName}
            disabled={!isEnabled}
            min={0}
            max={100}
            onChange={(event: React.FormEvent<any>) =>
              this.updateThresholdField(fieldName, event)
            }
            type="number"
            value={
              isNaN(value) ? '' : `${clamp(0, 100, Math.round(value * 100))}`
            }
          />
          <InputGroup.Append>
            <InputGroup.Text>%</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <Form.Text className="text-muted">{helpText}</Form.Text>
      </FormGroup>
    );
  }

  private renderThresholdValidationMessage() {
    if (this.isTransparencyThresholdGreaterThanOpacityThreshold()) {
      return (
        <Form.Group>
          <Col xs={12}>
            <Form.Text className="text-danger">
              Transparency threshold cannot be greater than opacity threshold
            </Form.Text>
          </Col>
        </Form.Group>
      );
    }

    return undefined;
  }
}
