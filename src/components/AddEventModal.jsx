import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Flex,
} from "@chakra-ui/react";

const AddEventModal = ({ isOpen, onClose, onAddEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);

  const DEFAULT_IMAGE_URL =
    "https://nirsa.net/wp-content/uploads/homepage-class03-750-500x433.png";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      description,
      image: image || DEFAULT_IMAGE_URL,
      startTime,
      endTime,
      location,
      categoryIds: categories,
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const result = await response.json();
      onAddEvent(result);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="600px" w="90%">
        <ModalHeader textAlign="center">Add New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl mb="4" isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl mb="4" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Image URL</FormLabel>
              <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </FormControl>

            <FormControl mb="4" isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>

            <FormControl mb="4" isRequired>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>

            <FormControl mb="4" isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>

            <FormControl mb="4" isRequired>
              <FormLabel>Categories</FormLabel>
              <Select
                multiple
                value={categories}
                onChange={(e) =>
                  setCategories(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
              >
                <option value="1">Sports</option>
                <option value="2">Games</option>
                <option value="3">Relaxation</option>
              </Select>
            </FormControl>

            <Flex justifyContent="center">
              <Button type="submit" colorScheme="teal">
                Add Event
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEventModal;
