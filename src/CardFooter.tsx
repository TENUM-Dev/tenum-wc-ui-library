import React, { FC, PropsWithChildren } from 'react';
import { CardFooter as ChakraCardFooter, CardFooterProps as ChakraCardFooterProps } from '@chakra-ui/react';

/**
 * A Component which is used within the multipart component `Card` as Footer Container.
 * It doesn't contain any own properties only inherited ones from `Box` Component.
 * See Details about the usage [online](https://chakra-ui.com/docs/components/card). Check all inherited properties from Box.
 */
export const CardFooter: FC<PropsWithChildren<ChakraCardFooterProps>> = ({
  children,
  ...props
}) => {
  return (
    <ChakraCardFooter {...props}>
      {children}
    </ChakraCardFooter>
  );
};

export default CardFooter;

