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
  ...props
}) => {
  const [newItemName, setNewItemName] = useState<string | undefined>(undefined)
  const convertedItems = Object.values(items ?? {})

  return (
    <VStack>
      <InputGroup size='md'>
        <Input
          pr='4.5rem'
          type='text'
          placeholder='Create new item'
          onChange={ev => setNewItemName(ev.target.value)}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={() => {
            if (newItemName === undefined || newItemName === '') {
              console.log('NewItemName is undefined or empty')
            }
            if (typeof onCreate === 'function') {
              // @ts-ignore
              onCreate(newItemName)
            } else {
              console.log('onCreate is not a function it is ', onCreate)
            }
          }}>
            <MdOutlineAdd />
          </Button>
        </InputRightElement>
      </InputGroup>
      <List>{
        convertedItems?.map(item => (
          <ListItem key={item.id}>
            <ButtonGroup size='sm' isAttached variant='outline'>
              <Button
                onClick={() => {
                  if (typeof onSelect === 'function') {
                    onSelect(item.id)
                  } else {
                    console.log('onSelect is not a function it is ', onSelect)
                  }
                }}>{item.name}</Button>
              <IconButton
                onClick={() => {
                  if (typeof onDelete === 'function') {
                    onDelete(item.id)
                  } else {
                    console.log('onDelete is not a function it is ', onDelete)
                  }
                }}
                aria-label='Remove element'
                icon={<MdOutlineRemove />}
              />
            </ButtonGroup>
          </ListItem>
        ))}
      </List>
    </VStack>
  )
};

export default CrudList;
