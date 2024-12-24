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
      <Container>
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
              <ContentSection>
                <Word>{item.word}</Word>
                <Pronunciation>{item.pronunciation}</Pronunciation>
                <Meaning>{item.meaning}</Meaning>
                <Example>{item.example}</Example>
              </ContentSection>
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
      </Container>
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
        <h2>Edit Category</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <ButtonGroup>
            <UpdateButton type="submit">Update</UpdateButton>
            <CancelEditButton type="button" onClick={onClose}>
              Cancel
            </CancelEditButton>
          </ButtonGroup>
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

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  gap: 8px;
  align-self: flex-start;
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
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #2c2c2c;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: start;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const Word = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #ffffff;
`;

const Pronunciation = styled.p`
  margin: 2px 0;
  font-style: italic;
  color: #cccccc;
`;

const Meaning = styled.p`
  margin: 2px 0;
  font-size: 16px;
  color: #ffffff;
`;

const Example = styled.p`
  margin: 2px 0;
  font-size: 18px;
  color: #bbbbbb;
`;

const Container = styled.div`
  margin-top: 60px;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const UpdateButton = styled(Button)`
  margin: 0;
`;

const CancelEditButton = styled(Button)`
  margin: 0;
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

export default VocabCategory;
