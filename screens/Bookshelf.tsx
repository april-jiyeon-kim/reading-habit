import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  TouchableWithoutFeedback,
} from "react-native";
import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { DARK_BLUE, LIGHT_GREY } from "../styles/colors";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { Container, Row } from "../styles/layout";
import BookCard from "../components/screens/Bookshelf/BookCard";
import { Book, ReadingStatus } from "../types/bookTypes";
import { SectionTitle } from "../components/screens/Bookshelf/SectionTitle";
import BookCover from "../components/screens/Bookshelf/BookCover";
import firestore from "@react-native-firebase/firestore";
import {
  DETAIL_SCREEN,
  REGISTER_SCREEN,
  SEARCH_SCREEN,
  WRITE_NOTE_SCREEN,
} from "../constants/screenName";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type RootStackParamList = {
  Bookshelf: undefined;
};

type BookshelfScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Bookshelf"
>;

const Bookshelf: React.FC<BookshelfScreenProps> = ({
  navigation: { navigate },
}) => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  const booksReading = useMemo(() => {
    return books.filter((it) => it.reading.status === ReadingStatus.READING);
  }, [books]);

  const booksToRead = useMemo(() => {
    return books.filter((it) => it.reading.status === ReadingStatus.TO_READ);
  }, [books]);

  const booksRead = useMemo(() => {
    return books.filter((it) => it.reading.status === ReadingStatus.READ);
  }, [books]);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = firestore()
        .collection("books")
        .where("uid", "==", auth().currentUser?.uid)
        .onSnapshot((snapshot) => {
          const booksArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Book[];
          setBooks(booksArray);
          setLoading(false);
        });

      return () => unsubscribe();
    }, [])
  );

  const goToDetail = (book: Book) => {
    //@ts-ignore
    navigation.navigate("Stack", {
      screen: DETAIL_SCREEN,
      params: { bookId: book.id, book },
    });
  };

  const renderBooks: ListRenderItem<Book> = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => goToDetail(item)}>
      <View>
        <BookCover image={item.image} />
      </View>
    </TouchableWithoutFeedback>
  );
  const bookKeyExtractor = (item: Book) => item.isbn;

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <ReadingContainer>
        <SectionTitle>
          Currently Reading
          <MaterialCommunityIcons
            name="book-open-page-variant-outline"
            size={24}
            color="black"
          />
        </SectionTitle>
        {booksReading.length === 0 && (
          <NoBookWrapper>
            <NoBookText>You haven't started reading any books yet.</NoBookText>
          </NoBookWrapper>
        )}
        <FlatList
          data={booksReading}
          horizontal
          keyExtractor={bookKeyExtractor}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={Seperator}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24 }}
          renderItem={({ item }) => <BookCard key={item.isbn} book={item} />}
        />
      </ReadingContainer>
      <Container>
        <SectionTitle>Wish List</SectionTitle>
        <Row>
          <RegisterBook
            onPress={() =>
              //@ts-ignore
              navigation.navigate("Stack", { screen: SEARCH_SCREEN })
            }
          >
            <AntDesign name="plus" size={24} color={DARK_BLUE} />
          </RegisterBook>
          <FlatList
            data={booksToRead}
            horizontal
            keyExtractor={bookKeyExtractor}
            ItemSeparatorComponent={Seperator}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24, paddingTop: 34 }}
            renderItem={renderBooks}
          />
        </Row>
      </Container>
      <Container>
        <SectionTitle>Finished Books</SectionTitle>
        {booksRead.length === 0 && (
          <NoBookWrapper>
            <NoBookText>You haven't started reading any books yet.</NoBookText>
          </NoBookWrapper>
        )}
        <FlatList
          data={booksRead}
          horizontal
          keyExtractor={bookKeyExtractor}
          ItemSeparatorComponent={Seperator}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 34 }}
          renderItem={renderBooks}
        />
      </Container>
    </Container>
  );
};
export default Bookshelf;

const ReadingContainer = styled(Container)`
  flex: 2;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const RegisterBook = styled.TouchableOpacity`
  width: 60px;
  height: 88px;
  border: 2px solid ${LIGHT_GREY};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin: 34px 10px 0 24px;
`;

const Seperator = styled.View`
  width: 10px;
`;

const NoBookWrapper = styled.View`
  width: ${SCREEN_WIDTH}px;
  margin: 60px 24px 0;
`;

const NoBookText = styled.Text`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  line-height: 17px;
`;
