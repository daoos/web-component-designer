import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { customElement } from '@polymer/decorators';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';

@customElement("app-layout-sample")
export class AppLayoutSample extends PolymerElement {
  static get template() {
    return html`
      <style>
        .sample_app_layout__box {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          padding: 16px;
          margin: 24px;
          border-radius: 5px;
          background-color: #fff;
          color: #757575;
        }
      
        .sample_app_layout__box .sample1_avatar {
          display: inline-block;
          height: 64px;
          width: 64px;
          border-radius: 50%;
          background: #ddd;
          line-height: 64px;
          font-size: 30px;
          color: #555;
          text-align: center;
        }
      
        .sample_app_layout__box h2 {
          font-size: 22px;
          margin: 16px 0;
          color: #212121;
        }
      </style>
      <app-header style="background-color: #4285f4;color:white" condenses reveals effects="waterfall">
        <app-toolbar>
          <paper-icon-button icon="menu" onclick="_sampleAppLayoutDrawer.toggle()"></paper-icon-button>
        </app-toolbar>
        <app-toolbar>
          <div spacer main-title>My App</div>
        </app-toolbar>
      </app-header>
      <app-drawer id="_sampleAppLayoutDrawer" align="start">
        <app-toolbar>
          <div>My App</div>
        </app-toolbar>
        <paper-listbox>
          <paper-item>action one</paper-item>
          <paper-item>action two</paper-item>
          <paper-item>action three</paper-item>
        </paper-listbox>
      </app-drawer>
      <div class="sample_app_layout__box">
        <div class="sample1_avatar">B</div>
        <h2> I am a title</h2>
        <p>I am a subtitle</p>
      </div>
      <div class="sample_app_layout__box">
        <div class="sample1_avatar">B</div>
        <h2> I am a title</h2>
        <p>I am a subtitle</p>
      </div>
    `;
  }
}
