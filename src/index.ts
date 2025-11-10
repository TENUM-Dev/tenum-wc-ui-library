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
  ChakraTableCaptionElement,
  ChakraTfootElement,
  ChakraBadgeElement,
  ChakraCodeElement,
  ChakraCardElement,
  ChakraCardHeaderElement,
  ChakraCardBodyElement,
  ChakraCardFooterElement,
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
        text: 'string',
        isNumeric: 'boolean'
      },
      eventMap: {}
    },
    Td: {
      elementClass: ChakraTdElement,
      tag: 'chakra-td',
      version: VERSION,
      props: {
        text: 'string',
        isNumeric: 'boolean'
      },
      eventMap: {}
    },
    TableCaption: {
      elementClass: ChakraTableCaptionElement,
      tag: 'chakra-table-caption',
      version: VERSION,
      props: {
        text: 'string'
      },
      eventMap: {}
    },
    Tfoot: {
      elementClass: ChakraTfootElement,
      tag: 'chakra-tfoot',
      version: VERSION,
      props: {},
      eventMap: {}
    },
    Badge: {
      elementClass: ChakraBadgeElement,
      tag: 'chakra-badge',
      version: VERSION,
      props: {
        text: 'string',
        colorScheme: 'string',
        size: 'string',
        variant: 'string'
      },
      eventMap: {}
    },
    Code: {
      elementClass: ChakraCodeElement,
      tag: 'chakra-code',
      version: VERSION,
      props: {
        children: 'string',
        colorScheme: 'string',
        size: 'string',
        variant: 'string'
      },
      eventMap: {}
    },
    Card: {
      elementClass: ChakraCardElement,
      tag: 'chakra-card',
      version: VERSION,
      props: {
        colorScheme: 'string',
        size: 'string',
        variant: 'string',
        align: 'string',
        direction: 'string',
        justify: 'string'
      },
      eventMap: {
        onContextMenuEvent: 'contextmenu'
      }
    },
    CardHeader: {
      elementClass: ChakraCardHeaderElement,
      tag: 'chakra-card-header',
      version: VERSION,
      props: {},
      eventMap: {}
    },
    CardBody: {
      elementClass: ChakraCardBodyElement,
      tag: 'chakra-card-body',
      version: VERSION,
      props: {},
      eventMap: {}
    },
    CardFooter: {
      elementClass: ChakraCardFooterElement,
      tag: 'chakra-card-footer',
      version: VERSION,
      props: {},
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
