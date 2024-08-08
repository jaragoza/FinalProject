import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  useToast,
  Stack,
  Center,
  Select,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchEventAndCategories = async () => {
      try {
        const eventResponse = await fetch(
          `http://localhost:3000/events/${eventId}`
        );
        if (!eventResponse.ok) {
          throw new Error("Event not found");
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
        setEditedEvent({
          ...eventData,
          categoryIds: eventData.categoryIds.map(String),
        });

        if (eventData.createdBy) {
          const userResponse = await fetch(
            `http://localhost:3000/users/${eventData.createdBy}`
          );
          if (!userResponse.ok) {
            throw new Error("User not found");
          }
          const userData = await userResponse.json();
          setCreator(userData);
        }

        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        if (!categoriesResponse.ok) {
          throw new Error("Categories not found");
        }
        const categoriesData = await categoriesResponse.json();

        const categoriesMap = {};
        categoriesData.forEach((cat) => {
          categoriesMap[String(cat.id)] = cat.name;
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndCategories();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setEditedEvent({ ...editedEvent, categoryIds: [value] });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedEvent,
          categoryIds: editedEvent.categoryIds.map(String),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
      toast({
        title: "Event updated",
        description: "The event has been successfully updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error.",
        description: "There was an error updating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedEvent({ ...event, categoryIds: event.categoryIds.map(String) });
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/"); // Redirect to the events list page
    } catch (error) {
      console.error(error);
      toast({
        title: "Error.",
        description: "There was an error deleting the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>No event data available</div>;
  }

  return (
    <Box
      backgroundColor="pink.100"
      minHeight="100vh"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Center>
        <Box
          maxWidth="800px"
          width="100%"
          margin="0 auto"
          padding={{ base: "10px", md: "20px" }}
          border="1px solid #ccc"
          bg="blackAlpha.200"
          borderRadius="8px"
          textAlign="center"
        >
          {isEditing ? (
            <Box>
              <Input
                name="title"
                placeholder="Edit title"
                value={editedEvent.title || ""}
                onChange={handleInputChange}
                mb="15px"
              />
              <Textarea
                name="description"
                placeholder="Edit description"
                value={editedEvent.description || ""}
                onChange={handleInputChange}
                mb="15px"
              />
              <Input
                name="startTime"
                type="datetime-local"
                value={editedEvent.startTime || ""}
                onChange={handleInputChange}
                mb="15px"
              />
              <Input
                name="endTime"
                type="datetime-local"
                value={editedEvent.endTime || ""}
                onChange={handleInputChange}
                mb="15px"
              />
              <Input
                name="location"
                placeholder="Edit location"
                value={editedEvent.location || ""}
                onChange={handleInputChange}
                mb="15px"
              />
              <Select
                name="categoryId"
                value={
                  editedEvent.categoryIds ? editedEvent.categoryIds[0] : ""
                }
                onChange={handleCategoryChange}
                placeholder="Select category"
                mb="15px"
              >
                {Object.keys(categories).map((catId) => (
                  <option key={catId} value={catId}>
                    {categories[catId]}
                  </option>
                ))}
              </Select>

              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                justifyContent="center"
              >
                <Button onClick={handleSaveClick} colorScheme="blue">
                  Save
                </Button>
                <Button onClick={handleCancelClick} colorScheme="gray">
                  Cancel
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Heading mb="8px">{event.title}</Heading>
              <Center>
                <Image
                  src={event.image}
                  alt={event.title}
                  width="700px"
                  height="400px"
                  objectFit="cover"
                  borderRadius="8px"
                  mb="10px"
                />
              </Center>
              <Text fontWeight="bold" mt="4px" mb="4px">
                {event.description}
              </Text>
              <Text mb="2px">
                <strong>Start Time:</strong>{" "}
                {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text mb="2px">
                <strong>End Time:</strong>{" "}
                {new Date(event.endTime).toLocaleString()}
              </Text>
              <Text mb="2px">
                <strong>Location:</strong> {event.location}
              </Text>
              <Text mb="2px">
                <strong>Categories:</strong>{" "}
                {event.categoryIds
                  .map((catId) => categories[String(catId)])
                  .join(", ")}
              </Text>
              {creator && (
                <Box>
                  <Heading size="md">Created by:</Heading>
                  <Center>
                    <Image
                      src={creator.image}
                      alt={creator.name}
                      width="100px"
                      height="100px"
                      borderRadius="50%"
                      mb="10px"
                    />
                  </Center>
                  <Text>{creator.name}</Text>
                </Box>
              )}
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                justifyContent="center"
                mt="20px"
              >
                <Button onClick={() => setIsEditing(true)} colorScheme="blue">
                  Edit
                </Button>
                <Button onClick={handleDeleteClick} colorScheme="red">
                  Delete
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Center>
    </Box>
  );
};

export default EventPage;
