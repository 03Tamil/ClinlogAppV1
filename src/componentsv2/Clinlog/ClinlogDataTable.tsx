import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  ArrowUpDownIcon,
} from "@chakra-ui/icons";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import React from "react";

type Props = {
  table: TanstackTable<any>;
  /** Left side of the header row (title, counts…). */
  toolbarLeft?: React.ReactNode;
  /** Right side of the header row (column picker, exports…). */
  toolbarRight?: React.ReactNode;
  /** Actions shown in the purple bar while rows are selected. */
  renderSelectionActions?: (selectedRows: any[]) => React.ReactNode;
  /** Trailing per-row cell (e.g. a View button). */
  renderRowActions?: (row: any) => React.ReactNode;
  rowActionsHeader?: string;
  onRowClick?: (row: any) => void;
  isLoadingMore?: boolean;
  emptyText?: string;
  pageSizes?: number[];
  maxH?: string;
  itemLabel?: [string, string]; // singular, plural
};

/**
 * Presentational table for any tanstack table instance that has row
 * selection, sorting and pagination enabled. Only the current page is
 * rendered, so it stays fast with thousands of records.
 */
export default function ClinlogDataTable({
  table,
  toolbarLeft,
  toolbarRight,
  renderSelectionActions,
  renderRowActions,
  rowActionsHeader = "",
  onRowClick,
  isLoadingMore = false,
  emptyText = "No cases match your search or filters.",
  pageSizes = [10, 20, 50, 100],
  maxH = "65vh",
  itemLabel = ["case", "cases"],
}: Props) {
  const filteredCount = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const pageRows = table.getRowModel().rows;
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);
  const from = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(filteredCount, (pageIndex + 1) * pageSize);
  const allPageSelected = table.getIsAllPageRowsSelected();
  const somePageSelected = table.getIsSomePageRowsSelected();
  const allSelected =
    filteredCount > 0 && selectedCount === filteredCount;
  const plural = (n: number) => (n === 1 ? itemLabel[0] : itemLabel[1]);
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  return (
    <Flex
      direction="column"
      w="100%"
      bg="white"
      borderRadius="10px"
      border="1px solid #EFE8F7"
      overflow="hidden"
    >
      {(toolbarLeft || toolbarRight) && (
        <Flex
          align="center"
          gap="3"
          px="4"
          py="3"
          wrap="wrap"
          borderBottom="1px solid #F3EEF9"
        >
          <Flex align="center" gap="3" flex="1" minW="200px">
            {toolbarLeft}
          </Flex>
          <Flex align="center" gap="2" wrap="wrap">
            {toolbarRight}
          </Flex>
        </Flex>
      )}

      {selectedCount > 0 && (
        <Flex
          align="center"
          gap="3"
          px="4"
          py="2"
          bg="#F4EEFF"
          borderBottom="1px solid #E4D8F8"
          wrap="wrap"
          role="status"
          aria-live="polite"
        >
          <Text fontSize="13px" fontWeight="700" color="#351361">
            {selectedCount} {plural(selectedCount)} selected
          </Text>
          {!allSelected && (
            <Button
              size="xs"
              variant="link"
              colorScheme="purple"
              onClick={() => table.toggleAllRowsSelected(true)}
            >
              Select all {filteredCount} matching {plural(filteredCount)}
            </Button>
          )}
          <Button
            size="xs"
            variant="link"
            color="gray.600"
            onClick={() => table.resetRowSelection()}
          >
            Clear selection
          </Button>
          <Flex ml="auto" gap="2" wrap="wrap">
            {renderSelectionActions?.(selectedRows)}
          </Flex>
        </Flex>
      )}

      <Box overflow="auto" maxH={maxH}>
        <Table size="sm" variant="simple">
          <Thead position="sticky" top={0} zIndex={2} bg="#F7F3FC">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                <Th w="44px" px="3" py="3" bg="#F7F3FC">
                  <Checkbox
                    colorScheme="purple"
                    isChecked={allPageSelected}
                    isIndeterminate={!allPageSelected && somePageSelected}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    aria-label="Select all cases on this page"
                  />
                </Th>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <Th
                      key={header.id}
                      px="3"
                      py="3"
                      bg="#F7F3FC"
                      color="#351361"
                      fontSize="11px"
                      letterSpacing="0.04em"
                      whiteSpace="nowrap"
                      cursor={canSort ? "pointer" : "default"}
                      userSelect="none"
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                      _hover={canSort ? { color: "#612ECC" } : undefined}
                    >
                      <Flex align="center" gap="1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort &&
                          (sorted === "asc" ? (
                            <TriangleUpIcon boxSize="2.5" />
                          ) : sorted === "desc" ? (
                            <TriangleDownIcon boxSize="2.5" />
                          ) : (
                            <ArrowUpDownIcon boxSize="2.5" opacity={0.3} />
                          ))}
                      </Flex>
                    </Th>
                  );
                })}
                {renderRowActions && (
                  <Th px="3" py="3" bg="#F7F3FC" color="#351361" fontSize="11px">
                    {rowActionsHeader}
                  </Th>
                )}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {pageRows.length === 0 ? (
              <Tr>
                <Td
                  colSpan={visibleColumnCount + 2}
                  textAlign="center"
                  py="12"
                  color="#5B4B77"
                  fontSize="13px"
                >
                  {isLoadingMore ? (
                    <Flex justify="center" align="center" gap="2">
                      <Spinner size="sm" color="#612ECC" /> Loading cases…
                    </Flex>
                  ) : (
                    emptyText
                  )}
                </Td>
              </Tr>
            ) : (
              pageRows.map((row) => {
                const isSelected = row.getIsSelected();
                return (
                  <Tr
                    key={row.id}
                    bg={isSelected ? "#F4EEFF" : "white"}
                    _hover={{ bg: isSelected ? "#EDE4FB" : "#FAF7FE" }}
                    cursor={onRowClick ? "pointer" : "default"}
                    onClick={
                      onRowClick
                        ? (e) => {
                            // Don't open the case when clicking controls.
                            const target = e.target as HTMLElement;
                            if (target.closest("button,a,input,label")) return;
                            onRowClick(row);
                          }
                        : undefined
                    }
                  >
                    <Td px="3" py="2.5" w="44px">
                      <Checkbox
                        colorScheme="purple"
                        isChecked={isSelected}
                        onChange={row.getToggleSelectedHandler()}
                        aria-label="Select case"
                      />
                    </Td>
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        px="3"
                        py="2.5"
                        fontSize="13px"
                        color="gray.800"
                        whiteSpace="nowrap"
                        maxW="320px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    ))}
                    {renderRowActions && (
                      <Td px="3" py="2">
                        {renderRowActions(row)}
                      </Td>
                    )}
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>

      <Flex
        align="center"
        gap="3"
        px="4"
        py="2.5"
        borderTop="1px solid #F3EEF9"
        wrap="wrap"
        fontSize="13px"
        color="gray.600"
      >
        <Text>
          Showing <b>{from}</b>–<b>{to}</b> of <b>{filteredCount}</b>{" "}
          {plural(filteredCount)}
        </Text>
        {isLoadingMore && (
          <Flex align="center" gap="1.5" color="#612ECC">
            <Spinner size="xs" /> <Text fontSize="12px">loading more…</Text>
          </Flex>
        )}
        <Flex align="center" gap="2" ml="auto">
          <Text whiteSpace="nowrap">Rows per page</Text>
          <Select
            size="sm"
            w="72px"
            borderRadius="6px"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <IconButton
            aria-label="Previous page"
            icon={<ChevronLeftIcon boxSize="5" />}
            size="sm"
            variant="ghost"
            isDisabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          />
          <Text whiteSpace="nowrap" minW="80px" textAlign="center">
            Page {pageIndex + 1} of {pageCount}
          </Text>
          <IconButton
            aria-label="Next page"
            icon={<ChevronRightIcon boxSize="5" />}
            size="sm"
            variant="ghost"
            isDisabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
