import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import AddVocabularyModal from "./vocab.addModal";
import EditVocabularyModal from "./vocab.editModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IPv4Address } from "../configs/config";

const VocabCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [vocabulary, setVocabulary] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const navigate = useNavigate();

  const fetchVocabulary = async () => {
    try {
      const response = await axios.get(
        `http://${IPv4Address}:3005/api/vocabulary/${category}`
      );
      setVocabulary(response.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setVocabulary([]);
        setLoading(false);
      } else {
        console.error("Error fetching vocabulary:", error);
        setError("Error fetching vocabulary");
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchVocabulary();
  }, [category]);

  const handleAddVocabulary = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `http://${IPv4Address}:3005/api/vocabulary/${category}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setVocabulary([...vocabulary, response.data]);
      await fetchVocabulary();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding new word:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleEdit = (item: any) => {
    setEditItem(item);
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      const response = await axios.put(
        `http://${IPv4Address}:3005/api/vocabulary/${category}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setVocabulary(
        vocabulary.map((item) => (item._id === id ? response.data : item))
      );
      setEditItem(null);
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await axios.delete(
          `http://${IPv4Address}:3005/api/vocabulary/${category}/${itemToDelete}`
        );
        setVocabulary(vocabulary.filter((item) => item._id !== itemToDelete));
      } catch (error) {
        console.error("Error deleting word:", error);
      }
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  const handleEditCategory = async (newName: string) => {
    try {
      await axios.put(
        `http://${IPv4Address}:3005/api/categories/${category}`,
        { newCategory: newName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Use navigate instead of window.location
      navigate(`/vocabulary/${newName}`);
      setShowEditCategoryModal(false);
    } catch (error: any) {
      console.error("Error updating category:", error);
      alert(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(
        `http://${IPv4Address}:3005/api/categories/${category}`
      );

      // Navigate to root and force reload
      window.location.href = "http://localhost:8080";

      setShowDeleteCategoryModal(false);
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <CategoryHeader>
        <h1>{category}</h1>
        <ButtonContainer>
          <IconButton onClick={() => setShowEditCategoryModal(true)}>
            <FaEdit />
          </IconButton>
          <IconButton onClick={() => setShowDeleteCategoryModal(true)}>
            <FaTrash />
          </IconButton>
        </ButtonContainer>
      </CategoryHeader>
      {/* <h1>{category}</h1> */}
      <Button onClick={() => setShowModal(true)}>+</Button>
      {showModal && (
        <AddVocabularyModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddVocabulary}
        />
      )}
      {editItem && (
        <EditVocabularyModal
          onClose={() => setEditItem(null)}
          onUpdate={handleUpdate}
          item={editItem}
        />
      )}
      <VocabularyList>
        {vocabulary.map((item, index) => (
          <VocabularyItem key={item._id || index}>
            <Image
              src={`http://${IPv4Address}:3005${item.image}`}
              alt={item.word}
            />
            <Word>{item.word}</Word>
            <Pronunciation>{item.pronunciation}</Pronunciation>
            <Meaning>{item.meaning}</Meaning>
            <Example>{item.example}</Example>
            <ButtonContainer>
              <IconButton onClick={() => handleEdit(item)}>
                <FaEdit />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(item._id)}>
                <FaTrash />
              </IconButton>
            </ButtonContainer>
          </VocabularyItem>
        ))}
      </VocabularyList>
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
      {showEditCategoryModal && (
        <EditCategoryModal
          currentName={category || ""}
          onClose={() => setShowEditCategoryModal(false)}
          onUpdate={handleEditCategory}
        />
      )}

      {showDeleteCategoryModal && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteCategory}
          onCancel={() => setShowDeleteCategoryModal(false)}
        />
      )}
    </div>
  );
};

interface EditCategoryModalProps {
  onClose: () => void;
  onUpdate: (newName: string) => void;
  currentName: string;
}
interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  onClose,
  onUpdate,
  currentName,
}) => {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(newName);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Edit Category</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Button type="submit">Update</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Delete Category</h2>
        <p>Are you sure you want to delete this category?</p>
        <p>This action cannot be undone.</p>
        <ButtonContainer>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Delete</ConfirmButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

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
  text-align: center;
`;

const ConfirmButton = styled.button`
  background-color: #e74c3c;
`;

const CancelButton = styled.button`
  background-color: #95a5a6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #3498db;
  margin-left: 10px;

  &:hover {
    color: #2980b9;
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
  }
`;

const VocabularyList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const VocabularyItem = styled.li`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Image = styled.img`
  max-width: 100px;
  height: auto;
  margin-right: 20px;
`;

const Word = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #333;
`;

const Pronunciation = styled.p`
  font-style: italic;
  color: #666;
`;

const Meaning = styled.p`
  font-size: 18px;
  color: #444;
`;

const Example = styled.p`
  font-size: 16px;
  color: #555;
`;

export default VocabCategory;
