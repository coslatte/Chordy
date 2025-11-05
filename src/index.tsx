import { Form, ActionPanel, Action, showToast } from "@raycast/api";

type Values = {
  textfield: string;
  textarea: string;
};

export default function Command() {
  function handleSubmit(values: Values) {
    console.log(values);
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
      <Form.TextField id="textfield" title="Find chord" placeholder="Enter chord" defaultValue="C major" />
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextArea id="input" info="Insert text" />
      <Form.TextArea id="textarea" title="Text area" placeholder="Enter multi-line text" />
    </Form>
  );
}
