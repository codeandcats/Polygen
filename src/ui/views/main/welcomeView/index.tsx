import * as React from 'react';
import { Button, ButtonToolbar, Col, Grid, Jumbotron, Modal, Row } from 'react-bootstrap';
import { ApplicationState } from '../../../../shared/models/applicationState';
import { ProjectFile } from '../../../../shared/models/projectFile';
import { Size } from '../../../../shared/models/size';
import { openNewProjectFile } from '../../../actions/editor/openNewProjectFile';
import { Store } from '../../../reduxWithLessSux/store';
import { NewProjectFileDialog } from '../newProjectFileDialog';

export interface WelcomeViewProps {
	store: Store<ApplicationState>;
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

	private hideOpenProjectFileDialog() {
		this.setState({ isOpenExistingProjectFileDialogVisible: false });
	}

	private hideNewProjectFileDialog() {
		this.setState({ isOpenNewProjectFileDialogVisible: false });
	}

	private openNewProjectFile(size: Size) {
		openNewProjectFile(this.props.store, { size });
	}

	private showOpenProjectFileDialog() {
		this.setState({ isOpenExistingProjectFileDialogVisible: true });
	}

	private showNewProjectFileDialog() {
		this.setState({ isOpenNewProjectFileDialogVisible: true });
	}

	public render() {
		return (
			<div style={ {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'absolute',
				width: '100%',
				height: '100%'
			} }>
				<Grid>
					<Jumbotron style={ { margin: 0 } }>
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
						onAccept={ size => this.openNewProjectFile(size) }
						onCancel={ () => this.hideNewProjectFileDialog() }
					/>
				</Grid>
			</div>
		);
	}
}
