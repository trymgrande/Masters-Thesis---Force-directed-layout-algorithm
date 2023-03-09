import { useEffect, useState } from "react";
// import { drawHelloWorld } from "@disputas/unnamed";
import { drawHelloWorld2 } from "@disputas/unnamed";
import domserver from "react-dom/server";
import { TiTrash } from "react-icons/ti";
//@ts-ignore
import dagre from "@disputas/dagre";

export type PropositionType =
  | "premise"
  | "conclusion"
  | "relevance"
  | "unsorted";

interface Proposition {
  type: PropositionType;
  annotationIds: string[];
  id: string;
  description: string;
  displayId: string;
  truthValue: boolean | number;
  hasAtleastOneContraArgument: boolean;
}

const TopButton = ({ icon }: { icon: JSX.Element }) => {
  return <div className="topButton">{icon}</div>;
};

const TestComponent = ({
  proposition,
  show,
}: {
  proposition: Proposition;
  show: string;
}) => {
  const { type, description, displayId } = proposition;
  return (
    <>
      {(show === proposition.id && (
        <TopButton icon={<TiTrash color="white" />} />
      )) || <div style={{ width: "100%", height: "2rem" }} />}

      <fieldset className={`wrapper ${type}`}>
        <legend className="tag">{displayId}</legend>
        <p className="content">{description}</p>
      </fieldset>
    </>
  );
};

const propositions: Proposition[] = [
  {
    type: "premise",
    annotationIds: [],
    id: "1",
    description:
      "In what follows, I shall argue that the way people in relatively affluent countries react to a situation like that in Bengal cannot be justified; indeed, the whole way we look at moral issues - our",
    displayId: "P1",
    truthValue: 50,
    hasAtleastOneContraArgument: false,
  },
  {
    type: "premise",
    annotationIds: [],
    id: "2",
    description:
      "In what follows, I shall argue that the way people in relatively affluent countries react to a situation like that in Bengal cannot be justified; indeed, the whole way we look at moral issues - our",
    displayId: "P2",
    truthValue: 50,
    hasAtleastOneContraArgument: false,
  },
  {
    type: "premise",
    annotationIds: [],
    id: "4",
    description:
      "In what follows, I shall argue that the way people in relatively affluent countries react to a situation like that in Bengal cannot be justified; indeed, the whole way we look at moral issues - our",
    displayId: "P3",
    truthValue: 50,
    hasAtleastOneContraArgument: false,
  },
  {
    type: "conclusion",
    annotationIds: [],
    id: "3",
    description:
      "In what follows, I shall argue that the way people in relatively affluent countries react to a situation like that in Bengal cannot be justified; indeed, the whole way we look at moral issues - our",
    displayId: "C1",
    truthValue: 50,
    hasAtleastOneContraArgument: false,
  },
];

const edges = [
  {
    id: "100",
    source: "1",
    target: "3",
  },
  {
    id: "101",
    source: "2",
    target: "3",
  },
  {
    id: "102",
    source: "4",
    target: "3",
  },
];

function App() {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ nodeSep: 200, rankSep: 400 });
  g.setDefaultEdgeLabel(() => ({}));
  propositions.forEach((prop) =>
    g.setNode(prop.id, { prop: { ...prop }, width: 300, height: 120 })
  );
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);

  useEffect(() => {
    const cleanup = drawHelloWorld2();

    return () => cleanup();
  }, []);

  return (
    <div className="App" id="app">
      <svg id="main"></svg>
    </div>
  );
}

export default App;
