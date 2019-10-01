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

import './element-stuff-base.js';
import './element-stuff-shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class ElementFlex extends ElementStuffBase(PolymerElement) {
  static get template() {
    return html`
      <style include="element-stuff-shared-styles"></style>
      <div class="content-wrapper">
        <label for="position">position</label>
        <select name="position" id="position">
          <option>static</option>
          <option>absolute</option>
          <option>relative</option>
        </select>
        <label for="display">display</label>
        <select name="display" id="display">
          <option>block</option>
          <option>inline-block</option>
          <option>flex</option>
          <option>contents</option>
          <option>grid</option>
          <option>inherit</option>
          <option>initial</option>
          <option>none</option>
        </select>
        <label for="flex-direction">flex-direction</label>
        <select name="flexDirection" id="flex-direction">
          <option>row</option>
          <option>row-reverse</option>
          <option selected="">column</option>
          <option>column-reverse</option>
        </select>
        <label for="flex-wrap">flex-wrap</label>
        <select name="flexWrap" id="flex-wrap">
          <option selected="">nowrap</option>
          <option>wrap</option>
          <option>wrap-reverse</option>
        </select>
        <label for="justify-content">justify-content</label>
        <select name="justifyContent" id="justify-content">
          <option selected="">flex-start</option>
          <option>flex-end</option>
          <option>center</option>
          <option>space-between</option>
          <option>space-around</option>
        </select>
        <label for="align-items">align-items</label>
        <select name="alignItems" id="align-items">
          <option selected="">flex-start</option>
          <option>flex-end</option>
          <option>center</option>
          <option>baseline</option>
          <option>stretch</option>
        </select>
        <label for="align-content">align-content</label>
        <select name="alignContent" id="align-content">
          <option selected="">flex-start</option>
          <option>flex-end</option>
          <option>center</option>
          <option>space-between</option>
          <option>space-around</option>
          <option>stretch</option>
        </select>
        <label for="align-self">align-self</label>
        <select name="alignSelf" id="align-self">
          <option selected="">auto</option>
          <option>flex-start</option>
          <option>flex-end</option>
          <option>center</option>
          <option>baseline</option>
          <option>stretch</option>
        </select>
        <label for="flex">flex</label>
        <input name="flex" id="flex">
      </div>
    `;
  }

  static get is() { return 'element-stuff-flex'; }
  
  constructor() {
    super();
    this.stuffType = 'style';
  }

  display(elementStyles) {
    for (let i = 0; i < this._stuff.length; i++) {
      let name = this._stuff[i];
      let el = this.root.querySelector(`[name=${name}]`);
      el.value = elementStyles[name];
    }
  }
}
customElements.define(ElementFlex.is, ElementFlex);