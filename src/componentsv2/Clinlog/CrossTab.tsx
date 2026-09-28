import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Table,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import React, { useMemo, useRef, useState } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import GroupedChecklist from "./GroupedChecklist";
import OptionChecklist from "./OptionChecklist";
import {
  FIELD_GROUPS,
  fieldsInGroup,
  getFieldLabel,
  getFieldOptions,
  type FieldOption,
  type OptionContext,
} from "./clinlogFields";
import {
  buildFluidModel,
  buildMembership,
  buildRestrictedModel,
  formatCell,
  modelToCsvRows,
  type CrossTabConfig,
} from "./crossTabEngine";
import { dateStamp, downloadCsv, toCsv } from "./csv";

type Props = {
  mode: "fluid" | "restricted";
  records: any[];
  clinlogNotes?: any[];
  surgeonOptions?: string[];
  locationOptions?: FieldOption[];
  implantLineOptions?: string[];
};

// Fields you can pivot on: every "pick a value" field, plus age (bucketed).
const PIVOT_FIELDS = FIELD_GROUPS.flatMap((group) =>
  fieldsInGroup(group.value).filter(
    (field) =>
      field.type === "select" || field.key === "ageAtTimeOfSurgery",
  ),
).map((field) => ({ id: field.key, label: field.label, group: field.group }));

const EMPTY_CONFIG: CrossTabConfig = {
  rowFields: [],
  colFields: [],
  subFields: [],
  values: {},
};

const buildSurveyMap = (notes: any[] = []) => {
  const map = new Map<string, any>();
  notes.forEach((note) => {
    const recordId = note?.recordNoteRecord?.[0]?.id;
    if (
      recordId === undefined ||
      recordId === null ||
      !(note?.attachedSurveyForm?.length > 0) ||
      map.has(String(recordId))
    ) {
      return;
    }
    map.set(
      String(recordId),
      note.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0],
    );
  });
  return map;
};

function FieldSlot({
  title,
  help,
  fields,
  onFieldsChange,
  allowValues,
  values,
  onValuesChange,
  optionCtx,
}: {
  title: string;
  help: string;
  fields: string[];
  onFieldsChange: (fields: string[]) => void;
  allowValues: boolean;
  values: Record<string, string[] | undefined>;
  onValuesChange: (key: string, values: string[] | undefined) => void;
  optionCtx: OptionContext;
}) {
  return (
    <Flex
      direction="column"
      gap="2"
      p="3"
      borderRadius="8px"
      border="1px dashed #DCCFF2"
      bg="#FCFAFF"
      minH="120px"
    >
      <Flex align="center" justify="space-between" gap="2">
        <Box>
          <Text fontSize="13px" fontWeight="700" color="#351361">
            {title}
          </Text>
          <Text fontSize="11px" color="gray.500">
            {help}
          </Text>
        </Box>
        <GroupedChecklist
          buttonLabel="Choose"
          buttonIcon={<MdAdd />}
          title={`Choose ${title.toLowerCase()} fields`}
          items={PIVOT_FIELDS}
          groups={FIELD_GROUPS}
          selected={fields}
          onChange={onFieldsChange}
          showCount={false}
        />
      </Flex>
      {fields.length === 0 ? (
        <Text fontSize="12px" color="gray.400" pt="2">
          No fields chosen yet.
        </Text>
      ) : (
        <Flex gap="2" wrap="wrap">
          {fields.map((key) => {
            const options = getFieldOptions(key, optionCtx);
            const chosen = values[key];
            const chosenCount = chosen ? chosen.length : options.length;
            return (
              <Tag
                key={key}
                size="md"
                borderRadius="full"
                bg="white"
                border="1px solid #DDD6FE"
                color="#351361"
              >
                {allowValues ? (
                  <Popover placement="bottom-start" isLazy>
                    <PopoverTrigger>
                      <TagLabel
                        as="button"
                        type="button"
                        fontSize="12px"
                        fontWeight="600"
                        cursor="pointer"
                        title="Choose which values to include"
                      >
                        {getFieldLabel(key)}{" "}
                        <Box as="span" color="#612ECC" fontWeight="500">
                          ·{" "}
                          {chosenCount === options.length
                            ? "all values"
                            : `${chosenCount} of ${options.length}`}
                        </Box>
                      </TagLabel>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent w="300px" zIndex={2000}>
                        <PopoverArrow />
                        <PopoverBody>
                          <Text fontSize="12px" color="gray.500" mb="2">
                            Values of {getFieldLabel(key)} to include:
                          </Text>
                          <OptionChecklist
                            options={options}
                            selected={chosen ?? options.map((o) => o.value)}
                            onChange={(next) =>
                              onValuesChange(
                                key,
                                next.length === options.length
                                  ? undefined
                                  : next,
                              )
                            }
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                ) : (
                  <TagLabel fontSize="12px" fontWeight="600">
                    {getFieldLabel(key)}
                  </TagLabel>
                )}
                <TagCloseButton
                  aria-label={`Remove ${getFieldLabel(key)}`}
                  onClick={() => onFieldsChange(fields.filter((f) => f !== key))}
                />
              </Tag>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}

export default function CrossTab({
  mode,
  records,
  clinlogNotes = [],
  surgeonOptions = [],
  locationOptions = [],
  implantLineOptions = [],
}: Props) {
  const [config, setConfig] = useState<CrossTabConfig>(EMPTY_CONFIG);
  const tableRef = useRef<HTMLDivElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const optionCtx = useMemo(
    () => ({ surgeonOptions, locationOptions, implantLineOptions }),
    [surgeonOptions, locationOptions, implantLineOptions],
  );
  const surveyMap = useMemo(() => buildSurveyMap(clinlogNotes), [clinlogNotes]);
  const restricted = mode === "restricted";

  const usedKeys = useMemo(
    () => [
      ...config.rowFields,
      ...config.colFields,
      ...(restricted ? config.subFields : []),
    ],
    [config.rowFields, config.colFields, config.subFields, restricted],
  );
  const usedKeysSignature = usedKeys.slice().sort().join("|");

  // Each record's values are read once per field set, not once per cell.
  const membership = useMemo(
    () => buildMembership(records, usedKeys, optionCtx, surveyMap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records, usedKeysSignature, optionCtx, surveyMap],
  );

  const ready = config.rowFields.length > 0 && config.colFields.length > 0;
  const model = useMemo(() => {
    if (!ready) return null;
    return restricted
      ? buildRestrictedModel(records, config, optionCtx, membership)
      : buildFluidModel(records, config, optionCtx, membership);
  }, [ready, restricted, records, config, optionCtx, membership]);

  const setFields = (slot: "rowFields" | "colFields" | "subFields") =>
    (fields: string[]) => setConfig((prev) => ({ ...prev, [slot]: fields }));
  const setValues = (key: string, values: string[] | undefined) =>
    setConfig((prev) => ({ ...prev, values: { ...prev.values, [key]: values } }));

  const exportCsv = () => {
    if (!model) return;
    const rows = modelToCsvRows(model);
    downloadCsv(
      `clinlog-${restricted ? "restricted" : "fluid"}-table-${dateStamp()}.csv`,
      toCsv(rows[0], rows.slice(1)),
    );
  };

  const exportPdf = async () => {
    if (!tableRef.current) return;
    setIsExportingPdf(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const landscape = canvas.width > canvas.height;
      const pdf = new jsPDF(landscape ? "l" : "p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `clinlog-${restricted ? "restricted" : "fluid"}-table-${dateStamp()}.pdf`,
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <Flex direction="column" w="100%" gap="3">
      <Flex
        direction="column"
        gap="3"
        bg="white"
        p="4"
        borderRadius="10px"
        border="1px solid #EFE8F7"
      >
        <Flex align="center" gap="2" wrap="wrap">
          <Box flex="1" minW="220px">
            <Text fontSize="15px" fontWeight="700" color="#351361">
              {restricted ? "Restricted values table" : "Fluid table"}
            </Text>
            <Text fontSize="12px" color="gray.600">
              {restricted
                ? "Pick fields, then click a field to choose exactly which values to compare. Each cell counts cases matching the row value, column value and split value."
                : "Pick the fields to compare. Each cell shows how many cases have both the row value and the column value, and the % within that column."}
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<MdRefresh />}
            onClick={() => setConfig(EMPTY_CONFIG)}
            isDisabled={usedKeys.length === 0}
          >
            Reset
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: restricted ? 3 : 2 }} spacing="3">
          <FieldSlot
            title="Rows"
            help="Each value becomes a row"
            fields={config.rowFields}
            onFieldsChange={setFields("rowFields")}
            allowValues={restricted}
            values={config.values}
            onValuesChange={setValues}
            optionCtx={optionCtx}
          />
          <FieldSlot
            title="Columns"
            help="Each value becomes a column"
            fields={config.colFields}
            onFieldsChange={setFields("colFields")}
            allowValues={restricted}
            values={config.values}
            onValuesChange={setValues}
            optionCtx={optionCtx}
          />
          {restricted && (
            <FieldSlot
              title="Split columns by"
              help="Optional second level under each column"
              fields={config.subFields}
              onFieldsChange={setFields("subFields")}
              allowValues
              values={config.values}
              onValuesChange={setValues}
              optionCtx={optionCtx}
            />
          )}
        </SimpleGrid>
      </Flex>

      {!ready ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="12"
          bg="white"
          borderRadius="10px"
          border="1px dashed #DCCFF2"
          color="#5B4B77"
          textAlign="center"
          px="4"
        >
          <Text fontSize="14px" fontWeight="700">
            Choose at least one row field and one column field
          </Text>
          <Text fontSize="12px" mt="1">
            The table updates instantly as you change fields or filters.
          </Text>
        </Flex>
      ) : (
        <Flex
          direction="column"
          bg="white"
          borderRadius="10px"
          border="1px solid #EFE8F7"
          overflow="hidden"
        >
          <Flex
            align="center"
            gap="2"
            px="4"
            py="3"
            borderBottom="1px solid #F3EEF9"
            wrap="wrap"
          >
            <Text fontSize="13px" color="gray.600" flex="1">
              Based on <b>{model?.totalRecords ?? 0}</b> cases (after filters)
            </Text>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<DownloadIcon />}
              onClick={exportCsv}
            >
              CSV
            </Button>
            <Button
              size="sm"
              leftIcon={<DownloadIcon />}
              bg="#452A7E"
              color="white"
              _hover={{ bg: "#612ECC" }}
              onClick={exportPdf}
              isLoading={isExportingPdf}
              loadingText="Preparing PDF"
            >
              PDF
            </Button>
          </Flex>
          <Box overflow="auto" maxH="65vh" ref={tableRef}>
            <Table size="sm" variant="unstyled">
              <Thead position="sticky" top={0} zIndex={2}>
                {model?.header.map((row, ri) => (
                  <Tr key={ri}>
                    {row.map((cell, ci) => (
                      <Th
                        key={ci}
                        colSpan={cell.colSpan}
                        rowSpan={cell.rowSpan}
                        position={ci === 0 ? "sticky" : undefined}
                        left={ci === 0 ? 0 : undefined}
                        zIndex={ci === 0 ? 3 : undefined}
                        bg={
                          cell.kind === "total"
                            ? "#EDE4FB"
                            : ri === 0
                              ? "#F1EAFB"
                              : "#F7F3FC"
                        }
                        color="#351361"
                        fontSize="11px"
                        textTransform="none"
                        letterSpacing="0"
                        textAlign={ci === 0 ? "left" : "center"}
                        borderRight="1px solid #E6DDF3"
                        borderBottom="1px solid #E6DDF3"
                        px="3"
                        py="2"
                        whiteSpace="nowrap"
                      >
                        {cell.text}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {model?.body.map((row, ri) => {
                  const bg =
                    row.kind === "sample"
                      ? "#EEF6FF"
                      : row.kind === "field"
                        ? "#F4EEFF"
                        : "white";
                  return (
                    <Tr key={ri} bg={bg} _hover={row.kind === "value" ? { bg: "#FAF7FE" } : undefined}>
                      <Td
                        position="sticky"
                        left={0}
                        zIndex={1}
                        bg={bg}
                        fontSize="12px"
                        fontWeight={row.kind === "value" ? "500" : "700"}
                        color={row.kind === "sample" ? "#1E4E8C" : "#351361"}
                        pl={row.kind === "value" ? "6" : "3"}
                        pr="3"
                        py="2"
                        borderRight="1px solid #E6DDF3"
                        borderBottom="1px solid #F3EEF9"
                        whiteSpace="nowrap"
                      >
                        {row.label}
                      </Td>
                      {row.cells.map((cell, ci) => (
                        <Td
                          key={ci}
                          textAlign="center"
                          fontSize="12px"
                          px="3"
                          py="2"
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                          fontWeight={row.kind === "value" ? "400" : "700"}
                          color={cell.count === 0 ? "gray.400" : "gray.800"}
                          bg={cell.kind === "total" && row.kind === "value" ? "#FBF8FF" : undefined}
                          borderRight="1px solid #F3EEF9"
                          borderBottom="1px solid #F3EEF9"
                          whiteSpace="nowrap"
                        >
                          {formatCell(cell)}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      )}
    </Flex>
  );
}
