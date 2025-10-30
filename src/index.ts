import { registerLibrary, registerCustomElements } from 'tenum-wc-registration';
import Hello from "./Hello";
import Del from "./Del";

import {
  ChakraTableContainerElement,
  ChakraTableElement,
  ChakraTheadElement,
  ChakraTbodyElement,
  ChakraTrElement,
  ChakraThElement,
  ChakraTdElement,
  JsonFormElement
} from "./ChakraWebComponents";
import { ChakraProviderElement } from "./PortalHost";
import "./initChakraHost";

const VERSION = process.env.LIBRARY_VERSION || '0.0.0-dev';

console.log(`[HelloLib] Loaded version: ${VERSION}`);

registerLibrary({
  name: 'HelloLib',
  components: [
    {
      name: 'Hello',
      component: Hello,
      tag: 'x-hello',
      version: VERSION,
      props: { name: 'string' },
      events: { onHelloClick: {} }
    },
    {
      name: 'Del',
      component: Del,
      tag: 'x-del',
      version: VERSION,
      props: { text: 'string' }
    }
  ]
});

registerCustomElements({
  name: 'HelloLib',
  elements: {
    TableContainer: {
      elementClass: ChakraTableContainerElement,
      tag: 'chakra-table-container',
      version: VERSION,
      props: {
        display: 'string',
        maxWidth: 'string',
        overflowX: 'string',
        overflowY: 'string',
        whiteSpace: 'string'
      },
      eventMap: {}
    },
    Table: {
      elementClass: ChakraTableElement,
      tag: 'chakra-table',
      version: VERSION,
      props: {
        variant: 'string',
        size: 'string',
        colorscheme: 'string'
      },
      eventMap: {}
    },
    Thead: {
      elementClass: ChakraTheadElement,
      tag: 'chakra-thead',
      version: VERSION,
      props: {},
      eventMap: {}
    },
    Tbody: {
      elementClass: ChakraTbodyElement,
      tag: 'chakra-tbody',
      version: VERSION,
      props: {},
      eventMap: {}
    },
    Tr: {
      elementClass: ChakraTrElement,
      tag: 'chakra-tr',
      version: VERSION,
      props: {},
      eventMap: {}
    },
    Th: {
      elementClass: ChakraThElement,
      tag: 'chakra-th',
      version: VERSION,
      props: {
        text: 'string'
      },
      eventMap: {}
    },
    Td: {
      elementClass: ChakraTdElement,
      tag: 'chakra-td',
      version: VERSION,
      props: {
        text: 'string'
      },
      eventMap: {}
    },
    Provider: {
      elementClass: ChakraProviderElement,
      tag: 'chakra-provider',
      version: VERSION,
      props: {
        theme: 'json'
      },
      eventMap: {}
    },
    JsonForm: {
      elementClass: JsonFormElement,
      tag: 'chakra-jsonform',
      version: VERSION,
      props: {
        schema: 'json',
        uischema: 'json',
        formData: 'json'
      },
      eventMap: {
        onChange: 'formchange',
        onSubmit: 'formsubmit',
        onError: 'formerror'
      }
    }
  }
});

export function register() {
  console.log(`[HelloLib v${VERSION}] Components already registered via package`);
}
