import * as classNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Layer } from '../../../../../shared/models/layer';
import * as mainStyles from '../../styles';
import * as styles from './styles';

interface LayerListItemProps {
  isSelected: boolean;
  layerIndex: number;
  layers: Layer[];
  onMoveLayer: (layer: Layer, toIndex: number) => void;
  onRemoveLayer: (layer: Layer) => void;
  onSelectLayer: (layer: Layer) => void;
  onSetLayerVisibility: (layer: Layer, isVisible: boolean) => void;
  onShowRenameLayerDialog: (layerIndex: number) => void;
  onShowLayerBackgroundDialog: (layerIndex: number) => void;
  onShowLayerSettingsDialog: (layerIndex: number) => void;
}

interface LayerListItemState {}

export class LayerListItem extends React.Component<
  LayerListItemProps,
  LayerListItemState
> {
  public render() {
    const { isSelected, layerIndex, layers } = this.props;
    const layer = layers[layerIndex];
    const canRemoveLayer = layers.length > 1;
    const canMoveLayerDown = layerIndex > 0;
    const canMoveLayerUp = layerIndex < layers.length - 1;
    const layerItemClassNames = classNames(styles.layerListItem, {
      [styles.layerListItemInvisible]: !layer.isVisible,
    });
    const buttonStyle = isSelected ? 'primary' : undefined;

    return (
      <li className={layerItemClassNames}>
        <ButtonGroup>
          <Button
            variant={buttonStyle}
            className={styles.layerNameButton}
            onClick={() => this.props.onSelectLayer(layer)}
            onDoubleClick={() =>
              this.props.onShowRenameLayerDialog(this.props.layerIndex)
            }
          >
            {layer.name}
          </Button>

          <OverlayTrigger
            overlay={
              <Tooltip id="toggleLayerVisibilityTooltip">
                {layer.isVisible ? 'Hide layer' : 'Show layer'}
              </Tooltip>
            }
            placement="top"
          >
            <Button
              variant={buttonStyle}
              className={classNames(
                mainStyles.iconButton,
                styles.layerVisibilityButton
              )}
              onClick={() =>
                this.props.onSetLayerVisibility(layer, !layer.isVisible)
              }
            >
              <i
                className={
                  'fa ' + (layer.isVisible ? 'fa-eye' : 'fa-eye-slash')
                }
              />
            </Button>
          </OverlayTrigger>

          <DropdownButton
            variant={buttonStyle}
            className={styles.layerActionsButton}
            title=""
            id={`layer${layerIndex}DropDownButton`}
          >
            <Dropdown.Item
              eventKey="1"
              disabled={!canMoveLayerUp}
              onClick={() => this.props.onMoveLayer(layer, layerIndex + 1)}
            >
              <i
                className={classNames('fa fa-arrow-up', mainStyles.spaceRight)}
              />
              Move up
            </Dropdown.Item>

            <Dropdown.Item
              eventKey="2"
              disabled={!canMoveLayerDown}
              onClick={() => this.props.onMoveLayer(layer, layerIndex - 1)}
            >
              <i
                className={classNames(
                  'fa fa-arrow-down',
                  mainStyles.spaceRight
                )}
              />
              Move down
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              eventKey="3"
              onClick={() =>
                this.props.onShowRenameLayerDialog(this.props.layerIndex)
              }
            >
              <i className={classNames('fa fa-tag', mainStyles.spaceRight)} />
              Rename
            </Dropdown.Item>

            <Dropdown.Item
              eventKey="3"
              onClick={() =>
                this.props.onShowLayerBackgroundDialog(this.props.layerIndex)
              }
            >
              <i
                className={classNames('fa fa-picture-o', mainStyles.spaceRight)}
              />
              Set background image
            </Dropdown.Item>

            <Dropdown.Item
              eventKey="4"
              onClick={() =>
                this.props.onShowLayerSettingsDialog(this.props.layerIndex)
              }
            >
              <i className={classNames('fa fa-cog', mainStyles.spaceRight)} />
              Settings
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              eventKey="5"
              disabled={!canRemoveLayer}
              onClick={() => this.props.onRemoveLayer(layer)}
            >
              <i className={classNames('fa fa-times', mainStyles.spaceRight)} />
              Remove
            </Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
      </li>
    );
  }
}
