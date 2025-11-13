import {
  ButtonGroup,
  Button,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  ListItem,
  List,
  VStack
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { MdOutlineRemove, MdOutlineAdd } from "react-icons/md";

interface Item {
  id: string;
  name: string;
}

interface CrudListProps {
  selected?: string;
  items?: Item[];
  onSelect?: (id: string) => void;
  onCreate?: (name: string) => void;
  onDelete?: (id: string) => void;
}

export const CrudList: FC<CrudListProps> = ({
  selected,
  items = [],
  onSelect,
  onCreate,
  onDelete,
}) => {
  const [newItemName, setNewItemName] = useState<string>('');
  const itemsArray: Item[] = Array.isArray(items) ? items : Object.values(items ?? {});

  console.log('[CrudList] Props:', { items, itemsArray, selected });

  const handleCreate = () => {
    console.log('[CrudList] handleCreate called, newItemName:', newItemName, 'onCreate:', typeof onCreate);
    if (newItemName.trim() && onCreate) {
      onCreate(newItemName.trim());
      setNewItemName(''); // Clear input after creating
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <InputGroup size='md'>
        <Input
          pr='4.5rem'
          type='text'
          placeholder='Create new item'
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <InputRightElement width='4.5rem'>
          <Button
            h='1.75rem'
            size='sm'
            onClick={handleCreate}
            isDisabled={!newItemName.trim()}
          >
            <MdOutlineAdd />
          </Button>
        </InputRightElement>
      </InputGroup>

      <List spacing={2} width="100%">
        {itemsArray.map((item) => (
          <ListItem key={item.id}>
            <ButtonGroup size='sm' isAttached variant='outline' width="100%">
              <Button
                flex={1}
                justifyContent="flex-start"
                colorScheme={selected === item.id ? 'blue' : undefined}
                variant={selected === item.id ? 'solid' : 'outline'}
                onClick={() => onSelect?.(item.id)}
              >
                {item.name}
              </Button>
              <IconButton
                onClick={() => onDelete?.(item.id)}
                aria-label='Remove element'
                icon={<MdOutlineRemove />}
              />
            </ButtonGroup>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default CrudList;
