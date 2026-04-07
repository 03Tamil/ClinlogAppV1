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
  Box,
  TableContainer,
} from "@chakra-ui/react";
import { table } from "console";
import { format } from "date-fns";
import { fi, is } from "date-fns/locale";
import { cp } from "fs";
import { clinlogFilterColumns } from "helpersv2/utils";
import { Sedgwick_Ave } from "next/font/google";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
export default function RestrictedValuesTable({
  filteredData,
  groupOptions,
  recordTreatmentSurgeonOptions,
}) {
  const [selectedColumns, setSelectedColumns] = useState([
    { group: "", fields: [], isChosen: false },
  ]);
  const [selectedSubColumns, setSelectedSubColumns] = useState([
    { group: "", fields: [], isChosen: false },
  ]);
  const [selectedRows, setSelectedRows] = useState([
    { group: "", fields: [], isChosen: false },
  ]);
  const [tableData, setTableData] = useState([]);
  const scrollRef = useRef(null);

  const handleRowClick = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200, // adjust scroll distance
        behavior: "smooth",
      });
    }
  };

  const ageGroupOptions = [
    { value: "<40", name: "<40" },
    { value: "40-50", name: "40-50" },
    { value: "50-60", name: "50-60" },
    { value: "60-70", name: "60-70" },
    { value: ">70", name: ">70" },
  ];
  useEffect(() => {
    const result = [];
    const isColValues = selectedColumns.every((col) =>
      col.fields.every((field) => field?.values?.length > 0),
    );
    const isSubColValues = selectedSubColumns.every((subCol) =>
      subCol.fields.every((field) => field?.values?.length > 0),
    );
    const isRowValues = selectedRows.every((row) =>
      row.fields.every((field) => field?.values?.length > 0),
    );
    if (
      isColValues &&
      isSubColValues &&
      isRowValues &&
      filteredData.length > 0
    ) {
      const fields = [
        ...selectedRows
          .map((row) =>
            row.fields.map((field) => {
              return { group: row.group, ...field };
            }),
          )
          .flat(),
        ...selectedColumns
          .map((col) =>
            col.fields.map((field) => {
              return { group: col.group, ...field };
            }),
          )
          .flat(),
        ...selectedSubColumns
          .map((col) =>
            col.fields.map((field) => {
              return { group: col.group, ...field };
            }),
          )
          .flat(),
      ];
      if (fields.length > 0) {
        const patientData = filteredData?.map((record) => {
          const data = { id: record.id };
          fields.forEach((field) => {
            if (field.group === "followUp") {
              const followUpData = record.recordFollowUpMatrix?.[0];
              data[field.key] = followUpData?.[field.key];
            } else if (field.group === "siteSpecificCharacteristics") {
              const siteDetails =
                record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );
              const siteSpecificData = siteDetails?.map((site) => {
                if (field.key === "toothValue") {
                  return site.toothValue;
                } else if (
                  clinlogFilterColumns?.find((col) => col.key === field.key)
                    ?.subGroup === "ssFollowUp"
                ) {
                  const siteFollowUpRecords =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.attachedSiteSpecificFollowUp?.[0];
                  return siteFollowUpRecords?.[field.key];
                }
                return site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.[field.key];
              });
              data[field.key] = siteSpecificData;
            } else if (field.key === "recordTreatmentDate") {
              data[field.key] = record[field.key]
                ? format(new Date(record[field.key]), "dd MMM yyyy")
                : "";
            } else if (field.key === "recordTreatmentSurgeons") {
              data[field.key] =
                record[field.key].map((surgeon) => surgeon.fullName).flat() ||
                [];
            } else {
              data[field.key] = record[field.key];
            }
          });
          return data;
        });

        const columnFields = selectedColumns
          .map((col) =>
            col.fields.map((field) => {
              return { group: col.group, ...field };
            }),
          )
          .flat()
          .filter((fields) => fields?.values?.length > 0);
        const subColumnFields = selectedSubColumns
          .map((col) =>
            col.fields.map((field) => {
              return { group: col.group, ...field };
            }),
          )
          .flat()
          .filter((fields) => fields?.values?.length > 0);
        const rowFields = selectedRows
          .map((row) =>
            row.fields.map((field) => {
              return { group: row.group, ...field };
            }),
          )
          .flat()
          .filter((fields) => fields?.values?.length > 0);

        columnFields.forEach((col) => {
          let colOptions = [];
          if (col.key === "ageAtTimeOfSurgery") {
            colOptions = ageGroupOptions;
          } else if (col.key === "recordTreatmentDate") {
            colOptions = [
              ...new Set(patientData?.map((record) => record[col.key])),
            ];
          } else if (col.key === "recordTreatmentSurgeons") {
            colOptions = recordTreatmentSurgeonOptions?.map((option) => {
              return {
                value: option,
                name: option,
              };
            });
          } else {
            colOptions = clinlogFilterColumns.find(
              (column) => column.key === col.key,
            )?.options;
          }
          subColumnFields.forEach((sub) => {
            let subColOptions = [];
            if (sub.key === "ageAtTimeOfSurgery") {
              subColOptions = ageGroupOptions;
            } else if (sub.key === "recordTreatmentDate") {
              subColOptions = [
                ...new Set(patientData?.map((record) => record[sub.key])),
              ];
            } else if (sub.key === "recordTreatmentSurgeons") {
              subColOptions = recordTreatmentSurgeonOptions?.map((option) => {
                return {
                  value: option,
                  name: option,
                };
              });
            } else {
              subColOptions = clinlogFilterColumns.find(
                (column) => column.key === sub.key,
              )?.options;
            }
            rowFields.forEach((row) => {
              let rowOptions = [];
              if (row.key === "ageAtTimeOfSurgery") {
                //@ts-ignore
                rowOptions = ageGroupOptions;
              } else if (row.key === "recordTreatmentDate") {
                rowOptions = [
                  ...new Set(patientData?.map((record) => record[row])),
                ];
              } else if (row.key === "recordTreatmentSurgeons") {
                rowOptions = recordTreatmentSurgeonOptions?.map((option) => {
                  return {
                    value: option,
                    name: option,
                  };
                });
              } else {
                rowOptions = clinlogFilterColumns.find(
                  (column) => column.key === row.key,
                )?.options;
              }
              colOptions?.forEach((option) => {
                const columnFilteredData = patientData?.filter((record) => {
                  if (col.group === "siteSpecificCharacteristics") {
                    return record?.[col.key]?.includes(option.value);
                  } else if (col.key === "ageAtTimeOfSurgery") {
                    if (option.value === "<40")
                      return Number(record[col.key]) < 40;
                    if (option.value === "40-50")
                      return (
                        Number(record[col.key]) >= 40 &&
                        Number(record[col.key]) <= 50
                      );
                    if (option.value === "50-60")
                      return (
                        Number(record[col.key]) >= 50 &&
                        Number(record[col.key]) <= 60
                      );
                    if (option.value === "60-70")
                      return (
                        Number(record[col.key]) >= 60 &&
                        Number(record[col.key]) <= 70
                      );
                    if (option.value === ">70")
                      return Number(record[col.key]) > 70;
                  } else if (col.key === "recordTreatmentSurgeons") {
                    return record[col.key].includes(option.value);
                  } else if (col.key === "recordTreatmentDate") {
                    return record[col.key] === option;
                  } else {
                    return record[col.key] === option.value;
                  }
                });

                subColOptions?.forEach((subOption) => {
                  const subColFilteredData = columnFilteredData?.filter(
                    (record) => {
                      if (sub.group === "siteSpecificCharacteristics") {
                        return record[sub.key].includes(subOption.value);
                      } else if (sub.key === "ageAtTimeOfSurgery") {
                        if (subOption.value === "<40")
                          return Number(record[sub.key]) < 40;
                        if (subOption.value === "40-50")
                          return (
                            Number(record[sub.key]) >= 40 &&
                            Number(record[sub.key]) <= 50
                          );
                        if (subOption.value === "50-60")
                          return (
                            Number(record[sub.key]) >= 50 &&
                            Number(record[sub.key]) <= 60
                          );
                        if (subOption.value === "60-70")
                          return (
                            Number(record[sub.key]) >= 60 &&
                            Number(record[sub.key]) <= 70
                          );
                        if (subOption.value === ">70")
                          return Number(record[sub.key]) > 70;
                      }
                      if (sub.key === "recordTreatmentSurgeons") {
                        return record[sub.key]?.includes(subOption.value);
                      }
                      if (sub.key === "recordTreatmentDate") {
                        return record[sub.key] === subOption;
                      }
                      return record[sub.key] === subOption.value;
                    },
                  );

                  rowOptions?.forEach((rowOpt) => {
                    const data = subColFilteredData?.filter((record) => {
                      if (row.group === "siteSpecificCharacteristics") {
                        return record[row.key].includes(rowOpt.value);
                      } else if (row.key === "ageAtTimeOfSurgery") {
                        if (rowOpt.value === "<40")
                          return Number(record[row.key]) < 40;
                        if (rowOpt.value === "40-50")
                          return (
                            Number(record[row.key]) >= 40 &&
                            Number(record[row.key]) <= 50
                          );
                        if (rowOpt.value === "50-60")
                          return (
                            Number(record[row.key]) >= 50 &&
                            Number(record[row.key]) <= 60
                          );
                        if (rowOpt.value === "60-70")
                          return (
                            Number(record[row.key]) >= 60 &&
                            Number(record[row.key]) <= 70
                          );
                        if (rowOpt.value === ">70")
                          return Number(record[row.key]) > 70;
                      }
                      if (row.key === "recordTreatmentSurgeons") {
                        return record[row.key].includes(rowOpt.value);
                      }
                      if (row.key === "recordTreatmentDate") {
                        return record[row.key] === rowOpt;
                      }
                      return record[row.key] === rowOpt.value;
                    }).length;

                    result.push({
                      columnHeader: col.key,
                      colValues: col.values.map(
                        (colOpt) =>
                          colOptions.find((opt) => opt.value === colOpt)?.name,
                      ),
                      columnValue: option?.name ? option.name : option,
                      colSampleSize: columnFilteredData.length,
                      subColumnHeader: sub.key,
                      subColValues: sub.values.map(
                        (subOpt) =>
                          subColOptions.find((opt) => opt.value === subOpt)
                            ?.name,
                      ),
                      subColumnValue: subOption?.name
                        ? subOption.name
                        : subOption,
                      subColSampleSize: subColFilteredData.length,
                      rowHeader: row.key,
                      rowValues: row.values.map(
                        (r) => rowOptions.find((opt) => opt.value === r)?.name,
                      ),
                      rowValue: rowOpt?.name ? rowOpt.name : rowOpt,
                      count: data,
                    });
                  });
                });
              });
            });
          });
        });
      }
    }
    setTableData(result);
  }, [selectedRows, selectedColumns, selectedSubColumns, filteredData]);

  return (
    <Flex flexDirection={"column"} w="100%" gap="1rem">
      <Card className="mt-2 flex flex-col justify-center w-full p-4">
        <Text mb="2"> Primary Columns:</Text>
        <Flex gap="0.5rem" w="100%" mb="8">
          <Flex w="30%" flexDirection={"column"}>
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
              {/* checked for unique key */}
              {groupOptions?.map((option) => (
                <option key={option.value + "_col"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {/* checked for unique key */}
            {selectedColumns?.map((col, index) => (
              <Flex flexDirection={"column"} key={index + "_col"} mt="2">
                {col?.fields?.length > 0 && (
                  <>
                    <Text fontSize={"13px"} fontWeight={"600"}>
                      {
                        groupOptions?.find((group) => col.group === group.value)
                          ?.label
                      }
                    </Text>
                    {/* checked for unique key */}
                    {col?.fields?.map(
                      (field) =>
                        field?.values?.length > 0 && (
                          <Flex
                            key={field.key + "_col"}
                            flexDirection={"column"}
                            fontSize={"13px"}
                            ml="2"
                          >
                            <Text fontWeight={"600"}>
                              {" "}
                              {
                                clinlogFilterColumns.find(
                                  (column) => column.key === field.key,
                                )?.label
                              }
                            </Text>

                            {field.values?.map((value) => {
                              return (
                                <Text key={value + "sel_col_val"} ml="2">
                                  {" - "}
                                  {value}
                                </Text>
                              );
                            })}
                          </Flex>
                        ),
                    )}
                  </>
                )}
              </Flex>
            ))}
          </Flex>
          {selectedColumns?.[0]?.group != "" && (
            <Select
              fontSize={"13px"}
              w="30%"
              value={
                selectedColumns
                  ?.map((row) => row.fields)
                  .flat()
                  .find((field) => field.isChosen)?.key || ""
              }
              onChange={(e) => {
                const key = e.target.value;
                setSelectedColumns((prev) => {
                  if (prev?.length > 0) {
                    return prev?.map((col) => {
                      if (col.isChosen) {
                        const fields = col.fields?.map((field) => field.key);
                        if (fields.includes(key)) {
                          return {
                            ...col,
                            fields: col.fields.map((f) => {
                              if (key === f.key) {
                                return { ...f, isChosen: true };
                              }
                              return { ...f, isChosen: false };
                            }),
                          };
                        } else {
                          return {
                            ...col,
                            fields: [
                              ...col.fields.map((f) => {
                                return { ...f, isChosen: false };
                              }),
                              { key: key, isChosen: true },
                            ],
                          };
                        }
                      } else {
                        return {
                          ...col,
                          fields: col.fields.map((f) => {
                            return { ...f, isChosen: false };
                          }),
                          isChosen: false,
                        };
                      }
                    });
                  }
                });
              }}
            >
              <option value="">-- Select a field --</option>
              {clinlogFilterColumns
                .filter(
                  (column) =>
                    column.group ===
                      //@ts-ignore
                      selectedColumns?.find((col) => col.isChosen)?.group &&
                    column.type === "select",
                )
                ?.map((column) => (
                  <option key={column.key + "_cols"} value={column.key}>
                    {column.label}
                  </option>
                ))}
            </Select>
          )}
          <Flex
            w="30%"
            flexDirection={"column"}
            gap="0.5rem"
            ml="4"
            borderRadius="8px"
            maxH="15vh"
            overflow={"scroll"}
            p="2"
          >
            {selectedColumns
              .map((col) => col.fields)
              .flat()
              .filter((field) => field.isChosen)
              .map((field) => {
                const fieldValues = field?.values || [];
                const options =
                  field?.key === "recordTreatmentSurgeons"
                    ? recordTreatmentSurgeonOptions?.map((option) => {
                        return {
                          value: option,
                          name: option,
                        };
                      })
                    : field?.key === "ageAtTimeOfSurgery"
                      ? ageGroupOptions
                      : clinlogFilterColumns.find(
                          (column) => column.key === field.key,
                        )?.options || [];
                return options?.map((option) => {
                  return (
                    <Checkbox
                      key={(option?.value || option) + "_check_cols_val"}
                      isChecked={fieldValues.includes(option.value || option)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedColumns((prev) => {
                          return prev.map((col) => {
                            if (col.isChosen) {
                              const field = col.fields.find((f) => f.isChosen);
                              if (field) {
                                const fieldValues = field?.values || [];
                                if (isChecked) {
                                  return {
                                    ...col,
                                    fields: col.fields.map((f) => {
                                      if (f.key === field.key) {
                                        return {
                                          ...f,
                                          values: [
                                            ...fieldValues,
                                            option.value,
                                          ],
                                        };
                                      }
                                      return f;
                                    }),
                                  };
                                } else {
                                  return {
                                    ...col,
                                    fields: col.fields.map((f) => {
                                      if (f.key === field.key) {
                                        return {
                                          ...f,
                                          values: fieldValues.filter(
                                            (value) => value !== option.value,
                                          ),
                                        };
                                      }
                                      return f;
                                    }),
                                  };
                                }
                              }
                            }
                            return col;
                          });
                        });
                      }}
                    >
                      {" "}
                      <Text fontSize={"14px"}>{option.name || option}</Text>
                    </Checkbox>
                  );
                });
              })}
          </Flex>
        </Flex>
        <Text mb="2">Sub Columns:</Text>
        <Flex gap="0.5rem" w="100%" mb="8">
          <Flex w="30%" flexDirection={"column"}>
            <Select
              w="100%"
              fontSize={"13px"}
              value={
                selectedSubColumns?.find((col) => col.isChosen)?.group || ""
              }
              isDisabled={selectedColumns?.[0]?.group === ""}
              onChange={(e) => {
                const key = e.target.value;
                setSelectedSubColumns((prev) => {
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
                <option key={option.value + "_sub"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {selectedSubColumns?.map((col, index) => (
              <Flex flexDirection={"column"} key={index} mt="2">
                {col?.fields?.length > 0 && (
                  <>
                    <Text fontSize={"13px"} fontWeight={"600"}>
                      {
                        groupOptions?.find((group) => col.group === group.value)
                          ?.label
                      }
                    </Text>

                    {col?.fields?.map(
                      (field) =>
                        field?.values?.length > 0 && (
                          <Flex
                            key={field.key}
                            flexDirection={"column"}
                            fontSize={"13px"}
                            ml="2"
                          >
                            <Text fontWeight={"600"}>
                              {" "}
                              {
                                clinlogFilterColumns.find(
                                  (column) => column.key === field.key,
                                )?.label
                              }
                            </Text>

                            {field.values?.map((value) => {
                              return (
                                <Text key={value} ml="2">
                                  {" - "}
                                  {value}{" "}
                                </Text>
                              );
                            })}
                          </Flex>
                        ),
                    )}
                  </>
                )}
              </Flex>
            ))}
          </Flex>
          {selectedSubColumns?.[0]?.group != "" && (
            <Select
              fontSize={"13px"}
              w="30%"
              value={
                selectedSubColumns
                  ?.map((row) => row.fields)
                  .flat()
                  .find((field) => field.isChosen)?.key || ""
              }
              onChange={(e) => {
                const key = e.target.value;
                setSelectedSubColumns((prev) => {
                  if (prev?.length > 0) {
                    return prev.map((col) => {
                      if (col.isChosen) {
                        const fields = col.fields?.map((field) => field.key);
                        if (fields.includes(key)) {
                          return {
                            ...col,
                            fields: col.fields.map((f) => {
                              if (key === f.key) {
                                return { ...f, isChosen: true };
                              }
                              return { ...f, isChosen: false };
                            }),
                          };
                        } else {
                          return {
                            ...col,
                            fields: [
                              ...col.fields.map((f) => {
                                return { ...f, isChosen: false };
                              }),
                              { key: key, isChosen: true },
                            ],
                          };
                        }
                      } else {
                        return {
                          ...col,
                          fields: col.fields.map((f) => {
                            return { ...f, isChosen: false };
                          }),
                          isChosen: false,
                        };
                      }
                    });
                  }
                });
              }}
            >
              <option value="">-- Select a field --</option>
              {clinlogFilterColumns
                .filter(
                  (column) =>
                    column.group ===
                      //@ts-ignore
                      selectedSubColumns?.find((col) => col.isChosen)?.group &&
                    column.type === "select",
                )
                ?.map((column) => (
                  <option key={column.key + "_sub"} value={column.key}>
                    {column.label}
                  </option>
                ))}
            </Select>
          )}
          <Flex
            w="30%"
            flexDirection={"column"}
            gap="0.5rem"
            ml="4"
            borderRadius="8px"
            maxH="15vh"
            overflow={"scroll"}
            p="2"
          >
            {selectedSubColumns
              .map((col) => col.fields)
              .flat()
              .filter((field) => field.isChosen)
              .map((field) => {
                const fieldValues = field?.values || [];
                const options =
                  field?.key === "recordTreatmentSurgeons"
                    ? recordTreatmentSurgeonOptions?.map((option) => {
                        return {
                          value: option,
                          name: option,
                        };
                      })
                    : field?.key === "ageAtTimeOfSurgery"
                      ? ageGroupOptions
                      : clinlogFilterColumns.find(
                          (column) => column.key === field.key,
                        )?.options || [];
                return options?.map((option, i) => {
                  return (
                    <Checkbox
                      key={(option?.value || option) + "_sub" + i}
                      isChecked={fieldValues.includes(option.value)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedSubColumns((prev) => {
                          return prev.map((col) => {
                            if (col.isChosen) {
                              const field = col.fields.find((f) => f.isChosen);
                              if (field) {
                                const fieldValues = field?.values || [];
                                if (isChecked) {
                                  return {
                                    ...col,
                                    fields: col.fields.map((f) => {
                                      if (f.key === field.key) {
                                        return {
                                          ...f,
                                          values: [
                                            ...fieldValues,
                                            option.value,
                                          ],
                                        };
                                      }
                                      return f;
                                    }),
                                  };
                                } else {
                                  return {
                                    ...col,
                                    fields: col.fields.map((f) => {
                                      if (f.key === field.key) {
                                        return {
                                          ...f,
                                          values: fieldValues.filter(
                                            (value) => value !== option.value,
                                          ),
                                        };
                                      }
                                      return f;
                                    }),
                                  };
                                }
                              }
                            }
                            return col;
                          });
                        });
                      }}
                    >
                      {" "}
                      <Text fontSize={"14px"}>{option.name || option}</Text>
                    </Checkbox>
                  );
                });
              })}
          </Flex>
        </Flex>
        <Text mb="2">Rows:</Text>
        <Flex gap="0.5rem" w="100%" mb="8">
          <Flex w="30%" flexDirection={"column"}>
            <Select
              w="100%"
              fontSize={"13px"}
              value={selectedRows?.find((row) => row.isChosen)?.group || ""}
              isDisabled={
                selectedColumns?.[0]?.group === "" &&
                selectedSubColumns?.[0]?.group === ""
              }
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
                <option key={option.value + "_rows"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {selectedRows?.map((row, index) => (
              <Flex
                flexDirection={"column"}
                key={row.group + "_rows_group_" + index}
                mt="2"
              >
                {row?.fields?.length > 0 && (
                  <>
                    <Text fontSize={"13px"} fontWeight={"600"}>
                      {
                        groupOptions?.find((group) => row.group === group.value)
                          ?.label
                      }
                    </Text>

                    {row?.fields?.map(
                      (field, i) =>
                        field?.values?.length > 0 && (
                          <Flex
                            key={field.key + "_row_fields_" + i}
                            flexDirection={"column"}
                            fontSize={"13px"}
                            ml="2"
                          >
                            <Text fontWeight={"600"}>
                              {" "}
                              {
                                clinlogFilterColumns.find(
                                  (column) => column.key === field.key,
                                )?.label
                              }
                            </Text>

                            {field.values?.map((value) => {
                              return (
                                <Text key={value + "_row_values"} ml="2">
                                  {" - "}
                                  {value}{" "}
                                </Text>
                              );
                            })}
                          </Flex>
                        ),
                    )}
                  </>
                )}
              </Flex>
            ))}
          </Flex>
          {selectedRows?.[0]?.group != "" && (
            <Select
              fontSize={"13px"}
              w="30%"
              value={
                selectedRows
                  ?.map((row) => row.fields)
                  .flat()
                  .find((field) => field.isChosen)?.key || ""
              }
              onChange={(e) => {
                const key = e.target.value;
                setSelectedRows((prev) => {
                  if (prev?.length > 0) {
                    return prev?.map((row) => {
                      if (row.isChosen) {
                        const fields = row?.fields?.map((field) => field.key);
                        if (fields.includes(key)) {
                          return {
                            ...row,
                            fields: row?.fields?.map((f) => {
                              if (key === f.key) {
                                return { ...f, isChosen: true };
                              }
                              return { ...f, isChosen: false };
                            }),
                          };
                        } else {
                          return {
                            ...row,
                            fields: [
                              ...row?.fields?.map((f) => {
                                return { ...f, isChosen: false };
                              }),
                              { key: key, isChosen: true },
                            ],
                          };
                        }
                      } else {
                        return {
                          ...row,
                          fields: [
                            ...row?.fields?.map((f) => {
                              return { ...f, isChosen: false };
                            }),
                          ],
                          isChosen: false,
                        };
                      }
                    });
                  }
                });
              }}
            >
              <option value="">-- Select a field --</option>
              {clinlogFilterColumns
                .filter(
                  (column) =>
                    column.group ===
                      //@ts-ignore
                      selectedRows?.find((row) => row.isChosen)?.group &&
                    column.type === "select",
                )
                ?.map((column) => (
                  <option key={column.key + "_rows"} value={column.key}>
                    {column.label}
                  </option>
                ))}
            </Select>
          )}
          <Flex
            w="30%"
            flexDirection={"column"}
            gap="0.5rem"
            ml="4"
            borderRadius="8px"
            maxH="15vh"
            overflow={"scroll"}
            p="2"
          >
            {selectedRows
              ?.map((row) => row.fields)
              ?.flat()
              ?.filter((field) => field.isChosen)
              ?.map((field) => {
                const fieldValues = field?.values || [];
                const options =
                  field?.key === "recordTreatmentSurgeons"
                    ? recordTreatmentSurgeonOptions?.map((option) => {
                        return {
                          value: option,
                          name: option,
                        };
                      })
                    : field?.key === "ageAtTimeOfSurgery"
                      ? ageGroupOptions
                      : clinlogFilterColumns.find(
                          (column) => column.key === field.key,
                        )?.options || [];
                return options?.map((option, i) => {
                  return (
                    <Checkbox
                      key={(option?.value || option) + "_rows" + i}
                      isChecked={fieldValues.includes(option.value)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedRows((prev) => {
                          return prev?.map((row) => {
                            if (row.isChosen) {
                              const field = row?.fields?.find(
                                (f) => f.isChosen,
                              );
                              if (field) {
                                const fieldValues = field?.values || [];
                                if (isChecked) {
                                  return {
                                    ...row,
                                    fields: row?.fields?.map((f) => {
                                      if (f.key === field.key) {
                                        return {
                                          ...f,
                                          values: [
                                            ...fieldValues,
                                            option.value,
                                          ],
                                        };
                                      }
                                      return f;
                                    }),
                                  };
                                } else {
                                  return {
                                    ...row,
                                    fields: row?.fields?.map((f) => {
                                      if (f.key === field.key) {
                                        return {
                                          ...f,
                                          values: fieldValues.filter(
                                            (value) => value !== option.value,
                                          ),
                                        };
                                      }
                                      return f;
                                    }),
                                  };
                                }
                              }
                            }
                            return row;
                          });
                        });
                      }}
                    >
                      {" "}
                      <Text fontSize={"14px"}>{option.name || option}</Text>
                    </Checkbox>
                  );
                });
              })}
          </Flex>
        </Flex>
      </Card>

      {tableData?.length > 0 && (
        <Flex
          flexDirection={"column"}
          w="100%"
          // border={"1px solid #9a9a9a"}
          borderBottom={"0px"}
          maxH="50vh"
          overflowX={"scroll"}
          overflowY={"scroll"}
          ref={scrollRef}
        >
          <TableContainer
            border="1px solid #D9D9D9"
            borderRadius="6px"
            w="100%"
          >
            <Table variant="unstyled" overflowX={"scroll"}>
              <Thead>
                {/* Main header */}
                <Tr borderBottom={"1px solid #D9D9D9"} bgColor={"#E2EFFC"}>
                  <Th bg={"#E2EFFC"} borderRight={"1px solid #D9D9D9"}></Th>
                  {selectedColumns?.map((col) =>
                    col?.fields?.map(
                      (field) =>
                        field?.values?.length > 0 &&
                        field?.values?.map((value, i) => (
                          <Th
                            key={value + "h1" + i}
                            colSpan={
                              selectedSubColumns
                                ?.map((subCol) => subCol.fields)
                                ?.flat()
                                ?.map((subField) => subField?.values)
                                .flat().length
                            }
                            borderRight={"1px solid #D9D9D9"}
                            textAlign="center"
                            fontSize={"14px"}
                          >
                            {
                              clinlogFilterColumns.find(
                                (column) => column.key === field.key,
                              )?.label
                            }
                            /{value}
                          </Th>
                        )),
                    ),
                  )}
                  <Th
                    key={"h1"}
                    colSpan={
                      selectedSubColumns
                        ?.map((subCol) => subCol.fields)
                        ?.flat()
                        ?.map((subField) => subField?.values)
                        ?.flat().length
                    }
                    borderRight={"1px solid #D9D9D9"}
                    textAlign="center"
                    fontSize={"14px"}
                  >
                    Total
                  </Th>
                  <Th rowSpan={2} textAlign="center" fontSize={"14px"}>
                    Total (All)
                  </Th>
                </Tr>

                <Tr borderBottom={"1px solid #D9D9D9"} bgColor={"#E2EFFC"}>
                  <Th borderRight={"1px solid #D9D9D9"}>Sub Columns</Th>
                  {selectedColumns?.map((col, i) =>
                    col?.fields?.map(
                      (field, j) =>
                        field?.values?.length > 0 &&
                        field?.values?.map((val, k) =>
                          selectedSubColumns?.map((subCol) =>
                            subCol?.fields.map(
                              (subField) =>
                                subField?.values?.length > 0 &&
                                subField?.values?.map((value) => (
                                  <Td
                                    key={val + value + "h2" + i + j + k}
                                    fontSize={"13px"}
                                    fontWeight={"500"}
                                    borderRight={"1px solid #D9D9D9"}
                                  >
                                    {
                                      clinlogFilterColumns.find(
                                        (column) => column.key === subField.key,
                                      )?.label
                                    }{" "}
                                    / {value.toUpperCase()}
                                  </Td>
                                )),
                            ),
                          ),
                        ),
                    ),
                  )}
                  {selectedSubColumns?.map((subCol, i) =>
                    subCol?.fields?.map(
                      (subField, j) =>
                        subField?.values?.length > 0 &&
                        subField?.values?.map((value, k) => (
                          <Td
                            key={value + "h2" + i + j + k}
                            fontSize={"13px"}
                            fontWeight={"500"}
                            borderRight={"1px solid #D9D9D9"}
                          >
                            {
                              clinlogFilterColumns.find(
                                (column) => column.key === subField.key,
                              )?.label
                            }{" "}
                            / {value.toUpperCase()}
                          </Td>
                        )),
                    ),
                  )}
                </Tr>
              </Thead>
              <Tbody>
                <Tr
                  borderBottom={"1px solid #D9D9D9"}
                  key={"row_1"}
                  bgColor="#CEF8FC"
                >
                  <Th bg="#CEF8FC" borderRight={"1px solid #D9D9D9"}>
                    {"Sample Size"}
                  </Th>
                  {selectedColumns
                    ?.filter((col) => col?.fields?.length > 0)
                    ?.map((col) => {
                      return col.fields.map((field) => {
                        const colOpt =
                          field.key === "ageAtTimeOfSurgery"
                            ? ageGroupOptions
                            : field.key === "recordTreatmentSurgeons"
                              ? recordTreatmentSurgeonOptions?.map((option) => {
                                  return {
                                    value: option,
                                    name: option,
                                  };
                                })
                              : clinlogFilterColumns.find(
                                  (column) => column.key === field.key,
                                )?.options || [];
                        const options = colOpt.filter((opt) =>
                          field.values?.includes(opt.value),
                        );
                        return options?.map((option) => {
                          return selectedSubColumns?.map((subCol) =>
                            subCol?.fields?.map((subField) => {
                              const subcolOpt =
                                subField.key === "ageAtTimeOfSurgery"
                                  ? ageGroupOptions
                                  : subField.key === "recordTreatmentSurgeons"
                                    ? recordTreatmentSurgeonOptions?.map(
                                        (option) => {
                                          return {
                                            value: option,
                                            name: option,
                                          };
                                        },
                                      )
                                    : clinlogFilterColumns.find(
                                        (column) => column.key === subField.key,
                                      )?.options || [];
                              const subOptions = subcolOpt.filter((opt) =>
                                subField.values?.includes(opt.value),
                              );
                              return subOptions?.map((subOption) => {
                                const data = tableData?.find((data) => {
                                  return (
                                    data.columnHeader === field.key &&
                                    data.columnValue ===
                                      (option?.name || option) &&
                                    data.subColumnHeader === subField.key &&
                                    data.subColumnValue ===
                                      (subOption?.name || subOption)
                                  );
                                });

                                const sampleSize = data?.subColSampleSize || 0;

                                return (
                                  <Th
                                    borderRight={"1px solid #D9D9D9"}
                                    key={(subOption?.value || subOption) + "h3"}
                                  >
                                    {sampleSize ? sampleSize : 0}
                                  </Th>
                                );
                              });
                            }),
                          );
                        });
                      });
                    })}

                  {selectedSubColumns
                    .filter((ss) => ss.fields.length > 0)
                    ?.map((subCol) => {
                      return subCol.fields.map((subField) => {
                        const subcolOpt =
                          subField.key === "ageAtTimeOfSurgery"
                            ? ageGroupOptions
                            : subField.key === "recordTreatmentSurgeons"
                              ? recordTreatmentSurgeonOptions?.map((option) => {
                                  return {
                                    value: option,
                                    name: option,
                                  };
                                })
                              : clinlogFilterColumns.find(
                                  (column) => column.key === subField.key,
                                )?.options || [];
                        const subOptions = subcolOpt.filter((opt) =>
                          subField.values?.includes(opt.value),
                        );
                        return subOptions?.map((option) => {
                          const data = tableData?.filter((data) => {
                            return (
                              data.subColumnHeader === subField.key &&
                              data.subColumnValue === option?.name &&
                              data.rowValues.includes(data.rowValue)
                            );
                          });
                          const columnValues = [
                            ...new Set(data?.map((d) => d.colValues).flat()),
                          ];

                          const total = columnValues?.map((opt) => {
                            return data?.find((r) => {
                              return r.columnValue === opt;
                            })?.subColSampleSize;
                          });

                          const count =
                            total?.reduce(
                              (acc, curr) => acc + (curr || 0),
                              0,
                            ) || 0;
                          return (
                            <Th
                              borderRight={"1px solid #D9D9D9"}
                              key={option?.value + "h3" + subField.key}
                              fontSize={"13px"}
                            >
                              {count || 0}
                            </Th>
                          );
                        });
                      });
                    })}
                  <Th fontSize={"13px"}>
                    {" "}
                    {tableData
                      .filter(
                        (row) =>
                          row.subColValues.includes(row.subColumnValue) &&
                          row.colValues.includes(row.columnValue) &&
                          row.rowValues.includes(row.rowValue),
                      )
                      .reduce((acc, row) => acc + row.subColSampleSize, 0) /
                      selectedRows
                        ?.map((row) => row.fields)
                        ?.flat()
                        ?.map((field) => field.values)
                        ?.flat().length}
                  </Th>
                </Tr>
                {selectedRows
                  ?.map((group) => group.fields)
                  .flat()
                  ?.map((row, index) => {
                    if (row?.values?.length > 0) {
                      const rowData = tableData?.filter(
                        (data) => data.rowHeader === row.key,
                      );
                      const rowField = clinlogFilterColumns.find(
                        (column) => column.key === row.key,
                      );
                      const rowOpts =
                        row.key === "ageAtTimeOfSurgery"
                          ? ageGroupOptions
                          : row.key === "recordTreatmentSurgeons"
                            ? recordTreatmentSurgeonOptions?.map((option) => {
                                return {
                                  value: option,
                                  name: option,
                                };
                              })
                            : clinlogFilterColumns.find(
                                (column) => column.key === row.key,
                              )?.options || [];
                      const rowOptions = rowOpts?.filter((option) =>
                        row.values?.includes(option.value),
                      );
                      return (
                        <>
                          <Tr
                            borderBottom={"1px solid #D9D9D9"}
                            key={row.key + index + "_row01"}
                            bgColor="#CEF8FC"
                          >
                            <Th borderRight={"1px solid #D9D9D9"}>
                              {rowField?.label}
                            </Th>
                            {selectedColumns
                              ?.filter((col) => col?.fields?.length > 0)
                              ?.map((col) => {
                                return col?.fields?.map((field) => {
                                  const colOpt =
                                    field.key === "ageAtTimeOfSurgery"
                                      ? ageGroupOptions
                                      : field.key === "recordTreatmentSurgeons"
                                        ? recordTreatmentSurgeonOptions?.map(
                                            (option) => {
                                              return {
                                                value: option,
                                                name: option,
                                              };
                                            },
                                          )
                                        : clinlogFilterColumns.find(
                                            (column) =>
                                              column.key === field.key,
                                          )?.options || [];

                                  const options = colOpt.filter((opt) =>
                                    field.values?.includes(opt.value),
                                  );

                                  return options?.map((option) => {
                                    return selectedSubColumns?.map((subCol) =>
                                      subCol?.fields?.map((subField) => {
                                        const subcolOpt =
                                          subField.key === "ageAtTimeOfSurgery"
                                            ? ageGroupOptions
                                            : subField.key ===
                                                "recordTreatmentSurgeons"
                                              ? recordTreatmentSurgeonOptions?.map(
                                                  (option) => {
                                                    return {
                                                      value: option,
                                                      name: option,
                                                    };
                                                  },
                                                )
                                              : clinlogFilterColumns.find(
                                                  (column) =>
                                                    column.key === subField.key,
                                                )?.options || [];
                                        const subOptions = subcolOpt.filter(
                                          (opt) =>
                                            subField.values?.includes(
                                              opt.value,
                                            ),
                                        );
                                        return subOptions?.map((subOption) => {
                                          const dataArr = rowData?.filter(
                                            (data) => {
                                              return (
                                                data.columnHeader ===
                                                  field.key &&
                                                data.columnValue ===
                                                  (option?.name || option) &&
                                                data.subColumnHeader ===
                                                  subField.key &&
                                                data.subColumnValue ===
                                                  (subOption?.name ||
                                                    subOption) &&
                                                data.rowValues.includes(
                                                  data.rowValue,
                                                ) &&
                                                data.rowHeader === row.key
                                              );
                                            },
                                          );

                                          const sampleSize =
                                            dataArr?.reduce(
                                              (acc, curr) =>
                                                acc + (curr.count || 0),
                                              0,
                                            ) || 0;

                                          return (
                                            <Th
                                              borderRight={"1px solid #D9D9D9"}
                                              key={
                                                (subOption?.value ||
                                                  subOption) + "h3"
                                              }
                                            >
                                              {sampleSize ? sampleSize : 0}
                                            </Th>
                                          );
                                        });
                                      }),
                                    );
                                  });
                                });
                              })}

                            {selectedSubColumns
                              .filter((ss) => ss.fields.length > 0)
                              ?.map((subCol) => {
                                return subCol?.fields?.map((subField) => {
                                  const subcolOpt =
                                    subField.key === "ageAtTimeOfSurgery"
                                      ? ageGroupOptions
                                      : subField.key ===
                                          "recordTreatmentSurgeons"
                                        ? recordTreatmentSurgeonOptions?.map(
                                            (option) => {
                                              return {
                                                value: option,
                                                name: option,
                                              };
                                            },
                                          )
                                        : clinlogFilterColumns.find(
                                            (column) =>
                                              column.key === subField.key,
                                          )?.options || [];
                                  const subOptions = subcolOpt.filter((opt) =>
                                    subField.values?.includes(opt.value),
                                  );

                                  return subOptions?.map((option) => {
                                    const count = tableData
                                      .filter(
                                        (data) =>
                                          data.colValues.includes(
                                            data.columnValue,
                                          ) &&
                                          data.subColValues.includes(
                                            data.subColumnValue,
                                          ) &&
                                          data.rowValues.includes(
                                            data.rowValue,
                                          ) &&
                                          data.rowHeader === row.key &&
                                          data.subColumnValue === option.name,
                                      )
                                      .reduce((acc, row) => acc + row.count, 0);

                                    return (
                                      <Th
                                        borderRight={"1px solid #D9D9D9"}
                                        key={
                                          option?.value + "h3" + subField.key
                                        }
                                        fontSize={"13px"}
                                      >
                                        {count || 0}
                                      </Th>
                                    );
                                  });
                                });
                              })}

                            <Th fontSize={"13px"}>
                              {" "}
                              {tableData
                                .filter(
                                  (data) =>
                                    data.colValues.includes(data.columnValue) &&
                                    data.subColValues.includes(
                                      data.subColumnValue,
                                    ) &&
                                    data.rowValues.includes(data.rowValue) &&
                                    data.rowHeader === row.key,
                                )
                                .reduce((acc, row) => acc + row.count, 0)}
                            </Th>
                          </Tr>
                          {rowOptions?.map((rowOpt, i) => {
                            return (
                              <Tr
                                borderBottom={"1px solid #D9D9D9"}
                                key={(rowOpt?.value || rowOpt) + "row" + i}
                                cursor="pointer"
                                _hover={{ bg: "gray.100" }}
                                w="100%"
                                bg="white"
                              >
                                <Td
                                  borderRight={"1px solid #D9D9D9"}
                                  fontSize={"14px"}
                                  fontWeight={"500"}
                                >
                                  {rowOpt?.name || rowOpt}
                                </Td>

                                {selectedColumns
                                  .filter((col) => col.fields.length > 0)
                                  ?.map((col) => {
                                    return col.fields.map((field) => {
                                      const colOpt =
                                        field.key === "ageAtTimeOfSurgery"
                                          ? ageGroupOptions
                                          : field.key ===
                                              "recordTreatmentSurgeons"
                                            ? recordTreatmentSurgeonOptions?.map(
                                                (option) => {
                                                  return {
                                                    value: option,
                                                    name: option,
                                                  };
                                                },
                                              )
                                            : clinlogFilterColumns.find(
                                                (column) =>
                                                  column.key === field.key,
                                              )?.options || [];
                                      const options = colOpt.filter((opt) =>
                                        field.values?.includes(opt.value),
                                      );
                                      return options?.map((option) => {
                                        return selectedSubColumns?.map(
                                          (subCol) =>
                                            subCol?.fields?.map((subField) => {
                                              const subcolOpt =
                                                subField.key ===
                                                "ageAtTimeOfSurgery"
                                                  ? ageGroupOptions
                                                  : subField.key ===
                                                      "recordTreatmentSurgeons"
                                                    ? recordTreatmentSurgeonOptions?.map(
                                                        (option) => {
                                                          return {
                                                            value: option,
                                                            name: option,
                                                          };
                                                        },
                                                      )
                                                    : clinlogFilterColumns.find(
                                                        (column) =>
                                                          column.key ===
                                                          subField.key,
                                                      )?.options || [];
                                              const subOptions =
                                                subcolOpt.filter((opt) =>
                                                  subField.values?.includes(
                                                    opt.value,
                                                  ),
                                                );

                                              return subOptions?.map(
                                                (subOption) => {
                                                  const cellValue =
                                                    rowData?.find((data) => {
                                                      return (
                                                        data.columnHeader ===
                                                          field.key &&
                                                        data.columnValue ===
                                                          (option?.name ||
                                                            option) &&
                                                        data.subColumnHeader ===
                                                          subField.key &&
                                                        data.subColumnValue ===
                                                          (subOption?.name ||
                                                            subOption) &&
                                                        data.rowValue ===
                                                          (rowOpt?.name ||
                                                            rowOpt)
                                                      );
                                                    });
                                                  const data = rowData?.filter(
                                                    (data) => {
                                                      return (
                                                        data.columnHeader ===
                                                          field.key &&
                                                        data.columnValue ===
                                                          (option?.name ||
                                                            option) &&
                                                        data.subColumnHeader ===
                                                          subField.key &&
                                                        data.subColumnValue ===
                                                          (subOption?.name ||
                                                            subOption) &&
                                                        data.rowValues.includes(
                                                          data.rowValue,
                                                        )
                                                      );
                                                    },
                                                  );

                                                  const sampleSize =
                                                    data?.reduce(
                                                      (acc, curr) =>
                                                        acc + (curr.count || 0),
                                                      0,
                                                    ) || 0;

                                                  const count =
                                                    cellValue?.count || 0;

                                                  const percentage =
                                                    (count / sampleSize) * 100;
                                                  const percentageText =
                                                    percentage
                                                      ? percentage.toFixed(2) +
                                                        "%"
                                                      : "0%";

                                                  return (
                                                    <Td
                                                      borderRight={
                                                        "1px solid #D9D9D9"
                                                      }
                                                      key={
                                                        (subOption?.value ||
                                                          subOption) + "h3"
                                                      }
                                                      fontSize={"13px"}
                                                    >
                                                      {count} ({percentageText})
                                                    </Td>
                                                  );
                                                },
                                              );
                                            }),
                                        );
                                      });
                                    });
                                  })}

                                {selectedSubColumns?.map((subCol, index) =>
                                  subCol?.fields?.map((subField, i) => {
                                    const colOpt =
                                      subField.key === "ageAtTimeOfSurgery"
                                        ? ageGroupOptions
                                        : subField.key ===
                                            "recordTreatmentSurgeons"
                                          ? recordTreatmentSurgeonOptions?.map(
                                              (option) => {
                                                return {
                                                  value: option,
                                                  name: option,
                                                };
                                              },
                                            )
                                          : clinlogFilterColumns.find(
                                              (column) =>
                                                column.key === subField.key,
                                            )?.options || [];
                                    const options = colOpt.filter((opt) =>
                                      subField.values?.includes(opt.value),
                                    );
                                    return options?.map((option, j) => {
                                      const count = tableData
                                        .filter(
                                          (data) =>
                                            data.colValues.includes(
                                              data.columnValue,
                                            ) &&
                                            data.subColValues.includes(
                                              data.subColumnValue,
                                            ) &&
                                            data.rowValues.includes(
                                              data.rowValue,
                                            ) &&
                                            data.rowHeader === row.key &&
                                            data.subColumnValue ===
                                              option.name &&
                                            data.rowValue === rowOpt.name,
                                        )
                                        .reduce(
                                          (acc, row) => acc + row.count,
                                          0,
                                        );

                                      const sampleSize = tableData
                                        .filter(
                                          (data) =>
                                            data.colValues.includes(
                                              data.columnValue,
                                            ) &&
                                            data.subColValues.includes(
                                              data.subColumnValue,
                                            ) &&
                                            data.rowValues.includes(
                                              data.rowValue,
                                            ) &&
                                            data.rowHeader === row.key &&
                                            data.subColumnValue === option.name,
                                        )
                                        .reduce(
                                          (acc, row) => acc + row.count,
                                          0,
                                        );
                                      const percentage =
                                        (count / sampleSize) * 100;
                                      const percentageText = percentage
                                        ? percentage.toFixed(2) + "%"
                                        : "0%";
                                      return (
                                        <Td
                                          borderRight={"1px solid #D9D9D9"}
                                          key={"subcol" + index + i + j}
                                          fontSize={"13px"}
                                        >
                                          {count ? count : 0}({percentageText})
                                        </Td>
                                      );
                                    });
                                  }),
                                )}
                                <Td
                                  fontSize={"13px"}
                                  borderRight={"1px solid #D9D9D9"}
                                >
                                  {tableData
                                    .filter(
                                      (row) =>
                                        row.subColValues.includes(
                                          row.subColumnValue,
                                        ) &&
                                        row.colValues.includes(
                                          row.columnValue,
                                        ) &&
                                        row.rowValues.includes(row.rowValue) &&
                                        row.rowValue === rowOpt.name,
                                    )
                                    .reduce((acc, row) => acc + row.count, 0)}
                                </Td>
                              </Tr>
                            );
                          })}
                        </>
                      );
                    }
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      )}
      <Flex w="100%" align={"center"} justify={"flex-end"}>
        {" "}
        <Button
          size="sm"
          leftIcon={<MdRefresh />}
          bg="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
          color={"white"}
          onClick={() => {
            setSelectedColumns([{ group: "", fields: [], isChosen: false }]);
            setSelectedSubColumns([{ group: "", fields: [], isChosen: false }]);
            setSelectedRows([{ group: "", fields: [], isChosen: false }]);
            setTableData([]);
          }}
        >
          Reset
        </Button>
      </Flex>
    </Flex>
  );
}
