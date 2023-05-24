import React, { useMemo, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { SectionTitle } from "../components/screens/Bookshelf/SectionTitle";
import styled from "styled-components/native";
import { Svg, Path } from "react-native-svg";
import { VictoryPie, VictoryLegend } from "victory-native";
import { Container } from "../styles/layout";
import { LIGHT_BLACK } from "../styles/colors";
import ProgressBar from "../components/common/ProgressBar";
import { useFocusEffect } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const mockData = [
  { name: "History", y: 1 },
  { name: "Novel", y: 2 },
  { name: "Economics", y: 3 },
  { name: "Entertain", y: 1 },
  { name: "Real Estate", y: 7 },
  { name: "Real Estate", y: 5 },
  { name: "Real Estate", y: 6 },
];

type UserTag = {
  name: string;
  y: number;
};

const colorScale = ["tomato", "orange", "gold", "cyan", "navy"];

const Home = () => {
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  useFocusEffect(
    React.useCallback(() => {
      const tagsObject: { [tag: string]: number } = {};
      let amount = 0;
      const unsubscribe = firestore()
        .collection("books")
        .where("uid", "==", auth().currentUser?.uid)
        .onSnapshot((snapshot) => {
          const books = snapshot.docs;
          books.forEach((doc) => {
            const bookData = doc.data();
            if (bookData.tags) {
              bookData.tags.forEach((tag: string) => {
                if (tagsObject[tag]) {
                  tagsObject[tag] += 1; // Increment count if the tag already exists
                } else {
                  tagsObject[tag] = 1; // Initialize count if the tag is encountered for the first time
                }
                amount += 1;
              });
            }
          });
          const tagsArray = Object.entries(tagsObject).map(([name, count]) => ({
            name,
            y: count,
          }));
          setUserTags(tagsArray);
          setTotalAmount(amount);
        });

      return () => unsubscribe();
    }, [])
  );

  return (
    <View>
      <Title>Genre bias</Title>
      <BiasContainer>
        <VictoryPie
          colorScale={"qualitative"}
          data={userTags}
          innerRadius={120}
          labelRadius={90}
          width={250}
          height={250}
          labels={({ datum }) =>
            `${Math.floor((datum.y / totalAmount) * 100)}%`
          }
          style={{
            labels: { fill: "white", fontSize: 14 },
          }}
        />
        <VictoryLegend
          orientation="horizontal"
          itemsPerRow={1}
          colorScale={"qualitative"}
          data={userTags}
          height={100}
          x={50}
        />
      </BiasContainer>
      <Title>Goals</Title>
      <SectionContainer>
        <ProgressBar value={75} maxValue={100} label={"17/21 books"} />
      </SectionContainer>
    </View>
  );
};
export default Home;

const BiasContainer = styled.View`
  margin: 40px 16px 0;
  align-items: center;
`;
const SectionContainer = styled.View`
  margin: 0 16px;
`;

export const Title = styled.Text`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  margin-left: 16px;
  color: ${LIGHT_BLACK};
`;
