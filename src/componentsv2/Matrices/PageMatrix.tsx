import {
  AspectRatio,
  Box,
  Flex,
  GridItem,
  Heading,
  Text,
  Image,
  Grid,
} from "@chakra-ui/react";
import DOMPurify from "dompurify";

type pageMatrixProps = {
  blocks?: any[];
  entry?: any;
};

export function PageMatrix({ blocks, entry }: pageMatrixProps) {
  return (
    <>
      <Box as={"article"}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            lg: "repeat(12, 1fr)",
          }}
          gap={{ base: "1rem", lg: "1rem" }}
        >
          {blocks.map((block, i) => (
            <GridItem key={i} colSpan={{ base: 1, lg: 12 }}>
              {(() => {
                switch (block.typeHandle) {
                  case "smallHeading": {
                    return (
                      <>
                        <Heading
                          color={"primary"}
                          fontSize={{ base: "12px", md: "14px" }}
                          textTransform={"uppercase"}
                          fontWeight={"500"}
                          mb={"0rem"}
                        >
                          {block.heading}
                        </Heading>
                      </>
                    );
                  }
                  case "largeHeading": {
                    return (
                      <Heading fontSize={{ base: "14px", md: "16px" }}>
                        {block.heading}
                      </Heading>
                    );
                  }
                  case "richTextParagraph": {
                    return (
                      <Box
                        fontSize={{ base: "13px", md: "14px" }}
                        className={"rich-text"}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(block.paragraph),
                        }}
                      />
                    );
                  }
                  case "paragraph": {
                    return (
                      <Text fontSize={{ base: "13px", md: "14px" }}>
                        {block.paragraph}
                      </Text>
                    );
                  }
                  case "largeImage": {
                    return (
                      <Flex flexDirection={"column"} gap={"1rem"}>
                        <Image
                          src={block?.image[0]?.url}
                          width={"100%"}
                          rounded={"0.25rem"}
                        />
                        <Text color={"grey"}>{block.caption}</Text>
                      </Flex>
                    );
                  }
                  case "paragraphPrimaryBg": {
                    return (
                      <Box bgColor={"primary"}>
                        <Heading>{block.heading}</Heading>
                        <Text fontSize={{ base: "13px", md: "14px" }}>
                          {block.paragraph}
                        </Text>
                      </Box>
                    );
                  }
                  case "video": {
                    return (
                      <Box>
                        <AspectRatio ratio={16 / 9}>
                          <iframe src={block.embedUrl} allowFullScreen />
                        </AspectRatio>
                      </Box>
                    );
                  }
                }
              })()}
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
}
