import * as React from 'react';
import { Button, ButtonToolbar, Col, Grid, Jumbotron, Modal, Row } from 'react-bootstrap';
import { ProjectFile } from '../../../../shared/models/projectFile';
import { Size } from '../../../../shared/models/size';
import { openNewProjectFile } from '../../../actions/editor/openNewProjectFile';
import { NewProjectFileDialog } from '../newProjectFileDialog';

export interface WelcomeViewProps {
}

export interface WelcomeViewState {
	isOpenNewProjectFileDialogVisible: boolean;
	isOpenExistingProjectFileDialogVisible: boolean;
}

export class WelcomeView extends React.Component<WelcomeViewProps, WelcomeViewState> {
	constructor(props: WelcomeViewProps, context?: any) {
		super(props, context);
		this.state = {
			isOpenNewProjectFileDialogVisible: false,
			isOpenExistingProjectFileDialogVisible: false
		};
	}

	private showNewProjectFileDialog() {
		this.setState({ isOpenNewProjectFileDialogVisible: true });
	}

	private hideNewProjectFileDialog() {
		this.setState({ isOpenNewProjectFileDialogVisible: false });
	}

	private showOpenProjectFileDialog() {
		this.setState({ isOpenExistingProjectFileDialogVisible: true });
	}

	private hideOpenProjectFileDialog() {
		this.setState({ isOpenExistingProjectFileDialogVisible: false });
	}

	public render() {
		return (
			<div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' } }>
				<Grid>
					<Jumbotron>
						<h1>Welcome</h1>
						<p>Create or open a file to get started.</p>
						<ButtonToolbar>
							<Button onClick={ () => this.showNewProjectFileDialog() }>New file</Button>
							<Button onClick={ () => this.showOpenProjectFileDialog() }>Open existing file</Button>
						</ButtonToolbar>
					</Jumbotron>
					<NewProjectFileDialog
						defaultSize={ { width: 800, height: 600 } }
						isVisible={ this.state.isOpenNewProjectFileDialogVisible }
						onAccept={ size => openNewProjectFile({ size }) }
						onCancel={ () => this.hideNewProjectFileDialog() }
					/>
				</Grid>
			</div>
		);
	}
}
