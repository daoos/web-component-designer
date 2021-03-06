import { ServiceContainer } from '../services/ServiceContainer';
import { IDesignItem } from './IDesignItem';
import { InstanceServiceContainer } from '../services/InstanceServiceContainer';
import { CssStyleChangeAction } from '../services/undoService/transactionItems/CssStyleChangeAction';
import { ChangeGroup } from '../services/undoService/ChangeGroup';

export class DesignItem implements IDesignItem {
  node: Node;
  serviceContainer: ServiceContainer;
  instanceServiceContainer: InstanceServiceContainer;

  public get hasAttributes() {
    return this.attributes.size > 0;
  }
  public attributes: Map<string, string>

  public get hasStyles() {
    return this.styles.size > 0;
  }
  public styles: Map<string, string>

  private static _designItemSymbol = Symbol('DesignItem');

  public get element(): Element {
    return <Element>this.node;
  }

  public get name() {
    return this.element.localName;
  }

  public get id(): string {
    return this.element.id;
  }
  public set id(value: string) {
    this.element.id = value;
  }

  public get hasChildren() {
    return this.element.children.length > 0;
  }
  public *children(): IterableIterator<IDesignItem> {
    for (const e of this.element.children) {
      yield DesignItem.GetOrCreateDesignItem(e, this.serviceContainer, this.instanceServiceContainer);
    }
  }
  public get parent(): IDesignItem {
    return this.getOrCreateDesignItem(this.element.parentNode);
  }

  public get hasContent() {
    return this.element.children.length === 0 && this.content !== null;
  }
  public content: string = null;

  private _hideAtDesignTime: boolean;
  public get hideAtDesignTime() {
    return this._hideAtDesignTime;
  }
  public set hideAtDesignTime(value: boolean) {
    this._hideAtDesignTime = value;
    if (this.element instanceof HTMLElement || this.element instanceof SVGElement) {
      if (!value)
        this.element.style.display = this.styles['display'];
      else
        this.element.style.display = 'none';
    }
  }

  private _hideAtRunTime: boolean;
  public get hideAtRunTime() {
    return this._hideAtRunTime;
  }
  public set hideAtRunTime(value: boolean) {
    this._hideAtRunTime = value;
    if (this.element instanceof HTMLElement || this.element instanceof SVGElement) {
      if (!value)
        this.element.style.opacity = this.styles['opacity'];
      else
        this.element.style.opacity = '0.3';
    }
  }

  private _lockAtDesignTime: boolean;
  public get lockAtDesignTime() {
    return this._lockAtDesignTime;
  }
  public set lockAtDesignTime(value: boolean) {
    this._lockAtDesignTime = value;
    if (this.element instanceof HTMLElement || this.element instanceof SVGElement) {
      if (!value)
        this.element.style.pointerEvents = 'auto';
      else
        this.element.style.pointerEvents = 'none';
    }
  }

  constructor(node: Node, serviceContainer: ServiceContainer, instanceServiceContainer: InstanceServiceContainer) {
    this.node = node;
    this.serviceContainer = serviceContainer;
    this.instanceServiceContainer = instanceServiceContainer;

    this.attributes = new Map();
    this.styles = new Map();

    for (let a of this.element.attributes) {
      if (a.name !== 'style') {
        this.attributes.set(a.name, a.value);
        if (a.name === 'node-projects-hide-at-design-time')
          this._hideAtDesignTime = true;
        if (a.name === 'node-projects-hide-at-run-time')
          this._hideAtRunTime = true;
        if (a.name === 'node-projects-lock-at-design-time')
          this._lockAtDesignTime = true;
      }
    }
    if (node instanceof HTMLElement || node instanceof SVGElement) {
      for (let s of node.style) {
        let val = node.style[s];
        if (val && typeof val === 'string')
          this.styles.set(s, node.style[s]);
      }
      if (!this._lockAtDesignTime)
        node.style.pointerEvents = 'auto';
      else
        node.style.pointerEvents = 'none';

      //node.style.cursor = 'pointer';
    }

    (<HTMLElement>node).draggable = false; //even if it should be true, for better designer exp.

    if (this.element.children.length === 0)
      this.content = this.element.textContent;
  }

  public openGroup(title: string, affectedItems?: IDesignItem[]): ChangeGroup {
    return this.instanceServiceContainer.undoService.openGroup(title, affectedItems);
  }

  public getOrCreateDesignItem(node: Node) {
    return DesignItem.GetOrCreateDesignItem(node, this.serviceContainer, this.instanceServiceContainer);
  }

  static GetOrCreateDesignItem(node: Node, serviceContainer: ServiceContainer, instanceServiceContainer: InstanceServiceContainer): IDesignItem {
    if (!node)
      return null;
    let designItem: IDesignItem = node[DesignItem._designItemSymbol];
    if (!designItem) {
      designItem = new DesignItem(node, serviceContainer, instanceServiceContainer);
      node[DesignItem._designItemSymbol] = designItem;
    }
    return designItem;
  }

  static RemoveDesignItemFromElement(element: HTMLElement) {
    if (!element)
      return null;
    delete element[DesignItem._designItemSymbol];
  }

  public setStyle(name: keyof CSSStyleDeclaration, value?: string | null) {
    let action = new CssStyleChangeAction(this, name, value, this.styles.get(<string>name));
    this.instanceServiceContainer.undoService.execute(action);
  }
  public removeStyle(name: keyof CSSStyleDeclaration) {
    let action = new CssStyleChangeAction(this, name, '', this.styles.get(<string>name));
    this.instanceServiceContainer.undoService.execute(action);
  }

  public setAttribute(name: string, value?: string | null) {
    this.attributes.set(name, value);
    if (name != "draggable") {
      this.element.setAttribute(name, value);
    }
  }
  public removeAttribute(name: string) {
    this.attributes.delete(name);
    if (name != "draggable") {
      this.element.removeAttribute(name);
    }
  }
}