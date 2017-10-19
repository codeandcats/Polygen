import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../shared/models/applicationState';
import { ProjectFile } from '../../../shared/models/projectFile';
import { Store } from '../../reduxWithLessSux/store';
import { BootstrapLabel } from './breakpointLabel/index';
import { EditorView } from './editorView';
import { WelcomeView } from './welcomeView';

interface MainWindowProps {
	store: Store<ApplicationState>;
}

interface MainWindowState {
}

export class MainWindow extends React.Component<MainWindowProps, MainWindowState> {
	public render() {
		const state = this.props.store.getState();

		return (
			<div>
				{ state.editors.length === 0 ? <WelcomeView store={this.props.store} /> : <EditorView store={this.props.store} /> }
				<BootstrapLabel />
			</div>
		);
	}
}
