import React, { useMemo, useState, useEffect } from 'react';
import { Box, Grid, TextField, MenuItem, Button, Typography, LinearProgress, Snackbar, Alert, Paper, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { createBlog } from '../../api/blog.api';
import { getAuthorsLists } from '../../api/author.api';
import { getBlogCategories } from '../../api/blogCategory.api';

export default function AddBlog() {
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await getAuthorsLists();
        if (response?.success) {
          setAuthors(response?.data);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await getBlogCategories();
        if (response?.success) {
          console.log('categories= ==== >', response?.data);
          setCategories(response?.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchAuthors();
    fetchCategories();
  }, []);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      author: '',
      description: '' // HTML string
    }
  });

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'blockquote', 'code-block'],
        [{ color: [] }, { background: [] }],
        ['clean']
      ]
    }),
    []
  );

  const onPickCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview('');
  };

  const onSubmit = async (values) => {
    try {
      setUploading(true);

      console.log('values= ==== ', values);

      // Build multipart/form-data
      const fd = new FormData();
      fd.append('title', values.title);
      fd.append('category', values.category);
      fd.append('author', values.author);
      fd.append('description', values.description); // HTML string
      if (coverFile) fd.append('coverImage', coverFile); // backend expects req.file

      const response = await createBlog(fd);

      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Blog created successfully' });
        // Cleanup
        reset();
        clearCover();
        navigate('/blogs');
      } else {
        throw new Error(response?.message || 'Failed to create blog');
      }
    } catch (e) {
      setSnack({ open: true, severity: 'error', msg: e.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="min-h-screen text-[#111218]">
      {uploading && <LinearProgress className="mb-4" />}

      <div className="border rounded-2xl p-6 mx-auto">
        <Typography variant="h5" className="mb-6 font-bold">
          Create Blog
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                required
                {...register('title', { required: true })}
                error={!!errors.title}
                helperText={errors.title ? 'Required' : ''}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Category"
                fullWidth
                required
                defaultValue=""
                {...register('category', { required: true })}
                error={!!errors.category}
                helperText={errors.category ? 'Required' : ''}
              >
                {categories?.map((opt) => (
                  <MenuItem key={opt.slug} value={opt._id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Author */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Author"
                fullWidth
                required
                defaultValue=""
                {...register('author', { required: true })}
                error={!!errors.author}
                helperText={errors.author ? 'Required' : ''}
              >
                {authors?.map((opt) => (
                  <MenuItem key={opt.name} value={opt._id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Cover Image */}
            <Grid item xs={12}>
              <div className="flex items-center gap-3">
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Upload Cover Image
                  <input hidden accept="image/*" type="file" onChange={onPickCover} />
                </Button>
                {coverFile && (
                  <Button variant="text" color="error" startIcon={<DeleteOutlineIcon />} onClick={clearCover}>
                    Remove
                  </Button>
                )}
              </div>
              {coverPreview && (
                <Paper variant="outlined" className="mt-3 p-3">
                  <img src={coverPreview} alt="Cover preview" style={{ maxHeight: 220, width: 'auto', borderRadius: 12 }} />
                </Paper>
              )}
            </Grid>

            {/* Description (React Quill) */}
            <Grid item xs={12} sx={{ mb: 6 }}>
              <Typography variant="subtitle2" className="mb-2 font-semibold">
                Description
              </Typography>
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ReactQuill className="w-full" style={{ height: 200 }} theme="snow" value={field.value} onChange={field.onChange} modules={quillModules} />
                )}
              />
              {errors.description && (
                <Typography variant="caption" color="error">
                  Required
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Create Blog
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
                clearCover();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
