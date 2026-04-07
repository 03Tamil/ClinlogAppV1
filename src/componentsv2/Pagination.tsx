import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

type PaginationProps = {
  scrollToTopRef?: React.RefObject<HTMLDivElement>;
  numPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  paginationType?: "numbers" | "arrows" | "buttons";
};

export default function Pagination({
  scrollToTopRef,
  numPages,
  currentPage,
  setCurrentPage,
  paginationType = "numbers",
}: PaginationProps) {
  const pageNumbers = [...Array(numPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage !== numPages && numPages !== 0) {
      setCurrentPage(currentPage + 1);
    }
    if (scrollToTopRef) {
      scrollToTopRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
    if (scrollToTopRef) {
      scrollToTopRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const toPage = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    if (scrollToTopRef) {
      // wait a bit for the page to change
      scrollToTopRef.current?.scrollTo({ top: 0 });
    }
  };

  return (
    <>
      {paginationType === "numbers" ? (
        <Flex
          pt="10px"
          gap="10px"
          position="sticky"
          alignItems={"center"}
          justifyContent={"center"}
        >
          {pageNumbers.map((pgNumber) => (
            <Button
              onClick={() => toPage(pgNumber)}
              variant="ghost"
              key={pgNumber}
              bgColor={currentPage == pgNumber ? "blue.300" : "white"}
              // bgColor={currentPage == pgNumber ? "medBlueLogo" : "darkBlueLogo"}
              // color="white"
            >
              {pgNumber}
            </Button>
          ))}
        </Flex>
      ) : (
        <Flex gap="10px" align="center">
          <Button onClick={prevPage} size={{ base: "xs", lg: "sm" }}>
            {"<"}
          </Button>
          <Button onClick={nextPage} size={{ base: "xs", lg: "sm" }}>
            {">"}
          </Button>
          <Text whiteSpace={"nowrap"}>
            {currentPage} of {numPages === 0 ? 1 : numPages}
          </Text>
        </Flex>
      )}
    </>
  );
}
