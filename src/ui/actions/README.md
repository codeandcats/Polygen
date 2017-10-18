# Steps for adding new actions
- Extend existing `ApplicationState` model in `src/shared/models`
- Add new ActionType string to `ALL_ACTION_TYPES` in `src/ui/actions/common.ts`
- Declare new action class under `src/ui/actions`
- Add new action class to `Action` type union
- Declare new reducer to handle action

## Would be cool if there was a better way that was:
- Terse
- DRY
- Type-safe
- Loosely coupled (if desired)