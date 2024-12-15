import React, { useState } from "react";
import styled from "styled-components";

interface AddVocabularyModalProps {
  onClose: () => void;
  onAdd: (newWord: FormData) => void;
}

const AddVocabularyModal: React.FC<AddVocabularyModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [newWord, setNewWord] = useState({
    word: "",
    image: null as File | null,
    pronunciation: "",
    meaning: "",
    example: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWord({ ...newWord, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewWord({ ...newWord, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("word", newWord.word);
    if (newWord.image) {
      formData.append("image", newWord.image);
    }
    formData.append("pronunciation", newWord.pronunciation);
    formData.append("meaning", newWord.meaning);
    formData.append("example", newWord.example);
    onAdd(formData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Add New Vocabulary</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="word"
            placeholder="Word"
            value={newWord.word}
            onChange={handleInputChange}
            required
          />
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <Input
            type="text"
            name="pronunciation"
            placeholder="Pronunciation"
            value={newWord.pronunciation}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="meaning"
            placeholder="Meaning"
            value={newWord.meaning}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="example"
            placeholder="Example"
            value={newWord.example}
            onChange={handleInputChange}
            required
          />
          <Button type="submit">Add Word</Button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #2980b9;
  }
`;

export default AddVocabularyModal;
