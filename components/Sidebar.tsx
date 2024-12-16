import React, { useEffect, useState } from "react";
import {
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CNavItem,
  CNavLink,
  CNavGroup,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { IPv4Address } from "../configs/config";

const AddCategoryModal: React.FC<{
  onClose: () => void;
  onAdd: (category: string) => void;
  isLoading?: boolean;
}> = ({ onClose, onAdd, isLoading }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    // Added async
    e.preventDefault();
    await onAdd(newCategory); // Added await
    setNewCategory("");
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add"}
          </button>
          <button type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const SideBar: React.FC = () => {
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://${IPv4Address}:3005/api/vocabulary/categories`
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleAddCategorySubmit = async (category: string) => {
    // Already async
    setAddCategoryLoading(true);
    setAddCategoryError(null);

    try {
      await axios.post(
        `http://${IPv4Address}:3005/api/categories`,
        { category },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const response = await axios.get(
        `http://${IPv4Address}:3005/api/vocabulary/categories`
      );
      setCategories(response.data);
      setShowAddCategoryModal(false);
    } catch (error: any) {
      setAddCategoryError(
        error.response?.data?.message || "Failed to add category"
      );
    } finally {
      setAddCategoryLoading(false);
    }
  };
  return (
    <StyledSidebar>
      <CSidebarNav>
        <StyledNavTitle>Components</StyledNavTitle>
        <CNavGroup
          toggler={
            <VocabularyWrapper>
              Vocabulary
              <AddButton onClick={handleAddCategory}>+</AddButton>
            </VocabularyWrapper>
          }
        >
          {Object.keys(categories).map((category) => (
            <StyledNavItem key={category}>
              <StyledNavLink as={Link} to={`/vocabulary/${category}`}>
                {category}
              </StyledNavLink>
            </StyledNavItem>
          ))}
        </CNavGroup>
        <CNavGroup toggler="Charts">
          <StyledNavItem>
            <StyledNavLink as={Link} to="/charts">
              Charts
            </StyledNavLink>
          </StyledNavItem>
        </CNavGroup>
        <CNavGroup toggler="Icons">
          <StyledNavItem>
            <StyledNavLink as={Link} to="/icons">
              Icons
            </StyledNavLink>
          </StyledNavItem>
        </CNavGroup>
        <StyledNavItem>
          <StyledNavLink as={Link} to="/notifications">
            Notifications
          </StyledNavLink>
        </StyledNavItem>
      </CSidebarNav>
      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onAdd={handleAddCategorySubmit}
        />
      )}
    </StyledSidebar>
  );
};

// Modify the AddButton styled component

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 10px;
  margin: 10px;
  background-color: rgba(231, 76, 60, 0.1);
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
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  color: #ffffff;

  h2 {
    color: #ffffff;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;

    input {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #34495e;
      background-color: #34495e;
      color: #ffffff;

      &::placeholder {
        color: #bdc3c7;
      }

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }

    button {
      padding: 10px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &[type="submit"] {
        background-color: #3498db;
        color: #ffffff;

        &:hover {
          background-color: #2980b9;
        }
      }

      &[type="button"] {
        background-color: #34495e;
        color: #ffffff;

        &:hover {
          background-color: #2c3e50;
        }
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
`;
const AddButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 4px;

  &:hover {
    background-color: #34495e;
    transform: scale(1.2);
    font-size: 24px;
    font-weight: bold;
  }
`;
const VocabularyWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: #ffffff;

  &:hover ${AddButton} {
    opacity: 1;
  }
`;

const StyledSidebar = styled(CSidebar)`
  background-color: #2c3e50;
  color: #ecf0f1;
`;

const StyledNavTitle = styled(CNavTitle)`
  color: #ecf0f1;
`;

const StyledNavItem = styled(CNavItem)`
  margin: 5px 0;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }
`;

const StyledNavLink = styled(CNavLink)`
  color: #ecf0f1;
  padding: 10px 15px;
  display: block;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

export default SideBar;
