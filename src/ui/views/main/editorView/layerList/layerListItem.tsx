import * as classNames from 'classnames';
import * as React from 'react';
import {
	Button, ButtonGroup, ControlLabel, DropdownButton,
	ListGroup, ListGroupItem, MenuItem, Panel
} from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Editor } from '../../../../../shared/models/editor';
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

interface LayerListItemState {
}

export class LayerListItem extends React.Component<LayerListItemProps, LayerListItemState> {
	public render() {
		const { isSelected, layerIndex, layers } = this.props;
		const layer = layers[layerIndex];
		const canRemoveLayer = layers.length > 1;
		const canMoveLayerDown = layerIndex > 0;
		const canMoveLayerUp = layerIndex < layers.length - 1;
		const layerItemClassNames = classNames(
			styles.layerListItem,
			{
				[styles.layerListItemInvisible]: !layer.isVisible
			}
		);
		const buttonStyle = isSelected ? 'primary' : 'default';

		return (
			<li className={ layerItemClassNames }>
				<ButtonGroup>
					<Button
						bsStyle={ buttonStyle }
						onClick={ () => this.props.onSelectLayer(layer) }
						onDoubleClick={ () => this.props.onShowRenameLayerDialog(this.props.layerIndex) }
					>{ layer.name }</Button>

					<OverlayTrigger
						overlay={ <Tooltip id='toggleLayerVisibilityTooltip'>{ layer.isVisible ? 'Hide layer' : 'Show layer' }</Tooltip> }
						placement='top'
					>
						<Button
							bsStyle={ buttonStyle }
							className={ mainStyles.iconButton }
							onClick={ () => this.props.onSetLayerVisibility(layer, !layer.isVisible) }
						>
							<i className={ 'fa ' + (layer.isVisible ? 'fa-eye' : 'fa-eye-slash') } />
						</Button>
					</OverlayTrigger>

					<DropdownButton
						bsStyle={ buttonStyle }
						title=''
						pullRight
						id={`layer${ layerIndex }DropDownButton`}
					>
						<MenuItem
							eventKey='1'
							disabled={ !canMoveLayerUp }
							onClick={ () => this.props.onMoveLayer(layer, layerIndex + 1) }
						>
							<i className={ classNames('fa fa-arrow-up', mainStyles.spaceRight) } />
							Move up
						</MenuItem>

						<MenuItem
							eventKey='2'
							disabled={ !canMoveLayerDown }
							onClick={ () => this.props.onMoveLayer(layer, layerIndex - 1) }
						>
							<i className={ classNames('fa fa-arrow-down', mainStyles.spaceRight) } />
							Move down
						</MenuItem>

						<MenuItem divider />

						<MenuItem
							eventKey='3'
							onClick={ () => this.props.onShowRenameLayerDialog(this.props.layerIndex) }
						>
							<i className={ classNames('fa fa-tag', mainStyles.spaceRight) } />
							Rename
						</MenuItem>

						<MenuItem
							eventKey='3'
							onClick={ () => this.props.onShowLayerBackgroundDialog(this.props.layerIndex) }
						>
							<i className={ classNames('fa fa-picture-o', mainStyles.spaceRight) } />
							Set background image
						</MenuItem>

						<MenuItem
							eventKey='4'
							onClick={ () => this.props.onShowLayerSettingsDialog(this.props.layerIndex) }
						>
							<i className={ classNames('fa fa-cog', mainStyles.spaceRight) } />
							Settings
						</MenuItem>

						<MenuItem divider />

						<MenuItem eventKey='5' disabled={ !canRemoveLayer } onClick={ () => this.props.onRemoveLayer(layer) }>
							<i className={ classNames('fa fa-times', mainStyles.spaceRight) } />
							Remove
						</MenuItem>
					</DropdownButton>
				</ButtonGroup>
			</li>
		);
	}
}
