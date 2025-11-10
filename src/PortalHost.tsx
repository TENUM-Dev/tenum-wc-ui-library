import React from "react";
import { ChakraProvider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, TableCaption, Badge, Card, CardHeader, CardBody, CardFooter, Code } from "@chakra-ui/react";
import { createPortal } from "react-dom";
import { Provider } from "./Provider";
import JsonForm from "./JsonForm";
import CardContent from "./CardContent";

export type ChakraElementType = "table-container" | "table" | "thead" | "tbody" | "tfoot" | "tr" | "th" | "td" | "table-caption" | "badge" | "code" | "provider" | "jsonform" | "card" | "card-header" | "card-body" | "card-footer";

export type NodeEntry = {
  id: string;
  parentId?: string;
  container: HTMLElement;
  type: ChakraElementType;
  props?: Record<string, any>;
  childrenOrder: string[];
  textContent?: string;
};

export class Registry {
  entries = new Map<string, NodeEntry>();
  listeners = new Set<() => void>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  upsert(entry: NodeEntry) {
    this.entries.set(entry.id, entry);
    this.notifyListeners();
  }

  remove(id: string) {
    const entry = this.entries.get(id);
    if (entry?.parentId) {
      const parent = this.entries.get(entry.parentId);
      if (parent) {
        parent.childrenOrder = parent.childrenOrder.filter(cid => cid !== id);
      }
    }
    this.entries.delete(id);
    this.notifyListeners();
  }

  addChild(parentId: string, childId: string) {
    const parent = this.entries.get(parentId);
    if (parent && !parent.childrenOrder.includes(childId)) {
      parent.childrenOrder.push(childId);
      this.notifyListeners();
    }
  }

  updateProps(id: string, props: Record<string, any>) {
    const entry = this.entries.get(id);
    if (entry) {
      entry.props = props;
      this.notifyListeners();
    }
  }

  updateTextContent(id: string, textContent: string) {
    const entry = this.entries.get(id);
    if (entry) {
      entry.textContent = textContent;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn());
  }
}

export const registry = new Registry();

export class ChakraProviderElement extends HTMLElement {
  protected _id: string;
  protected observer?: MutationObserver;

  constructor() {
    super();
    this._id = `provider-${Math.random().toString(36).substring(7)}`;
  }

  connectedCallback() {
    // Apply Box styles directly to the web component element
    this.applyStyles();

    // Register this provider in the portal registry
    registry.upsert({
      id: this._id,
      parentId: this.getParentChakraElement()?._id,
      container: this,
      type: "provider",
      props: this.collectProps(),
      childrenOrder: [],
      textContent: this.getTextContent()
    });

    const parentId = this.getParentChakraElement()?._id;
    if (parentId) {
      registry.addChild(parentId, this._id);
    }

    // Observe mutations to keep props/text in sync
    this.observer = new MutationObserver(() => {
      registry.updateTextContent(this._id, this.getTextContent());
    });

    this.observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    registry.remove(this._id);
  }

  protected getParentChakraElement(): ChakraProviderElement | undefined {
    let parent = this.parentElement;
    while (parent) {
      if (parent instanceof ChakraProviderElement) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return undefined;
  }

  protected collectProps(): Record<string, any> {
    const props: Record<string, any> = {};

    if (this.hasAttribute("data-theme")) {
      try {
        const themeStr = this.getAttribute("data-theme");
        if (themeStr) {
          props.theme = JSON.parse(decodeURIComponent(themeStr));
        }
      } catch (e) {
        console.warn("[ChakraProviderElement] Failed to parse theme:", e);
      }
    }

    // Copy other attributes, converting to camelCase
    for (const attr of this.attributes) {
      if (!attr.name.startsWith("data-") && attr.name !== "id" && attr.name !== "theme") {
        // Convert attribute name from lowercase to camelCase
        // e.g., "bordercolor" -> "borderColor", "borderwidth" -> "borderWidth"
        const camelCaseName = attr.name.replace(/([a-z])([a-z]+)/g, (m, p1, p2) =>
          p1 + p2.toLowerCase()
        ).replace(/^([a-z])/, (m) => m.toLowerCase());

        const chakraName = this.toCamelCase(attr.name);
        props[chakraName] = attr.value;
      }
    }

    return props;
  }

  /**
   * Convert lowercased attribute names to camelCase for Chakra UI
   * e.g., "bordercolor" -> "borderColor", "backgroundcolor" -> "backgroundColor"
   */
  private toCamelCase(str: string): string {
    const mapping: Record<string, string> = {
      bordercolor: "borderColor",
      borderwidth: "borderWidth",
      borderradius: "borderRadius",
      backgroundcolor: "backgroundColor",
      textcolor: "textColor",
      fontsize: "fontSize",
      fontweight: "fontWeight",
      padding: "padding",
      margin: "margin",
    };

    if (mapping[str.toLowerCase()]) {
      return mapping[str.toLowerCase()];
    }

    // Fallback: convert any lowercase string to camelCase
    return str
      .toLowerCase()
      .split(/[-_]/)
      .reduce((result, word, index) => {
        if (index === 0) return word;
        return result + word.charAt(0).toUpperCase() + word.slice(1);
      }, "");
  }

  protected getTextContent(): string {
    return this.textContent?.trim() || "";
  }

  /**
   * Apply Chakra Box styling directly to the web component element
   */
  private applyStyles(): void {
    const props = this.collectProps();

    const styleMap: Record<string, string> = {
      borderColor: props.borderColor || "",
      borderWidth: props.borderWidth || "",
      borderRadius: props.borderRadius || "",
      padding: props.padding || "",
      margin: props.margin || "",
      backgroundColor: props.backgroundColor || "",
    };

    // Apply styles to the element
    if (styleMap.borderColor) this.style.borderColor = styleMap.borderColor;
    if (styleMap.borderWidth) this.style.borderWidth = styleMap.borderWidth;
    if (styleMap.borderRadius) this.style.borderRadius = styleMap.borderRadius;
    if (styleMap.padding) this.style.padding = styleMap.padding;
    if (styleMap.margin) this.style.margin = styleMap.margin;
    if (styleMap.backgroundColor) this.style.backgroundColor = styleMap.backgroundColor;

    // Ensure the element displays as a block to contain children
    this.style.display = "block";
  }
}

function buildReactNode(id: string, entries: Map<string, NodeEntry>, isRoot: boolean = false): React.ReactNode {
  const entry = entries.get(id);
  // console.warn('entry', entry);
  if (!entry) {
    console.warn('[PortalHost] Entry not found for id:', id);
    return null;
  }

  const children = entry.childrenOrder.map(childId => buildReactNode(childId, entries, false));

  const content = children.length > 0 ? children : (entry.textContent || null);

  let element: React.ReactNode = null;

  switch (entry.type) {
    case "table-container":
      // console.error('[PortalHost] Building table-container with props:', entry.props);
      const { maxwidth, overflowx, overflowy, whitespace, ...otherProps } = entry.props || {};
      const tableContainerProps = {
        ...otherProps,
        maxWidth: maxwidth,
        overflowX: overflowx,
        overflowY: overflowy,
        whiteSpace: whitespace,
        display: entry.props?.display
      };
      element = <TableContainer {...tableContainerProps}>{children}</TableContainer>;
      break;
    case "table":
      element = <Table {...entry.props}>{children}</Table>;
      break;
    case "thead":
      element = <Thead {...entry.props}>{children}</Thead>;
      break;
    case "tbody":
      element = <Tbody {...entry.props}>{children}</Tbody>;
      break;
    case "tfoot":
      element = <Tfoot {...entry.props}>{children}</Tfoot>;
      break;
    case "tr":
      element = <Tr {...entry.props}>{children}</Tr>;
      break;
    case "th":
      element = <Th {...entry.props}>{content}</Th>;
      break;
    case "td":
      element = <Td {...entry.props}>{content}</Td>;
      break;
    case "table-caption":
      element = <TableCaption {...entry.props}>{content}</TableCaption>;
      break;
    case "badge":
      element = <Badge {...entry.props}>{content}</Badge>;
      break;
    case "code":
      const { children: childrenProp, ...codeProps } = entry.props || {};
      const codeContent = childrenProp || content;
      if (!(window as any).__codeRenderLogged) {
        (window as any).__codeRenderLogged = true;
        console.log('[PortalHost] Code rendering:', {
          propsKeys: Object.keys(entry.props || {}),
          props: Object.keys(entry.props || {}).reduce((acc, k) => {
            acc[k] = entry.props?.[k];
            return acc;
          }, {} as Record<string, any>),
          childrenProp: childrenProp || '(undefined)',
          content: content || '(null)',
          codeContent: codeContent || '(empty)',
          textContent: entry.textContent || '(empty)'
        });
      }
      element = <Code {...codeProps}>{codeContent}</Code>;
      break;
    case "card":
      element = <Card {...entry.props}>{children}</Card>;
      break;
    case "card-header":
      element = <CardHeader {...entry.props}>{children}</CardHeader>;
      break;
    case "card-body":
      element = <CardContent {...entry.props}>{children}</CardContent>;
      break;
    case "card-footer":
      element = <CardFooter {...entry.props}>{children}</CardFooter>;
      break;
    case "provider":
      const providerTheme = entry.props?.theme;
      element = <Provider theme={providerTheme}>{children}</Provider>;
      break;
    case "jsonform":
      const { schema, uischema, formData, onChange, onSubmit, onError } = entry.props || {};
      element = (
        <JsonForm
          schema={schema}
          uischema={uischema}
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          onError={onError}
        />
      );
      break;
  }

  // Only create portals for parent elements (those without parentId)
  if (isRoot) {
    return createPortal(element, entry.container);
  } else {
    return element;
  }
}

export default function PortalHost() {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = registry.subscribe(() => {
      setTick(x => x + 1);

      return unsubscribe;
    });
  }, []);

  const parentNodes = Array.from(registry.entries.values()).filter(e => !e.parentId);

  return (
    <ChakraProvider>
      {parentNodes.map(e => (
        <React.Fragment key={e.id}>
          {buildReactNode(e.id, registry.entries, true)}
        </React.Fragment>
      ))}
    </ChakraProvider>
  );
}
