import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";

export default function MaintenancePage() {
  return (
    <>
      <Head>
        <title>Maintenance - SmileConnect</title>
      </Head>
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.50"
        px={4}
      >
        <VStack spacing={6} textAlign="center" maxW="600px">
          <Box>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              color="gray.800"
              fontWeight="bold"
            >
              We&apos;ll be back soon!
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={2}>
              SmileConnect is currently down for maintenance.
            </Text>
            <Text fontSize="md" color="gray.500">
              We&apos;re performing some updates to improve your experience.
              Please check back shortly.
            </Text>
          </Box>
          <Box
            mt={8}
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            w="100%"
          >
            <Text fontSize="sm" color="gray.600">
              If you have any urgent concerns, please contact your practice
              directly.
            </Text>
          </Box>
        </VStack>
      </Flex>
    </>
  );
}

