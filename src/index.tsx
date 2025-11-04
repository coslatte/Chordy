import { Form, ActionPanel, Action, showToast } from "@raycast/api";

type Values = {
  textfield: string;
  textarea: string;
};

const sanitizeChordInput = (input: string): string => {
  return (
    input
      // Allow: A-G (notes),
      // #♯♭ (accidentals),
      // mMaugdimsus (qualities),
      // 0-9 (extensions),
      // / (slashes for bass),
      // ()- (grouping/hyphens), spaces
      .replace(/[^a-gA-G#♯♭bmMaugdimsus2-9\d\s\/\(\)\-]/g, "")

      // Normalize accidentals (optional - convert ♯♭ to #b)
      .replace(/♯/g, "#")
      .replace(/♭/g, "b")
      .replace(/\s+/g, " ") // Clean up multiple spaces
      .replace(/\s*\/\s*/g, "/") // Remove spaces around slashes (C / G -> C/G)
      .replace(/\s*-\s*/g, "-") // Remove spaces around hyphens

      .trim()
      .toUpperCase()
  ); // Optional: standardize to uppercase
};

export default function Command() {
  function handleSubmit(values: Values) {
    const val = cleanWhiteSpaces(values);
    console.log(val);
    // console.log(values);
    showToast({ title: "Submitted form", message: "See logs for submitted values" });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" info="Insert text" />
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField id="textfield" title="Text field" placeholder="Enter text" defaultValue="Raycast" />
      <Form.TextArea id="textarea" title="Text area" placeholder="Enter multi-line text" />
    </Form>
  );
}
