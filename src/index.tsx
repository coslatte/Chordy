import { Form, ActionPanel, Action, showToast } from "@raycast/api";

type Values = {
  textfield: string;
};

function isChordLike(value: string): boolean {
  return value.toLowerCase() === "cmaj";
}

function translate(value: string): string {
  if (isChordLike(value)) {
    return value;
  } else {
    return value;
  }
}

const theStuff = "The String";

export function handleSubmit(values: Values) {
  if (isChordLike(values.textfield)) {
    showToast({ title: "Submitted form", message: "See logs for submitted values." });
    // translate(values.textfield)
  } else {
    //
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
        <Form.TextField id="textfield" title="Find chord" placeholder="Text a chord..." defaultValue="" />
      </Form>
    </>
  );
}
