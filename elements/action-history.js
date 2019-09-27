/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Base } from '@polymer/polymer/polymer-legacy.js';

/*
 * Manages a stack of available undo/redo actions
 */
class ActionHistory extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
    `;
  }

  static get is() { return 'action-history'; }

  constructor() {
    super();
    this.undoHistory = [];
    this.redoHistory = [];
  }

  add(action, node, detail) {
    const item = {
      action: action,
      node: node,
      detail: detail
    };

    // Don't save no-ops: this action may have the new state the same as
    // the old state (like when you start dragging but don't get anywhere)
    if (detail && detail.new && detail.old &&
        this._itemsMatch(action, detail.new, detail.old)) {
      return;
    }

    const topItem = this.undoHistory[this.undoHistory.length - 1];

    // Don't save dupes: this action may be a duplicate of the previous one.
    if (topItem &&
        item.action === topItem.action &&
        topItem.node === item.node &&
        item.detail && topItem.detail &&
        this._itemsMatch(item.action, item.detail, topItem.detail)) {
      return;
    }

    this.undoHistory.push(item);

    // A new item in the undo stack means you have nothing to redo.
    this.redoHistory = [];
    this.updateButtons();
  }

  undo() {
    // Take the top action off the undo stack and move it to the redo stack.
    const item = this.undoHistory.pop();
    this.redoHistory.push(item);
    this.updateButtons();

    const detail = item.detail;
    item.node.click();
    switch(item.action) {
      case 'update':
          Base.fire('element-updated',
              {type: detail.type, name: detail.name, value: detail.old.value, skipHistory: true},
              {node: this});
          break;
      case 'new':
          Base.fire('remove-from-canvas',
              {target: item.node, parent: item.detail.parent},
              {node: this});
          break;
      case 'delete':
          if (item.node.id === 'viewContainer') {
            item.node.setInnerHTML(detail.innerHTML);
          } else {
            detail.parent.appendChild(item.node);
          }
          break;
      case 'move':
          this._updatePosition(item.node, detail.old);
          break;
      case 'resize':
          this._updateSize(item.node, detail.old);
          break;
      case 'reparent':
      case 'move-up':
      case 'move-down':
          this._reparent(item.node, detail.new.parent, detail.old.parent);
          this._updatePosition(item.node, detail.old);
          break;
      case 'fit':
          this._updatePosition(item.node, detail.old);
          this._updateSize(item.node, detail.old);
          break;
      case 'move-back':
          Base.fire('move', {type:'forward', skipHistory: true}, {node: this});
          break;
      case 'move-forward':
          Base.fire('move', {type:'back', skipHistory: true}, {node: this});
          break;
    }
    item.node.click();
  }

  redo() {
    // Take the top action off the redo stack and move it to the undo stack.
    let item = this.redoHistory.pop();
    let detail = item.detail;
    this.undoHistory.push(item);
    this.updateButtons();

    item.node.click();
    switch(item.action) {
      case 'update':
          Base.fire('element-updated',
              {type: detail.type, name: detail.name, value: detail.new.value, skipHistory: true},
              {node: this});
          break;
      case 'new':
          Base.fire('add-to-canvas',
              {target: item.node, parent: item.detail.parent},
              {node: this});
          break;
      case 'delete':
          // If the node is the viewContainer, clear its inner HTML.
          if (item.node.id === 'viewContainer') {
            item.node.setInnerHTML('');
          } else {
            item.node.parentElement.click();
            item.node.parentElement.removeChild(item.node);
          }
          break;
      case 'move':
          this._updatePosition(item.node, detail.new);
          break;
      case 'resize':
          this._updateSize(item.node, detail.new);
          break;
      case 'reparent':
      case 'move-up':
      case 'move-down':
          this._reparent(item.node, detail.old.parent, detail.new.parent);
          this._updatePosition(item.node, detail.new);
          break;
      case 'fit':
          this._updateSize(item.node, detail.new);
          this._updatePosition(item.node, detail.new);
          break;
      case 'move-back':
          Base.fire('move', {type:'forward', skipHistory: true}, {node: this});
          break;
      case 'move-forward':
          Base.fire('move', {type:'back', skipHistory: true}, {node: this});
          break;
    }
    item.node.click();
  }

  updateButtons() {
    Base.fire('update-action-buttons',
        {undos: this.undoHistory.length, redos: this.redoHistory.length}, {node: this});
  }

  _itemsMatch(action, first, second) {
    // These kinds of actions have element refs in the details,
    // and you can't json those anyway.
    if (action === 'reparent' || action === 'move-up' || action === 'move-down') {
      return false;
    }
    return JSON.stringify(first) === JSON.stringify(second);
  }

  _updatePosition(node, detail) {
    node.style.left = detail.left;
    node.style.top = detail.top;
    node.style.position = detail.position;
  }

  _updateSize(node, detail) {
    node.style.width = detail.width;
    node.style.height = detail.height;
  }

  _reparent(node, oldParent, newParent) {
    oldParent.removeChild(node);
    newParent.appendChild(node);
  }
}
customElements.define(ActionHistory.is, ActionHistory);
