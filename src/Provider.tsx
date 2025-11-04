import { useTheme } from "@emotion/react";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";

export type ProviderProps = PropsWithChildren<{
  theme?: Record<string, any>;
  [key: string]: any;
}>;

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
