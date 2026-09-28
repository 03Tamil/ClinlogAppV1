import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";

export type ChecklistItem = { id: string; label: string; group: string };

type Props = {
  /** Button text, e.g. "Columns" or "Add row fields". */
  buttonLabel: string;
  buttonIcon?: React.ReactElement;
  title?: string;
  items: ChecklistItem[];
  groups: { value: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  /** Items that are always on and can't be unticked. */
  lockedIds?: string[];
  /** Optional "reset" target. */
  defaultSelected?: string[];
  buttonProps?: Record<string, any>;
  showCount?: boolean;
};

/**
 * Popover with a searchable, grouped checklist. Every group has its own
 * "select all" checkbox, and there's a global "Select all / Clear" as well.
 * Used for choosing table columns and cross-tab fields.
 */
export default function GroupedChecklist({
  buttonLabel,
  buttonIcon,
  title,
  items,
  groups,
  selected,
  onChange,
  lockedIds = [],
  defaultSelected,
  buttonProps = {},
  showCount = true,
}: Props) {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const q = query.trim().toLowerCase();

  const visibleByGroup = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: items.filter(
            (item) =>
              item.group === group.value &&
              (!q || item.label.toLowerCase().includes(q)),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [groups, items, q],
  );

  const order = useMemo(() => items.map((i) => i.id), [items]);
  const emit = (next: Set<string>) => {
    lockedIds.forEach((id) => next.add(id));
    onChange(order.filter((id) => next.has(id)));
  };

  const setMany = (ids: string[], on: boolean) => {
    const next = new Set(selected);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    emit(next);
  };

  const allVisibleIds = visibleByGroup.flatMap((g) => g.items.map((i) => i.id));
  const allVisibleOn =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedSet.has(id));
  const someVisibleOn =
    !allVisibleOn && allVisibleIds.some((id) => selectedSet.has(id));

  const selectedCount = items.filter((i) => selectedSet.has(i.id)).length;

  return (
    <Popover placement="bottom-end" isLazy>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          borderRadius="full"
          fontSize="13px"
          fontWeight="600"
          leftIcon={buttonIcon}
          rightIcon={<ChevronDownIcon />}
          borderColor="gray.200"
          bg="white"
          _hover={{ bg: "#F4EEFF" }}
          {...buttonProps}
        >
          {buttonLabel}
          {showCount && selectedCount > 0 && (
            <Box
              as="span"
              ml="1.5"
              px="1.5"
              borderRadius="full"
              bg="#EDE4FB"
              color="#351361"
              fontSize="11px"
            >
              {selectedCount}
            </Box>
          )}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="340px" zIndex={2000}>
          <PopoverArrow />
          <PopoverBody p="3">
            {title && (
              <Text fontSize="13px" fontWeight="700" color="#351361" mb="2">
                {title}
              </Text>
            )}
            <InputGroup size="sm" mb="2">
              <InputLeftElement pointerEvents="none">
                <MdSearch color="#718096" />
              </InputLeftElement>
              <Input
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                borderRadius="6px"
                fontSize="13px"
                aria-label="Search"
              />
            </InputGroup>
            <Flex
              align="center"
              justify="space-between"
              pb="2"
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              <Checkbox
                colorScheme="purple"
                isChecked={allVisibleOn}
                isIndeterminate={someVisibleOn}
                onChange={() => setMany(allVisibleIds, !allVisibleOn)}
              >
                <Text fontSize="13px" fontWeight="600">
                  {q ? "Select all matching" : "Select all"}
                </Text>
              </Checkbox>
              <Text fontSize="12px" color="gray.500">
                {selectedCount} of {items.length}
              </Text>
            </Flex>
            <Box maxH="340px" overflowY="auto" mt="2" pr="1">
              {visibleByGroup.length === 0 && (
                <Text fontSize="13px" color="gray.500" py="2">
                  Nothing matches “{query}”.
                </Text>
              )}
              {visibleByGroup.map((group) => {
                const ids = group.items.map((i) => i.id);
                const on = ids.filter((id) => selectedSet.has(id)).length;
                return (
                  <Box key={group.value} mb="3">
                    <Checkbox
                      colorScheme="purple"
                      isChecked={on === ids.length}
                      isIndeterminate={on > 0 && on < ids.length}
                      onChange={() => setMany(ids, on !== ids.length)}
                      mb="1"
                    >
                      <Text
                        fontSize="11px"
                        fontWeight="700"
                        color="gray.600"
                        textTransform="uppercase"
                        letterSpacing="0.05em"
                      >
                        {group.label}
                      </Text>
                    </Checkbox>
                    <Flex direction="column" gap="1" pl="6">
                      {group.items.map((item) => (
                        <Checkbox
                          key={item.id}
                          colorScheme="purple"
                          isChecked={selectedSet.has(item.id)}
                          isDisabled={lockedIds.includes(item.id)}
                          onChange={(e) => setMany([item.id], e.target.checked)}
                        >
                          <Text fontSize="13px">{item.label}</Text>
                        </Checkbox>
                      ))}
                    </Flex>
                  </Box>
                );
              })}
            </Box>
          </PopoverBody>
          <PopoverFooter display="flex" justifyContent="space-between" p="2">
            <Button
              size="xs"
              variant="ghost"
              colorScheme="purple"
              onClick={() => emit(new Set())}
            >
              Clear
            </Button>
            {defaultSelected && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="purple"
                onClick={() => emit(new Set(defaultSelected))}
              >
                Reset to default
              </Button>
            )}
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
