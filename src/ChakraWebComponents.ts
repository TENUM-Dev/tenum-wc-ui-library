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
        this.style.border = "1px solid red";
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

  console.log('[ChakraWC] All Chakra web components registered');
}
