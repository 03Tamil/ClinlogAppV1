import {
  Button,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { set } from "date-fns";
import { de, se } from "date-fns/locale";
import { clinlogFilterColumns } from "helpersv2/utils";
import React, { useEffect } from "react";
import { IoMdRefresh } from "react-icons/io";
import { MdAdd, MdDelete } from "react-icons/md";
import ReactSelect, { StylesConfig } from "react-select";
export type filterProps = {
  globalFilter: any[];
  setGlobalFilter: (value: any[]) => void;
  surgeonOptions: any[];
  selectCustomStyle: StylesConfig;
  locationOptions?: any[];
  isAdmin?: boolean;
  implantLineOptions?: any[];
};
export default function FilterComponent({
  globalFilter,
  setGlobalFilter,
  surgeonOptions,
  selectCustomStyle,
  locationOptions = [],
  isAdmin = false,
  implantLineOptions = [],
}: filterProps) {
  const [filterArray, setFilterArray] = React.useState<any[]>([]);
  const [standardReport, setStandardReport] = React.useState(false);

  useEffect(() => {
    if (
      (filterArray.length === 0 || filterArray[0].group === "") &&
      globalFilter.length === 0
    ) {
      setGlobalFilter([]);
      setStandardReport(false);
    }
  }, [filterArray]);

  useEffect(() => {
    if (
      globalFilter.length > 0 &&
      (filterArray.length === 0 || standardReport)
    ) {
      if (filterArray.length === 0) {
        setStandardReport(true);
      }
      const updatedFilterArray = globalFilter.map((filter) => {
        const column = clinlogFilterColumns.find(
          (col) => col.key === filter.id,
        );

        return {
          group: column?.group || "",
          key: filter.id,
          value:
            column?.type === "number"
              ? filter?.value?.value?.[0]
              : filter.value.value || [],
          toValue: filter.value.toValue || [],
          condition: filter.value.condition || "",
          operation: filter.value.operation || "",
          type: column?.type || "",
        };
      });
      setFilterArray(updatedFilterArray);

      //  setStandardReport(true);
    } else if (globalFilter.length === 0 && standardReport) {
      setFilterArray([]);
      setStandardReport(false);
    }
  }, [globalFilter, standardReport]);

  return (
    <Flex
      flexDirection={"column"}
      // gap="1rem"
      // w="100%"
      // border={"1px dashed #D9D9D9"}
      // p="4"
      w="100%"
      gap="1rem"
      bg="white"
      p="4"
      borderRadius="6px"
      border="1px solid #F7F0F0"
    >
      <Text fontSize="13px" fontWeight={"600"} whiteSpace="nowrap">
        Filter By:
      </Text>
      {filterArray.map((item, index) => {
        return (
          <Flex gap="0.5rem" key={item.key + "_" + index} w="100%">
            <SimpleGrid columns={4} spacing={2}>
              <Select
                value={item.group}
                fontSize={"13px"}
                onChange={(e) => {
                  const group = e.target.value;
                  setFilterArray(
                    filterArray.map((item, i) => {
                      if (i === index) {
                        return {
                          ...item,
                          group,
                          key: "",
                          value: [],
                          condition: "",
                        };
                      }
                      return item;
                    }),
                  );
                }}
              >
                <option value="">-- Select Group --</option>
                <option value="generalDetails">General Details</option>
                <option value="patientCharacteristics">
                  Patient Characteristics
                </option>{" "}
                <option value="treatmentCharacteristics">
                  Treatment Characteristics
                </option>
                <option value="followUp">Follow Up</option>
                <option value="patientSurvey">Patient Survey</option>
                <option value="siteSpecificCharacteristics">
                  Site Specific Characteristics
                </option>
              </Select>
              {item.group && (
                <>
                  <Select
                    fontSize={"13px"}
                    onChange={(e) => {
                      const key = e.target.value;

                      setFilterArray(
                        filterArray.map((item, i) => {
                          if (i === index) {
                            return {
                              ...item,
                              key: key,
                              value: [],
                              condition: "",
                              type: clinlogFilterColumns.find(
                                (column) => column.key === key,
                              )?.type,
                            };
                          }
                          return item;
                        }),
                      );
                    }}
                    value={item.key}
                  >
                    <option value="">-- Select Field --</option>
                    {clinlogFilterColumns
                      .filter((column) => column.group === item.group)
                      .map((column) => (
                        <option key={column.key + index} value={column.key}>
                          {column.label}
                        </option>
                      ))}
                  </Select>
                  {item.key && item.type && (
                    <>
                      <Select
                        fontSize={"13px"}
                        value={item.condition}
                        onChange={(e) => {
                          const condition = e.target.value;
                          setFilterArray(
                            filterArray.map((item, i) => {
                              if (i === index) {
                                return {
                                  ...item,
                                  condition,
                                };
                              }
                              return item;
                            }),
                          );
                        }}
                      >
                        <option value="">-- Select Condition --</option>
                        {item.type === "select" && (
                          <>
                            <option value="isOneOf">is one of</option>
                            <option value="isNotOneOf">is not one of</option>
                            <option value="hasAValue">has a Value</option>
                            <option value="isEmpty">is Empty</option>
                          </>
                        )}
                        {item.type === "string" && (
                          <>
                            <option value="contains">contains</option>
                            <option value="notContains">not contains</option>
                            <option value="equals">equals</option>
                            <option value="notEquals">not Equals</option>
                            <option value="hasAValue">has a Value</option>
                            <option value="isEmpty">is Empty</option>
                          </>
                        )}
                        {item.type === "number" && (
                          <>
                            <option value="equals">equals</option>
                            <option value="notEquals">not Equals</option>
                            <option value="isLessThan">is Less Than</option>
                            <option value="isLessThanOrEquals">
                              is Less Than or Equals
                            </option>
                            <option value="isGreaterThan">
                              is Greater Than
                            </option>
                            <option value="isGreaterThanOrEquals">
                              is Greater Than or Equals
                            </option>
                            <option value="isBetween">is Between</option>
                            <option value="hasAValue">has a Value</option>
                            <option value="isEmpty">is Empty</option>
                          </>
                        )}

                        {item.type === "date" && (
                          <>
                            <option value="isBefore">is Before</option>

                            <option value="isAfter">is After</option>
                            <option value="isBetween">is Between</option>
                            <option value="hasAValue">has a Value</option>
                            <option value="isEmpty">is Empty</option>
                          </>
                        )}
                      </Select>
                    </>
                  )}
                  {item.condition &&
                    item.type === "select" &&
                    !["hasAValue", "isEmpty"].includes(item.condition) && (
                      <>
                        <ReactSelect
                          placeholder="-- Select value -- "
                          isMulti
                          value={item.value}
                          onChange={(value) => {
                            setFilterArray(
                              filterArray.map((item, i) => {
                                if (i === index) {
                                  return {
                                    ...item,
                                    value: value,
                                  };
                                }
                                return item;
                              }),
                            );
                          }}
                          options={
                            item?.key === "recordTreatmentSurgeons"
                              ? surgeonOptions?.map((option) => ({
                                  value: option,
                                  label: option,
                                }))
                              : item?.key === "recordClinic"
                                ? locationOptions
                                : item?.key === "implantLine"
                                  ? implantLineOptions?.map((option) => ({
                                      value: option,
                                      label: option,
                                    }))
                                  : clinlogFilterColumns
                                      .find((column) => column.key === item.key)
                                      ?.options?.map((option) => ({
                                        value: option.value || option,
                                        label: option.name || option,
                                      }))
                          }
                          styles={selectCustomStyle}
                        />
                      </>
                    )}
                  {item.condition &&
                    item.type === "number" &&
                    !["hasAValue", "isEmpty"].includes(item.condition) && (
                      <>
                        {item.condition === "isBetween" ? (
                          <Flex gap="0.2rem" align={"center"}>
                            <NumberInput
                              min={1}
                              value={item?.value}
                              onChange={(val) => {
                                if (
                                  val !== undefined &&
                                  val !== null &&
                                  val !== ""
                                ) {
                                  setTimeout(() => {
                                    setFilterArray(
                                      filterArray.map((item, i) => {
                                        if (i === index) {
                                          const value = [Number(val)];
                                          return {
                                            ...item,
                                            value,
                                          };
                                        }
                                        return item;
                                      }),
                                    );
                                  }, 1000);
                                }
                              }}
                            >
                              <NumberInputField fontSize={"13px"} />
                            </NumberInput>
                            <Text mx="1">and</Text>
                            <NumberInput
                              min={1}
                              value={item?.toValue}
                              onChange={(val) => {
                                if (
                                  val !== undefined &&
                                  val !== null &&
                                  val !== ""
                                ) {
                                  setTimeout(() => {
                                    setFilterArray(
                                      filterArray.map((item, i) => {
                                        if (i === index) {
                                          const toValue = [Number(val)];
                                          return {
                                            ...item,
                                            toValue,
                                          };
                                        }
                                        return item;
                                      }),
                                    );
                                  }, 1000);
                                }
                              }}
                            >
                              <NumberInputField fontSize={"13px"} />
                            </NumberInput>
                          </Flex>
                        ) : (
                          <NumberInput
                            min={1}
                            value={item?.value}
                            onChange={(val) => {
                              if (
                                val !== undefined &&
                                val !== null &&
                                val !== ""
                              ) {
                                const value = [Number(val)];
                                setTimeout(() => {
                                  setFilterArray(
                                    filterArray.map((item, i) => {
                                      if (i === index) {
                                        return {
                                          ...item,
                                          value,
                                        };
                                      }
                                      return item;
                                    }),
                                  );
                                }, 1000);
                              }
                            }}
                          >
                            <NumberInputField fontSize={"13px"} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      </>
                    )}
                  {item.condition &&
                    item.type === "date" &&
                    !["hasAValue", "isEmpty"].includes(item.condition) && (
                      <>
                        {item.condition === "isBetween" ? (
                          <Flex gap="0.2rem" align={"center"} w="30%">
                            <Input
                              type="date"
                              fontSize={"13px"}
                              onChange={(e) => {
                                const value = [e.target.value];

                                setFilterArray(
                                  filterArray.map((item, i) => {
                                    if (i === index) {
                                      return {
                                        ...item,
                                        value,
                                      };
                                    }
                                    return item;
                                  }),
                                );
                              }}
                            />
                            <Text mx="1" fontSize={"13px"}>
                              and
                            </Text>
                            <Input
                              type="date"
                              fontSize={"13px"}
                              onChange={(e) => {
                                const toValue = [e.target.value];

                                setFilterArray(
                                  filterArray.map((item, i) => {
                                    if (i === index) {
                                      return {
                                        ...item,
                                        toValue,
                                      };
                                    }
                                    return item;
                                  }),
                                );
                              }}
                            />
                          </Flex>
                        ) : (
                          <Input
                            type="date"
                            fontSize={"13px"}
                            onChange={(e) => {
                              const value = [e.target.value];

                              setFilterArray(
                                filterArray.map((item, i) => {
                                  if (i === index) {
                                    return {
                                      ...item,
                                      value,
                                    };
                                  }
                                  return item;
                                }),
                              );
                            }}
                          />
                        )}
                      </>
                    )}
                  {(item.value?.length > 0 ||
                    ["hasAValue", "isEmpty"].includes(item.condition)) &&
                    item.operation && (
                      <Select
                        fontSize={"13px"}
                        value={item.operation || "AND"}
                        onChange={(e) => {
                          const operation = e.target.value;
                          setFilterArray(
                            filterArray.map((item, i) => {
                              if (i === index) {
                                return {
                                  ...item,
                                  operation,
                                };
                              }
                              return item;
                            }),
                          );
                        }}
                      >
                        <option value="">-- Select Operation --</option>
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </Select>
                    )}
                </>
              )}
            </SimpleGrid>
            <Button
              onClick={() => {
                setFilterArray(
                  filterArray.filter((item, i) => i !== index) || [],
                );
              }}
              rightIcon={<MdDelete color="red" fontSize={"26px"} />}
              bg="none"
              border="none"
              _hover={{
                bg: "none",
              }}
              _active={{
                bg: "none",
              }}
              disabled={standardReport}
            ></Button>
            <Button
              onClick={() => {
                setFilterArray(
                  filterArray.map((item, i) => {
                    if (i === index) {
                      return {
                        group: "",
                        key: "",
                        value: [],
                        condition: "",
                        operation: "",
                      };
                    }
                    return item;
                  }),
                );
              }}
              leftIcon={<IoMdRefresh fontSize={"26px"} />}
              bg="none"
              border="none"
              _hover={{
                bg: "none",
              }}
              _active={{
                bg: "none",
              }}
              disabled={standardReport}
            ></Button>
          </Flex>
        );
      })}

      <Flex gap="0.5rem">
        <Button
          py="4"
          fontWeight={"700"}
          leftIcon={<MdAdd fontSize={"22px"} />}
          fontSize="11px"
          borderRadius={"full"}
          bgColor="#452A7E"
          color="white"
          textTransform={"uppercase"}
          _hover={{
            bgColor: "#452A7E",
          }}
          disabled={filterArray?.[0]?.group === "" || standardReport}
          onClick={() =>
            setFilterArray([
              ...filterArray.map((item) => {
                return {
                  ...item,
                  operation: item.operation || "AND",
                };
              }),
              {
                group: "",
                key: "",
                value: "",
                condition: "",
                operation: "",
              },
            ])
          }
        >
          Add Filter
        </Button>
        {filterArray?.length > 0 && (
          <Button
            py="4"
            px="8"
            fontWeight={"700"}
            bgColor="#007AFF"
            fontSize={"10px"}
            borderRadius={"10px"}
            color="white"
            _hover={{
              bgColor: "#007AFF",
            }}
            disabled={
              (filterArray?.[0]?.value?.length === 0 &&
                filterArray?.[0]?.condition !== "hasAValue" &&
                filterArray?.[0]?.condition !== "isEmpty") ||
              standardReport
            }
            textTransform={"uppercase"}
            onClick={() =>
              setGlobalFilter(
                filterArray?.map((item) => {
                  return {
                    id: item?.key,
                    value: {
                      value: item?.value,
                      toValue: item?.toValue || [],
                      condition: item?.condition,
                      operation: item?.operation,
                    },
                  };
                }),
              )
            }
          >
            Apply
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
