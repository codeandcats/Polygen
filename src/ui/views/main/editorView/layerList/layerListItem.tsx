import * as classNames from 'classnames';
import * as React from 'react';
import {
	Button, ButtonGroup, ControlLabel, DropdownButton,
	ListGroup, ListGroupItem, MenuItem, Panel
} from 'react-bootstrap';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Editor } from '../../../../../shared/models/editor';
import { Layer } from '../../../../../shared/models/layer';
import * as styles from './styles';

interface LayerListItemProps {
	isSelected: boolean;
	layerIndex: number;
	layers: Layer[];
	onMoveLayer: (layer: Layer, toIndex: number) => void;
	onRemoveLayer: (layer: Layer) => void;
	onSelectLayer: (layer: Layer) => void;
	onSetLayerVisibility: (layer: Layer, isVisible: boolean) => void;
}

interface LayerListItemState {
}

export class LayerListItem extends React.Component<LayerListItemProps, LayerListItemState> {
	public render() {
		const { isSelected, layerIndex, layers } = this.props;
		const layer = layers[layerIndex];
		const canRemoveLayer = layers.length > 1;
		const canMoveLayerDown = layerIndex < layers.length - 1;
		const canMoveLayerUp = layerIndex > 0;
		const layerItemClassNames = classNames(
			styles.layerListItem,
			{
				[styles.layerListItemInvisible]: !layer.isVisible
			}
		);

		return (
			<li className={ layerItemClassNames }>
				<ButtonGroup>
					<Button
						bsStyle={ isSelected ? 'primary' : 'default' }
						onClick={ () => this.props.onSelectLayer(layer) }
					>{ layer.name }</Button>

					<Button
						bsStyle={ isSelected ? 'primary' : 'default' }
						onClick={ () => this.props.onSetLayerVisibility(layer, !layer.isVisible) }
					>
						<i className={ 'fa ' + (layer.isVisible ? 'fa-eye' : 'fa-eye-slash') } />
					</Button>

					<DropdownButton
						bsStyle={ isSelected ? 'primary' : 'default' }
						title=''
						pullRight
						id={`layer${ layerIndex }DropDownButton`}
					>
						<MenuItem
							eventKey='1'
							disabled={ !canMoveLayerUp }
							onClick={ () => this.props.onMoveLayer(layer, layerIndex - 1) }
						>
							<i className='fa fa-arrow-up icon-space-right' />
							Move up
						</MenuItem>

						<MenuItem
							eventKey='2'
							disabled={ !canMoveLayerDown }
							onClick={ () => this.props.onMoveLayer(layer, layerIndex + 1) }
						>
							<i className='fa fa-arrow-down icon-space-right' />
							Move down
						</MenuItem>

						<MenuItem divider />

						<MenuItem eventKey='3' disabled={ !canRemoveLayer } onClick={ () => this.props.onRemoveLayer(layer) }>
							<i className='fa fa-times icon-space-right' />
							Remove
						</MenuItem>
					</DropdownButton>
				</ButtonGroup>
			</li>
		);
	}
}
