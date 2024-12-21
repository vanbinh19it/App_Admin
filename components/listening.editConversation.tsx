import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface EditConversationModalProps {
  onClose: () => void;
  onUpdate: (data: any) => void;
  conversation: {
    speaker: string;
    text: string;
    translation: string;
  };
}

const EditConversationModal: React.FC<EditConversationModalProps> = ({
  onClose,
  onUpdate,
  conversation,
}) => {
  const [formData, setFormData] = useState({
    speaker: conversation.speaker,
    text: conversation.text,
    translation: conversation.translation,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Edit Conversation</h2>
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
            />
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit">Update</SubmitButton>
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

export default EditConversationModal;
