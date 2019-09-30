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

import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './palette-shared-styles.js';
import './palette-base.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Base } from '@polymer/polymer/polymer-legacy.js';

/*
 * List of elements that can be added to the view.
 * This list is generated from the `devDependencies` field of this
 * app's package.json
 */
class ElementsView extends PaletteBase(PolymerElement) {
  static get template() {
    return html`
      <style include="palette-shared-styles"></style>

      <!-- A typeahead search -->
      <input list="list" placeholder="Filter Custom Elements" id="filter">
      <datalist id="list">
        <dom-repeat items="[[elements]]">
          <template>
            <option value="[[item]]">
          </option></template>
        </dom-repeat>
      </datalist>

      <!-- The list of clickable buttons -->
      <dom-repeat items="[[elements]]">
        <template>
          <button>[[item]]</button>
        </template>
      </dom-repeat>
      <iron-ajax auto="" url="package.json" handle-as="json" on-response="_elementsReady"></iron-ajax>
    `;
  }

  static get is() { return 'palette-elements'; }

  ready() {
    super.ready();
    this.namesToPackages = {};
  }

  _elementsReady(event) {
    // First, some elements have sub-elements in the same package.
    let subElements = event.detail.response.subelements;
    let list = event.detail.response.devDependencies;

    for (let p in list) {
      this.namesToPackages[p] = p;
    }

    let subelements = [];
    for (let parent in subElements) {
      for (let i = 0; i < subElements[parent].length; i++) {
        subelements.push(`${parent}/${subElements[parent][i]}`);
        let packageName = parent;
        if (parent === 'app-layout') {
          packageName = parent + '/' + subElements[parent][i];
        }
        this.namesToPackages[subElements[parent][i]] = packageName;
      }
    }
    this.elements = Object.keys(list).concat(subelements).sort();

    Base.fire('package-names-ready', {list: this.namesToPackages}, {node: this});
  }

  _doClick(target, kind) {
    // maybe it's a package/subpackage kind of thing.
    let matches = kind.match(/(.*)\/(.*)/);
    let packageName = kind;
    if (matches && matches.length === 3) {
      packageName = matches[1];
      kind = matches[2];
    }
    this.maybeDoHTMLImport(kind, this.namesToPackages[kind]);
  }

  maybeDoHTMLImport(kind, packageName) {
    if (packageName === undefined) {
      // Oof, someone didn't know what element this was. Find it in the list.
      packageName = this.namesToPackages[kind];
    }
    
    this._fireEvent('new-element', kind, packageName, '');
  }
}
customElements.define(ElementsView.is, ElementsView);
