import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Input,
  CheckboxGroup,
  Checkbox,
  Stack,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import AddEventModal from "../components/AddEventModal";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
    fetchCategories();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (selectedValues) => {
    setSelectedCategoryIds(selectedValues.map((val) => val.toString()));
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const filteredEvents = events.filter((event) => {
    // Filter by search term
    const matchesSearchTerm =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by selected categories
    const matchesCategory =
      selectedCategoryIds.length === 0 ||
      event.categoryIds.some((catId) =>
        selectedCategoryIds.includes(catId.toString())
      );

    return matchesSearchTerm && matchesCategory;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!events.length) {
    return <div>No events available</div>;
  }

  return (
    <Box
      padding={{ base: "20px", md: "30px" }}
      bgGradient="linear(to-r, gray.300, yellow.400, pink.200)"
      minHeight="100vh"
      width="100%"
    >
      <Flex direction="column" alignItems="center">
        <Heading as="h1" marginBottom="20px" textAlign="center">
          List of Events
        </Heading>
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
          marginBottom="10px"
          width={{ base: "100%", md: "600px" }}
          size="md"
          borderRadius="md"
          marginRight={{ base: "0", md: "10px" }}
          bg="whiteAlpha.600"
        />

        <CheckboxGroup onChange={handleCategoryChange}>
          <Stack direction="row" justify="center">
            {categories.map((category) => (
              <Checkbox key={category.id} value={category.id.toString()}>
                {category.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>

        <Button
          onClick={onOpen}
          colorScheme="teal"
          marginBottom="20px"
          marginTop="15px"
        >
          Add Event
        </Button>
      </Flex>

      <Flex justifyContent="center">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="30px">
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="8px"
              overflow="hidden"
              padding="10px"
              cursor="pointer"
              textAlign="center"
              bg="whiteAlpha.500"
            >
              <Link to={`/event/${event.id}`}>
                <Image
                  src={event.image}
                  alt={event.title}
                  w="100%"
                  h="350px"
                  objectFit="cover"
                  borderRadius="8px"
                />
                <Heading size="md" marginTop="10px">
                  {event.title}
                </Heading>
                <Text mb="5px">{event.description}</Text>
                <Text mb="5px">
                  <strong>Start:</strong>{" "}
                  {new Date(event.startTime).toLocaleString()}
                </Text>
                <Text mb="5px">
                  <strong>End:</strong>{" "}
                  {new Date(event.endTime).toLocaleString()}
                </Text>
                <Text mb="5px">
                  <strong>Categories:</strong>{" "}
                  {event.categoryIds
                    .map((catId) => {
                      const category = categories.find(
                        (cat) => cat.id.toString() === catId.toString()
                      );
                      return category ? category.name : "Unknown";
                    })
                    .join(", ")}
                </Text>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
      <AddEventModal
        isOpen={isOpen}
        onClose={onClose}
        onAddEvent={handleAddEvent}
      />
    </Box>
  );
};

export default EventsPage;
