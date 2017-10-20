import * as classNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, ControlLabel } from 'react-bootstrap';
import * as mainStyles from '../../styles';

interface EditorToolbarProps {
}

interface EditorToolbarState {
}

export class EditorToolbar extends React.Component<EditorToolbarProps, EditorToolbarState> {
	public render() {
		return (
			<div className={ mainStyles.spaceBelow }>
				<ControlLabel className={ classNames('control-label', mainStyles.spaceRight) }>Tools</ControlLabel>
				<ButtonGroup>
					<Button bsSize='sm'><i className='fa fa-pencil' /></Button>
					<Button bsSize='sm'><i className='fa fa-square-o' /></Button>
				</ButtonGroup>
			</div>
		);
	}
}
