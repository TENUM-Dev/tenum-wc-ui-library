import r2wc from "@r2wc/react-to-web-component";
import Hello from "./Hello";
import JsonForm from "./JsonForm";
import Del from "./Del";

import { registerChakraWebComponents } from "./ChakraWebComponents";
import "./initChakraHost";

let registered = false;

function register() {
  if (registered) {
    return;
  }

  registered = true;

  if (!customElements.get("x-hello")) {
    const HelloWC = r2wc(Hello, {
      props: { name: "string" },
      events: {
        onHelloClick: {}  // Will create 'helloclick' event
      }
    });
    customElements.define("x-hello", HelloWC);
  }

  if (!customElements.get("x-jsonform")) {
    const JsonFormWC = r2wc(JsonForm, {
      props: {
        schema: "json",
        uischema: "json",
        formData: "json"
      },
      // r2wc automatically converts these callback props into custom events
      // using prefixed names to avoid conflicts with native HTML events
      events: {
        onFormChange: {},   // Will create 'formchange' event
        onFormSubmit: {},   // Will create 'formsubmit' event
        onFormError: {}     // Will create 'formerror' event
      }
    });
    customElements.define("x-jsonform", JsonFormWC);
  }

  if (!customElements.get("x-del")) {
    const DelWC = r2wc(Del, {
      props: { text: "string" }
    });
    customElements.define("x-del", DelWC);
  }

  try {
    registerChakraWebComponents();
  } catch (error) {
    console.error('[HelloLib] Failed to register Chakra web components:', error);
  }

  if (window.__COMPONENT_REGISTRY__) {
    window.__COMPONENT_REGISTRY__.register('HelloLib', {
      Hello: {
        tag: 'x-hello',
        version: '1.0.0',
        props: { name: 'string' },
        eventMap: { onClick: 'helloclick' }
      },
      JsonForm: {
        tag: 'x-jsonform',
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
      },
      TableContainer: {
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
        tag: 'chakra-thead',
        version: '1.0.0',
        props: {},
        eventMap: {}
      },
      Tbody: {
        tag: 'chakra-tbody',
        version: '1.0.0',
        props: {},
        eventMap: {}
      },
      Tr: {
        tag: 'chakra-tr',
        version: '1.0.0',
        props: {},
        eventMap: {}
      },
      Th: {
        tag: 'chakra-th',
        version: '1.0.0',
        props: {
          text: 'string'
        },
        eventMap: {}
      },
      Td: {
        tag: 'chakra-td',
        version: '1.0.0',
        props: {
          text: 'string'
        },
        eventMap: {}
      },
      Del: {
        tag: 'x-del',
        version: '1.0.0',
        props: {
          text: 'string'
        },
        eventMap: {}
      }
    });
  } else {
    console.warn('[HelloLib] Components failed to register');
  }
}

register();

export { register };
