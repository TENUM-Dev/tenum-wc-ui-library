const ARRAY_PROPS = [
  "required", "dependencies", "enum", "allOf", "anyOf", "oneOf", "items", "examples", "type"
];

export function fixEmptyObjectsAsArraysInJsonSchema(
  obj: any,
  arrayProps: string[] = ARRAY_PROPS
): any {
  if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj)) {
          const value = obj[key];
          if (
              arrayProps.includes(key) &&
              value &&
              typeof value === "object" &&
              !Array.isArray(value) &&
              Object.keys(value).length === 0
          ) {
              // Fix: turn {} back into []
              obj[key] = [];
          } else if (typeof value === "object" && value !== null) {
              fixEmptyObjectsAsArraysInJsonSchema(value, arrayProps);
          }
      }
  }
  return obj;
}

const UI_ARRAY_PROPS = [
  "ui:order",
  "ui:enumDisabled"
];

export function fixEmptyObjectsAsArraysInUiSchema(
  obj: any,
  arrayProps: string[] = UI_ARRAY_PROPS
): any {
  if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj)) {
          const value = obj[key];
          if (
              arrayProps.includes(key) &&
              value &&
              typeof value === "object" &&
              !Array.isArray(value) &&
              Object.keys(value).length === 0
          ) {
              // Fix: turn {} back into []
              obj[key] = [];
          } else if (typeof value === "object" && value !== null) {
              fixEmptyObjectsAsArraysInUiSchema(value, arrayProps);
          }
      }
  }
  return obj;
}
