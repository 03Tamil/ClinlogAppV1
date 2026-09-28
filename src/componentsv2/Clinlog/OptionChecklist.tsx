import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";
import type { FieldOption } from "./clinlogFields";

type Props = {
  options: FieldOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  /** Show a search box when there are more options than this. */
  searchThreshold?: number;
  maxH?: string;
  emptyText?: string;
};

/**
 * A searchable checkbox list with "Select all" / "Clear". "Select all" acts on
 * the options currently visible (i.e. matching the search), which is what
 * people expect when they've typed to narrow the list.
 */
export default function OptionChecklist({
  options,
  selected,
  onChange,
  searchThreshold = 8,
  maxH = "240px",
  emptyText = "No options available",
}: Props) {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  const visibleSelected = visible.filter((option) =>
    selectedSet.has(option.value),
  ).length;
  const allVisibleSelected =
    visible.length > 0 && visibleSelected === visible.length;
  const someVisibleSelected = visibleSelected > 0 && !allVisibleSelected;

  const toggleAll = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      visible.forEach((option) => next.delete(option.value));
    } else {
      visible.forEach((option) => next.add(option.value));
    }
    // Preserve the options' natural order.
    onChange(options.map((o) => o.value).filter((value) => next.has(value)));
  };

  const toggleOne = (value: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(value);
    else next.delete(value);
    onChange(options.map((o) => o.value).filter((v) => next.has(v)));
  };

  if (options.length === 0) {
    return (
      <Text fontSize="13px" color="gray.500" py="2">
        {emptyText}
      </Text>
    );
  }

  return (
    <Flex direction="column" gap="2">
      {options.length > searchThreshold && (
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <MdSearch color="#718096" />
          </InputLeftElement>
          <Input
            placeholder="Search options"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            borderRadius="6px"
            fontSize="13px"
            aria-label="Search options"
          />
        </InputGroup>
      )}
      <Flex
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor="gray.100"
        pb="2"
      >
        <Checkbox
          colorScheme="purple"
          isChecked={allVisibleSelected}
          isIndeterminate={someVisibleSelected}
          onChange={toggleAll}
          isDisabled={visible.length === 0}
        >
          <Text fontSize="13px" fontWeight="600">
            {query ? "Select all matching" : "Select all"}
          </Text>
        </Checkbox>
        <Flex align="center" gap="2">
          <Text fontSize="12px" color="gray.500">
            {selected.length} selected
          </Text>
          {selected.length > 0 && (
            <Button
              size="xs"
              variant="ghost"
              colorScheme="purple"
              onClick={() => onChange([])}
            >
              Clear
            </Button>
          )}
        </Flex>
      </Flex>
      <Box maxH={maxH} overflowY="auto" pr="1">
        {visible.length === 0 ? (
          <Text fontSize="13px" color="gray.500" py="2">
            Nothing matches “{query}”.
          </Text>
        ) : (
          <Flex direction="column" gap="1.5">
            {visible.map((option) => (
              <Checkbox
                key={option.value}
                colorScheme="purple"
                isChecked={selectedSet.has(option.value)}
                onChange={(e) => toggleOne(option.value, e.target.checked)}
              >
                <Text fontSize="13px" lineHeight="1.3">
                  {option.label}
                </Text>
              </Checkbox>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
