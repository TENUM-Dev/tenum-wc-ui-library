import originalValidator from "@rjsf/validator-ajv8";

import type {
  ValidatorType,
  RJSFSchema,
  ErrorSchema,
  RJSFValidationError,
} from "@rjsf/utils";

function fixDependencies(obj: any) {
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (key === "dependencies" && Array.isArray(val)) {
        obj[key] = {}; // ✅ AJV expects object
      } else if (typeof val === "object") {
        fixDependencies(val); // recursive dive
      }
    }
  }
}

const customValidator: ValidatorType<any, RJSFSchema, any> = {
  ...originalValidator,

  rawValidation: (schema, formData) => {
    const clonedSchema = JSON.parse(JSON.stringify(schema));
    const clonedFormData = JSON.parse(JSON.stringify(formData));
    fixDependencies(clonedSchema);
    // Dynamically strip upload-like fields from schema & formData
    for (const key in clonedFormData) {
      const value = clonedFormData[key];

      const isUploadArray =
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null &&
        "filename" in value[0] &&
        "filetype" in value[0] &&
        "text" in value[0]; // stricter check to avoid false matches

      if (isUploadArray) {
        console.log("Upload widget", key)
        if (!clonedSchema.properties) continue;
        clonedSchema.properties[key] = {};
      }
    }
    return originalValidator.rawValidation(clonedSchema, clonedFormData);
  },

  validateFormData: originalValidator.validateFormData,
  toErrorList: originalValidator.toErrorList,
  isValid: originalValidator.isValid,
};

export default customValidator;
