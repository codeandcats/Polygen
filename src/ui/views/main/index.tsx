import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../shared/models/applicationState';
import { Nullable } from '../../../shared/models/nullable';
import { PolygenDocument } from '../../../shared/models/polygenDocument';
import { openNewProjectFile } from '../../actions/editor/openNewProjectFile';
import { ImageCache } from '../../models/imageCache';
import { Store } from '../../reduxWithLessSux/store';
import { BootstrapLabel } from './breakpointLabel';
import { EditorView } from './editorView';
import { ExportDialog } from './exportDialog';
import { NewProjectFileDialog } from './newProjectFileDialog';
import * as styles from './styles';
import { WelcomeView } from './welcomeView';

interface MainWindowProps {
  store: Store<ApplicationState>;
  onOpenProjectFile: (fileName: string) => void;
  onShowOpenProjectFileDialog: () => void;
  onShowNewProjectFileDialog: () => void;
}

interface MainWindowState {}

export class MainWindow extends React.Component<
  MainWindowProps,
  MainWindowState
> {
  constructor(props: Readonly<MainWindowProps>, context?: any) {
    super(props, context);
  }

  private imageCache = new ImageCache();
  private editorView: Nullable<EditorView>;

  public getEditorView(): Nullable<EditorView> {
    return this.editorView;
  }

  public render() {
    const state = this.props.store.getState();

    return (
      <div className={styles.mainWindow}>
        <NewProjectFileDialog store={this.props.store} />
        <ExportDialog imageCache={this.imageCache} store={this.props.store} />
        {state.editors.length === 0 ? (
          <WelcomeView
            recentFileNames={state.recentFileNames}
            onOpenProjectFile={(fileName) =>
              this.props.onOpenProjectFile(fileName)
            }
            onShowNewProjectFileDialog={() =>
              this.props.onShowNewProjectFileDialog()
            }
            onShowOpenProjectFileDialog={() =>
              this.props.onShowOpenProjectFileDialog()
            }
          />
        ) : (
          <EditorView
            imageCache={this.imageCache}
            ref={(editorView) => (this.editorView = editorView)}
            store={this.props.store}
          />
        )}
        {state.isResponsiveBreakpointLabelVisible ? <BootstrapLabel /> : null}
      </div>
    );
  }
}
