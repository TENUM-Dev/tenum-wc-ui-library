export interface ComponentMetadata {
  tag: string;
  version?: string;
  styles?: Record<string, any>;
  props?: Record<string, string>;
  eventMap?: Record<string, string>;
}

export interface ComponentLibraryMetadata {
  [componentName: string]: ComponentMetadata;
}

export interface ComponentRegistry {
  register(libraryName: string, components: ComponentLibraryMetadata): void;
  get(libraryName: string, componentName: string): ComponentMetadata | undefined;
  getLibrary(libraryName: string): ComponentLibraryMetadata | undefined;
  getAllLibraries(): string[];
}


declare global {
  interface Window {
    __COMPONENT_REGISTRY__?: ComponentRegistry;
  }
}

export {};


