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

class DemoView extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        #placeholder {
          height: 100%;
          width: 100%;
        }
        #loading {
          position: absolute;
          top: 60px;
          left: 20px;
        }
        iframe {
          width: 100%;
          height: 100%;
        }
      </style>
      <div id="placeholder"></div>
      <div id="loading">🛀 Hold on, loading...</div>
    `;
  }

  static get is() { return 'demo-view'; }

  display(code) {
    let iframe = document.createElement('iframe');
    iframe.frameBorder = '0';
    this.$.placeholder.innerHTML = '';
    this.$.placeholder.appendChild(iframe);
    this.$.loading.hidden = false;

    iframe.onload = function() {
      this.$.loading.hidden = true;
    }.bind(this);

    let doc = iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  }
}
customElements.define(DemoView.is, DemoView);
