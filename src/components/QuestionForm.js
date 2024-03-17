import React, { useState } from "react";

function QuestionForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // If courseId is selectable by the user, maintain its state here

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="body">Body</label>
      <textarea
        id="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {/* Include courseId selection if necessary */}
      <button type="submit">Post Question</button>
    </form>
  );
}

export default QuestionForm;
