import { ApplicationState } from './applicationState';
import { ExportDialogState } from './exportDialogState';
import { LayerImageSourceDialogState } from './layerImageSourceDialogState';
import { LayerSettingsDialogState } from './layerSettingsDialogState';
import { NewProjectFileDialogState } from './newProjectFileDialogState';
import { Nullable } from './nullable';
import { RenameLayerDialogState } from './renameLayerDialogState';

export type WebDialog = (
  NewProjectFileDialogState |
  RenameLayerDialogState |
  LayerSettingsDialogState |
  LayerImageSourceDialogState |
  ExportDialogState
);

export type NativeDialogType = 'save' | 'open' | 'messageBox';

export interface Dialogs {
  web: Nullable<WebDialog>;
  native: Nullable<NativeDialogType>;
}

export function getWebDialogState(state: ApplicationState, type: 'newProjectFile'): Nullable<NewProjectFileDialogState>;
export function getWebDialogState(state: ApplicationState, type: 'renameLayer'): Nullable<RenameLayerDialogState>;
export function getWebDialogState(state: ApplicationState, type: 'layerSettings'): Nullable<LayerSettingsDialogState>;
export function getWebDialogState(
  state: ApplicationState,
  type: 'layerImageSource'
): Nullable<LayerImageSourceDialogState>;

export function getWebDialogState(state: ApplicationState, type: WebDialog['dialogType']): Nullable<WebDialog> {
  const dialog = state.dialogs.web;
  if (dialog && dialog.dialogType === type) {
    return dialog;
  } else {
    return undefined;
  }
}
