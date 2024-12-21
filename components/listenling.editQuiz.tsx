import React, { useState } from "react";
import styled from "styled-components";

interface EditQuizModalProps {
  onClose: () => void;
  onUpdate: (quizData: QuizData) => void;
  quiz: QuizData;
}

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
  onClose,
  onUpdate,
  quiz,
}) => {
  const [quizData, setQuizData] = useState<QuizData>({
    question: quiz.question,
    options: [...quiz.options],
    correctAnswer: quiz.correctAnswer,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(quizData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Edit Quiz</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Question:</Label>
            <Input
              value={quizData.question}
              onChange={(e) =>
                setQuizData({ ...quizData, question: e.target.value })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Options:</Label>
            {quizData.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...quizData.options];
                  newOptions[index] = e.target.value;
                  setQuizData({ ...quizData, options: newOptions });
                }}
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
          </FormGroup>

          <FormGroup>
            <Label>Correct Answer:</Label>
            <Select
              value={quizData.correctAnswer}
              onChange={(e) =>
                setQuizData({ ...quizData, correctAnswer: e.target.value })
              }
              required
            >
              <option value="">Select correct answer</option>
              {quizData.options.map(
                (option, index) =>
                  option && (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  )
              )}
            </Select>
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

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  background-color: #404040;
  color: white;
  border: 1px solid #666;
`;

const Select = styled.select`
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

export default EditQuizModal;
