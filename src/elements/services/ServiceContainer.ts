import { IPropertiesService } from "./propertiesService/IPropertiesService";
import { IContainerService } from './placementService/IContainerService';
import { IElementsService } from './elementsService/IElementsService';
import { IInstanceService } from './instanceService/IInstanceService';
import { IEditorTypesService } from './propertiesService/IEditorTypesService';
import { BaseServiceContainer } from './BaseServiceContainer';
import { IHtmlWriterService } from './serializationService/IHtmlWriterService';
import { CodeViewMonaco } from "../widgets/codeView/code-view-monaco";
import { ICodeView } from "../widgets/codeView/ICodeView";
import { IHtmlParserService } from "./htmlParserService/IHtmlParserService";

interface ServiceNameMap {
  "propertyService": IPropertiesService;
  "containerService": IContainerService;
  "elementsService": IElementsService;
  "instanceService": IInstanceService;
  "editorTypesService": IEditorTypesService;
  "htmlWriterService": IHtmlWriterService;
  "htmlParserService": IHtmlParserService;
}

export class ServiceContainer extends BaseServiceContainer<ServiceNameMap>  {

  readonly config: {
    codeViewWidget: new (...args: any[]) => ICodeView & HTMLElement
  } = {
      codeViewWidget: CodeViewMonaco
    };

  get propertiesServices(): IPropertiesService[] {
    return this.getServices('propertyService');
  }

  get containerServices(): IContainerService[] {
    return this.getServices('containerService');
  }

  get elementsServices(): IElementsService[] {
    return this.getServices('elementsService');
  }

  get instanceServices(): IInstanceService[] {
    return this.getServices('instanceService');
  }

  get editorTypesServices(): IEditorTypesService[] {
    return this.getServices('editorTypesService');
  }

  get htmlWriterServices(): IHtmlWriterService[] {
    return this.getServices('htmlWriterService');
  }

  get htmlParserService(): IHtmlParserService {
    return this.getLastService('htmlParserService');
  }
}