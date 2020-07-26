import * as path from 'path';
import React = require('react');
import { Button, ButtonToolbar, Jumbotron, ListGroup } from 'react-bootstrap';
import * as styles from './styles';

export interface WelcomeViewProps {
  recentFileNames: string[];
  onShowNewProjectFileDialog: () => void;
  onShowOpenProjectFileDialog: () => void;
  onOpenProjectFile: (fileName: string) => void;
}

export interface WelcomeViewState {}

export const WelcomeView: React.StatelessComponent<WelcomeViewProps> = (
  props: WelcomeViewProps
) => {
  const renderFileList = () => (
    <ListGroup className={styles.fileList} variant="flush" activeKey="">
      {props.recentFileNames.map((recentFileName: string) => (
        <ListGroup.Item
          action
          href="#"
          active={false}
          key={recentFileName}
          onClick={() => props.onOpenProjectFile(recentFileName)}
        >
          {path.basename(recentFileName)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  const shouldShowRecentFiles =
    props.recentFileNames && props.recentFileNames.length > 0;

  return (
    <div className={styles.welcomePage}>
      <Jumbotron>
        <div>
          <h1>Welcome</h1>
          <p>Create or open a file to get started.</p>

          <ButtonToolbar>
            <Button
              onClick={() => props.onShowNewProjectFileDialog()}
              className="mr-2"
            >
              New file
            </Button>
            <Button onClick={() => props.onShowOpenProjectFileDialog()}>
              Open existing file
            </Button>
          </ButtonToolbar>

          {shouldShowRecentFiles ? <h6>Recent Files</h6> : null}
        </div>
        {shouldShowRecentFiles ? renderFileList() : null}
      </Jumbotron>
    </div>
  );
};
