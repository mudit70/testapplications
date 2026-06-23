// HTTP client for the blog API using plain fetch().
// URL literals here mirror the Laravel route patterns in backend/routes/api.php.

export interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author: string;
  body: string;
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  return res.json();
}

export async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`);
  return res.json();
}

export async function createPost(input: {
  title: string;
  body: string;
  author: string;
}): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });
}

export async function addComment(
  postId: number,
  input: { author: string; body: string }
): Promise<Comment> {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}
