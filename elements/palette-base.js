/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { Base } from '@polymer/polymer/polymer-legacy.js';

window.PaletteBase = function(base) {
  return class extends base {
    static get properties() {
      return {
        elements: { type: Array }
      }
    }

    ready() {
      super.ready();
      this.addEventListener('click', this._click.bind(this));

      if (this.$.filter) {
        this.$.filter.addEventListener('input', this._filterInput.bind(this));
      }
    }

    _elementsReady(event) {
      this.elements = event.detail.response.elements;
    }

    _click(event) {
      // Need composed path because the event is coming from a shadow root (the sub-palette).
      let target = event.composedPath()[0];
      let kind = target.textContent;
      if (target.tagName !== 'BUTTON') {
        return;
      }
      this._doClick(target, kind);
    }

    _filterInput(event) {
      if (!this.elements) {
        this.$.filter.removeEventListener('input', this._filterInput);
        return;
      }
      var selectedValue = event.target.value;
      // Only do something if this is a complete element name, not some
      // partial typing.
      if (this.elements.indexOf(selectedValue) !== -1) {
        this._doClick(null, selectedValue);
      }
    }

    _fireEvent(name, tag, packageName, template) {
      Base.fire(name, {
        type: tag,
        template: template,
        package: packageName
      }, {node: this});
    }
  };
}
