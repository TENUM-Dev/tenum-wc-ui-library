import React, { FC, PropsWithChildren } from 'react';
import { CardBody as ChakraCardContent, CardBodyProps as ChakraCardBodyProps } from '@chakra-ui/react';

/**
 * A Component which is used within the multipart component `Card` as Body Container.
 * It doesn't contain any own properties only inherited ones from `Box` Component.
 * See Details about the usage [online](https://chakra-ui.com/docs/components/card). Check all inherited properties from Box.
 */
export const CardContent: FC<PropsWithChildren<ChakraCardBodyProps>> = ({
  children,
  ...props
}) => {
  return (
    <ChakraCardContent {...props}>
      {children}
    </ChakraCardContent>
  );
};

export default CardContent;

