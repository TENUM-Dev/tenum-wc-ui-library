import React from "react";
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { createPortal } from "react-dom";

export type ChakraElementType = "table-container" | "table" | "thead" | "tbody" | "tr" | "th" | "td";

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
    case "tr":
      element = <Tr {...entry.props}>{children}</Tr>;
      break;
    case "th":
      element = <Th {...entry.props}>{content}</Th>;
      break;
    case "td":
      element = <Td {...entry.props}>{content}</Td>;
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
