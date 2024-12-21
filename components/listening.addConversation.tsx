import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { IPv4Address } from "../configs/config";

interface AddConversationModalProps {
  onClose: () => void;
  onAdd: () => void;
  topicName: string;
  levelName: string;
}

const AddConversationModal: React.FC<AddConversationModalProps> = ({
  onClose,
  onAdd,
  topicName,
  levelName,
}) => {
  const [formData, setFormData] = useState({
    speaker: "",
    text: "",
    translation: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://${IPv4Address}:3005/api/listening/topics/${topicName}/practice/${levelName}/conversations`,
        formData
      );
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error adding conversation:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add New Conversation</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Speaker:</Label>
            <Select
              value={formData.speaker}
              onChange={(e) =>
                setFormData({ ...formData, speaker: e.target.value })
              }
              required
            >
              <option value="">Select Speaker</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Text:</Label>
            <TextArea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              required
              placeholder="Enter conversation text in English"
            />
          </FormGroup>

          <FormGroup>
            <Label>Translation:</Label>
            <TextArea
              value={formData.translation}
              onChange={(e) =>
                setFormData({ ...formData, translation: e.target.value })
              }
              required
              placeholder="Enter translation in Vietnamese"
            />
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit">Add</SubmitButton>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #e0e0e0;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  background-color: #404040;
  color: white;
  border: 1px solid #666;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  background-color: #404040;
  color: white;
  border: 1px solid #666;
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  background-color: #3498db;
  color: white;
  &:hover {
    background-color: #2980b9;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
  &:hover {
    background-color: #c0392b;
  }
`;

export default AddConversationModal;
