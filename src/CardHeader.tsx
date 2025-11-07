import React, { FC, PropsWithChildren } from 'react';
import { CardHeader as ChakraCardHeader, CardHeaderProps as ChakraCardHeaderProps } from '@chakra-ui/react';

/**
 * A Component which is used within the multipart component `Card` as Header Container.
 * It doesn't contain any own properties only inherited ones from `Box` Component.
 * See Details about the usage [online](https://chakra-ui.com/docs/components/card). Check all inherited properties from Box.
 */
export const CardHeader: FC<PropsWithChildren<ChakraCardHeaderProps>> = ({
  children,
  ...props
}) => {
  return (
    <ChakraCardHeader {...props}>
      {children}
    </ChakraCardHeader>
  );
};

export default CardHeader;

