import React, { useState } from "react";
import styled from "styled-components";

interface AddFillBlanksModalProps {
  onClose: () => void;
  onAdd: (fillBlankData: FillBlankData) => void;
}

interface FillBlankData {
  sentence: string;
  missingWord: string;
  audioText: string;
}

const AddFillBlanksModal: React.FC<AddFillBlanksModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [fillBlankData, setFillBlankData] = useState<FillBlankData>({
    sentence: "",
    missingWord: "",
    audioText: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(fillBlankData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add Fill-in-Blank Exercise</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Sentence with blank (___):</Label>
            <Input
              value={fillBlankData.sentence}
              onChange={(e) =>
                setFillBlankData({ ...fillBlankData, sentence: e.target.value })
              }
              placeholder="Example: Hi! How ___ you today?"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Missing Word:</Label>
            <Input
              value={fillBlankData.missingWord}
              onChange={(e) =>
                setFillBlankData({
                  ...fillBlankData,
                  missingWord: e.target.value,
                })
              }
              placeholder="Example: are"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Complete Audio Text:</Label>
            <Input
              value={fillBlankData.audioText}
              onChange={(e) =>
                setFillBlankData({
                  ...fillBlankData,
                  audioText: e.target.value,
                })
              }
              placeholder="Example: Hi! How are you today?"
              required
            />
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit">Add Exercise</SubmitButton>
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

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  background-color: #404040;
  color: white;
  border: 1px solid #666;
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

export default AddFillBlanksModal;
