import { Code as ChakraCode, CodeProps as ChakraCodeProps } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";
import { variantCode as variant, colorScheme } from "./chakraTypes";

interface CodeProps extends ChakraCodeProps {
  /**
   * The visual color appearance of the component
   * @default gray
   */
  colorScheme?: colorScheme;

  /**
   * The font size of the Code (e.g., "sm", "md", "lg", "0.875em", "1.125em")
   */
  fontSize?: string;

  /**
   * The variant of the Code
   * @default subtle
   */
  variant?: variant;
}

/**
 * Code component is used to display code snippets
 */
export const Code: FC<PropsWithChildren<CodeProps>> = ({
  children,
  colorScheme,
  fontSize,
  variant,
  ...props
}) => {
  if (!(window as any).__codeComponentLogged) {
    (window as any).__codeComponentLogged = true;
    console.log('[Code Component] Rendering with props:', {
      fontSize,
      colorScheme,
      variant,
      hasChildren: !!children,
      allPropsKeys: Object.keys({ colorScheme, fontSize, variant, ...props }),
      allProps: { colorScheme, fontSize, variant, ...props }
    });
  }

  return (
    <ChakraCode
      colorScheme={colorScheme}
      fontSize={fontSize}
      variant={variant}
      {...props}
    >
      {children}
    </ChakraCode>
  );
};

export default Code;

