var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

import { PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
import { html } from "../../node_modules/@polymer/polymer/lib/utils/html-tag.js";
import { customElement } from "../../node_modules/@polymer/decorators/lib/decorators.js";
import { PaletteBase } from './palette-base.js';
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import './palette-shared-styles.js';
import './palette-base.js';
/*
 * List of custom templates that can be added to the view.
 */

let SamplesView = class SamplesView extends PaletteBase(PolymerElement) {
  static get template() {
    return html`
      <style include="palette-shared-styles"></style>

      <!-- A typeahead search -->
      <input list="list" placeholder="Filter Samples" id="filter">
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

      <iron-ajax auto="" url="./elements-samples.json" handle-as="json" on-response="_elementsReady"></iron-ajax>
    `;
  }

  async _doClick(_, kind) {
    this._fireEvent('new-sample', kind, '', '');
    /*Base.import(url, function(e) {
      let doc = e.target.import;
      let template = doc.querySelector('template');
      this._fireEvent('new-sample', kind, '', template);
    }.bind(this));*/

  }

};
SamplesView = __decorate([customElement('palette-samples')], SamplesView);
export { SamplesView }; //# sourceMappingURL=palette-samples.js.map