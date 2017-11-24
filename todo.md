# TODO

## Tools
- Custom Cursors

### Move Tool
- ~~Update polygon colours~~

### Select Tool
- ~~Select point above/left of/right of/below selected point (Alt+Up/Left/Right/Down)~~
- Animate selected point jumping

## Menus
- ~~Selection~~
	- ~~Select All (CmdOrCtrl+A when canvas focused)~~
	- ~~Deselect All (CmdOrCtrl+D when canvas focused)~~
	- ~~Remove Selection (Delete when canvas focused)~~

- File
	- Close/Quit should prompt to save changes

- Undo/Redo
	- Properties
		- Type
		- Timestamp
		- Enough information to undo then redo changes
	- Interaction
		- Add Point
		- Select
		- Deselect
		- Remove Points
		- Move Points
		- Set Layer Image
		- Clear Layer Image

- Tools
	- Pan (1 when canvas focused)
	- Point (2 when canvas focused)
	- Selection (3 when canvas focused)

- Window
	- Switch between open editors

- View
	- Show/hide lines
	- Show/hide points
	- Zoom

- Debug
	- Show/hide FPS

## Layer settings
- Transparency/Opacity threshold

## Preview
- A way to see a preview of the image
	- Maybe it just toggles between edit mode and preview mode?

## Bugs
- ~~Fix scrolling offset bug~~
- ~~Fix mouse up outside canvas bug~~
- ~~Fix canvas sizing~~
- Should not render the same lines twice when edge shared between 2 polygons
- ~~Document shadow is doubled in corner~~
