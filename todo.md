# TODO

## Tools
- Custom Cursors

## Animations
- Selected point jumping
- Add point
- Remove points
- Zoom

### ~~Select Tool~~
- ~~Select point above/left of/right of/below selected point (Alt+Up/Left/Right/Down)~~

## Menus
- ~~Selection~~
	- ~~Select All (CmdOrCtrl+A when canvas focused)~~
	- ~~Deselect All (CmdOrCtrl+D when canvas focused)~~
	- ~~Remove Selection (Delete when canvas focused)~~

- File
	- New
		- Should be able to specify the image you want to use from the start and base document dimensions on image
	- Close/Quit should prompt to save changes

- Undo/Redo
	- Properties
		- Type
		- Timestamp
		- Enough information to undo then redo changes
	- Interactions
		- Add Point
		- Select Points?
		- Deselect Points?
		- Select Layer?
		- Remove Points
		- Move Points
		- Set Layer Image
		- Clear Layer Image

- ~~Tools~~
	- ~~Pan (CmdOrCtrl+1)~~
	- ~~Point (CmdOrCtrl+2)~~
	- ~~Selection (CmdOrCtrl+3)~~
	- Line
		- Lets user force lines between points

- Canvas
	- ~~Pan using two finger swipe on trackpad~~
	- Zoom in/out using pinch on trackpad

- Window
	- Switch between open editors

- View
	- Show/hide lines
	- Show/hide points
	- ~~Zoom~~

- Export
	- ~~Formats~~
		- ~~JPEG~~
		- ~~PNG~~
	- ~~Dimensions~~
	- ~~Quality~~
	- Render options
		- Line colour & visibility
		- Point colour & visibility

- ~~Debug~~
	- ~~Show/hide FPS~~
	- ~~Show/hide Bootstrap breakpoint~~

## Layer settings
- Transparency/Opacity threshold

## Preview
- A way to see a preview of the image
	- ~~Maybe it just toggles between edit mode and preview mode~~
	- Should default to pan tool when in preview mode, then switch back to previously selected tool when in edit mode
	- Should not allow using editing tools in preview mode

## Bugs
- ~~Fix scrolling offset bug~~
- ~~Fix mouse up outside canvas bug~~
- ~~Fix canvas sizing~~
- ~~Document shadow is doubled in corner~~
- Should not render the same lines twice when edge shared between 2 polygons
- Seams between polygons in final rendering (render double size then shrink?)
- Zooming out too far flips image lolz
