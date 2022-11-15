import React from "react";
import { CardList } from "./components/CardList";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  return (
    <RootSiblingParent>
      <CardList />
    </RootSiblingParent>
  );
}
