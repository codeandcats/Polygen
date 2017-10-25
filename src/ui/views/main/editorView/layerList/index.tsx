import * as classNames from 'classnames';
import * as React from 'react';
import {
	Button, ButtonGroup, ControlLabel, DropdownButton,
	ListGroup, ListGroupItem, MenuItem, OverlayTrigger, Panel, Tooltip
} from 'react-bootstrap';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Editor } from '../../../../../shared/models/editor';
import { ImageSource } from '../../../../../shared/models/imageSource';
import { Layer } from '../../../../../shared/models/layer';
import { Nullable } from '../../../../../shared/models/nullable';
import { moveLayer } from '../../../../actions/editor/projectFile/layer/moveLayer';
import { removeLayer } from '../../../../actions/editor/projectFile/layer/removeLayer';
import { renameLayer } from '../../../../actions/editor/projectFile/layer/renameLayer';
import { selectLayer } from '../../../../actions/editor/projectFile/layer/selectLayer';
import { setLayerImage } from '../../../../actions/editor/projectFile/layer/setLayerImage';
import { setLayerVisibility } from '../../../../actions/editor/projectFile/layer/setLayerVisibility';
import { addLayer } from '../../../../actions/editor/projectFile/layers/addLayer';
import { Store } from '../../../../reduxWithLessSux/store';
import * as mainStyles from '../../styles';
import { LayerBackgroundDialog } from './layerBackgroundDialog/index';
import { LayerListItem } from './layerListItem';
import { RenameLayerDialog } from './renameLayerDialog/index';
import * as styles from './styles';

interface LayerListProps {
	store: Store<ApplicationState>;
}

interface LayerListState {
	indexOfLayerBeingRenamed: number;
	indexOfLayerHavingBackgroundUpdated: number;
}

export class LayerList extends React.Component<LayerListProps, LayerListState> {

	constructor(props: LayerListProps, context: any) {
		super(props, context);

		this.state = {
			indexOfLayerBeingRenamed: -1,
			indexOfLayerHavingBackgroundUpdated: -1
		};
	}

	private cancelRenameLayerDialog() {
		this.setState({
			indexOfLayerBeingRenamed: -1
		});
	}

	private cancelUpdatingLayerImageDialog() {
		this.setState({
			indexOfLayerHavingBackgroundUpdated: -1
		});
	}

	private renameLayer(layerIndex: number, layerName: string) {
		renameLayer(this.props.store, { layerIndex, layerName });
		this.setState({
			indexOfLayerBeingRenamed: -1
		});
	}

	public render() {
		const { activeEditorIndex, editors } = this.props.store.getState();
		const editor = editors[activeEditorIndex];
		const selectedLayerIndex = editor.selectedLayerIndex;
		const layersWithIndices = editor.projectFile.layers
			.map((layer, index) => ({
				layer,
				index
			}))
			.sort((a, b) => b.index - a.index);

		return (
			<div className={styles.layerList}>
				<div className={ mainStyles.spaceBelow }>
					<label className={ classNames('control-label', mainStyles.spaceRight) }>Layers</label>
					<OverlayTrigger
							overlay={ <Tooltip id='addLayerTooltip'>Add layer</Tooltip> }
							placement='bottom'
						>
						<Button
							bsSize='sm'
							className={ mainStyles.iconButton }
							onClick={ () => addLayer(this.props.store) }
							title='Add layer'
						>
							<i className='fa fa-plus' />
						</Button>
					</OverlayTrigger>
				</div>
				<ul>
					{
						layersWithIndices.map(layerWithIndex =>
							<LayerListItem
								key={layerWithIndex.index}
								isSelected={layerWithIndex.index === editor.selectedLayerIndex}
								layerIndex={layerWithIndex.index}
								layers={editor.projectFile.layers}
								onSelectLayer={ () => selectLayer(this.props.store, { layerIndex: layerWithIndex.index }) }
								onMoveLayer={ (_, toIndex) => moveLayer(this.props.store, { layerIndex: layerWithIndex.index, toIndex }) }
								onSetLayerVisibility={
									() => setLayerVisibility(
										this.props.store, { layerIndex: layerWithIndex.index, isVisible: !layerWithIndex.layer.isVisible }
									)
								}
								onShowRenameLayerDialog={ () => this.showRenameLayerDialog(layerWithIndex.index) }
								onShowLayerBackgroundDialog={ () => this.showLayerBackgroundDialog(layerWithIndex.index) }
								onRemoveLayer={ () => removeLayer(this.props.store, { layerIndex: layerWithIndex.index }) }
							/>
						)
					}
				</ul>
				<RenameLayerDialog
					layerName={
						this.state.indexOfLayerBeingRenamed === -1 ?
						'' :
						editor.projectFile.layers[this.state.indexOfLayerBeingRenamed].name
					}
					isVisible={ this.state.indexOfLayerBeingRenamed > -1 }
					onAccept={ layerName => this.renameLayer(this.state.indexOfLayerBeingRenamed, layerName) }
					onCancel={ () => this.cancelRenameLayerDialog() }
				/>
				<LayerBackgroundDialog
					imageSource={
						this.state.indexOfLayerHavingBackgroundUpdated === -1 ?
						undefined :
						editor.projectFile.layers[this.state.indexOfLayerHavingBackgroundUpdated].imageSource
					}
					isVisible={ this.state.indexOfLayerHavingBackgroundUpdated > -1 }
					onAccept={ imageSource => this.setLayerImage(this.state.indexOfLayerHavingBackgroundUpdated, imageSource) }
					onCancel={ () => this.cancelUpdatingLayerImageDialog() }
				/>
			</div>
		);
	}

	private setLayerImage(layerIndex: number, imageSource: Nullable<ImageSource>) {
		setLayerImage(this.props.store, { layerIndex, imageSource });
		this.setState({
			indexOfLayerHavingBackgroundUpdated: -1
		});
	}

	private showRenameLayerDialog(layerIndex: number) {
		this.setState({
			indexOfLayerBeingRenamed: layerIndex
		});
	}

	private showLayerBackgroundDialog(layerIndex: number) {
		this.setState({
			indexOfLayerHavingBackgroundUpdated: layerIndex
		});
	}
}
