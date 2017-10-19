import * as classNames from 'classnames';
import * as React from 'react';
import {
	Button, ButtonGroup, ControlLabel, DropdownButton,
	ListGroup, ListGroupItem, MenuItem, Panel
} from 'react-bootstrap';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Editor } from '../../../../../shared/models/editor';
import { Layer } from '../../../../../shared/models/layer';
import { moveLayer } from '../../../../actions/editor/projectFile/layer/moveLayer';
import { removeLayer } from '../../../../actions/editor/projectFile/layer/removeLayer';
import { selectLayer } from '../../../../actions/editor/projectFile/layer/selectLayer';
import { setLayerVisibility } from '../../../../actions/editor/projectFile/layer/setLayerVisibility';
import { addLayer } from '../../../../actions/editor/projectFile/layers/addLayer';
import { Store } from '../../../../reduxWithLessSux/store';
import { LayerListItem } from './layerListItem';
import * as styles from './styles';

interface LayerListProps {
	store: Store<ApplicationState>;
}

interface LayerListState {
}

export class LayerList extends React.Component<LayerListProps, LayerListState> {

	private renderPanelHeader() {
		return (
			<p className={ styles.layerListHeader }>
				<label className='control-label'>Layers</label>
				<Button bsSize='xs' className='pull-right' onClick={ () => addLayer(this.props.store) }>
					<i className='fa fa-plus' />
				</Button>
			</p>
		);
	}

	public render() {
		const { activeEditorIndex, editors } = this.props.store.getState();
		const editor = editors[activeEditorIndex];
		const selectedLayerIndex = editor.selectedLayerIndex;

		return (
			<div className={styles.layerList}>
				{ this.renderPanelHeader() }
				<ul>
					{
						editor.projectFile.layers.map((layer, layerIndex) =>
							<LayerListItem
								key={layerIndex}
								isSelected={layerIndex === editor.selectedLayerIndex}
								layerIndex={layerIndex}
								layers={editor.projectFile.layers}
								onSelectLayer={ () => selectLayer(this.props.store, { layerIndex }) }
								onMoveLayer={ (_, toIndex) => moveLayer(this.props.store, { layerIndex, toIndex }) }
								onSetLayerVisibility={
									() => setLayerVisibility(this.props.store, { layerIndex, isVisible: !layer.isVisible })
								}
								onRemoveLayer={ () => removeLayer(this.props.store, { layerIndex }) }
							/>
						)
					}
				</ul>
			</div>
		);
	}
}
