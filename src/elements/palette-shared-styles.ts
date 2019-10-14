const $_documentPalContainer = document.createElement('template');
$_documentPalContainer.innerHTML = `<dom-module id="palette-shared-styles">
  <template>
    <style>
      :host {
        display: block;
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        padding-bottom: 60px;
      }

      button {
        background-color: transparent;
        color: white;
        border: none;
        font-size: 13px;
        display: block;
        cursor: pointer;
        width: 100%;
        text-align: left;
        padding: 8px 14px;
      }
      button:hover {
        background: var(--light-grey);
      }

      div {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        padding: 4px 14px;
      }

      input {
        display: block;
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        margin: 10px;
        border-bottom: 1px solid white;
        width: 90%;
      }

      ::-webkit-input-placeholder { color: white; font-weight: 100; font-size: 14px; }
      ::-moz-placeholder { color: white; font-weight: 100; font-size: 14px;  }
      :-ms-input-placeholder { color: white; font-weight: 100; font-size: 14px;  }
      :-moz-placeholder { color: white; font-weight: 100; font-size: 14px;  }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentPalContainer.content);
