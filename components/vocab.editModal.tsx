// EditVocabularyModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface EditVocabularyModalProps {
  onClose: () => void;
  onUpdate: (id: string, updatedWord: FormData) => void;
  item: any;
}

const EditVocabularyModal: React.FC<EditVocabularyModalProps> = ({
  onClose,
  onUpdate,
  item,
}) => {
  const [editedWord, setEditedWord] = useState({
    word: item.word,
    image: null as File | null,
    pronunciation: item.pronunciation,
    meaning: item.meaning,
    example: item.example,
  });

  useEffect(() => {
    setEditedWord({
      word: item.word,
      image: null,
      pronunciation: item.pronunciation,
      meaning: item.meaning,
      example: item.example,
    });
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedWord({ ...editedWord, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditedWord({ ...editedWord, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("word", editedWord.word);
    formData.append("pronunciation", editedWord.pronunciation);
    formData.append("meaning", editedWord.meaning);
    formData.append("example", editedWord.example);
    if (editedWord.image) {
      formData.append("image", editedWord.image);
    }
    onUpdate(item._id, formData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Edit Vocabulary</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="word"
            placeholder="Word"
            value={editedWord.word}
            onChange={handleInputChange}
            required
          />
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Input
            type="text"
            name="pronunciation"
            placeholder="Pronunciation"
            value={editedWord.pronunciation}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="meaning"
            placeholder="Meaning"
            value={editedWord.meaning}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="example"
            placeholder="Example"
            value={editedWord.example}
            onChange={handleInputChange}
            required
          />
          <Button type="submit">Update Word</Button>
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
  position: relative;
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  color: #ffffff;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #ffffff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: #34495e;
    color: #e74c3c;
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #34495e;
  border-radius: 5px;
  background-color: #34495e;
  color: #ffffff;

  &::placeholder {
    color: #bdc3c7;
  }

  &:focus {
    outline: none;
    border-color: #3498db;
  }
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
    transform: scale(1.02);
  }
`;

export default EditVocabularyModal;
