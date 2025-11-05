import { type JSONSchema7 } from "json-schema";
import { registry, ChakraElementType } from "./PortalHost";

abstract class ChakraElementBase extends HTMLElement {
  protected _id: string;
  protected observer?: MutationObserver;
  protected abstract elementType: ChakraElementType;

  constructor() {
    super();
    this._id = this.generateId();
  }

  protected generateId(): string {
    return `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  }

  protected getParentChakraElement(): ChakraElementBase | null {
    let parent = this.parentElement;
    while (parent) {
      if (parent instanceof ChakraElementBase) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  protected collectProps(): Record<string, any> {
    const props: Record<string, any> = {};
    for (const attr of this.attributes) {
      if (attr.name === "variant" || attr.name === "size" || attr.name === "colorscheme") {
        props[attr.name] = attr.value;
      }
      // For th/td elements
      if (attr.name === "text") {
        props[attr.name] = attr.value;
      }
      // For th/td isNumeric - HTML lowercases attributes to "isnumeric"
      if (attr.name === "isnumeric") {
        props.isNumeric = attr.value === 'true' || attr.value === '';
      }
      // For table-container elements
      if (this.elementType === "table-container") {
        if (attr.name === "display" || attr.name === "maxwidth" ||
            attr.name === "overflowx" || attr.name === "overflowy" ||
            attr.name === "whitespace" || attr.name === "maxWidth" ||
            attr.name === "overflowX" || attr.name === "overflowY" ||
            attr.name === "whiteSpace") {
          props[attr.name] = attr.value;
        }
      }
    }
    return props;
  }

  protected getTextContent(): string {
    const textAttr = this.getAttribute("text");
    if (textAttr) return textAttr;

    return this.textContent?.trim() || "";
  }

  protected setDisplayStyle(): void {
    switch (this.elementType) {
      case "table-container":
        // this.style.border = "1px solid red";
        break;
      case "table":
        this.style.display = "table";
        break;
      case "thead":
        this.style.display = "table-header-group";
        break;
      case "tbody":
        this.style.display = "table-row-group";
        break;
      case "tr":
        this.style.display = "table-row";
        break;
      case "th":
        this.style.display = "table-cell";
        break;
      case "td":
        this.style.display = "table-cell";
        break;
    }
  }

  connectedCallback() {
    this.setDisplayStyle();

    queueMicrotask(() => {
      const parent = this.getParentChakraElement();
      const parentId = parent?._id;

      // console.log(`[ChakraWC] ${this.elementType} connected, parent: ${parentId || 'none'}, text: ${this.getTextContent()}`);

      registry.upsert({
        id: this._id,
        parentId,
        container: this, // Element itself as the portal target
        type: this.elementType,
        props: this.collectProps(),
        childrenOrder: [],
        textContent: this.getTextContent()
      });

      if (parentId) {
        registry.addChild(parentId, this._id);
      }

      // For th/td elements
      this.observer = new MutationObserver(() => {
        registry.updateTextContent(this._id, this.getTextContent());
      });
      this.observer.observe(this, {
        childList: true,
        characterData: true,
        subtree: true
      });

      this.observeAttributes();

      // console.log(`[ChakraWC] Registry now has ${registry.entries.size} entries`);
    });
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    registry.remove(this._id);
  }

  protected observeAttributes() {
    const attrObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          registry.updateProps(this._id, this.collectProps());

          if (mutation.attributeName === "text") {
            registry.updateTextContent(this._id, this.getTextContent());
          }
        }
      }
    });
    attrObserver.observe(this, { attributes: true });
  }

  get __id(): string {
    return this._id;
  }
}

export class ChakraTableContainerElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "table-container";
}

export class ChakraTableElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "table";
}

export class ChakraTheadElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "thead";
}

export class ChakraTbodyElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "tbody";
}

export class ChakraTrElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "tr";
}

export class ChakraThElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "th";
}

export class ChakraTdElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "td";
}

export class ChakraTableCaptionElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "table-caption";
}

export class ChakraTfootElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "tfoot";
}

export class ChakraBadgeElement extends ChakraElementBase {
  protected elementType: ChakraElementType = "badge";
}

export class JsonFormElement extends HTMLElement {
  protected _id: string;
  protected observer?: MutationObserver;
  private _schema: JSONSchema7 | null = null;
  private _uischema: any = null;
  private _formData: any = null;

  constructor() {
    super();
    this._id = `jsonform-${Math.random().toString(36).substring(7)}`;
  }

  get schema(): JSONSchema7 | null {
    return this._schema;
  }

  set schema(value: JSONSchema7 | null) {
    this._schema = value;
    this.updateRegistry();
  }

  get uischema(): any {
    return this._uischema;
  }

  set uischema(value: any) {
    this._uischema = value;
    this.updateRegistry();
  }

  get formData(): any {
    return this._formData;
  }

  set formData(value: any) {
    this._formData = value;
    this.updateRegistry();
  }

  connectedCallback() {
    this.style.display = "block";

    this.parseAttributes();

    const parent = this.getParentElement();
    const parentId = parent?._id;

    registry.upsert({
      id: this._id,
      parentId,
      container: this,
      type: "jsonform",
      props: this.collectProps(),
      childrenOrder: [],
      textContent: ""
    });

    if (parentId) {
      registry.addChild(parentId, this._id);
    }

    this.observer = new MutationObserver(() => {
      this.parseAttributes();
      this.updateRegistry();
    });

    this.observer.observe(this, {
      attributes: true,
      attributeFilter: ["schema", "uischema", "formdata"]
    });
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    registry.remove(this._id);
  }

  private parseAttributes(): void {
    const schemaAttr = this.getAttribute("schema");
    if (schemaAttr) {
      try {
        this._schema = JSON.parse(decodeURIComponent(schemaAttr));
      } catch (e) {
        console.warn("[JsonFormElement] Failed to parse schema:", e);
      }
    }

    const uischemaAttr = this.getAttribute("uischema");
    if (uischemaAttr) {
      try {
        this._uischema = JSON.parse(decodeURIComponent(uischemaAttr));
      } catch (e) {
        console.warn("[JsonFormElement] Failed to parse uischema:", e);
      }
    }

    const formDataAttr = this.getAttribute("formdata");
    if (formDataAttr) {
      try {
        this._formData = JSON.parse(decodeURIComponent(formDataAttr));
      } catch (e) {
        console.warn("[JsonFormElement] Failed to parse formData:", e);
      }
    }
  }

  private getParentElement(): any {
    let parent = this.parentElement;
    while (parent) {
      if ((parent as any)._id) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return undefined;
  }

  private collectProps(): Record<string, any> {
    const onChange = (data: any) => {
      this.dispatchEvent(new CustomEvent('formchange', {
        detail: data,
        bubbles: true,
        composed: true
      }));
    };

    const onSubmit = (data: any) => {
      this.dispatchEvent(new CustomEvent('formsubmit', {
        detail: data,
        bubbles: true,
        composed: true
      }));
    };

    const onError = (errors: any) => {
      this.dispatchEvent(new CustomEvent('formerror', {
        detail: errors,
        bubbles: true,
        composed: true
      }));
    };

    return {
      schema: this._schema,
      uischema: this._uischema,
      formData: this._formData,
      onChange,
      onSubmit,
      onError
    };
  }

  private updateRegistry(): void {
    registry.updateProps(this._id, this.collectProps());
  }
}

export function registerChakraWebComponents() {
  // console.log('[ChakraWC] Registering Chakra web components...');

  if (!customElements.get("chakra-table-container")) {
    customElements.define("chakra-table-container", ChakraTableContainerElement);
    // console.log('[ChakraWC] Registered chakra-table-container');
  }
  if (!customElements.get("chakra-table")) {
    customElements.define("chakra-table", ChakraTableElement);
    // console.log('[ChakraWC] Registered chakra-table');
  }
  if (!customElements.get("chakra-thead")) {
    customElements.define("chakra-thead", ChakraTheadElement);
    // console.log('[ChakraWC] Registered chakra-thead');
  }
  if (!customElements.get("chakra-tbody")) {
    customElements.define("chakra-tbody", ChakraTbodyElement);
    // console.log('[ChakraWC] Registered chakra-tbody');
  }
  if (!customElements.get("chakra-tr")) {
    customElements.define("chakra-tr", ChakraTrElement);
    // console.log('[ChakraWC] Registered chakra-tr');
  }
  if (!customElements.get("chakra-th")) {
    customElements.define("chakra-th", ChakraThElement);
    // console.log('[ChakraWC] Registered chakra-th');
  }
  if (!customElements.get("chakra-td")) {
    customElements.define("chakra-td", ChakraTdElement);
    // console.log('[ChakraWC] Registered chakra-td');
  }
  if (!customElements.get("chakra-table-caption")) {
    customElements.define("chakra-table-caption", ChakraTableCaptionElement);
    // console.log('[ChakraWC] Registered chakra-table-caption');
  }
  if (!customElements.get("chakra-tfoot")) {
    customElements.define("chakra-tfoot", ChakraTfootElement);
    // console.log('[ChakraWC] Registered chakra-tfoot');
  }
  if (!customElements.get("chakra-badge")) {
    customElements.define("chakra-badge", ChakraBadgeElement);
    // console.log('[ChakraWC] Registered chakra-badge');
  }

  console.log('[ChakraWC] All Chakra web components registered');
}
