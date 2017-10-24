import * as classNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ToolName } from '../../../../models/tools/common';
import { TOOL_BY_NAME } from '../../../../models/tools/index';
import * as mainStyles from '../../styles';

interface EditorToolbarProps {
	selectedToolName: ToolName | undefined;
	onSelectTool: (toolName: ToolName | undefined) => void;
}

interface EditorToolbarState {
}

export class EditorToolbar extends React.Component<EditorToolbarProps, EditorToolbarState> {
	private static TOOL_NAMES_ORDERED: ToolName[] = ['pan', 'point', 'selection'];
	private toolbarElement: HTMLDivElement | null;

	public getHeight() {
		return (this.toolbarElement && this.toolbarElement.offsetHeight) || 0;
	}

	public render() {
		return (
			<div className={ mainStyles.spaceBelow } ref={ toolbar => this.toolbarElement = toolbar }>
				<ControlLabel className={ classNames('control-label', mainStyles.spaceRight) }>Tools</ControlLabel>
				<ButtonGroup>
					{
						EditorToolbar.TOOL_NAMES_ORDERED.map(toolName => {
							const tool = TOOL_BY_NAME[toolName];
							const isSelected = toolName === this.props.selectedToolName;
							return (
								<OverlayTrigger
									key={ tool.name }
									overlay={ <Tooltip id={ 'toolButtonTooltip_' + tool.name }>{ tool.displayName }</Tooltip> }
									placement='bottom'
								>
									<Button
										bsSize='sm'
										bsStyle={ isSelected ? 'primary' : 'default' }
										className={ classNames(mainStyles.iconButton, { active: isSelected }) }
										onClick={ () => {
											if (isSelected) {
												this.props.onSelectTool(undefined);
											} else {
												this.props.onSelectTool(tool.name);
											}
										} }
									>
										<i className={ 'fa ' + tool.iconClassName } />
									</Button>
								</OverlayTrigger>
							);
						})
					}
				</ButtonGroup>
			</div>
		);
	}
}
