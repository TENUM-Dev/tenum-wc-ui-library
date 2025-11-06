import React, { FC } from 'react';
import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';
import { colorScheme, variantCode as variant } from './chakraTypes';

interface BadgeProps extends ChakraBadgeProps {
  /**
   * The text content of the component.
   */
  text: string;

  /**
   * The visual color appearance of the component.
   * @default gray
   */
  colorScheme?: colorScheme;

  /**
   * Size definition of the component.
   * There are no predefined sizes present.
   * @default undefined
   */
  size?: string;

  /**
   * Variant definition of the component
   * @default subtle
   */
  variant?: variant;
}

/**
 * Badges are used to highlight an item's status for quick recognition.
 * The `Badge` component composes Box component so you can pass props for `Box`.
 */
export const Badge: FC<BadgeProps> = ({
  text,
  ...props
}) => {
  return (
    <ChakraBadge {...props}>
      {text}
    </ChakraBadge>
  );
};

export default Badge;

