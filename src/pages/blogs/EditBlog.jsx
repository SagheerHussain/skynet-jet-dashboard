import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Box, Grid, TextField, MenuItem, Button, Typography, LinearProgress, Snackbar, Alert, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { getBlogById, updateBlog } from '../../api/blog.api';
import { getAuthorsLists } from '../../api/author.api';
import { getBlogCategories } from '../../api/blogCategory.api';

const tf = { variant: 'outlined', InputLabelProps: { shrink: true } };

export default function EditBlog() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const initialValuesRef = useRef(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      author: '',
      description: ''
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

  useEffect(() => {
    async function bootstrap() {
      try {
        setLoading(true);
        const [aRes, cRes, bRes] = await Promise.all([getAuthorsLists(), getBlogCategories(), getBlogById(id)]);

        if (aRes?.success) setAuthors(aRes.data || []);
        if (cRes?.success) setCategories(cRes.data || []);

        if (!bRes?.success) throw new Error(bRes?.message || 'Failed to load blog');
        const b = bRes.data;

        const values = {
          title: b?.title || '',
          category: b?.category?._id ? String(b.category._id) : b?.category ? String(b.category) : '',
          author: b?.author?._id ? String(b.author._id) : b?.author ? String(b.author) : '',
          description: b?.description || ''
        };
        initialValuesRef.current = { ...values, coverImage: b?.coverImage || '' };

        reset(values);
        setCoverPreview(b?.coverImage || '');
      } catch (e) {
        setSnack({ open: true, severity: 'error', msg: e.message });
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [id, reset]);

  const onPickCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview(initialValuesRef.current?.coverImage || '');
  };

  const onSubmit = async (values) => {
    try {
      setUploading(true);
      console.log("values= ==== ", values);
      const fd = new FormData();
      fd.append('title', values.title);
      fd.append('category', values.category); // string id
      fd.append('author', values.author); // string id
      fd.append('description', values.description);

      // Match your multer field name
      if (coverFile) fd.append('coverImage', coverFile);

      const response = await updateBlog(id, fd);

      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Blog updated successfully' });
        navigate('/blogs');
      } else {
        throw new Error(response?.message || 'Failed to update blog');
      }
    } catch (e) {
      setSnack({ open: true, severity: 'error', msg: e.message });
    } finally {
      setUploading(false);
    }
  };

  const handleResetToLoaded = () => {
    if (!initialValuesRef.current) return;
    const { coverImage, ...vals } = initialValuesRef.current;
    reset(vals);
    setCoverFile(null);
    setCoverPreview(coverImage || '');
  };

  return (
    <Box className="min-h-screen text-[#111218]">
      {(loading || uploading) && <LinearProgress className="mb-4" />}

      <div className="border rounded-2xl p-6 mx-auto">
        <Typography variant="h5" className="mb-6 font-bold">
          Edit Blog
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
                {...tf}
              />
            </Grid>

            {/* Category (Controller) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    required
                    {...tf}
                    value={field.value ?? ''} // <-- controlled
                    onChange={(e) => field.onChange(e.target.value)}
                    error={!!errors.category}
                    helperText={errors.category ? 'Required' : ''}
                  >
                    {categories.map((opt) => (
                      <MenuItem key={opt?._id || opt?.slug} value={String(opt?._id)}>
                        {opt?.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Author (Controller) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="author"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    select
                    label="Author"
                    fullWidth
                    required
                    {...tf}
                    value={field.value ?? ''} // <-- controlled
                    onChange={(e) => field.onChange(e.target.value)}
                    error={!!errors.author}
                    helperText={errors.author ? 'Required' : ''}
                  >
                    {authors.map((opt) => (
                      <MenuItem key={opt?._id || opt?.name} value={String(opt?._id)}>
                        {opt?.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Cover Image */}
            <Grid item xs={12}>
              <div className="flex items-center gap-3">
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Change Cover Image
                  <input hidden accept="image/*" type="file" onChange={onPickCover} />
                </Button>
                {coverPreview && (
                  <Button variant="text" color="error" startIcon={<DeleteOutlineIcon />} onClick={clearCover}>
                    Revert to Original
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="mb-2 font-semibold">
                Description
              </Typography>
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ReactQuill
                    className="w-full min-h-[200px]"
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={quillModules}
                  />
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
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading || loading}>
              Update Blog
            </Button>
            <Button type="button" variant="outlined" onClick={handleResetToLoaded} disabled={loading}>
              Reset to Loaded
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
