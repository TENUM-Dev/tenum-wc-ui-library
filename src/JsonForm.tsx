import React, { useCallback, useEffect, useState } from "react";
import Form from "@rjsf/chakra-ui";
import { deepEquals } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import customValidator from "./utils/CustomValidator";
import { fixEmptyObjectsAsArraysInJsonSchema, fixEmptyObjectsAsArraysInUiSchema } from "./utils/JsonSchemaFixes";

export type JsonFormProps =
{
  schema: JSONSchema7;
  uischema: any;
  formData: any;
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
  onError?: (errors: any) => void;
};

const JsonForm: React.FC<JsonFormProps> = ({
  schema,
  uischema = {},
  formData = {},
  onChange,
  onSubmit,
  onError
 }: JsonFormProps): JSX.Element => {
  const [formStateData, setFormStateData] = useState(formData);
  const newSchema = schema ? fixEmptyObjectsAsArraysInJsonSchema(schema) : null;
  const newUiSchema = fixEmptyObjectsAsArraysInUiSchema(uischema);
  const [formSchema, setFormSchema] = useState(newSchema);
  const [formUiSchema, setFormUiSchema] = useState(newUiSchema);

  if (!deepEquals(newSchema, formSchema)) {
    setFormSchema(newSchema);
  }

  if (!deepEquals(newUiSchema, formUiSchema)) {
    setFormUiSchema(newUiSchema);
  }

  useEffect(() => {
    setFormStateData((current: any) => {
      if (deepEquals(current, formData)) {
        return current;
      } else {
        return formData
      }
    });
  }, [formData]);

  const handleChange = useCallback((event: any) => {
    console.log("Form changed:", event.formData);

    setFormStateData(event.formData);

    typeof onChange === 'function'
      ? onChange(event.formData)
      : console.warn('onChange is not a function it is ', onChange)
  }, [onChange]);

  const handleSubmit = useCallback((event: any) => {
    console.log('Form submitted:', event.formData);

    typeof onSubmit === 'function'
      ? onSubmit(event.formData)
      : console.warn('onSubmit is not a function it is ', onSubmit)

    setFormStateData({});
  }, [onSubmit]);

  const handleError = useCallback((errors: any) => {
    console.log("Form errors:", errors);

    typeof onError === 'function'
      ? onError(errors)
      : console.warn('onError is not a function it is ', onError)
  }, [onError]);

  if (!formSchema || !schema) {
    console.error("JsonForm: No schema found");
  }

  return (
    <Form
      schema={formSchema}
      uiSchema={formUiSchema}
      formData={formStateData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onError={handleError}
      validator={customValidator}
      // widgets={customWidgets} // TODO: Add this back in
      formContext={formStateData}
   />
  );
};

export default JsonForm;
