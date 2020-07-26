import * as classNames from 'classnames';
import * as React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { ImageSource } from '../../../../../shared/models/imageSource';
import { LayerImageSourceDialogState } from '../../../../../shared/models/layerImageSourceDialogState';
import {
  DEFAULT_LAYER_THRESHOLD_SETTING_VALUE,
  LayerSettingsDialogState,
} from '../../../../../shared/models/layerSettingsDialogState';
import { Nullable } from '../../../../../shared/models/nullable';
import { RenameLayerDialogState } from '../../../../../shared/models/renameLayerDialogState';
import { showWebDialog } from '../../../../actions/dialogs/showWebDialog';
import { moveLayer } from '../../../../actions/editor/document/layer/moveLayer';
import { removeLayer } from '../../../../actions/editor/document/layer/removeLayer';
import { selectLayer } from '../../../../actions/editor/document/layer/selectLayer';
import { setLayerVisibility } from '../../../../actions/editor/document/layer/setLayerVisibility';
import { addLayer } from '../../../../actions/editor/document/layers/addLayer';
import { duplicateLayer } from '../../../../actions/editor/document/layers/duplicateLayer';
import { ImageCache } from '../../../../models/imageCache';
import { Store } from '../../../../reduxWithLessSux/store';
import * as mainStyles from '../../styles';
import { LayerBackgroundDialog } from './layerBackgroundDialog/index';
import { LayerListItem } from './layerListItem';
import { LayerSettingsDialog } from './layerSettingsDialog/index';
import { RenameLayerDialog } from './renameLayerDialog/index';
import * as styles from './styles';

interface LayerListProps {
  store: Store<ApplicationState>;
  imageCache: ImageCache;
}

export class LayerList extends React.Component<LayerListProps, {}> {
  public render() {
    const { activeEditorIndex, editors } = this.props.store.getState();
    const editor = editors[activeEditorIndex];
    const images = editor.document.images;
    const layersWithIndices = editor.document.layers
      .map((layer, index) => ({
        layer,
        index,
      }))
      .sort((a, b) => b.index - a.index);

    return (
      <div className={styles.layerList}>
        <div className={styles.layerListHeader}>
          <label className={classNames('control-label', mainStyles.spaceRight)}>
            Layers
          </label>
          <OverlayTrigger
            overlay={<Tooltip id="addLayerTooltip">Add layer</Tooltip>}
            placement="bottom"
          >
            <Button
              size="sm"
              className={classNames(
                styles.addLayerButton,
                mainStyles.iconButton
              )}
              onClick={() => addLayer(this.props.store)}
            >
              <i className="fa fa-plus" />
            </Button>
          </OverlayTrigger>
        </div>
        <ul>
          {layersWithIndices.map((layerWithIndex) => (
            <LayerListItem
              key={layerWithIndex.index}
              isSelected={layerWithIndex.index === editor.selectedLayerIndex}
              layerIndex={layerWithIndex.index}
              layers={editor.document.layers}
              onSelectLayer={() =>
                selectLayer(this.props.store, {
                  layerIndex: layerWithIndex.index,
                })
              }
              onMoveLayer={(_, toIndex) =>
                moveLayer(this.props.store, {
                  layerIndex: layerWithIndex.index,
                  toIndex,
                })
              }
              onSetLayerVisibility={() =>
                setLayerVisibility(this.props.store, {
                  layerIndex: layerWithIndex.index,
                  isVisible: !layerWithIndex.layer.isVisible,
                })
              }
              onShowRenameLayerDialog={() =>
                this.showRenameLayerDialog(
                  layerWithIndex.index,
                  layerWithIndex.layer.name
                )
              }
              onDuplicateLayer={() =>
                duplicateLayer(this.props.store, {
                  layerIndex: layerWithIndex.index,
                })
              }
              onShowLayerBackgroundDialog={() =>
                this.showLayerImageSourceDialog(
                  layerWithIndex.index,
                  images.find(
                    (image) => image.id === layerWithIndex.layer.image.imageId
                  )
                )
              }
              onShowLayerSettingsDialog={() => {
                this.showLayerSettingsDialog(
                  layerWithIndex.index,
                  layerWithIndex.layer.transparencyThreshold,
                  layerWithIndex.layer.opacityThreshold
                );
              }}
              onRemoveLayer={() =>
                removeLayer(this.props.store, {
                  layerIndex: layerWithIndex.index,
                })
              }
            />
          ))}
        </ul>
        <RenameLayerDialog store={this.props.store} />
        <LayerBackgroundDialog store={this.props.store} />
        <LayerSettingsDialog
          imageCache={this.props.imageCache}
          store={this.props.store}
        />
      </div>
    );
  }

  private showLayerSettingsDialog(
    layerIndex: number,
    transparencyThreshold: Nullable<number>,
    opacityThreshold: Nullable<number>
  ) {
    const dialog: LayerSettingsDialogState = {
      dialogType: 'layerSettings',
      layerIndex,
      thresholds: {
        transparency: {
          enabled: typeof transparencyThreshold === 'number',
          value:
            typeof transparencyThreshold === 'number'
              ? transparencyThreshold
              : DEFAULT_LAYER_THRESHOLD_SETTING_VALUE,
        },
        opacity: {
          enabled: typeof opacityThreshold === 'number',
          value:
            typeof opacityThreshold === 'number'
              ? opacityThreshold
              : DEFAULT_LAYER_THRESHOLD_SETTING_VALUE,
        },
      },
    };

    showWebDialog(this.props.store, {
      dialog,
    });
  }

  private showLayerImageSourceDialog(
    layerIndex: number,
    imageSource: Nullable<ImageSource>
  ) {
    const dialog: LayerImageSourceDialogState = {
      dialogType: 'layerImageSource',
      layerIndex,
      imageSource,
    };

    showWebDialog(this.props.store, {
      dialog,
    });
  }

  private showRenameLayerDialog(layerIndex: number, layerName: string) {
    const dialog: RenameLayerDialogState = {
      dialogType: 'renameLayer',
      layerIndex,
      layerName,
    };

    showWebDialog(this.props.store, {
      dialog,
    });
  }
}
