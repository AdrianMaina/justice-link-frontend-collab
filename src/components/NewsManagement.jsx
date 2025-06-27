import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { apiService } from '../apiService';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';

export default function NewsManagement() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', source: '', read_more_link: '' });

  const fetchArticles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getNews();
      setArticles(data);
    } catch (err) {
      setError('Failed to fetch news articles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEdit = (article) => {
    setIsEditing(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      source: article.source || '',
      read_more_link: article.read_more_link || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await apiService.deleteNewsArticle(id);
        fetchArticles();
      } catch (err) {
        setError('Failed to delete article.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiService.updateNewsArticle(isEditing, formData);
      } else {
        await apiService.createNewsArticle(formData);
      }
      setIsEditing(null);
      setFormData({ title: '', content: '', source: '', read_more_link: '' });
      fetchArticles();
    } catch (err) {
      setError('Failed to save article.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Article Management</CardTitle>
        <CardDescription>Create, edit, and delete news articles.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{isEditing ? 'Edit Article' : 'Create New Article'}</h3>
          <Input id="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
          <Textarea id="content" placeholder="Content" value={formData.content} onChange={handleInputChange} required />
          <Input id="source" placeholder="Source" value={formData.source} onChange={handleInputChange} />
          <Input id="read_more_link" placeholder="Read More Link" value={formData.read_more_link} onChange={handleInputChange} />
          <div className="flex gap-2">
            <Button type="submit">{isEditing ? <Edit className="h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}{isEditing ? 'Update Article' : 'Create Article'}</Button>
            {isEditing && <Button variant="outline" onClick={() => { setIsEditing(null); setFormData({ title: '', content: '', source: '', read_more_link: '' }); }}>Cancel</Button>}
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{article.title}</h4>
                  <p className="text-sm text-muted-foreground">{article.source}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(article)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}