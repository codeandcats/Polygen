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
import { moveLayer } from '../../../../actions/editor/document/layer/moveLayer';
import { removeLayer } from '../../../../actions/editor/document/layer/removeLayer';
import { renameLayer } from '../../../../actions/editor/document/layer/renameLayer';
import { selectLayer } from '../../../../actions/editor/document/layer/selectLayer';
import { setLayerImage } from '../../../../actions/editor/document/layer/setLayerImage';
import { setLayerVisibility } from '../../../../actions/editor/document/layer/setLayerVisibility';
import { addLayer } from '../../../../actions/editor/document/layers/addLayer';
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
		const layersWithIndices = editor.document.layers
			.map((layer, index) => ({
				layer,
				index
			}))
			.sort((a, b) => b.index - a.index);

		const layerHavingBackgroundUpdated = editor.document.layers[this.state.indexOfLayerHavingBackgroundUpdated];

		return (
			<div className={ styles.layerList }>
				<div className={ styles.layerListHeader }>
					<label className={ classNames('control-label', mainStyles.spaceRight) }>Layers</label>
					<OverlayTrigger
						overlay={ <Tooltip id='addLayerTooltip'>Add layer</Tooltip> }
						placement='bottom'
					>
						<Button
							bsSize='sm'
							className={ classNames(styles.addLayerButton, mainStyles.iconButton) }
							onClick={ () => addLayer(this.props.store) }
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
								layers={editor.document.layers}
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
						editor.document.layers[this.state.indexOfLayerBeingRenamed].name
					}
					isVisible={ this.state.indexOfLayerBeingRenamed > -1 }
					onAccept={ layerName => this.renameLayer(this.state.indexOfLayerBeingRenamed, layerName) }
					onCancel={ () => this.cancelRenameLayerDialog() }
				/>
				<LayerBackgroundDialog
					imageSource={
						this.state.indexOfLayerHavingBackgroundUpdated === -1 ?
						undefined :
						layerHavingBackgroundUpdated && layerHavingBackgroundUpdated.image.source
					}
					isVisible={ this.state.indexOfLayerHavingBackgroundUpdated > -1 }
					onAccept={ imageSource => this.setLayerImage(this.state.indexOfLayerHavingBackgroundUpdated, imageSource) }
					onCancel={ () => this.cancelUpdatingLayerImageDialog() }
				/>
			</div>
		);
	}

	private setLayerImage(layerIndex: number, source: Nullable<ImageSource>) {
		setLayerImage(this.props.store, { layerIndex, source });
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
