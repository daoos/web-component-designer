export interface IContextMenuItem {
  readonly title: string;
  readonly action?: (e: HTMLElement, args?: Event) => void 
}