import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Button, TextField, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

type Page = {
  id: bigint;
  title: string;
  content: string;
};

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (quill && selectedPage) {
      quill.root.innerHTML = selectedPage.content;
    }
  }, [quill, selectedPage]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const result = await backend.getPages();
      setPages(result.map(page => ({ ...page, id: BigInt(page.id) })));
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
    setLoading(false);
  };

  const createPage = async () => {
    try {
      const id = await backend.createPage('New Page');
      fetchPages();
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const updatePage = async () => {
    if (selectedPage && quill) {
      try {
        await backend.updatePage(selectedPage.id, selectedPage.title, quill.root.innerHTML);
        fetchPages();
      } catch (error) {
        console.error('Error updating page:', error);
      }
    }
  };

  const deletePage = async (id: bigint) => {
    try {
      await backend.deletePage(id);
      fetchPages();
      if (selectedPage && selectedPage.id === id) {
        setSelectedPage(null);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="sidebar p-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createPage}
          className="mb-4 w-full"
        >
          New Page
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {pages.map((page) => (
              <ListItem
                key={page.id.toString()}
                button
                onClick={() => setSelectedPage(page)}
                selected={selectedPage?.id === page.id}
              >
                <ListItemText primary={page.title} />
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <div className="content">
        <div className="header-image"></div>
        {selectedPage ? (
          <>
            <TextField
              value={selectedPage.title}
              onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
              variant="standard"
              fullWidth
              className="mb-4"
            />
            <div ref={quillRef} className="h-64 mb-4" />
            <Button variant="contained" onClick={updatePage}>Save</Button>
            <Button variant="outlined" onClick={() => deletePage(selectedPage.id)} className="ml-2">Delete</Button>
          </>
        ) : (
          <p>Select a page or create a new one</p>
        )}
      </div>
    </div>
  );
};

export default App;
