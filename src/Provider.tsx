import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Box,
  ChakraProvider,
  extendTheme,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTheme } from "@emotion/react";

export type ProviderProps = PropsWithChildren<{
  /**
   * The theme object to extend/customize the Chakra UI theme.
   * Can contain colors, fonts, components, etc.
   * @example { colors: { brand: { 500: '#0066cc' } } }
   */
  theme?: Record<string, any>;
  /**
   * Any Chakra Box styling props (borderWidth, borderColor, padding, etc.)
   */
  [key: string]: any;
}>;

/**
 * The `Provider` component allows you to apply a custom Chakra UI theme
 * to a section of your application while keeping other sections unaffected.
 *
 * This is useful when you need different themes in different parts of your UI,
 * or when you want to scope theme changes to specific components.
 *
 * @example
 * ```tsx
 * <Provider theme={{ colors: { brand: { 500: '#0066cc' } } }} borderWidth="2px" borderColor="red">
 *   <Button>Custom themed button</Button>
 * </Provider>
 * ```
 */
export const Provider: FC<ProviderProps> = ({
  theme,
  children,
  ...props
}) => {
  const [id] = useState<string>("section-id-" + Date.now());
  const [subTheme, setSubTheme] = useState<Record<string, any>>();
  const currentTheme = useTheme();

  useEffect(() => {
    const cssConfig = {
      config: {
        cssVarPrefix: id,
      },
    };
    const extendedTheme = extendTheme(currentTheme, theme ?? {}, cssConfig);
    setSubTheme(extendedTheme);
  }, [theme, id, currentTheme]);

  return (
    <Box id={id} {...props}>
      <ChakraProvider theme={subTheme} cssVarsRoot={"#" + id}>
        {children}
      </ChakraProvider>
    </Box>
  );
};

export default Provider;
