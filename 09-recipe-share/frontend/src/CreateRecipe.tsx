import { useState } from "react";
import { createRecipe } from "./api";

export function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    await createRecipe({
      title,
      body,
      author_id: 1,
      image_name: "dish.png",
      image_data: "base64data",
    });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
