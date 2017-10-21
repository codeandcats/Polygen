import * as classNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, ControlLabel } from 'react-bootstrap';
import * as mainStyles from '../../styles';

interface EditorToolbarProps {
}

interface EditorToolbarState {
}

export class EditorToolbar extends React.Component<EditorToolbarProps, EditorToolbarState> {
	private toolbarElement: HTMLDivElement | null;

	public getHeight() {
		return (this.toolbarElement && this.toolbarElement.offsetHeight) || 0;
	}

	public render() {
		return (
			<div className={ mainStyles.spaceBelow } ref={ toolbar => this.toolbarElement = toolbar }>
				<ControlLabel className={ classNames('control-label', mainStyles.spaceRight) }>Tools</ControlLabel>
				<ButtonGroup>
					<Button bsSize='sm'><i className='fa fa-pencil' /></Button>
					<Button bsSize='sm'><i className='fa fa-square-o' /></Button>
				</ButtonGroup>
			</div>
		);
	}
}
