import Frame = require('canvas-to-buffer');
import { remote, SaveDialogOptions } from 'electron';
import * as fs from 'fs-extra';
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
import {
  ExportFileFormat,
  ExportFileFormats,
} from '../../../../shared/models/exportFileFormat';
import { FloatPercent } from '../../../../shared/models/floatPercent';
import { PolygenDocument } from '../../../../shared/models/polygenDocument';
import { Size } from '../../../../shared/models/size';
import { clamp } from '../../../../shared/utils/math';
import { hideWebDialog } from '../../../actions/dialogs/hideWebDialog';
import { hideNativeDialog } from '../../../actions/dialogs/nativeDialogDidHide';
import { showNativeDialog } from '../../../actions/dialogs/showNativeDialog';
import { updateWebDialogFields } from '../../../actions/dialogs/updateWebDialogFields';
import { ImageCache } from '../../../models/imageCache';
import { Store } from '../../../reduxWithLessSux/store';
import store from '../../../store';
import { renderDocument, RenderDocumentOptions } from '../../../utils/graphics';

interface ExportDialogProps {
  imageCache: ImageCache;
  store: Store<ApplicationState>;
}

interface ExportDialogState {}

interface RenderDocumentToFileOptions {
  dimensions: Size;
  document: PolygenDocument;
  fileName: string;
  format: ExportFileFormat;
  imageCache: ImageCache;
  quality: FloatPercent;
}

function calculateZoomToFit(canvasSize: Size, documentSize: Size) {
  const documentAspectRatio = !documentSize.height
    ? 0
    : documentSize.width / documentSize.height;
  const canvasAspectRatio = !canvasSize.height
    ? 0
    : canvasSize.width / canvasSize.height;
  const result =
    canvasAspectRatio > documentAspectRatio
      ? canvasSize.height / documentSize.height
      : canvasSize.width / documentSize.width;
  return result;
}

async function renderDocumentToFile(
  options: RenderDocumentToFileOptions
): Promise<void> {
  const width = options.dimensions.width;
  const height = options.dimensions.height;

  const largeCanvas = document.createElement('canvas');
  largeCanvas.setAttribute('width', '' + width * 2);
  largeCanvas.setAttribute('height', '' + height * 2);
  const largeContext = largeCanvas.getContext('2d');

  const finalCanvas = document.createElement('canvas');
  finalCanvas.setAttribute('width', '' + width);
  finalCanvas.setAttribute('height', '' + height);
  const finalContext = finalCanvas.getContext('2d');

  if (!largeContext || !finalContext) {
    throw new Error('Could not get context for canvas');
  }

  renderDocument({
    bounds: {
      x: 0,
      y: 0,
      ...options.dimensions,
    },
    context: largeContext,
    document: options.document,
    imageCache: options.imageCache,
    mode: 'final',
    pixelRatio: 1,
    selectedLayerIndex: -1,
    selectedPointIndices: [],
    shouldRenderPoints: false,
    shouldRenderEdges: false,
    viewPort: {
      pan: {
        x: 0,
        y: 0,
      },
      zoom: calculateZoomToFit(options.dimensions, options.document.dimensions),
    },
  });

  if (!largeContext) {
    throw new Error('Could not get context for canvas');
  }

  // finalContext.drawImage(largeCanvas, 0, 0, width * 2, height * 2, 0, 0, width, height);
  finalContext.drawImage(largeCanvas, 0, 0, width * 2, height * 2);

  const frame = new Frame(finalCanvas, {
    image: { types: [options.format] },
    quality: options.quality,
  });

  const buffer = frame.toBuffer();

  await fs.writeFile(options.fileName, buffer);
}

export class ExportDialog extends React.Component<
  ExportDialogProps,
  ExportDialogState
> {
  private async accept(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    event.preventDefault();

    const state = this.props.store.getState();
    const dialog = state.dialogs.web;

    if (!dialog || dialog.dialogType !== 'export') {
      return;
    }

    const width = this.getDimensionValueIfValid('width');
    const height = this.getDimensionValueIfValid('height');
    const { format, quality } = dialog;

    if (width && height) {
      const dimensions = { width, height };
      const { document } = state.editors[state.activeEditorIndex];

      const fileName = await this.promptUserForImageFileName();

      if (!fileName) {
        return;
      }

      await renderDocumentToFile({
        dimensions: {
          width,
          height,
        },
        document,
        fileName,
        format,
        imageCache: this.props.imageCache,
        quality,
      });

      hideWebDialog(this.props.store);
    }
  }

  private async promptUserForImageFileName(): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve) => {
      const window = remote.getCurrentWindow();
      const options: SaveDialogOptions = {
        filters: [
          {
            extensions: ['png'],
            name: 'Png image files',
          },
          {
            extensions: ['jpeg'],
            name: 'Jpeg image files',
          },
        ],
      };
      showNativeDialog(this.props.store, { type: 'save' });
      remote.dialog.showSaveDialog(window, options, (fileName) =>
        resolve(fileName)
      );
    }).then(
      (fileName) => {
        hideNativeDialog(this.props.store);
        return fileName;
      },
      () => {
        hideNativeDialog(this.props.store);
        return undefined;
      }
    );
  }

  private cancel() {
    hideWebDialog(this.props.store);
  }

  private getDimensionValueIfValid(dimension: keyof Size): number | undefined {
    const state = this.props.store.getState();
    const dialog = state.dialogs.web;
    if (!dialog || dialog.dialogType !== 'export') {
      return undefined;
    }

    const value = dialog.dimensions[dimension];

    if ((typeof value === 'string' && value === '') || value == null) {
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
    if (!dialog || dialog.dialogType !== 'export') {
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

    if (!dialog || dialog.dialogType !== 'export') {
      return undefined;
    }

    return (
      <FormGroup>
        <Col sm="2" as={Form.Label}>
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

  private setFormat(event: React.FormEvent<FormControl>) {
    const format = (event.target as HTMLInputElement).value as ExportFileFormat;
    updateWebDialogFields(this.props.store, { format });
  }

  private setQuality(event: React.FormEvent<FormControl>) {
    let quality = parseFloat(
      '' + ((event.target as HTMLInputElement).value || '')
    );
    quality = Math.round(quality);
    quality = clamp(1, 100, quality);
    quality /= 100;
    updateWebDialogFields(this.props.store, { quality });
  }

  public render() {
    const state = this.props.store.getState();
    const dialog = state.dialogs.web;
    const isVisible = !!dialog && dialog.dialogType === 'export';
    const isWidthValid = !!this.getDimensionValueIfValid('width');
    const isHeightValid = !!this.getDimensionValueIfValid('height');
    const isSubmitEnabled = isWidthValid && isHeightValid;
    const format: ExportFileFormat =
      (dialog && dialog.dialogType === 'export' && dialog.format) || 'png';
    const quality =
      (dialog && dialog.dialogType === 'export' && dialog.quality) || 0;

    return (
      <Modal show={isVisible} onHide={() => this.cancel()}>
        <Modal.Header>
          <h2>Export image</h2>
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

            <FormGroup>
              <Col as={Form.Label} sm={2}>
                Format
              </Col>
              <Col sm={10}>
                <FormControl
                  as="select"
                  value={format}
                  onChange={(event: React.FormEvent<FormControl>) =>
                    this.setFormat(event)
                  }
                >
                  {ExportFileFormats.map((value) => (
                    <option key={value} value={value}>
                      {value.toUpperCase()}
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col sm={2} as={Form.Label}>
                Quality
              </Col>
              <Col sm={10}>
                <FormControl
                  type="number"
                  value={`${Math.round(quality * 100)}`}
                  min={0}
                  max={100}
                  onChange={(event: React.FormEvent<FormControl>) =>
                    this.setQuality(event)
                  }
                ></FormControl>
              </Col>
            </FormGroup>
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
