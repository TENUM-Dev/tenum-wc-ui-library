import { Code as ChakraCode, CodeProps as ChakraCodeProps } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";
import { sizeAll as size, variantCode as variant, colorScheme } from "./chakraTypes";

interface CodeProps extends ChakraCodeProps {
  /**
   * The visual color appearance of the component
   * @default gray
   */
  colorScheme?: colorScheme;

  /**
   * The size of the Code. No predefined values available. The values are to be defined within the theme.
   * @default md
   */
  size?: size;

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
  size,
  variant,
  ...props
}) => {
  return (
    <ChakraCode
      colorScheme={colorScheme}
      size={size}
      variant={variant}
      {...props}
    >
      {children}
    </ChakraCode>
  );
};

export default Code;

