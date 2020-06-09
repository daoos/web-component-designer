import type { IPoint } from '../../../interfaces/IPoint.js';
import type { IContainerService } from './IContainerService.js';
import type { IDesignItem } from '../../item/IDesignItem.js';
import { IDesignerMousePoint } from '../../../interfaces/IDesignermousePoint.js';
import { IPlacementView } from '../../widgets/designerView/IPlacementView.js';

export class DefaultPlacementService implements IContainerService {

  //todo: we should be able to switch what we change 
  //(margin, absolute/relative position, order in flexbox)
  serviceForContainer(container: IDesignItem) {
    return true;
  }

  canEnter(container: IDesignItem, items: IDesignItem[]) {
    return true;
  }

  canLeave(container: IDesignItem, items: IDesignItem[]) {
    return true;
  }

  private calculateTrack(placementView: IPlacementView, startPoint: IDesignerMousePoint, newPoint: IDesignerMousePoint, item: IDesignItem): IPoint {
    let trackX = newPoint.x - startPoint.x;
    let trackY = newPoint.y - startPoint.y;

    if (placementView.alignOnGrid) {
      trackX = Math.round(trackX / placementView.gridSize) * placementView.gridSize;
      trackY = Math.round(trackY / placementView.gridSize) * placementView.gridSize;
    }
    else if (placementView.alignOnSnap) {
      //let rect = this.instanceServiceContainer.selectionService.primarySelection.element.getBoundingClientRect();
      let rect = item.element.getBoundingClientRect();
      let newPos = placementView.snapLines.snapToPosition({ x: newPoint.x - startPoint.controlOffsetX, y: newPoint.y - startPoint.controlOffsetY }, { width: rect.width, height: rect.height }, { x: trackX > 0 ? 1 : -1, y: trackY > 0 ? 1 : -1 })
      if (newPos.x !== null) {
        trackX = newPos.x - startPoint.x + startPoint.controlOffsetX;
      }
      if (newPos.y !== null) {
        trackY = newPos.y - startPoint.y + startPoint.controlOffsetY;
      }
    }

    return { x: trackX, y: trackY };
  }

  place(placementView: IPlacementView, container: IDesignItem, startPoint: IDesignerMousePoint, newPoint: IDesignerMousePoint, items: IDesignItem[]) {
    //todo, this should revert all undo actions while active
    //maybe a undo actions returns itself or an id so it could be changed?

    let track = this.calculateTrack(placementView, startPoint, newPoint, items[0]);

    //console.warn('track', track);
    //todo -> what is if a transform already exists -> backup existing style.?
    for (const designItem of items) {
      (<HTMLElement>designItem.element).style.transform = 'translate(' + track.x + 'px, ' + track.y + 'px)';
    }

    console.warn(startPoint)
    console.warn(newPoint)
    /*
    // See if it's over anything.
    let targets = this._rootContainer.element.querySelectorAll('*');
    for (let i = 0; i < targets.length; i++) {
      let possibleTarget = targets[i] as HTMLElement;
      possibleTarget.classList.remove('over');

      let possibleTargetDesignItem = this._rootContainer.getOrCreateDesignItem(possibleTarget);
      if (this._rootContainer.instanceServiceContainer.selectionService.selectedElements.indexOf(possibleTargetDesignItem) >= 0)
        continue;

      // todo put following a extenable function ...
      // in IContainerHandler ...

      // Only some native elements and things with slots can be drop targets.
      let slots = possibleTarget ? possibleTarget.querySelectorAll('slot') : [];
      // input is the only native in this app that doesn't have a slot
      let canDrop = (possibleTarget.localName.indexOf('-') === -1 && possibleTarget.localName !== 'input') || possibleTarget.localName === 'dom-repeat' || slots.length !== 0;

      if (!canDrop) {
        continue;
      }

      // Do we actually intersect this child?
      const possibleTargetRect = possibleTarget.getBoundingClientRect();
      if (possibleTargetRect.top - this._ownBoundingRect.top <= currentPoint.y &&
        possibleTargetRect.left - this._ownBoundingRect.left <= currentPoint.x &&
        possibleTargetRect.top - this._ownBoundingRect.top + possibleTargetRect.height >= currentPoint.y &&
        possibleTargetRect.left - this._ownBoundingRect.left + possibleTargetRect.width >= currentPoint.x) {

        // New target! Remove the other target indicators.
        var previousTargets = this._canvas.querySelectorAll('.over');
        for (var j = 0; j < previousTargets.length; j++) {
          previousTargets[j].classList.remove('over');
        }
        if (currentDesignItem != possibleTargetDesignItem && this._dropTarget != possibleTarget) {
          possibleTarget.classList.add('over');

          if (event.altKey) {
            if (this._dropTarget != null)
              this._dropTarget.classList.remove('over-enter');
            this._dropTarget = possibleTarget;
            this._dropTarget.classList.remove('over');
            this._dropTarget.classList.add('over-enter');
          }
        }
      }
    }*/
  }

  finishPlace(placementView: IPlacementView, container: IDesignItem, startPoint: IDesignerMousePoint, newPoint: IDesignerMousePoint, items: IDesignItem[]) {
    let track = this.calculateTrack(placementView, startPoint, newPoint, items[0]);

    for (const designItem of items) {
      let movedElement = designItem.element;

      let oldLeft = parseInt((<HTMLElement>movedElement).style.left);
      oldLeft = Number.isNaN(oldLeft) ? 0 : oldLeft;
      let oldTop = parseInt((<HTMLElement>movedElement).style.top);
      oldTop = Number.isNaN(oldTop) ? 0 : oldTop;
      //let oldPosition = movedElement.style.position;

      //todo: move this to handler wich is specific depeding on the container (e.g. canvasHandler, gridHandler, flexboxHandler...)
      //todo: designitem set properties undo...
      (<HTMLElement>designItem.element).style.transform = null;
      designItem.setStyle('position', 'absolute');
      designItem.setStyle('left', (track.x + oldLeft) + "px");
      designItem.setStyle('top', (track.y + oldTop) + "px");
    }
  }
}