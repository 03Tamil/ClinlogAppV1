import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { MdAdd, MdFilterList, MdSearch } from "react-icons/md";
import OptionChecklist from "./OptionChecklist";
import {
  FIELD_GROUPS,
  fieldsInGroup,
  getFieldLabel,
  getFieldMeta,
  getFieldOptions,
  type FieldOption,
  type OptionContext,
} from "./clinlogFields";

/**
 * Filter entries keep the exact shape the existing filter engine
 * (globalFilterFunction) and Standard Reports already use:
 *   { id: fieldKey, value: { value, toValue, condition, operation } }
 * - select: value = [{ value, label }]
 * - number: value = [n], toValue = [n]
 * - date:   value = ["yyyy-MM-dd"], toValue = ["yyyy-MM-dd"]
 */
export type FilterEntry = {
  id: string;
  value: {
    value: any;
    toValue?: any[];
    condition: string;
    operation?: string;
  };
};

const CONDITIONS: Record<string, { value: string; label: string }[]> = {
  select: [
    { value: "isOneOf", label: "is any of" },
    { value: "isNotOneOf", label: "is none of" },
    { value: "hasAValue", label: "has a value" },
    { value: "isEmpty", label: "is empty" },
  ],
  number: [
    { value: "isBetween", label: "is between" },
    { value: "equals", label: "equals" },
    { value: "notEquals", label: "does not equal" },
    { value: "isGreaterThan", label: "is more than" },
    { value: "isGreaterThanOrEquals", label: "is at least" },
    { value: "isLessThan", label: "is less than" },
    { value: "isLessThanOrEquals", label: "is at most" },
    { value: "hasAValue", label: "has a value" },
    { value: "isEmpty", label: "is empty" },
  ],
  date: [
    { value: "isBetween", label: "is between" },
    { value: "isAfter", label: "is after" },
    { value: "isBefore", label: "is before" },
    { value: "hasAValue", label: "has a date" },
    { value: "isEmpty", label: "has no date" },
  ],
  string: [
    { value: "hasAValue", label: "has a value" },
    { value: "isEmpty", label: "is empty" },
  ],
};

const NO_VALUE_CONDITIONS = ["hasAValue", "isEmpty"];

const conditionLabel = (type: string, condition: string) =>
  CONDITIONS[type]?.find((c) => c.value === condition)?.label ?? condition;

const fmtDate = (value?: string) =>
  value ? format(new Date(value), "d MMM yyyy") : "…";

/** Plain-English description of a filter, e.g. "Age is between 50 and 70". */
export const describeFilter = (entry: FilterEntry) => {
  const meta = getFieldMeta(entry.id);
  const type = meta?.type ?? "select";
  const label = getFieldLabel(entry.id);
  const { condition, value, toValue } = entry.value ?? ({} as any);
  const cond = conditionLabel(type, condition);
  if (NO_VALUE_CONDITIONS.includes(condition)) return `${label} ${cond}`;
  if (type === "select") {
    const labels = (value ?? []).map((v: any) => v?.label ?? v?.value ?? v);
    const shown =
      labels.length > 3
        ? `${labels.slice(0, 2).join(", ")} +${labels.length - 2} more`
        : labels.join(", ");
    return `${label} ${cond} ${shown}`;
  }
  if (type === "date") {
    return condition === "isBetween"
      ? `${label} is between ${fmtDate(value?.[0])} and ${fmtDate(toValue?.[0])}`
      : `${label} ${cond} ${fmtDate(value?.[0])}`;
  }
  return condition === "isBetween"
    ? `${label} is between ${value?.[0] ?? "…"} and ${toValue?.[0] ?? "…"}`
    : `${label} ${cond} ${value?.[0] ?? "…"}`;
};

const isEntryComplete = (entry: FilterEntry) => {
  const type = getFieldMeta(entry.id)?.type ?? "select";
  const { condition, value, toValue } = entry.value;
  if (!entry.id || !condition) return false;
  if (NO_VALUE_CONDITIONS.includes(condition)) return true;
  if (type === "select") return (value ?? []).length > 0;
  const hasFrom =
    value?.[0] !== undefined && value?.[0] !== "" && value?.[0] !== null;
  if (condition === "isBetween") {
    return (
      hasFrom &&
      toValue?.[0] !== undefined &&
      toValue?.[0] !== "" &&
      toValue?.[0] !== null
    );
  }
  return hasFrom;
};

// ---------------------------------------------------------------------------
// Filter editor (used for "Add filter" and for editing an existing chip)
// ---------------------------------------------------------------------------
function FilterEditor({
  initial,
  optionCtx,
  onApply,
  onCancel,
}: {
  initial?: FilterEntry | null;
  optionCtx: OptionContext;
  onApply: (entry: FilterEntry) => void;
  onCancel: () => void;
}) {
  const [fieldKey, setFieldKey] = useState(initial?.id ?? "");
  const [fieldQuery, setFieldQuery] = useState("");
  const meta = fieldKey ? getFieldMeta(fieldKey) : undefined;
  const type = meta?.type ?? "select";
  const [condition, setCondition] = useState(
    initial?.value?.condition ?? "",
  );
  const [selectValues, setSelectValues] = useState<string[]>(
    type === "select"
      ? (initial?.value?.value ?? []).map((v: any) => String(v?.value ?? v))
      : [],
  );
  const [fromValue, setFromValue] = useState<string>(
    type !== "select" ? String(initial?.value?.value?.[0] ?? "") : "",
  );
  const [toValue, setToValue] = useState<string>(
    String(initial?.value?.toValue?.[0] ?? ""),
  );

  const options = useMemo(
    () => (fieldKey ? getFieldOptions(fieldKey, optionCtx) : []),
    [fieldKey, optionCtx],
  );

  const pickField = (key: string) => {
    const nextType = getFieldMeta(key)?.type ?? "select";
    setFieldKey(key);
    setCondition(CONDITIONS[nextType]?.[0]?.value ?? "");
    setSelectValues([]);
    setFromValue("");
    setToValue("");
  };

  const entry: FilterEntry = {
    id: fieldKey,
    value: {
      condition,
      value:
        type === "select"
          ? options
              .filter((o) => selectValues.includes(o.value))
              .map((o) => ({ value: o.value, label: o.label }))
          : fromValue === ""
            ? []
            : [type === "number" ? Number(fromValue) : fromValue],
      toValue:
        toValue === "" ? [] : [type === "number" ? Number(toValue) : toValue],
      operation: initial?.value?.operation,
    },
  };

  // Step 1: choose a field
  if (!fieldKey) {
    const q = fieldQuery.trim().toLowerCase();
    return (
      <Flex direction="column" gap="2">
        <Text fontSize="13px" fontWeight="700" color="#351361">
          What do you want to filter by?
        </Text>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <MdSearch color="#718096" />
          </InputLeftElement>
          <Input
            autoFocus
            placeholder="Search fields, e.g. smoking, implant brand"
            value={fieldQuery}
            onChange={(e) => setFieldQuery(e.target.value)}
            borderRadius="6px"
            fontSize="13px"
            aria-label="Search fields"
          />
        </InputGroup>
        <Box maxH="320px" overflowY="auto" mx="-2">
          {FIELD_GROUPS.map((group) => {
            const fields = fieldsInGroup(group.value).filter(
              (f) => !q || f.label.toLowerCase().includes(q),
            );
            if (fields.length === 0) return null;
            return (
              <Box key={group.value} mb="2">
                <Text
                  px="2"
                  py="1"
                  fontSize="11px"
                  fontWeight="700"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                >
                  {group.label}
                </Text>
                {fields.map((field) => (
                  <Box
                    as="button"
                    type="button"
                    key={field.key}
                    display="block"
                    w="100%"
                    textAlign="left"
                    px="2"
                    py="1.5"
                    fontSize="13px"
                    borderRadius="6px"
                    _hover={{ bg: "#F4EEFF" }}
                    _focusVisible={{ bg: "#F4EEFF", outline: "none" }}
                    onClick={() => pickField(field.key)}
                  >
                    {field.label}
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
        <Flex justify="flex-end">
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    );
  }

  // Step 2 + 3: condition and value
  return (
    <Flex direction="column" gap="3">
      <Flex align="center" justify="space-between" gap="2">
        <Box>
          <Text fontSize="11px" color="gray.500" fontWeight="600">
            {FIELD_GROUPS.find((g) => g.value === meta?.group)?.label}
          </Text>
          <Text fontSize="14px" fontWeight="700" color="#351361">
            {meta?.label}
          </Text>
        </Box>
        {!initial && (
          <Button
            size="xs"
            variant="ghost"
            colorScheme="purple"
            onClick={() => setFieldKey("")}
          >
            Change field
          </Button>
        )}
      </Flex>
      <Select
        size="sm"
        borderRadius="6px"
        fontSize="13px"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        aria-label="Condition"
      >
        {(CONDITIONS[type] ?? CONDITIONS.select).map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>

      {!NO_VALUE_CONDITIONS.includes(condition) && type === "select" && (
        <OptionChecklist
          options={options}
          selected={selectValues}
          onChange={setSelectValues}
        />
      )}

      {!NO_VALUE_CONDITIONS.includes(condition) && type === "number" && (
        <Flex align="center" gap="2">
          <NumberInput
            size="sm"
            value={fromValue}
            onChange={(v) => setFromValue(v)}
            min={0}
          >
            <NumberInputField
              borderRadius="6px"
              placeholder={condition === "isBetween" ? "From" : "Value"}
              aria-label={condition === "isBetween" ? "From" : "Value"}
            />
          </NumberInput>
          {condition === "isBetween" && (
            <>
              <Text fontSize="13px">and</Text>
              <NumberInput
                size="sm"
                value={toValue}
                onChange={(v) => setToValue(v)}
                min={0}
              >
                <NumberInputField
                  borderRadius="6px"
                  placeholder="To"
                  aria-label="To"
                />
              </NumberInput>
            </>
          )}
        </Flex>
      )}

      {!NO_VALUE_CONDITIONS.includes(condition) && type === "date" && (
        <Flex align="center" gap="2">
          <Input
            type="date"
            size="sm"
            borderRadius="6px"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            aria-label={condition === "isBetween" ? "From date" : "Date"}
          />
          {condition === "isBetween" && (
            <>
              <Text fontSize="13px">and</Text>
              <Input
                type="date"
                size="sm"
                borderRadius="6px"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
                aria-label="To date"
              />
            </>
          )}
        </Flex>
      )}

      <Flex justify="flex-end" gap="2" pt="1">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          colorScheme="purple"
          bg="#452A7E"
          _hover={{ bg: "#612ECC" }}
          isDisabled={!isEntryComplete(entry)}
          onClick={() => onApply(entry)}
        >
          {initial ? "Update filter" : "Add filter"}
        </Button>
      </Flex>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Quick filters (one click, apply instantly)
// ---------------------------------------------------------------------------
function QuickSelectFilter({
  fieldKey,
  label,
  options,
  entries,
  onEntriesChange,
  matchMode,
}: {
  fieldKey: string;
  label: string;
  options: FieldOption[];
  entries: FilterEntry[];
  onEntriesChange: (entries: FilterEntry[]) => void;
  matchMode: string;
}) {
  const index = entries.findIndex(
    (e) => e.id === fieldKey && e.value?.condition === "isOneOf",
  );
  const selected: string[] =
    index >= 0
      ? (entries[index].value.value ?? []).map((v: any) =>
          String(v?.value ?? v),
        )
      : [];

  const setSelected = (values: string[]) => {
    const next = [...entries];
    const value = options
      .filter((o) => values.includes(o.value))
      .map((o) => ({ value: o.value, label: o.label }));
    if (values.length === 0) {
      if (index >= 0) next.splice(index, 1);
    } else if (index >= 0) {
      next[index] = {
        ...next[index],
        value: { ...next[index].value, value },
      };
    } else {
      next.push({
        id: fieldKey,
        value: { value, toValue: [], condition: "isOneOf", operation: matchMode },
      });
    }
    onEntriesChange(next);
  };

  const active = selected.length > 0;
  return (
    <Popover placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          size="sm"
          borderRadius="full"
          variant="outline"
          fontSize="13px"
          fontWeight="600"
          rightIcon={<ChevronDownIcon />}
          borderColor={active ? "#612ECC" : "gray.200"}
          bg={active ? "#F4EEFF" : "white"}
          color={active ? "#351361" : "gray.700"}
          _hover={{ bg: "#F4EEFF" }}
        >
          {label}
          {active && (
            <Box
              as="span"
              ml="1.5"
              px="1.5"
              borderRadius="full"
              bg="#612ECC"
              color="white"
              fontSize="11px"
            >
              {selected.length}
            </Box>
          )}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="300px" zIndex={2000}>
          <PopoverArrow />
          <PopoverBody>
            <Text fontSize="12px" color="gray.500" mb="2">
              Show cases where {label.toLowerCase()} is any of:
            </Text>
            <OptionChecklist
              options={options}
              selected={selected}
              onChange={setSelected}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

function QuickDateFilter({
  fieldKey,
  label,
  entries,
  onEntriesChange,
  matchMode,
}: {
  fieldKey: string;
  label: string;
  entries: FilterEntry[];
  onEntriesChange: (entries: FilterEntry[]) => void;
  matchMode: string;
}) {
  const index = entries.findIndex(
    (e) =>
      e.id === fieldKey &&
      ["isBetween", "isAfter", "isBefore"].includes(e.value?.condition),
  );
  const current = index >= 0 ? entries[index] : null;
  const from =
    current && ["isBetween", "isAfter"].includes(current.value.condition)
      ? current.value.value?.[0] ?? ""
      : "";
  const to =
    current?.value.condition === "isBetween"
      ? current.value.toValue?.[0] ?? ""
      : current?.value.condition === "isBefore"
        ? current.value.value?.[0] ?? ""
        : "";

  const update = (nextFrom: string, nextTo: string) => {
    const next = [...entries];
    let entry: FilterEntry | null = null;
    if (nextFrom && nextTo) {
      entry = {
        id: fieldKey,
        value: {
          condition: "isBetween",
          value: [nextFrom],
          toValue: [nextTo],
          operation: matchMode,
        },
      };
    } else if (nextFrom) {
      entry = {
        id: fieldKey,
        value: {
          condition: "isAfter",
          value: [nextFrom],
          toValue: [],
          operation: matchMode,
        },
      };
    } else if (nextTo) {
      entry = {
        id: fieldKey,
        value: {
          condition: "isBefore",
          value: [nextTo],
          toValue: [],
          operation: matchMode,
        },
      };
    }
    if (index >= 0) {
      if (entry) next[index] = entry;
      else next.splice(index, 1);
    } else if (entry) {
      next.push(entry);
    }
    onEntriesChange(next);
  };

  const active = !!current;
  return (
    <Popover placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          size="sm"
          borderRadius="full"
          variant="outline"
          fontSize="13px"
          fontWeight="600"
          rightIcon={<ChevronDownIcon />}
          borderColor={active ? "#612ECC" : "gray.200"}
          bg={active ? "#F4EEFF" : "white"}
          color={active ? "#351361" : "gray.700"}
          _hover={{ bg: "#F4EEFF" }}
        >
          {label}
          {active && (
            <Box as="span" ml="1.5" fontSize="11px" color="#612ECC">
              ●
            </Box>
          )}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="300px" zIndex={2000}>
          <PopoverArrow />
          <PopoverBody>
            <Text fontSize="12px" color="gray.500" mb="2">
              Show cases with a {label.toLowerCase()}:
            </Text>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <Text fontSize="13px" w="40px">
                  From
                </Text>
                <Input
                  type="date"
                  size="sm"
                  borderRadius="6px"
                  value={from}
                  max={to || undefined}
                  onChange={(e) => update(e.target.value, to)}
                  aria-label={`${label} from`}
                />
              </Flex>
              <Flex align="center" gap="2">
                <Text fontSize="13px" w="40px">
                  To
                </Text>
                <Input
                  type="date"
                  size="sm"
                  borderRadius="6px"
                  value={to}
                  min={from || undefined}
                  onChange={(e) => update(from, e.target.value)}
                  aria-label={`${label} to`}
                />
              </Flex>
              {active && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="purple"
                  alignSelf="flex-end"
                  onClick={() => update("", "")}
                >
                  Clear dates
                </Button>
              )}
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// The bar
// ---------------------------------------------------------------------------
export type ClinlogFilterBarProps = {
  filters: FilterEntry[];
  onFiltersChange: (filters: FilterEntry[]) => void;
  surgeonOptions?: string[];
  locationOptions?: FieldOption[];
  implantLineOptions?: string[];
  /** Optional case search box shown at the start of the bar. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Number of cases after filtering, shown next to the chips. */
  resultCount?: number;
  totalCount?: number;
  /** Shown when filters were set by a report rather than by the user. */
  note?: string;
};

export default function ClinlogFilterBar({
  filters,
  onFiltersChange,
  surgeonOptions = [],
  locationOptions = [],
  implantLineOptions = [],
  searchValue,
  onSearchChange,
  resultCount,
  totalCount,
  note,
}: ClinlogFilterBarProps) {
  const optionCtx = useMemo(
    () => ({ surgeonOptions, locationOptions, implantLineOptions }),
    [surgeonOptions, locationOptions, implantLineOptions],
  );
  const addPopover = useDisclosure();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const operations = filters
    .slice(0, -1)
    .map((f) => (f.value?.operation || "AND").toUpperCase());
  const matchMode =
    operations.length === 0 || operations.every((op) => op === "AND")
      ? "AND"
      : operations.every((op) => op === "OR")
        ? "OR"
        : "CUSTOM";

  const setMatchMode = (mode: string) => {
    onFiltersChange(
      filters.map((f) => ({ ...f, value: { ...f.value, operation: mode } })),
    );
  };

  const withOperation = (entry: FilterEntry): FilterEntry => ({
    ...entry,
    value: {
      ...entry.value,
      operation:
        entry.value.operation || (matchMode === "OR" ? "OR" : "AND"),
    },
  });

  const surgeonQuickOptions = useMemo(
    () => getFieldOptions("recordTreatmentSurgeons", optionCtx),
    [optionCtx],
  );
  const locationQuickOptions = useMemo(
    () => getFieldOptions("recordClinic", optionCtx),
    [optionCtx],
  );

  const effectiveMode = matchMode === "OR" ? "OR" : "AND";

  return (
    <Flex
      direction="column"
      gap="3"
      w="100%"
      bg="white"
      p={{ base: "3", md: "4" }}
      borderRadius="10px"
      border="1px solid #EFE8F7"
    >
      <Flex gap="2" wrap="wrap" align="center">
        {onSearchChange && (
          <InputGroup size="sm" w={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
              <MdSearch color="#718096" fontSize="18px" />
            </InputLeftElement>
            <Input
              placeholder="Search patient or case number"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              borderRadius="full"
              fontSize="13px"
              aria-label="Search patient or case number"
            />
            {searchValue ? (
              <InputRightElement>
                <IconButton
                  aria-label="Clear search"
                  icon={<CloseIcon boxSize="2" />}
                  size="xs"
                  variant="ghost"
                  borderRadius="full"
                  onClick={() => onSearchChange("")}
                />
              </InputRightElement>
            ) : null}
          </InputGroup>
        )}
        <Flex align="center" gap="1" color="gray.500" pl="1">
          <MdFilterList />
          <Text fontSize="12px" fontWeight="600">
            Quick filters:
          </Text>
        </Flex>
        <QuickSelectFilter
          fieldKey="recordTreatmentSurgeons"
          label="Surgeon"
          options={surgeonQuickOptions}
          entries={filters}
          onEntriesChange={onFiltersChange}
          matchMode={effectiveMode}
        />
        {locationQuickOptions.length > 1 && (
          <QuickSelectFilter
            fieldKey="recordClinic"
            label="Location"
            options={locationQuickOptions}
            entries={filters}
            onEntriesChange={onFiltersChange}
            matchMode={effectiveMode}
          />
        )}
        <QuickSelectFilter
          fieldKey="archType"
          label="Arch type"
          options={getFieldOptions("archType")}
          entries={filters}
          onEntriesChange={onFiltersChange}
          matchMode={effectiveMode}
        />
        <QuickSelectFilter
          fieldKey="treatmentTitle"
          label="Treatment"
          options={getFieldOptions("treatmentTitle")}
          entries={filters}
          onEntriesChange={onFiltersChange}
          matchMode={effectiveMode}
        />
        <QuickDateFilter
          fieldKey="recordTreatmentDate"
          label="Surgery date"
          entries={filters}
          onEntriesChange={onFiltersChange}
          matchMode={effectiveMode}
        />
        <Popover
          placement="bottom-start"
          isOpen={addPopover.isOpen}
          onOpen={addPopover.onOpen}
          onClose={addPopover.onClose}
          isLazy
          closeOnBlur
        >
          <PopoverTrigger>
            <Button
              size="sm"
              borderRadius="full"
              leftIcon={<MdAdd />}
              bg="#452A7E"
              color="white"
              fontSize="13px"
              _hover={{ bg: "#612ECC" }}
            >
              More filters
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent w="340px" zIndex={2000}>
              <PopoverArrow />
              <PopoverBody p="4">
                {addPopover.isOpen && (
                  <FilterEditor
                    optionCtx={optionCtx}
                    onCancel={addPopover.onClose}
                    onApply={(entry) => {
                      onFiltersChange([...filters, withOperation(entry)]);
                      addPopover.onClose();
                    }}
                  />
                )}
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>

      {(filters.length > 0 || note) && (
        <Flex
          gap="2"
          align="center"
          wrap="wrap"
          borderTop="1px solid #F3EEF9"
          pt="3"
        >
          {note && (
            <Text fontSize="12px" color="#5B4B77" fontStyle="italic" mr="1">
              {note}
            </Text>
          )}
          <Wrap spacing="2" flex="1">
            {filters.map((entry, index) => (
              <WrapItem key={`${entry.id}-${index}`}>
                <Popover
                  placement="bottom-start"
                  isOpen={editingIndex === index}
                  onClose={() => setEditingIndex(null)}
                  isLazy
                >
                  <PopoverAnchor>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="subtle"
                      bg="#F4EEFF"
                      color="#351361"
                      border="1px solid #DDD6FE"
                      maxW="420px"
                    >
                      <TagLabel
                        as="button"
                        type="button"
                        fontSize="12px"
                        fontWeight="600"
                        cursor="pointer"
                        title={`${describeFilter(entry)} (click to edit)`}
                        onClick={() => setEditingIndex(index)}
                      >
                        {index > 0 && (
                          <Box
                            as="span"
                            color="#612ECC"
                            fontWeight="800"
                            mr="1"
                          >
                            {(
                              filters[index - 1]?.value?.operation || "AND"
                            ).toUpperCase() === "OR"
                              ? "or"
                              : "and"}
                          </Box>
                        )}
                        {describeFilter(entry)}
                      </TagLabel>
                      <TagCloseButton
                        aria-label={`Remove filter: ${describeFilter(entry)}`}
                        onClick={() =>
                          onFiltersChange(filters.filter((_, i) => i !== index))
                        }
                      />
                    </Tag>
                  </PopoverAnchor>
                  <Portal>
                    <PopoverContent w="340px" zIndex={2000}>
                      <PopoverArrow />
                      <PopoverBody p="4">
                        {editingIndex === index && (
                          <FilterEditor
                            initial={entry}
                            optionCtx={optionCtx}
                            onCancel={() => setEditingIndex(null)}
                            onApply={(updated) => {
                              const next = [...filters];
                              next[index] = updated;
                              onFiltersChange(next);
                              setEditingIndex(null);
                            }}
                          />
                        )}
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </WrapItem>
            ))}
          </Wrap>
          <Flex align="center" gap="2" ml="auto">
            {filters.length > 1 && (
              <Flex align="center" gap="1.5">
                <Text fontSize="12px" color="gray.600">
                  Show cases matching
                </Text>
                <Select
                  size="xs"
                  w="auto"
                  borderRadius="6px"
                  value={matchMode}
                  onChange={(e) => setMatchMode(e.target.value)}
                  aria-label="How filters combine"
                >
                  <option value="AND">all filters</option>
                  <option value="OR">any filter</option>
                  {matchMode === "CUSTOM" && (
                    <option value="CUSTOM" disabled>
                      custom (from report)
                    </option>
                  )}
                </Select>
              </Flex>
            )}
            {typeof resultCount === "number" && (
              <Text fontSize="12px" color="gray.600" whiteSpace="nowrap">
                <b>{resultCount}</b>
                {typeof totalCount === "number" ? ` of ${totalCount}` : ""} cases
              </Text>
            )}
            {filters.length > 0 && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => onFiltersChange([])}
              >
                Clear all
              </Button>
            )}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
