import { useEffect, useState } from 'react';
import { listArticles, getArticle, listSpaces, searchArticles } from './api.js';

export function HomePage() {
  const [articles, setArticles] = useState<unknown[]>([]);
  useEffect(() => {
    listArticles().then(setArticles);
  }, []);
  return <div className="home">{JSON.stringify(articles)}</div>;
}

export function ArticlePage() {
  const [article, setArticle] = useState<unknown>(null);
  useEffect(() => {
    getArticle('1').then(setArticle);
  }, []);
  return <div className="article">{JSON.stringify(article)}</div>;
}

export function SpacesPage() {
  const [spaces, setSpaces] = useState<unknown[]>([]);
  useEffect(() => {
    listSpaces().then(setSpaces);
  }, []);
  return <div className="spaces">{JSON.stringify(spaces)}</div>;
}

export function SearchPage() {
  const [results, setResults] = useState<unknown[]>([]);
  useEffect(() => {
    searchArticles('hello').then(setResults);
  }, []);
  return <div className="search">{JSON.stringify(results)}</div>;
}
