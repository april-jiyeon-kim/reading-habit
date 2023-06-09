import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { NoteType } from "../../types/bookTypes";
import { Row } from "../../styles/layout";
import styled from "styled-components/native";
import { DARK_BLUE, INPUT_BG_COLOR, LIGHT_GREY } from "../../styles/colors";

interface ToggleTabProps {
  activeTab: NoteType;
  onChangeTab: (tab: NoteType) => void;
  size?: "small" | "medium" | "large";
}

const ToggleTab: React.FC<ToggleTabProps> = ({
  activeTab,
  onChangeTab,
  size = "medium",
}) => {
  return (
    <Wrapper size={size}>
      <Tab selected={activeTab === NoteType.QUOTES}>
        <TabText
          selected={activeTab === NoteType.QUOTES}
          onPress={() => onChangeTab(NoteType.QUOTES)}
          size={size}
        >
          Quotes
        </TabText>
      </Tab>
      <Tab selected={activeTab === NoteType.NOTES}>
        <TabText
          selected={activeTab === NoteType.NOTES}
          onPress={() => onChangeTab(NoteType.NOTES)}
          size={size}
        >
          Notes
        </TabText>
      </Tab>
    </Wrapper>
  );
};

export default ToggleTab;

const Wrapper = styled(Row)<{ size: string }>`
  height: ${({ size }) => (size === "small" ? "24px" : "46px")};
  width: ${({ size }) => (size === "small" ? "50%" : "100%")};
  border-radius: 20px;
  background-color: ${INPUT_BG_COLOR};
  padding: 2px;
`;

const Tab = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ selected }) => (selected ? "white" : INPUT_BG_COLOR)};
  height: 100%;
  border-radius: 20px;
`;

const TabText = styled.Text<{ selected: boolean; size: string }>`
  color: ${({ selected }) => (selected ? DARK_BLUE : LIGHT_GREY)};
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: ${({ size }) => (size === "small" ? "12px" : "16px")};
`;
