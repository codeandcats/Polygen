import * as EventEmitter from 'events';
import { Nullable } from '../../shared/models/nullable';

export type MouseTrapMouseEventName = 'mousedown' | 'mousemove' | 'mouseup' | 'mouseenter' | 'mouseleave';

export type MouseTrapMouseEventHandler = (event: MouseEvent) => void;

export type Unsubscribe = () => void;

let mouseTrapInstanceCount = 0;

const MOUSE_BUTTON = Object.freeze({
  LEFT: 0,
  AUXILIARY: 1,
  RIGHT: 2
});

const MOUSE_BUTTONS = Object.freeze({
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
  AUXILIARY: 4,
});

function mouseButtonToButtons(button: Nullable<number>): number {
  switch (button) {
    case MOUSE_BUTTON.LEFT:
      return MOUSE_BUTTONS.LEFT;

    case MOUSE_BUTTON.RIGHT:
      return MOUSE_BUTTONS.RIGHT;

    case MOUSE_BUTTON.AUXILIARY:
      return MOUSE_BUTTONS.AUXILIARY;

    default:
      return MOUSE_BUTTONS.NONE;
  }
}

export class MouseTrap {
  private instanceId = mouseTrapInstanceCount++;
  private events = new EventEmitter();
  private isCaptured: boolean;
  private mouseDownButton: Nullable<number>;
  private wasMouseDownInsideElement: boolean = false;

  constructor(private element: HTMLElement) {
    this.capture();
  }

  /**
   * Returns the provided event name with a unique prefix so not to
   * conflict with other MouseTrap instances which may also be
   * listening and emitting events for the same element
   */
  private getUniqueEventName(eventName: string): string {
    return `mouseTrap_${this.instanceId}_${eventName}`;
  }

  private elementMouseEnter = (event: MouseEvent) => {
    this.events.emit('mouseenter', event);
  }

  private elementMouseLeave = (event: MouseEvent) => {
    this.events.emit('mouseleave', event);
  }

  private emitMouseEvent(eventName: MouseTrapMouseEventName, event: MouseEvent) {
    const customEventName = this.getUniqueEventName(eventName);

    const customHandler = (customEvent2: MouseEvent) => {
      this.events.emit(eventName, customEvent2);
      this.element.removeEventListener(customEventName, customHandler);
    };

    this.element.addEventListener(customEventName, customHandler);

    const customEvent = new MouseEvent(customEventName, {
      button: this.wasMouseDownInsideElement ? this.mouseDownButton || 0 : 0,
      buttons: this.wasMouseDownInsideElement ? mouseButtonToButtons(this.mouseDownButton) : 0,
      view: window,
      bubbles: false,
      cancelable: false,
      clientX: event.x,
      clientY: event.y,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey
    });

    this.element.dispatchEvent(customEvent);
  }

  private windowMouseDown = (event: MouseEvent) => {
    const elementUnderMouse = document.elementFromPoint(event.x, event.y);

    this.mouseDownButton = event.button;
    this.wasMouseDownInsideElement = elementUnderMouse === this.element;

    if (this.wasMouseDownInsideElement) {
      this.emitMouseEvent('mousedown', event);
    }
  }

  private windowMouseMove = (event: MouseEvent) => {
    const elementUnderMouse = document.elementFromPoint(event.x, event.y);

    if (elementUnderMouse !== this.element) {
      if (!this.wasMouseDownInsideElement) {
        return;
      }
    }

    this.emitMouseEvent('mousemove', event);
  }

  private windowMouseUp = (event: MouseEvent) => {
    if (!this.wasMouseDownInsideElement) {
      return;
    }

    this.emitMouseEvent('mouseup', event);

    this.mouseDownButton = undefined;
    this.wasMouseDownInsideElement = false;
  }

  public capture() {
    if (this.isCaptured) {
      return;
    }

    window.addEventListener('mousedown', this.windowMouseDown);
    window.addEventListener('mousemove', this.windowMouseMove);
    window.addEventListener('mouseup', this.windowMouseUp);
    this.element.addEventListener('mouseenter', this.elementMouseEnter);
    this.element.addEventListener('mouseleave', this.elementMouseLeave);

    this.isCaptured = true;
  }

  public release() {
    if (!this.isCaptured) {
      return;
    }

    window.removeEventListener('mousedown', this.windowMouseDown);
    window.removeEventListener('mousemove', this.windowMouseMove);
    window.removeEventListener('mouseup', this.windowMouseUp);
    this.element.removeEventListener('mouseenter', this.elementMouseEnter);
    this.element.removeEventListener('mouseleave', this.elementMouseLeave);

    this.isCaptured = false;
  }

  public on(eventName: MouseTrapMouseEventName, handler: MouseTrapMouseEventHandler): Unsubscribe {
    this.events.on(eventName, handler);
    return () => this.off(eventName, handler);
  }

  public off(eventName: MouseTrapMouseEventName, handler: MouseTrapMouseEventHandler): void {
    this.events.removeListener(eventName, handler);
  }
}
