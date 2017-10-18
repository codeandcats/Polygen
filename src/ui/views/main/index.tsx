import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../shared/models/applicationState';
import { ProjectFile } from '../../../shared/models/projectFile';
import { Store } from '../../reduxWithLessSux/store';
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
			state.editors.length === 0 ? <WelcomeView /> : <EditorView />
		);
	}
}
