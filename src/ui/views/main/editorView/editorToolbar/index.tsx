import * as classNames from 'classnames';
import * as React from 'react';
import {
  Button,
  ButtonGroup,
  FormLabel,
  OverlayTrigger,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from 'react-bootstrap';
import { EditorMode } from '../../../../../shared/models/editorMode';
import { ToolName } from '../../../../models/tools/common';
import { TOOL_BY_NAME } from '../../../../models/tools/index';
import * as mainStyles from '../../styles';

interface EditorToolbarProps {
  mode: EditorMode;
  selectedToolName: ToolName | undefined;
  onSetMode: (mode: EditorMode) => void;
  onSelectTool: (toolName: ToolName | undefined) => void;
}

interface EditorToolbarState {}

export class EditorToolbar extends React.Component<
  EditorToolbarProps,
  EditorToolbarState
> {
  private static TOOL_NAMES_ORDERED: ToolName[] = ['pan', 'point', 'selection'];

  public render() {
    return (
      <div>
        <FormLabel className={mainStyles.spaceRight}>Mode</FormLabel>
        <ToggleButtonGroup
          name="mode"
          type="radio"
          value={this.props.mode}
          // ToggleButtonGroup.onChange type signature is wrong so using `any` :(
          onChange={((mode: EditorMode) => this.props.onSetMode(mode)) as any}
        >
          <ToggleButton className="btn-sm" value={'preview'}>
            Preview
          </ToggleButton>
          <ToggleButton className="btn-sm" value={'edit'}>
            Edit
          </ToggleButton>
        </ToggleButtonGroup>
        {this.props.mode === 'preview' ? null : (
          <div style={{ display: 'inline-block' }}>
            <FormLabel
              className={classNames(
                mainStyles.spaceLeft2x,
                mainStyles.spaceRight
              )}
            >
              Tools
            </FormLabel>
            <ButtonGroup>
              {EditorToolbar.TOOL_NAMES_ORDERED.map((toolName) => {
                const tool = TOOL_BY_NAME[toolName];
                const isSelected = toolName === this.props.selectedToolName;
                return (
                  <OverlayTrigger
                    key={tool.name}
                    overlay={
                      <Tooltip id={'toolButtonTooltip_' + tool.name}>
                        {tool.displayName}
                      </Tooltip>
                    }
                    placement="bottom"
                  >
                    <Button
                      size="sm"
                      className={classNames(mainStyles.iconButton, {
                        active: isSelected,
                      })}
                      onClick={() => {
                        if (isSelected) {
                          this.props.onSelectTool(undefined);
                        } else {
                          this.props.onSelectTool(tool.name);
                        }
                      }}
                    >
                      <i className={'fa ' + tool.iconClassName} />
                    </Button>
                  </OverlayTrigger>
                );
              })}
            </ButtonGroup>
          </div>
        )}
      </div>
    );
  }
}
