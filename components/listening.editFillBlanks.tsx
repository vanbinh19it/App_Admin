import React, { useState } from "react";
import styled from "styled-components";

interface EditFillBlanksModalProps {
  onClose: () => void;
  onUpdate: (fillBlankData: FillBlankData) => void;
  fillBlank: FillBlankData;
}

interface FillBlankData {
  sentence: string;
  missingWord: string;
  audioText: string;
}

const EditFillBlanksModal: React.FC<EditFillBlanksModalProps> = ({
  onClose,
  onUpdate,
  fillBlank,
}) => {
  const [fillBlankData, setFillBlankData] = useState<FillBlankData>({
    sentence: fillBlank.sentence,
    missingWord: fillBlank.missingWord,
    audioText: fillBlank.audioText,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(fillBlankData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Edit Fill-in-Blank Exercise</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Sentence with blank (___):</Label>
            <Input
              value={fillBlankData.sentence}
              onChange={(e) =>
                setFillBlankData({ ...fillBlankData, sentence: e.target.value })
              }
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
              required
            />
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit">Update Exercise</SubmitButton>
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

export default EditFillBlanksModal;
