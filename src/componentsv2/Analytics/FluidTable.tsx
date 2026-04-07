import {
  Flex,
  Select,
  Text,
  Checkbox,
  Table,
  Th,
  Tr,
  Td,
  Tbody,
  Thead,
  Button,
  TableContainer,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { clinlogFilterColumns } from "helpersv2/utils";
import React, { useMemo, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadIcon } from "@chakra-ui/icons";
import { table } from "console";
export default function FluidTable({
  filteredData,
  groupOptions,
  recordTreatmentSurgeonOptions,
  clinlogNotes = [],
}) {
  const [selectedColumns, setSelectedColumns] = useState([
    { group: "", fields: [], isChosen: false },
  ]);
  const [selectedRows, setSelectedRows] = useState([
    { group: "", fields: [], isChosen: false },
  ]);

  const tableRef = useRef(null);
  const tableData = useMemo(() => {
    const result = [];
    if (selectedRows.length > 0 && selectedColumns.length > 0) {
      const fields = [
        ...selectedRows.map((row) => row.fields).flat(),
        ...selectedColumns.map((col) => col.fields).flat(),
      ];
      if (fields.length > 0) {
        const patientData = filteredData?.map((record) => {
          const data = { id: record.id };
          fields.forEach((field) => {
            const groupField = clinlogFilterColumns.find(
              (column) => column.key === field,
            );
            if (groupField.group === "followUp") {
              const followUpData = record.recordFollowUpMatrix?.[0];
              data[field] = followUpData?.[field];
            } else if (groupField.group === "patientSurvey") {
              const patientSurveyData = clinlogNotes?.find((note) => {
                return (
                  note?.recordNoteRecord?.[0]?.id === record?.id &&
                  note?.attachedSurveyForm?.length > 0
                );
              })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
              data[field] = patientSurveyData?.[field?.split("_")?.[0]];
            } else if (groupField.group === "siteSpecificCharacteristics") {
              const siteDetails =
                record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );
              const siteSpecificData = siteDetails?.map((site) => {
                if (field === "toothValue") {
                  return site.toothValue;
                } else if (
                  clinlogFilterColumns?.find((col) => col.key === field)
                    ?.subGroup === "ssFollowUp"
                ) {
                  const siteFollowUpRecords =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.attachedSiteSpecificFollowUp?.[0];

                  return siteFollowUpRecords?.[field];
                }
                return site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.[field];
              });
              data[field] = siteSpecificData;
            } else if (field === "recordTreatmentDate") {
              data[field] = record[field]
                ? format(new Date(record[field]), "dd MMM yyyy")
                : "";
            } else if (field === "recordTreatmentSurgeons") {
              data[field] =
                record[field].map((surgeon) => surgeon.fullName).flat() || [];
            } else {
              data[field] = record[field];
            }
          });
          return data;
        });

        const columnFields = selectedColumns.map((col) => col.fields).flat();
        const rowFields = selectedRows.map((row) => row.fields).flat();

        columnFields.forEach((col) => {
          const groupCol = clinlogFilterColumns.find(
            (column) => column.key === col,
          );

          let colOptions = [];
          if (col === "ageAtTimeOfSurgery") {
            colOptions = [
              { value: "<40", name: "<40" },
              { value: "40-50", name: "40-50" },
              { value: "50-60", name: "50-60" },
              { value: "60-70", name: "60-70" },
              { value: ">70", name: ">70" },
            ];
          } else if (col === "recordTreatmentDate") {
            colOptions = [
              ...new Set(patientData?.map((record) => record[col])),
            ];
          } else if (col === "recordTreatmentSurgeons") {
            colOptions = [
              ...new Set(
                patientData
                  ?.map((record) => record[col]?.map((surgeon) => surgeon))
                  .flat(),
              ),
            ];
          } else {
            colOptions = groupCol?.options;
          }

          rowFields.forEach((row) => {
            const groupRow = clinlogFilterColumns.find(
              (column) => column.key === row,
            );
            let rowOptions = [];
            if (row === "ageAtTimeOfSurgery") {
              //@ts-ignore
              options = [
                { value: "<40", name: "<40" },
                { value: "40-50", name: "40-50" },
                { value: "50-60", name: "50-60" },
                { value: "60-70", name: "60-70" },
                { value: ">70", name: ">70" },
              ];
            } else if (row === "recordTreatmentDate") {
              rowOptions = [
                ...new Set(patientData?.map((record) => record[row])),
              ];
            } else if (row === "recordTreatmentSurgeons") {
              rowOptions = [
                ...new Set(
                  patientData
                    ?.map((record) => record[row]?.map((surgeon) => surgeon))
                    .flat(),
                ),
              ];
            } else {
              rowOptions = groupRow?.options;
            }
            colOptions?.forEach((option) => {
              rowOptions?.forEach((rowOpt) => {
                const columnFilteredData = patientData?.filter((record) => {
                  if (groupCol.group === "siteSpecificCharacteristics") {
                    return record[col]?.includes(option.value);
                  } else if (col === "ageAtTimeOfSurgery") {
                    if (option.value === "<40") return Number(record[col]) < 40;
                    if (option.value === "40-50")
                      return (
                        Number(record[col]) >= 40 && Number(record[col]) <= 50
                      );
                    if (option.value === "50-60")
                      return (
                        Number(record[col]) >= 50 && Number(record[col]) <= 60
                      );
                    if (option.value === "60-70")
                      return (
                        Number(record[col]) >= 60 && Number(record[col]) <= 70
                      );
                    if (option.value === ">70") return Number(record[col]) > 70;
                  } else if (col === "recordTreatmentSurgeons") {
                    return record[col]?.includes(option);
                  } else if (col === "recordTreatmentDate") {
                    return record[col] === option;
                  }
                  return record[col] === option.value;
                });

                const data = columnFilteredData?.filter((record) => {
                  if (groupRow.group === "siteSpecificCharacteristics") {
                    return record[row].includes(rowOpt.value);
                  } else if (row === "ageAtTimeOfSurgery") {
                    if (rowOpt.value === "<40") return Number(record[row]) < 40;
                    if (rowOpt.value === "40-50")
                      return (
                        Number(record[row]) >= 40 && Number(record[row]) <= 50
                      );
                    if (rowOpt.value === "50-60")
                      return (
                        Number(record[row]) >= 50 && Number(record[row]) <= 60
                      );
                    if (rowOpt.value === "60-70")
                      return (
                        Number(record[row]) >= 60 && Number(record[row]) <= 70
                      );
                    if (rowOpt.value === ">70") return Number(record[row]) > 70;
                  } else if (row === "recordTreatmentSurgeons") {
                    return record[row].includes(rowOpt);
                  } else if (row === "recordTreatmentDate") {
                    return record[row] === rowOpt;
                  }
                  return record[row] === rowOpt.value;
                }).length;

                result.push({
                  columnHeader: col,
                  columnValue: option?.name ? option.name : option,
                  colSampleSize: columnFilteredData.length,
                  rowHeader: row,
                  rowValue: rowOpt?.name ? rowOpt.name : rowOpt,
                  count: data,
                });
              });
            });
          });
        });
      }
    }
    return result;
  }, [selectedRows, selectedColumns, filteredData]);
  const downloadPDF = async () => {
    const element = tableRef.current;

    const canvas = await html2canvas(element, {
      scale: 2, // better quality
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image (auto scales)
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfname = `${selectedRows?.map((row) => row.group).join("_")}.pdf`;
    pdf.save(pdfname);
  };

  return (
    <Flex flexDirection={"column"} w="100%" gap="1rem">
      <Card className="mt-2 flex flex-col justify-center w-full p-4">
        <Text mb="2">Columns:</Text>
        <Flex gap="0.5rem" w="100%" mb="8">
          <Flex w="50%" flexDirection={"column"}>
            <Select
              w="100%"
              fontSize={"13px"}
              value={selectedColumns?.find((col) => col.isChosen)?.group || ""}
              onChange={(e) => {
                const key = e.target.value;
                setSelectedColumns((prev) => {
                  if (prev.length === 1 && prev[0].group === "") {
                    return [{ group: key, fields: [], isChosen: true }];
                  } else {
                    const existingGroup = prev.find((col) => col.group === key);
                    if (existingGroup) {
                      return prev.map((col) => {
                        if (col.group === key) {
                          return {
                            ...col,
                            isChosen: true,
                          };
                        }
                        return { ...col, isChosen: false };
                      });
                    }
                    return [
                      { group: key, fields: [], isChosen: true },
                      ...prev.map((col) => {
                        return { ...col, isChosen: false };
                      }),
                    ];
                  }
                });
              }}
            >
              <option value="">-- Select Group --</option>
              {groupOptions.map((option) => (
                <option key={option.value + "_col"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {selectedColumns?.map((col, index) => (
              <Flex flexDirection={"column"} key={index + "_col"} mt="2">
                <Text fontSize={"13px"} fontWeight={"600"}>
                  {
                    groupOptions?.find((group) => col.group === group.value)
                      ?.label
                  }
                </Text>
                {col?.fields?.length > 0 &&
                  col?.fields?.map((field) => (
                    <Text key={field + "_col"} fontSize={"13px"}>
                      {
                        clinlogFilterColumns.find(
                          (column) => column.key === field,
                        )?.label
                      }
                    </Text>
                  ))}
              </Flex>
            ))}
          </Flex>
          <Flex flexDirection={"column"} gap="0.5rem" w="50%" ml="4">
            {clinlogFilterColumns
              .filter(
                (column) =>
                  column.group ===
                    //@ts-ignore
                    selectedColumns?.find((col) => col.isChosen)?.group &&
                  column.type === "select",
              )
              ?.map((column) => (
                <Checkbox
                  key={column.key + "_col"}
                  isChecked={selectedColumns
                    .map((col) => col.fields)
                    .flat()
                    .includes(column.key)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedColumns((prev) => {
                      const newFields = isChecked;
                      return prev.map((col) => {
                        if (col.group === column.group) {
                          if (isChecked) {
                            return {
                              ...col,
                              fields: [...col.fields, column.key],
                            };
                          } else {
                            return {
                              ...col,
                              fields: col.fields.filter(
                                (field) => field !== column.key,
                              ),
                            };
                          }
                        }
                        return col;
                      });
                    });
                  }}
                >
                  <Text fontSize={"14px"}>{column.label}</Text>
                </Checkbox>
              ))}
          </Flex>
        </Flex>
        <Text mb="2">Rows:</Text>
        <Flex gap="0.5rem" w="100%" mb="8">
          <Flex w="50%" flexDirection={"column"}>
            <Select
              w="100%"
              fontSize={"13px"}
              value={selectedRows?.find((row) => row.isChosen)?.group || ""}
              onChange={(e) => {
                const key = e.target.value;
                setSelectedRows((prev) => {
                  if (prev.length === 1 && prev[0].group === "") {
                    return [{ group: key, fields: [], isChosen: true }];
                  } else {
                    const existingGroup = prev.find((row) => row.group === key);
                    if (existingGroup) {
                      return prev.map((row) => {
                        if (row.group === key) {
                          return {
                            ...row,
                            isChosen: true,
                          };
                        }
                        return { ...row, isChosen: false };
                      });
                    }
                    return [
                      { group: key, fields: [], isChosen: true },
                      ...prev.map((row) => {
                        return { ...row, isChosen: false };
                      }),
                    ];
                  }
                });
              }}
            >
              <option value="">-- Select Group --</option>
              {groupOptions.map((option) => (
                <option key={option.value + "_row"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {selectedRows?.map(
              (row, index) =>
                row?.fields?.length > 0 && (
                  <Flex flexDirection={"column"} key={index + "_row"} mt="2">
                    <Text fontSize={"13px"} fontWeight={"600"}>
                      {
                        groupOptions?.find((group) => row.group === group.value)
                          ?.label
                      }
                    </Text>

                    {row?.fields?.map((field) => (
                      <Text key={field + "_row"} fontSize={"13px"}>
                        {
                          clinlogFilterColumns.find(
                            (column) => column.key === field,
                          )?.label
                        }{" "}
                      </Text>
                    ))}
                  </Flex>
                ),
            )}
          </Flex>
          <Flex flexDirection={"column"} gap="0.5rem" w="50%" ml="4">
            {clinlogFilterColumns
              .filter(
                (column) =>
                  column.group ===
                    selectedRows?.find((row) => row.isChosen)?.group &&
                  column.type === "select",
              )
              ?.map((column) => (
                <Checkbox
                  key={column.key + "_row"}
                  isChecked={selectedRows
                    .map((row) => row.fields)
                    .flat()
                    .includes(column.key)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedRows((prev) => {
                      const newFields = isChecked;
                      return prev.map((row) => {
                        if (row.group === column.group) {
                          if (isChecked) {
                            return {
                              ...row,
                              fields: [...row.fields, column.key],
                            };
                          } else {
                            return {
                              ...row,
                              fields: row.fields.filter(
                                (field) => field !== column.key,
                              ),
                            };
                          }
                        }
                        return row;
                      });
                    });
                  }}
                >
                  <Text fontSize={"14px"}>{column.label}</Text>
                </Checkbox>
              ))}
          </Flex>
        </Flex>
      </Card>
      <Flex flexDirection={"column"} w="100%">
        <Flex justify={"flex-end"} gap="2">
          <Button
            size="sm"
            mb="2"
            leftIcon={<DownloadIcon />}
            bg="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
            color={"white"}
            onClick={downloadPDF}
          >
            Download Report
          </Button>
          <Button
            size="sm"
            leftIcon={<MdRefresh />}
            bg="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
            color={"white"}
            onClick={() => {
              setSelectedColumns([{ group: "", fields: [], isChosen: false }]);

              setSelectedRows([{ group: "", fields: [], isChosen: false }]);
            }}
          >
            Reset
          </Button>
        </Flex>
        {tableData?.length > 0 && (
          <Text mb="2" fontSize={"14px"} fontWeight={"600"}>
            Total: {filteredData?.length}
          </Text>
        )}
        {tableData?.length > 0 && (
          <TableContainer
            ref={tableRef}
            border="1px solid #F7F0F0"
            borderRadius="6px"
            w="100%"
          >
            <Table variant="unstyled" overflow={"scroll"}>
              <Thead>
                <Tr borderBottom={"1px solid #E2E8F0"} bgColor={"#E2EFFC"}>
                  <Th
                    position="sticky"
                    top={0}
                    left={0}
                    zIndex={3}
                    bg={"#E2EFFC"}
                  ></Th>
                  {selectedColumns?.map((col) =>
                    col.fields.map((field) => (
                      <Th
                        key={field + "h1"}
                        colSpan={
                          clinlogFilterColumns?.find(
                            (column) => column.key === field,
                          )?.options?.length ||
                          recordTreatmentSurgeonOptions?.length
                        }
                        fontSize={"14px"}
                        textAlign={"center"}
                        borderRight={"1px solid #E2E8F0"}
                      >
                        {
                          clinlogFilterColumns.find(
                            (column) => column.key === field,
                          )?.label
                        }
                      </Th>
                    )),
                  )}
                </Tr>

                <Tr borderBottom={"1px solid #E2E8F0"} bg="white">
                  <Th
                    borderRight={"1px solid #E2E8F0"}
                    position="sticky"
                    left={0}
                    top={0}
                    zIndex={2}
                    bg="white"
                  ></Th>
                  {selectedColumns?.map((col) =>
                    col?.fields?.map((field) => {
                      const column = clinlogFilterColumns.find(
                        (column) => column.key === field,
                      );

                      const colOptions =
                        field === "recordTreatmentSurgeons"
                          ? recordTreatmentSurgeonOptions
                          : column?.options || [];
                      return colOptions?.map((option) => (
                        <Td
                          borderRight={"1px solid #E2E8F0"}
                          key={option?.value || option}
                        >
                          <Text fontSize="14px" fontWeight={"500"}>
                            {option?.name || option}
                          </Text>
                        </Td>
                      ));
                    }),
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {selectedRows
                  ?.map((group) => group.fields)
                  .flat()
                  .map((row, index) => {
                    const rowData = tableData?.filter(
                      (data) => data.rowHeader === row,
                    );
                    const rowField = clinlogFilterColumns.find(
                      (column) => column.key === row,
                    );
                    const rowOptions =
                      row === "recordTreatmentSurgeons"
                        ? recordTreatmentSurgeonOptions
                        : rowField?.options;
                    return (
                      <>
                        <Tr
                          borderBottom={"1px solid #E2E8F0"}
                          key={row + index + "sample"}
                          bgColor="#CEF8FC"
                        >
                          <Th
                            position="sticky"
                            left={0}
                            top={0}
                            zIndex={2}
                            bg="#CEF8FC"
                            borderRight={"1px solid #E2E8F0"}
                          >
                            {"Sample Size"}{" "}
                          </Th>
                          {selectedColumns
                            ?.filter((col) => col.fields.length > 0)
                            ?.map((col) => {
                              return col.fields.map((field) => {
                                const options =
                                  field === "recordTreatmentSurgeons"
                                    ? recordTreatmentSurgeonOptions
                                    : clinlogFilterColumns.find(
                                        (column) => column.key === field,
                                      )?.options;
                                return options?.map((option, i) => {
                                  const sampleSize = rowData?.find((data) => {
                                    return (
                                      data.columnHeader === field &&
                                      data.columnValue ===
                                        (option?.name || option)
                                    );
                                  })?.colSampleSize;

                                  return (
                                    <Th
                                      borderRight={"1px solid #E2E8F0"}
                                      key={`${
                                        option?.value || option
                                      } ${i} sample`}
                                    >
                                      {sampleSize ? sampleSize : 0}{" "}
                                    </Th>
                                  );
                                });
                              });
                            })}
                        </Tr>
                        <Tr
                          borderBottom={"1px solid #E2E8F0"}
                          key={row + index + "_val"}
                          bgColor="#CEF8FC"
                        >
                          <Th
                            position="sticky"
                            left={0}
                            top={0}
                            zIndex={2}
                            bg="#CEF8FC"
                            borderRight={"1px solid #E2E8F0"}
                          >
                            {rowField?.label}
                          </Th>
                          {selectedColumns
                            ?.filter((col) => col.fields.length > 0)
                            ?.map((col, i) => {
                              return col?.fields?.map((field, j) => {
                                const options =
                                  field === "recordTreatmentSurgeons"
                                    ? recordTreatmentSurgeonOptions
                                    : clinlogFilterColumns.find(
                                        (column) => column?.key === field,
                                      )?.options;
                                return options?.map((option, k) => {
                                  const data = rowData?.filter((data) => {
                                    return (
                                      data.columnHeader === field &&
                                      data.columnValue ===
                                        (option?.name || option)
                                    );
                                  });
                                  const sampleSize = data?.reduce(
                                    (acc, curr) => {
                                      return acc + curr.count;
                                    },
                                    0,
                                  );
                                  return (
                                    <Th
                                      borderRight={"1px solid #E2E8F0"}
                                      key={`${option?.value || option} ${
                                        row + k
                                      } _val`}
                                    >
                                      {sampleSize ? sampleSize : 0}
                                    </Th>
                                  );
                                });
                              });
                            })}
                        </Tr>
                        {rowOptions?.map((rowOpt) => {
                          return (
                            <>
                              <Tr
                                borderBottom={"1px solid #E2E8F0"}
                                key={`${rowOpt?.value || rowOpt} _row`}
                                bg="white"
                              >
                                <Td
                                  borderRight={"1px solid #E2E8F0"}
                                  fontSize={"14px"}
                                  fontWeight={"700"}
                                  position="sticky"
                                  bg="white"
                                  left={0}
                                  top={0}
                                  zIndex={2}
                                >
                                  {rowOpt?.name || rowOpt}
                                </Td>
                                {selectedColumns
                                  .filter((col) => col.fields.length > 0)
                                  .map((col, index) => {
                                    return col.fields.map((field, j) => {
                                      const options =
                                        field === "recordTreatmentSurgeons"
                                          ? recordTreatmentSurgeonOptions
                                          : clinlogFilterColumns.find(
                                              (column) => column.key === field,
                                            )?.options;
                                      return options?.map((option, i) => {
                                        const cellValue = rowData?.find(
                                          (data) => {
                                            return (
                                              data.columnHeader === field &&
                                              data.columnValue ===
                                                (option?.name || option) &&
                                              data.rowValue ===
                                                (rowOpt?.name || rowOpt)
                                            );
                                          },
                                        );
                                        const data = rowData?.filter((data) => {
                                          return (
                                            data.columnHeader === field &&
                                            data.columnValue ===
                                              (option?.name || option)
                                          );
                                        });
                                        const sampleSize = data?.reduce(
                                          (acc, curr) => {
                                            return acc + curr.count;
                                          },
                                          0,
                                        );
                                        const count = cellValue?.count || 0;
                                        const percentage =
                                          (cellValue?.count / sampleSize) * 100;
                                        const percentageText = percentage
                                          ? percentage.toFixed(2) + "%"
                                          : "0%";
                                        return (
                                          <Td
                                            borderRight={"1px solid #E2E8F0"}
                                            key={`${
                                              option?.value || option
                                            } ${row} ${
                                              rowOpt?.name || rowOpt
                                            } col`}
                                            fontSize={"12px"}
                                          >
                                            {count} ({percentageText}){" "}
                                          </Td>
                                        );
                                      });
                                    });
                                  })}
                              </Tr>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {/* </Card> */}
      </Flex>
      {/* <Flex w="100%" align={"center"} justify={"flex-end"}>
        {" "}
        <Button
          size="sm"
          leftIcon={<MdRefresh />}
          bg="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
          color={"white"}
          onClick={() => {
            setSelectedColumns([{ group: "", fields: [], isChosen: false }]);

            setSelectedRows([{ group: "", fields: [], isChosen: false }]);
          }}
        >
          Reset
        </Button>
      </Flex> */}
    </Flex>
  );
}
