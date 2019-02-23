import { ToolName } from '../../ui/models/tools/common';
import { Dialogs } from './dialogs';
import { Editor } from './editor';
import { FocusedElementInfo } from './focusedElementInfo';
import { Nullable } from './nullable';
import { PolygenDocument } from './polygenDocument';
import { ViewPort } from './viewPort';

export interface ApplicationState {
  activeEditorIndex: number;
  dialogs: Dialogs;
  editors: Editor[];
  focusedElement: FocusedElementInfo;
  isResponsiveBreakpointLabelVisible: boolean;
  recentFileNames: string[];
}

export const DEFAULT_APPLICATION_STATE: ApplicationState = {
  activeEditorIndex: -1,
  dialogs: {
    web: undefined,
    native: undefined
  },
  editors: [],
  focusedElement: {
    isInput: false,
    isTextInput: false
  },
  isResponsiveBreakpointLabelVisible: false,
  recentFileNames: []
};

export const MAX_RECENT_FILE_NAME_COUNT = 10;

export function areDialogsVisible(state: ApplicationState): boolean {
  return !!(state.dialogs.web || state.dialogs.native);
}

export function isEditorVisible(state: ApplicationState): boolean {
  return state.activeEditorIndex > -1;
}

export function isToolSelected(state: ApplicationState, toolName: ToolName): boolean {
  const editor = state.editors[state.activeEditorIndex];
  return editor && editor.selectedToolName === toolName;
}
