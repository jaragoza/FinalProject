import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box bg="teal.400" px={5}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Text fontSize="xl" color="white">
            Winc Events
          </Text>
          <ChakraLink
            as={Link}
            to="/"
            rounded="md"
            _hover={{ textDecoration: "none", bg: "teal.600" }}
            color="white"
          >
            Events List
          </ChakraLink>
        </HStack>
      </Flex>
    </Box>
  );
};
