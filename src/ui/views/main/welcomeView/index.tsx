import { OpenDialogOptions, remote } from 'electron';
import * as path from 'path';
import * as React from 'react';
import { Button, ButtonToolbar, Col, Grid, Jumbotron, Modal, Row } from 'react-bootstrap';
import { ApplicationState } from '../../../../shared/models/applicationState';
import { ProjectFile } from '../../../../shared/models/projectFile';
import { Size } from '../../../../shared/models/size';
import { openNewProjectFile } from '../../../actions/editor/openNewProjectFile';
import { showNewProjectFileDialog } from '../../../actions/showNewProjectFileDialog';
import { Store } from '../../../reduxWithLessSux/store';
import { NewProjectFileDialog } from '../newProjectFileDialog';
import * as styles from './styles';

export interface WelcomeViewProps {
	recentFileNames: string[];
	onShowNewProjectFileDialog: () => void;
	onShowOpenProjectFileDialog: () => void;
	onOpenProjectFile: (fileName: string) => void;
}

export interface WelcomeViewState {
}

export class WelcomeView extends React.Component<WelcomeViewProps, WelcomeViewState> {
	constructor(props: WelcomeViewProps, context?: any) {
		super(props, context);
	}

	public render() {
		return (
			<div className={ styles.fullScreenContainer }>
				<Grid>
					<Jumbotron>
						<h1>Welcome</h1>
						<p>Create or open a file to get started.</p>
						<ButtonToolbar>
							<Button onClick={ () => this.props.onShowNewProjectFileDialog() }>New file</Button>
							<Button onClick={ () => this.props.onShowOpenProjectFileDialog() }>Open existing file</Button>
						</ButtonToolbar>

						{
							this.props.recentFileNames && this.props.recentFileNames.length ?
							<div>
								<br />
								<p>Recent Files</p>
								<div className='list-group'>
									{
										this.props.recentFileNames.map(recentFileName => {
											return (
												<a
													className='list-group-item'
													href='#'
													key={ recentFileName }
													onClick={ () => this.props.onOpenProjectFile(recentFileName) }
												>{ path.basename(recentFileName) }</a>
											);
										})
									}
								</div>
							</div> :
							null
						}
					</Jumbotron>
				</Grid>
			</div>
		);
	}
}
