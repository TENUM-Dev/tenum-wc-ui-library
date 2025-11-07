import React, { FC, PropsWithChildren } from 'react';
import { Card as ChakraCard, CardProps as ChakraCardProps } from '@chakra-ui/react';
import { colorScheme, variantCard as variant, sizeBasic as size, justifyContent, alignItems, flexDirection } from './chakraTypes';

export type pagePosition = {
  pageX: number | string;
  pageY: number | string;
};

interface CardProps extends Omit<ChakraCardProps, 'onContextMenu'> {
  /**
   * The flex alignment of the card.
   */
  align?: alignItems;

  /**
   * The visual color appearance of the component.
   */
  colorScheme?: colorScheme;

  /**
   * The flex direction of the card.
   */
  direction?: flexDirection;

  /**
   * The flex distribution of the card.
   */
  justify?: justifyContent;

  /**
   * The size of the Card.
   * @default md
   */
  size?: size;

  /**
   * The variant of the Card.
   * @default elevated
   */
  variant?: variant;

  /**
   * Event Listener for ContextMenu Events.
   */
  onContextMenuEvent?: (data: pagePosition) => void;
}

/**
 * Card is a flexible component used to group and display content in a clear and concise format.
 *
 * The Card component gets its style from the default Chakra UI theme. However, in some scenarios, you might need to customize its theming to match your design requirements.
 * To customize the theme for Card, you would need to modify the base or default styles and modifier styles that alter its size or visual style. You would then need to apply specific styles to each part, size or variant of the Card.
 *
 * #### **Anatomy**
 * The Card component is a multipart component and consists of the following parts:
 * - A: `container`, the `Card`Component.
 * - B: `header`, the `CardHeader` Component.
 * - C: `body`, the `CardContent` aka. `CardBody` Component.
 * - D: `footer`, the `CardFooter`Component.
 *
 * See more details [here](https://chakra-ui.com/docs/components/card).
 */
export const Card: FC<PropsWithChildren<CardProps>> = ({
  colorScheme,
  size,
  variant,
  onContextMenuEvent,
  children,
  ...props
}) => {
  return (
    <ChakraCard
      colorScheme={colorScheme}
      size={size}
      variant={variant}
      onContextMenu={(ev) => {
        if (typeof onContextMenuEvent === 'function') {
          ev.preventDefault();
          onContextMenuEvent({ pageX: ev.pageX, pageY: ev.pageY });
        }
      }}
      {...props}
    >
      {children}
    </ChakraCard>
  );
};

export default Card;

