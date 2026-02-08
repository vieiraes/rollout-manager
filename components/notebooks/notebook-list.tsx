'use client';

import { useState, useEffect, useCallback } from 'react';
import { NotebookCard } from './notebook-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface Notebook {
  id: number;
  serviceTag: string;
  hostname: string | null;
  brand: string;
  model: string;
  notebookType: string;
  ramConfig: string;
  status: string;
  place: {
    id: number;
    name: string;
  } | null;
  updatedAt: string;
}

interface NotebooksResponse {
  data: Notebook[];
  total: number;
  page: number;
  limit: number;
}

export function NotebookList() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotebooks = useCallback(async (pageNum: number, append = false) => {
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const res = await fetch(`/api/notebooks?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch notebooks');

      const data: NotebooksResponse = await res.json();
      
      if (append) {
        setNotebooks(prev => [...prev, ...data.data]);
      } else {
        setNotebooks(data.data);
      }
      
      setHasMore(data.data.length === data.limit);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchNotebooks(1, false);
  }, [searchTerm, fetchNotebooks]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotebooks(nextPage, true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNotebooks(1, false);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when scrolled to 80% of the content
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMore && !loading) {
      handleLoadMore();
    }
  }, [hasMore, loading]);

  if (loading && notebooks.length === 0) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por service tag, hostname..."
            className="pl-10 min-h-[44px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="min-h-[44px]"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="px-4 py-2 text-center text-sm text-muted-foreground">
          Atualizando...
        </div>
      )}

      {/* List */}
      <div 
        className="flex-1 overflow-auto px-4 py-3 space-y-3" 
        onScroll={handleScroll}
      >
        {notebooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum notebook encontrado</p>
          </div>
        ) : (
          <>
            {notebooks.map((notebook) => (
              <NotebookCard key={notebook.id} notebook={notebook} />
            ))}
            
            {loading && (
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
            )}
            
            {!hasMore && notebooks.length > 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Todos os notebooks foram carregados
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
