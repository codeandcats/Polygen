import { ApplicationState } from '../../../shared/models/applicationState';
import { defineAction } from '../../reduxWithLessSux/action';

export const closeActiveProjectFile = defineAction(
  'closeActiveProjectFile',
  (state: ApplicationState) => {
    let { activeEditorIndex } = state;
    const editors = state.editors.filter(
      (_, editorIndex) => editorIndex !== activeEditorIndex
    );
    activeEditorIndex = editors.length - 1;
    return {
      ...state,
      activeEditorIndex,
      editors,
    };
  }
).getDispatcher();
