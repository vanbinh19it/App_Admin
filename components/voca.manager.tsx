import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import axios from "axios";

interface VocabularyItem {
  _id: string;
  word: string;
  image: string;
  pronunciation: string;
  meaning: string;
  example: string;
}

interface FormData {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  category: string;
  image?: string;
}
interface Categories {
  fruits: VocabularyItem[];
  animals: VocabularyItem[];
}

interface VocabularyData {
  _id: string;
  categories: Categories;
}

const VocabularyManagement: React.FC = () => {
  const [vocabularyData, setVocabularyData] = useState<VocabularyData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<VocabularyItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("fruits");
  const [formData, setFormData] = useState<FormData>({
    word: "",
    pronunciation: "",
    meaning: "",
    example: "",
    category: selectedCategory,
    image: "",
  });
  const fetchVocabularies = async (): Promise<void> => {
    try {
      const response = await axios.get<VocabularyData[]>(
        "http://192.168.1.234:3005/api/vocabularies"
      );
      setVocabularyData(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch vocabularies", [{ text: "OK" }]);
      console.error("Error fetching vocabularies:", error);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    Alert.alert(
      "Delete Vocabulary",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `http://192.168.1.234:3005/api/vocabularies/${id}`
              );
              await fetchVocabularies(); // Refresh list
              Alert.alert("Success", "Vocabulary deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete vocabulary");
              console.error("Error deleting vocabulary:", error);
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    // Validate required fields
    if (!formData.word || !formData.meaning || !formData.category) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      if (editItem) {
        // Update existing vocabulary
        await axios.put(
          `http://192.168.1.234:3005/api/vocabularies/${editItem._id}`,
          {
            category: selectedCategory,
            item: {
              ...formData,
              _id: editItem._id,
            },
          }
        );
        Alert.alert("Success", "Vocabulary updated successfully");
      } else {
        // Create new vocabulary
        await axios.post("http://192.168.1.234:3005/api/vocabularies", {
          category: selectedCategory,
          item: formData,
        });
        Alert.alert("Success", "Vocabulary created successfully");
      }

      // Reset form and refresh list
      setModalVisible(false);
      setEditItem(null);
      setFormData({
        word: "",
        pronunciation: "",
        meaning: "",
        example: "",
        category: selectedCategory,
        image: "",
      });
      await fetchVocabularies();
    } catch (error) {
      Alert.alert(
        "Error",
        editItem ? "Failed to update vocabulary" : "Failed to create vocabulary"
      );
      console.error("Error submitting vocabulary:", error);
    }
  };

  useEffect(() => {
    fetchVocabularies();
  }, []);
  const getVocabulariesByCategory = () => {
    if (vocabularyData.length > 0) {
      return (
        vocabularyData[0].categories[selectedCategory as keyof Categories] || []
      );
    }
    return [];
  };

  const renderCategorySelector = () => (
    <View style={styles.categorySelector}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === "fruits" && styles.selectedCategory,
        ]}
        onPress={() => setSelectedCategory("fruits")}
      >
        <Text style={styles.categoryButtonText}>Fruits</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === "animals" && styles.selectedCategory,
        ]}
        onPress={() => setSelectedCategory("animals")}
      >
        <Text style={styles.categoryButtonText}>Animals</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    if (editItem) {
      setFormData({
        word: editItem.word,
        pronunciation: editItem.pronunciation,
        meaning: editItem.meaning,
        example: editItem.example,
        category: selectedCategory,
        image: editItem.image,
      });
    }
  }, [editItem]);

  const renderVocabularyItem = ({ item }: { item: VocabularyItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Image
          source={{ uri: `http://192.168.1.234:3005${item.image}` }}
          style={styles.itemImage}
          defaultSource={require("../assets/icon.png")}
        />
        <View style={styles.itemText}>
          <Text style={styles.wordText}>{item.word}</Text>
          <Text style={styles.pronunciationText}>{item.pronunciation}</Text>
          <Text style={styles.meaningText}>{item.meaning}</Text>
          <Text style={styles.exampleText}>{item.example}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => {
            setEditItem(item);
            setFormData({
              word: item.word,
              pronunciation: item.pronunciation,
              meaning: item.meaning,
              example: item.example,
              category: selectedCategory,
              image: item.image,
            });
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary Management</Text>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => {
            setEditItem(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {renderCategorySelector()}

      <FlatList
        data={getVocabulariesByCategory()}
        renderItem={renderVocabularyItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editItem ? "Edit Vocabulary" : "Add New Vocabulary"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Word"
            value={formData.word}
            onChangeText={(text) => setFormData({ ...formData, word: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Meaning"
            value={formData.meaning}
            onChangeText={(text) => setFormData({ ...formData, meaning: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={formData.category}
            onChangeText={(text) =>
              setFormData({ ...formData, category: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setFormData({
                  word: "",
                  pronunciation: "",
                  meaning: "",
                  example: "",
                  category: selectedCategory,
                  image: "",
                });
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    marginBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  meaningText: {
    fontSize: 16,
    color: "#666",
  },
  categoryText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: "center",
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 16,
  },
  categorySelector: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  selectedCategory: {
    backgroundColor: "#4CAF50",
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  pronunciationText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
  exampleText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default VocabularyManagement;
