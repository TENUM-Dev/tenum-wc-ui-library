import { registerLibrary, registerCustomElements } from 'tenum-wc-registration';
import Hello from "./Hello";
import JsonForm from "./JsonForm";
import Del from "./Del";
import Provider from "./Provider";

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

registerLibrary({
  name: 'HelloLib',
  components: [
    {
      name: 'Hello',
      component: Hello,
      tag: 'x-hello',
      version: '1.0.0',
      props: { name: 'string' },
      events: { onHelloClick: {} }
    },
    {
      name: 'Del',
      component: Del,
      tag: 'x-del',
      version: '1.0.0',
      props: { text: 'string' }
    },
    {
      name: 'Provider',
      component: Provider,
      tag: 'x-provider',
      version: '1.0.0',
      props: {
        theme: 'json'
      },
      events: {}
    }
  ]
});

registerCustomElements({
  name: 'HelloLib',
  elements: {
    TableContainer: {
      elementClass: ChakraTableContainerElement,
      tag: 'chakra-table-container',
      version: '1.0.0',
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
      version: '1.0.0',
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
      version: '1.0.0',
      props: {},
      eventMap: {}
    },
    Tbody: {
      elementClass: ChakraTbodyElement,
      tag: 'chakra-tbody',
      version: '1.0.0',
      props: {},
      eventMap: {}
    },
    Tr: {
      elementClass: ChakraTrElement,
      tag: 'chakra-tr',
      version: '1.0.0',
      props: {},
      eventMap: {}
    },
    Th: {
      elementClass: ChakraThElement,
      tag: 'chakra-th',
      version: '1.0.0',
      props: {
        text: 'string'
      },
      eventMap: {}
    },
    Td: {
      elementClass: ChakraTdElement,
      tag: 'chakra-td',
      version: '1.0.0',
      props: {
        text: 'string'
      },
      eventMap: {}
    },
    Provider: {
      elementClass: ChakraProviderElement,
      tag: 'chakra-provider',
      version: '1.0.0',
      props: {
        theme: 'json'
      },
      eventMap: {}
    },
    JsonForm: {
      elementClass: JsonFormElement,
      tag: 'chakra-jsonform',
      version: '1.0.0',
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
  console.log('[HelloLib] Components already registered via package');
}
