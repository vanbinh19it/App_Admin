import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IPv4Address } from "../configs/config";
import AddConversationModal from "./listening.addConversation";
import EditConversationModal from "./listening.editConversation";
import AddQuizModal from "./listening.addQuiz";
import EditQuizModal from "./listenling.editQuiz";
import AddFillBlanksModal from "./listening.addFillBlanks";
import EditFillBlanksModal from "./listening.editFillBlanks";

interface FillBlank {
  sentence: string;
  missingWord: string;
  audioText: string;
}

const ListeningCategory: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [practiceData, setPracticeData] = useState<any>({});
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [editLevel, setEditLevel] = useState("");
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showEditLevelModal, setShowEditLevelModal] = useState(false);
  const [selectedLevelName, setSelectedLevelName] = useState("");
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(-1);
  const [fillBlanksData, setFillBlanksData] = useState<FillBlank[]>([]);
  const [showAddFillBlankModal, setShowAddFillBlankModal] = useState(false);
  const [showEditFillBlankModal, setShowEditFillBlankModal] = useState(false);
  const [selectedFillBlank, setSelectedFillBlank] = useState<FillBlank | null>(
    null
  );
  const [selectedFillBlankIndex, setSelectedFillBlankIndex] =
    useState<number>(-1);

  const handleAddClick = (level: string) => {
    setSelectedLevel(level);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setSelectedLevel("");
  };

  const handleConversationAdd = async () => {
    try {
      const response = await axios.get(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}`
      );
      if (response.data) {
        setPracticeData(response.data.practice || {});
        setQuizData(response.data.quiz || []);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };
  const handleEdit = (level: string, conversation: any, index: number) => {
    setEditLevel(level);
    setSelectedConversation(conversation);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedData: any) => {
    try {
      const response = await axios.put(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/practice/${editLevel}/conversations/${editIndex}`,
        updatedData
      );

      if (response.status === 200) {
        const updatedPracticeData = { ...practiceData };
        updatedPracticeData[editLevel].conversations[editIndex] =
          response.data.conversation;
        setPracticeData(updatedPracticeData);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating conversation:", error);
    }
  };

  const handleDelete = async (level: string, index: number) => {
    try {
      const response = await axios.delete(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/practice/${level}/conversations/${index}`
      );

      if (response.status === 200) {
        // Update state to reflect deletion
        const updatedPracticeData = { ...practiceData };
        updatedPracticeData[level].conversations.splice(index, 1);
        setPracticeData(updatedPracticeData);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleAddLevel = async (levelName: string) => {
    try {
      const response = await axios.post(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/level`,
        { levelName }
      );
      if (response.status === 201) {
        const updatedPracticeData = { ...practiceData };
        updatedPracticeData[levelName] = response.data.level;
        setPracticeData(updatedPracticeData);
        setShowAddLevelModal(false);
      }
    } catch (error) {
      console.error("Error adding level:", error);
    }
  };

  const handleEditLevel = async (
    oldLevelName: string,
    newLevelName: string
  ) => {
    try {
      const response = await axios.put(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/level/${oldLevelName}`,
        { newLevelName }
      );
      if (response.status === 200) {
        const updatedPracticeData = { ...practiceData };
        delete updatedPracticeData[oldLevelName];
        updatedPracticeData[newLevelName] = response.data.level;
        setPracticeData(updatedPracticeData);
        setShowEditLevelModal(false);
      }
    } catch (error) {
      console.error("Error updating level:", error);
    }
  };

  const handleDeleteLevel = async (levelName: string) => {
    try {
      const response = await axios.delete(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/level/${levelName}`
      );
      if (response.status === 200) {
        const updatedPracticeData = { ...practiceData };
        delete updatedPracticeData[levelName];
        setPracticeData(updatedPracticeData);
      }
    } catch (error) {
      console.error("Error deleting level:", error);
    }
  };
  const handleAddLevelClick = () => {
    setShowAddLevelModal(true);
  };

  const handleAddQuiz = async (quizData: any) => {
    try {
      const response = await axios.post(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/quiz`,
        quizData
      );
      if (response.status === 201) {
        // Fetch updated quiz list instead of just appending
        const updatedData = await axios.get(
          `http://${IPv4Address}:3005/api/listening/topics/${topic}`
        );
        setQuizData(updatedData.data.quiz || []);
        setShowAddQuizModal(false);
      }
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  const handleEditQuiz = async (updatedQuizData: any) => {
    try {
      const response = await axios.put(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/quiz/${selectedQuizIndex}`,
        updatedQuizData
      );
      if (response.status === 200) {
        const newQuizData = [...quizData];
        newQuizData[selectedQuizIndex] = response.data.quiz;
        setQuizData(newQuizData);
        setShowEditQuizModal(false);
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const handleDeleteQuiz = async (index: number) => {
    try {
      const response = await axios.delete(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/quiz/${index}`
      );
      if (response.status === 200) {
        setQuizData(quizData.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleAddFillBlank = async (fillBlankData: any) => {
    try {
      const response = await axios.post(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/fillblanks`,
        fillBlankData
      );
      if (response.status === 201) {
        setFillBlanksData([...fillBlanksData, response.data.fillBlank]);
        setShowAddFillBlankModal(false);
      }
    } catch (error) {
      console.error("Error adding fill blank:", error);
    }
  };

  const handleEditFillBlank = async (updatedData: any) => {
    try {
      const response = await axios.put(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/fillblanks/${selectedFillBlankIndex}`,
        updatedData
      );
      if (response.status === 200) {
        const newFillBlanksData = [...fillBlanksData];
        newFillBlanksData[selectedFillBlankIndex] = response.data.fillBlank;
        setFillBlanksData(newFillBlanksData);
        setShowEditFillBlankModal(false);
      }
    } catch (error) {
      console.error("Error updating fill blank:", error);
    }
  };

  const handleDeleteFillBlank = async (index: number) => {
    try {
      const response = await axios.delete(
        `http://${IPv4Address}:3005/api/listening/topics/${topic}/fillblanks/${index}`
      );
      if (response.status === 200) {
        setFillBlanksData(fillBlanksData.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error deleting fill blank:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicResponse, fillBlanksResponse] = await Promise.all([
          axios.get(`http://${IPv4Address}:3005/api/listening/topics/${topic}`),
          axios.get(
            `http://${IPv4Address}:3005/api/listening/topics/${topic}/fillblanks`
          ),
        ]);

        if (topicResponse.data) {
          setPracticeData(topicResponse.data.practice || {});
          setQuizData(topicResponse.data.quiz || []);
        }

        if (fillBlanksResponse.data) {
          setFillBlanksData(fillBlanksResponse.data.fillBlanks || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, [topic]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <CategoryHeader>
        <h1>{topic}</h1>
        <ButtonContainer>
          <IconButton>
            <FaEdit />
          </IconButton>
          <IconButton>
            <FaTrash />
          </IconButton>
        </ButtonContainer>
      </CategoryHeader>
      <Section>
        <SectionHeader>
          <h2>Practice Levels</h2>
          <IconButton onClick={handleAddLevelClick}>
            <span>+</span>
          </IconButton>
        </SectionHeader>
        {Object.entries(practiceData).map(([level, data]: [string, any]) => (
          <LevelItem key={level}>
            <LevelHeader>
              <h3>{level}</h3>
              <ButtonContainer>
                <IconButton onClick={() => handleAddClick(level)}>
                  <span>+</span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedLevelName(level);
                    setShowEditLevelModal(true);
                  }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => handleDeleteLevel(level)}>
                  <FaTrash />
                </IconButton>
              </ButtonContainer>
            </LevelHeader>
            <ContentList>
              {data.conversations.map((conv: any, index: number) => (
                <ContentItem key={index}>
                  <div>
                    <p>
                      <strong>Speaker:</strong> {conv.speaker}
                    </p>
                    <p>
                      <strong>Text:</strong> {conv.text}
                    </p>
                    <p>
                      <strong>Translation:</strong> {conv.translation}
                    </p>
                  </div>
                  <ButtonContainer>
                    <IconButton onClick={() => handleEdit(level, conv, index)}>
                      <FaEdit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(level, index)}>
                      <FaTrash />
                    </IconButton>
                  </ButtonContainer>
                </ContentItem>
              ))}
            </ContentList>
          </LevelItem>
        ))}
      </Section>

      <Section>
        <SectionHeader>
          <h2>Quiz</h2>
          <IconButton onClick={() => setShowAddQuizModal(true)}>
            <span>+</span>
          </IconButton>
        </SectionHeader>
        <ContentList>
          {quizData.map((quiz, index) => (
            <ContentItem key={index}>
              <div>
                <p>
                  <strong>Question:</strong> {quiz.question}
                </p>
                <OptionsList>
                  <strong>Options:</strong>
                  {quiz.options.map((option: string, i: number) => (
                    <OptionItem key={i}>{option}</OptionItem>
                  ))}
                </OptionsList>
                <p>
                  <strong>Correct Answer:</strong> {quiz.correctAnswer}
                </p>
              </div>
              <ButtonContainer>
                <IconButton
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setSelectedQuizIndex(index);
                    setShowEditQuizModal(true);
                  }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => handleDeleteQuiz(index)}>
                  <FaTrash />
                </IconButton>
              </ButtonContainer>
            </ContentItem>
          ))}
        </ContentList>
      </Section>

      <Section>
        <SectionHeader>
          <h2>Fill in Blanks</h2>
          <IconButton onClick={() => setShowAddFillBlankModal(true)}>
            <span>+</span>
          </IconButton>
        </SectionHeader>
        <ContentList>
          {fillBlanksData.map((fillBlank, index) => (
            <ContentItem key={index}>
              <div>
                <p>
                  <strong>Sentence:</strong> {fillBlank.sentence}
                </p>
                <p>
                  <strong>Missing Word:</strong> {fillBlank.missingWord}
                </p>
                <p>
                  <strong>Audio Text:</strong> {fillBlank.audioText}
                </p>
              </div>
              <ButtonContainer>
                <IconButton
                  onClick={() => {
                    setSelectedFillBlank(fillBlank);
                    setSelectedFillBlankIndex(index);
                    setShowEditFillBlankModal(true);
                  }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => handleDeleteFillBlank(index)}>
                  <FaTrash />
                </IconButton>
              </ButtonContainer>
            </ContentItem>
          ))}
        </ContentList>
      </Section>

      {showAddModal && (
        <AddConversationModal
          onClose={handleModalClose}
          onAdd={handleConversationAdd}
          topicName={topic || ""}
          levelName={selectedLevel}
        />
      )}
      {showEditModal && selectedConversation && (
        <EditConversationModal
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
          conversation={selectedConversation}
        />
      )}
      {showAddLevelModal && (
        <AddLevelModal
          onClose={() => setShowAddLevelModal(false)}
          onAdd={handleAddLevel}
        />
      )}
      {showAddLevelModal && (
        <AddLevelModal
          onClose={() => setShowAddLevelModal(false)}
          onAdd={handleAddLevel}
        />
      )}
      {showEditLevelModal && (
        <EditLevelModal
          onClose={() => setShowEditLevelModal(false)}
          onEdit={handleEditLevel}
          currentLevelName={selectedLevelName}
        />
      )}
      {showAddQuizModal && (
        <AddQuizModal
          onClose={() => setShowAddQuizModal(false)}
          onAdd={handleAddQuiz}
          topicName={topic || ""}
        />
      )}
      {showEditQuizModal && selectedQuiz && (
        <EditQuizModal
          onClose={() => setShowEditQuizModal(false)}
          onUpdate={handleEditQuiz}
          quiz={selectedQuiz}
        />
      )}
      {showAddFillBlankModal && (
        <AddFillBlanksModal
          onClose={() => setShowAddFillBlankModal(false)}
          onAdd={handleAddFillBlank}
        />
      )}
      {showEditFillBlankModal && selectedFillBlank && (
        <EditFillBlanksModal
          onClose={() => setShowEditFillBlankModal(false)}
          onUpdate={handleEditFillBlank}
          fillBlank={selectedFillBlank}
        />
      )}
    </Container>
  );
};

interface AddLevelModalProps {
  onClose: () => void;
  onAdd: (levelName: string) => void;
}

interface EditLevelModalProps {
  onClose: () => void;
  onEdit: (oldLevelName: string, newLevelName: string) => void;
  currentLevelName: string;
}

const AddLevelModal: React.FC<AddLevelModalProps> = ({ onClose, onAdd }) => {
  const [levelName, setLevelName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(levelName);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add New Level</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Level Name:</Label>
            <Input
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              placeholder="e.g., level1, level2"
              required
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

const EditLevelModal: React.FC<EditLevelModalProps> = ({
  onClose,
  onEdit,
  currentLevelName,
}) => {
  const [newLevelName, setNewLevelName] = useState(currentLevelName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(currentLevelName, newLevelName);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Edit Level Name</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>New Level Name:</Label>
            <Input
              value={newLevelName}
              onChange={(e) => setNewLevelName(e.target.value)}
              placeholder="Enter new level name"
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

const Container = styled.div`
  margin-top: 60px;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: #ffffff;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #2c2c2c;
  border-radius: 5px;
`;

const LevelItem = styled.div`
  margin: 15px 0;
  padding: 15px;
  background-color: #363636;
  border-radius: 5px;
`;

const ContentList = styled.div`
  margin: 10px 0;
`;

const ContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #404040;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #3498db;

  &:hover {
    color: #2980b9;
  }
`;
const OptionsList = styled.div`
  margin: 10px 0;
`;

const OptionItem = styled.p`
  margin: 5px 0 5px 20px;
  color: #e0e0e0;
`;

const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

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
  width: 400px;
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

export default ListeningCategory;
