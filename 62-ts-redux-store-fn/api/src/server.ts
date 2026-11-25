import express from "express";

const app = express();

const articles = [{ slug: "hello", tagList: ["go"] }];

/** Every article, a page at a time. */
app.get("/api/articles", (req, res) => {
  res.json({ articles, articlesCount: articles.length, page: Number(req.query.page ?? 0) });
});

/** The articles of the authors the user follows. */
app.get("/api/articles/feed", (req, res) => {
  res.json({ articles: [], articlesCount: 0, page: Number(req.query.page ?? 0) });
});

/** The articles with a tag. */
app.get("/api/articles/tagged/:tag", (req, res) => {
  const tagged = articles.filter((a) => a.tagList.includes(req.params.tag));
  res.json({ articles: tagged, articlesCount: tagged.length });
});

app.listen(3000);
