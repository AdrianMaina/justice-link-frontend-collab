// File: src/pages/NewsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Globe, Search, Filter, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { apiService } from '../apiService';

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await apiService.getNews();
        setNewsItems(data);
      } catch (err) {
        setError('Failed to fetch news articles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = newsItems.filter(item => {
    const itemSource = item.source || '';
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || itemSource.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-4xl font-bold text-slate-800 mb-4">Habari na Taarifa</h1><p className="text-xl text-slate-600">Ripoti za habari, taarifa za serikali, na majibu ya kimataifa.</p></div>
      <div className="mb-8 grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" /><Input placeholder="Tafuta habari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div>
        <Select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="all">Vyanzo Vyote</option>
          {/* You can dynamically populate this later from unique sources */}
          <option value="UN Human Rights">UN Human Rights</option>
          <option value="Justice Today">Justice Today</option>
        </Select>
        <Button variant="outline" className="flex items-center gap-2"><Filter className="h-4 w-4" />Chuja Zaidi</Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            filteredNews.length > 0 ? filteredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-slate-500">{item.source || 'Unknown Source'}</span>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(item.published_date).toLocaleDateString()}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{item.content}</p>
                  {item.read_more_link && (
                    <a href={item.read_more_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 inline-flex items-center">
                      Soma Zaidi <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No news articles found.</p>
          )}
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Habari Kuu</CardTitle></CardHeader><CardContent><div className="space-y-2">{['Police Reform', 'Body Cameras', 'Community Oversight'].map((topic, i) => (<Button key={i} variant="ghost" className="justify-start w-full text-left p-2">#{topic}</Button>))}</div></CardContent></Card>
        </div>
      </div>
    </div>
  );
};