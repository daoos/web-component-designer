import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { customElement, property } from '@polymer/decorators';
import { ActionHistory } from './action-history.js';

import '@polymer/iron-icon/iron-icon.js';
import './app-icons.js';
import './designer-tab.js';

@customElement('canvas-controls')
export class CanvasControls extends PolymerElement {
  @property({ type: Object, observer: '_selectedElementChanged' })
  selectedElement: HTMLElement;
  @property({ type: Object })
  canvasElement: Object;
  @property({ type: Object })
  actionHistory: ActionHistory;

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        designer-tab {
          color: white;
          background: var(--dark-grey);
          width: 100%;
          height: 41px;
          margin: 0;
          padding: 0;
          border: none;
          display: flex;
          padding: 0 0 1em;
          font-size: 10px;
          line-height: 1em;
          justify-content: space-around;
        }
        button {
          padding: 0;
          cursor: pointer;
          font-size: 8px;
          border: 2px solid transparent;
          border-width: 2px 0;
          position: relative;
          margin: 0;
          transition: all .05s ease-in;
          outline: none;
        }
        button[disabled] {
          pointer-events: none;
          opacity: 0.3;
        }
        button::before,
        button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          border: 2px solid transparent;
          border-width: 0 2px 0;
          box-sizing: border-box;
        }
        button::after {
          top: auto;
          bottom: 0;
        }
        button:hover,
        button:hover::before,
        button:hover::after,
        button:focus, /* :focus hack */
        button:focus::before,
        button:focus::after {
          border-color: var(--light-grey);
        }
        button:active,
        button:active::before,
        button:active::after {
          border-color: var(--highlight-pink);
        }
      </style>
      <designer-tab>
        <button on-click="delete" title="Delete element">
          <iron-icon icon="designer:delete"></iron-icon>
        </button>
        <button on-click="clone" id="cloneBtn" title="Clone element">
          <iron-icon icon="designer:copy"></iron-icon>
        </button>
        <button on-click="fit" id="fitBtn" title="Fit to parent">
          <iron-icon icon="designer:fit"></iron-icon>
        </button>
        <button on-click="moveUp" title="Move to parent. Also Shift+UpArrow" id="moveUpBtn">
          <iron-icon icon="designer:up"></iron-icon>
        </button>
        <button on-click="moveDown" title="Move to first child. Also Shift+DownArrow" id="moveDownBtn">
          <iron-icon icon="designer:down"></iron-icon>
        </button>
        <button on-click="moveBack" title="Move back. Also Shift+LeftArrow" id="moveBackBtn">
          <iron-icon icon="designer:back"></iron-icon>
        </button>
        <button on-click="moveForward" title="Move forward. Also Shift+RightArrow" id="moveForwardBtn">
          <iron-icon icon="designer:forward"></iron-icon>
        </button>
      </designer-tab>
    `;
  }

  /**
   * Disable a bunch of UI if the selected element is the canvas element.
   */
  update(disableUI) {
    (this.$.cloneBtn as HTMLInputElement).disabled = disableUI;
    (this.$.fitBtn as HTMLInputElement).disabled = disableUI;
    (this.$.moveUpBtn as HTMLInputElement).disabled = disableUI;
    (this.$.moveDownBtn as HTMLInputElement).disabled = disableUI;
    (this.$.moveBackBtn as HTMLInputElement).disabled = disableUI;
    (this.$.moveForwardBtn as HTMLInputElement).disabled = disableUI;
  }

  /**
   * Deletes the active element.
   */
  delete() {
    if (!this.selectedElement) {
      console.log('🔥 how did i get here?');
      return;
    }

    const el = this.selectedElement;
    // Deleting the top level app should remove its children.
    if (this._isCanvasElement(el)) {
      this.actionHistory.add('delete', el, {innerHTML: el.innerHTML});
      el.innerHTML = '';
    } else {
      const parent = el.parentElement;
      parent.removeChild(el);
      this.selectedElement = parent;
      this.actionHistory.add('delete', el, {parent: parent});
    }
    this._refreshView();

  }

  /**
   * Creates a sibling copy of the active element.
   */
  clone() {
    const el = this.selectedElement;
    if (this._isCanvasElement(el)) {
      return;
    }

    let clone = el.cloneNode(true);
    el.parentNode.appendChild(clone);

    this.dispatchEvent(new CustomEvent('selected-element-changed', {detail: {target: clone, node: this}}));
    //Base.fire('finish-clone', {target: clone}, {node: this});

    // P.S: Since we did a clone, we already have the initial state of the <tag>.
    this.actionHistory.add('new', clone, {parent: el.parentNode});
    this._refreshView();

  }

  /**
   * Fit an element to its target
   */
  fit() {
    const el = this.selectedElement;
    if (this._isCanvasElement(el)) {
      return;
    }

    this.actionHistory.add('fit', el,
      {
        new: {
          position: 'absolute',
          left: '0', top: '0',
          width: '100%', height: '100%'
        },
        old: {
          position: el.style.position,
          left: el.style.left, top: el.style.top,
          width: el.style.width, height: el.style.height,
        }
      });

    el.style.position = 'absolute';
    el.style.left = el.style.top = '0px';
    el.style.height = el.style.width = '100%';
  }

  /**
   * Moving elements in the DOM
   */
  move(type, skipHistory) {
    switch(type) {
      case 'forward':
        this.moveForward(skipHistory);
        break;
      case 'back':
        this.moveBack(skipHistory);
        break;
      case 'up':
        this.moveUp(skipHistory);
        break;
      case 'down':
        this.moveDown(skipHistory);
        break;
    }
  }

  moveBack(skipHistory) {
    const el = this.selectedElement;
    if (this._isCanvasElement(el)) {
      return;
    }

    let parent = el.parentElement;
    let previous = el.previousElementSibling;
    if (previous) {
      parent.insertBefore(el, previous);
    } else {
      parent.appendChild(el);
    }
    this._refreshView();
    if (skipHistory === true) {
      return;
    }
    this.actionHistory.add('move-back', el);
  }

  moveForward(skipHistory) {
    const el = this.selectedElement;
    if (this._isCanvasElement(el)) {
      return;
    }
    let parent = el.parentElement;

    // Since you can't insertAfter your next sibling, you need to
    // insert before two siblings over.
    let next = el.nextElementSibling;
    if (next) {
      next = next.nextElementSibling;
      if (next) {
        parent.insertBefore(el, next);
      } else {
        parent.appendChild(el);
      }
    } else {
      parent.insertBefore(el, parent.firstChild);
    }
    this._refreshView();

    if (skipHistory === true) {
      return;
    }
    this.actionHistory.add('move-forward', el);
  }

  moveUp(skipHistory) {
    const el = this.selectedElement;
    let parent = el.parentElement;
    // If the parent isn't already the viewContainer, move it one up.
    if (this._isCanvasElement(el) || (parent && parent.id === 'canvas')) {
      return;
    }
    parent.removeChild(el);
    parent.parentElement.appendChild(el);
    this._refreshView();

    if (skipHistory === true) {
      return;
    }
    this.actionHistory.add('move-up', el,
      {old: {parent: parent}, new: {parent: parent.parentElement}});
  }

  moveDown(skipHistory) {
    const el = this.selectedElement;
    let sibling = el.nextElementSibling;
    if (this._isCanvasElement(el) || !sibling) {
      return;
    }

    // Not everything accepts children, as we've learnt from canvas-view
    // (where I copied this code from like a lazy bum)
    let slots = sibling ? sibling.querySelectorAll('slot') : [];
    let canDrop =
      (sibling.localName.indexOf('-') === -1 && sibling.localName !== 'input') ||
       sibling.localName === 'dom-repeat' || slots.length !== 0;

    if (!canDrop) {
      return;
    }

    // If you can, add it there.
    const oldParent = el.parentElement;
    sibling.appendChild(el);
    const oldPosition = el.style.position;
    el.style.position = 'relative';
    this._refreshView();

    if (skipHistory === true) {
      return;
    }
    this.actionHistory.add('move-down', el,
        {
          old: {parent: oldParent, position: oldPosition},
          new: {parent: sibling, position: 'relative'}
        });
  }

  _refreshView() {
    this.dispatchEvent(new CustomEvent('refresh-view', {detail: {node: this}}));
    //Base.fire('refresh-view', {}, {node: this});
  }

  _selectedElementChanged() {
    this.dispatchEvent(new CustomEvent('selected-element-changed', {detail: {target: this.selectedElement, node: this}}));
    //Base.fire('selected-element-changed', {target: this.selectedElement}, {node: this});
  }

  _isCanvasElement(el) {
    return (el === this.canvasElement);
  }
}
