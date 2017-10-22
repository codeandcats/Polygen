import * as classNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, ControlLabel } from 'react-bootstrap';
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
								<Button
									bsSize='sm'
									bsStyle={ isSelected ? 'primary' : 'default' }
									className={ classNames(mainStyles.iconButton, { active: isSelected }) }
									key={ tool.name }
									onClick={ () => {
										if (isSelected) {
											this.props.onSelectTool(undefined);
										} else {
											this.props.onSelectTool(tool.name);
										}
									} }
									title={ tool.displayName }
								>
									<i className={ 'fa ' + tool.iconClassName } />
								</Button>
							);
						})
					}
				</ButtonGroup>
			</div>
		);
	}
}
