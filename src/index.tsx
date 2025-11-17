import { Form, ActionPanel, Action, showToast, Detail } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { title } from "process";

type Values = {
  textfield: string;
};

const MARKDOWN_TEXT = "**YEA**, idk";

export function DetailWindow() {
  return (
    <Detail
      markdown={MARKDOWN_TEXT}
      navigationTitle="Test"
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Height" text={`1' 04"`} />
          <Detail.Metadata.Label title="Weight" text="13.2 lbs" />
          <Detail.Metadata.TagList title="Type">
            <Detail.Metadata.TagList.Item text="Electric" color={"#eed535"} />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link title="Evolution" target="https://www.pokemon.com/us/pokedex/pikachu" text="Raichu" />
        </Detail.Metadata>
      }
    />
  );
}

function buildMarkdown(value: string) {
  return `**${value}**`;
}

function isChordLike(value: string): boolean {
  return value === "Cmaj";
}

async function translate(value: string): Promise<boolean> {
  // implement with Tonal.js
  return new Promise((resolve) => {
    const valid = isChordLike(value);
    if (valid) {
      const md = buildMarkdown(value);
      console.log(md);
    }
    resolve(valid)
  });
}

async function handleSubmit(values: Values) {
  const isValid = await translate(values.textfield);
  if (isValid) {
    showToast({ title: "Submitted form", message: "See logs for submitted values." });
  } else {
    showFailureToast({ title: "Failed to translate", message: "It's not a valid chord." });
  }
}

export default function Command() {
  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField id="textfield" title="Find chord" placeholder="Enter chord" defaultValue="C major" />
      </Form>
    </>
  );
}
