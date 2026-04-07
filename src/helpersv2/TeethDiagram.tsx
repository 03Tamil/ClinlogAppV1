import { Flex } from "@chakra-ui/react";
import React from "react";

export default function TeethDiagram({ teethData, postDateFormatted }) {
  if (teethData === undefined) return null;
  const teethValues = {
    "": {},
    missing: { css: { background: "#fff" }, value: "M" },
    guarded: { css: { background: "#ff9100" }, value: "G" },
    poor: { css: { background: "#fc0606" }, value: "P" },
    extraction: { css: { background: "#282827", color: "white" }, value: "E" },
    implantExisting: { css: { background: "#8dddff" }, value: "I" },
    implant: { css: { background: "#8dddff" }, value: "I" },
  };
  return (
    <Flex>
      <div className="css-ujh5s">
        <img
          src="../teeth1.jpg"
          style={{ height: "400px", minWidth: "232px" }}
          draggable={false}
        />
        <form>
          <input
            type="text"
            defaultValue={teethValues[teethData[0]?.col1].value}
            style={teethValues[teethData[0]?.col1].css}
            name="uda1"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[1]?.col1].value}
            style={teethValues[teethData[1]?.col1].css}
            name="uda2"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[2]?.col1].value}
            style={teethValues[teethData[2]?.col1].css}
            name="uda3"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[3]?.col1].value}
            style={teethValues[teethData[3]?.col1].css}
            name="uda4"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[4]?.col1].value}
            style={teethValues[teethData[4]?.col1].css}
            name="uda5"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[5]?.col1].value}
            style={teethValues[teethData[5]?.col1].css}
            name="uda6"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[6]?.col1].value}
            style={teethValues[teethData[6]?.col1].css}
            name="uda7"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[7]?.col1].value}
            style={teethValues[teethData[7]?.col1].css}
            name="uda8"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[8]?.col1].value}
            style={teethValues[teethData[8]?.col1].css}
            name="uda9"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[9]?.col1].value}
            style={teethValues[teethData[9]?.col1].css}
            name="uda10"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[10]?.col1].value}
            style={teethValues[teethData[10]?.col1].css}
            name="uda11"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[11]?.col1].value}
            style={teethValues[teethData[11]?.col1].css}
            name="uda12"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[12]?.col1].value}
            style={teethValues[teethData[12]?.col1].css}
            name="uda13"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[13]?.col1].value}
            style={teethValues[teethData[13]?.col1].css}
            name="uda14"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[14]?.col1].value}
            style={teethValues[teethData[14]?.col1].css}
            name="uda15"
            className="uda"
            onChange={() => {}}
          />
          <input
            type="text"
            defaultValue={teethValues[teethData[15]?.col1].value}
            style={teethValues[teethData[15]?.col1].css}
            name="uda16"
            className="uda"
            onChange={() => {}}
          />

          <input
            type="text"
            name="lda17"
            defaultValue={teethValues[teethData[16]?.col1].value}
            style={teethValues[teethData[16]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda18"
            defaultValue={teethValues[teethData[17]?.col1].value}
            style={teethValues[teethData[17]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda19"
            defaultValue={teethValues[teethData[18]?.col1].value}
            style={teethValues[teethData[18]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda20"
            defaultValue={teethValues[teethData[19]?.col1].value}
            style={teethValues[teethData[19]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda21"
            defaultValue={teethValues[teethData[20]?.col1].value}
            style={teethValues[teethData[20]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda22"
            defaultValue={teethValues[teethData[21]?.col1].value}
            style={teethValues[teethData[21]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda23"
            defaultValue={teethValues[teethData[22]?.col1].value}
            style={teethValues[teethData[22]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda24"
            defaultValue={teethValues[teethData[23]?.col1].value}
            style={teethValues[teethData[23]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda25"
            defaultValue={teethValues[teethData[24]?.col1].value}
            style={teethValues[teethData[24]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda26"
            defaultValue={teethValues[teethData[25]?.col1].value}
            style={teethValues[teethData[25]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda27"
            defaultValue={teethValues[teethData[26]?.col1].value}
            style={teethValues[teethData[26]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda28"
            defaultValue={teethValues[teethData[27]?.col1].value}
            style={teethValues[teethData[27]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda29"
            defaultValue={teethValues[teethData[28]?.col1].value}
            style={teethValues[teethData[28]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda30"
            defaultValue={teethValues[teethData[29]?.col1].value}
            style={teethValues[teethData[29]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda31"
            defaultValue={teethValues[teethData[30]?.col1].value}
            style={teethValues[teethData[30]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
          <input
            type="text"
            name="lda32"
            defaultValue={teethValues[teethData[31]?.col1].value}
            style={teethValues[teethData[31]?.col1].css}
            className="lda"
            onChange={() => {}}
          />
        </form>
      </div>
    </Flex>
  );
}
