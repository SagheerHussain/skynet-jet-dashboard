// src/pages/team/AddTeam.jsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Typography, LinearProgress, Snackbar, Alert, Paper, FormHelperText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../../api/team.api';

// React Quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddTeam() {
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [image, setImage] = useState(null);
  const [detailImage, setDetailImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [detailPreviewUrl, setDetailPreviewUrl] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '', // will store HTML from Quill
      designation: '',
      phone: '',
      email: '',
      address: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });

  // Quill toolbar/modules
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean']
    ]
  };
  const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'link'];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setSnack({ open: true, severity: 'error', msg: 'Please select a PNG/JPEG/JPG/WEBP/GIF image.' });
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));

    if (detailPreviewUrl) URL.revokeObjectURL(detailPreviewUrl);
    setDetailImage(file);
    setDetailPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    if (!image) {
      setSnack({ open: true, severity: 'error', msg: 'Profile picture is required' });
      return;
    }

    // Optional: Basic guard so empty <p><br></p> doesn't pass
    const descPlain = values.description.replace(/<[^>]+>/g, '').trim();
    if (!descPlain) {
      setSnack({ open: true, severity: 'error', msg: 'Description is required' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      formData.append('profile_picture', image, image.name);
      formData.append('team_member_picture', detailImage, detailImage.name);

      const response = await createTeam(formData);
      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Team member created successfully' });
        reset();
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        setImage(null);
        navigate('/teams');
      } else {
        setSnack({
          open: true,
          severity: 'error',
          msg: response?.message || 'Failed to create team member'
        });
      }
    } catch (e) {
      setSnack({ open: true, severity: 'error', msg: e?.message || 'Something went wrong' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="min-h-screen text-[#111218]">
      {uploading && <LinearProgress className="mb-4" />}

      <div className="border rounded-2xl p-6 mx-auto">
        <Typography variant="h5" className="mb-6 font-bold">
          Add Team Member
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Grid container spacing={2}>
            {/* Required fields */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                fullWidth
                required
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Designation"
                fullWidth
                required
                {...register('designation', { required: 'Designation is required' })}
                error={!!errors.designation}
                helperText={errors.designation?.message || ''}
              />
            </Grid>

            {/* React Quill Description */}
            <Grid item xs={12} sx={{ mb: 6 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Short Bio / Description <span style={{ color: '#d32f2f' }}>*</span>
              </Typography>
              <Controller
                name="description"
                control={control}
                rules={{
                  validate: (val) => {
                    const plain = (val || '').replace(/<[^>]+>/g, '').trim();
                    return plain.length > 0 || 'Description is required';
                  }
                }}
                render={({ field }) => (
                  <>
                    <div>
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write a concise bio…"
                        style={{ height: 200 }}
                      />
                    </div>
                    {errors.description && <FormHelperText error>{errors.description.message}</FormHelperText>}
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                placeholder="+92xxxxxxxxxx"
                fullWidth
                required
                {...register('phone', {
                  required: 'Phone is required',
                  pattern: { value: /^[0-9+()\-\s]{7,20}$/, message: 'Enter a valid phone' }
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                })}
                error={!!errors.email}
                helperText={errors.email?.message || ''}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                required
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message || ''}
              />
            </Grid>

            {/* Socials (optional) */}
            <Grid item xs={12} md={6}>
              <TextField label="Facebook (URL)" fullWidth {...register('facebook')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Instagram (URL)" fullWidth {...register('instagram')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="LinkedIn (URL)" fullWidth {...register('linkedin')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="YouTube (URL)" fullWidth {...register('youtube')} />
            </Grid>

            {/* Upload + Preview */}
            <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth sx={{ mb: 2 }}>
                <input type="file" accept="image/*" name="profile_picture" hidden onChange={handleImageChange} />
                {image ? 'Change Image' : 'Upload Profile Picture'}
              </Button>

              {previewUrl && (
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: 'cover',
                      borderRadius: 12
                    }}
                  />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {image?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(image?.size / 1024).toFixed(1)} KB
                    </Typography>
                  </div>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth sx={{ mb: 2 }}>
                <input type="file" accept="image/*" name="team_member_picture" hidden onChange={handleImageChange} />
                {detailImage ? 'Change Image' : 'Upload Team Member Picture'}
              </Button>

              {detailPreviewUrl && (
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <img
                    src={detailPreviewUrl}
                    alt="Preview"
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: 'cover',
                      borderRadius: 12
                    }}
                  />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {detailImage?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(detailImage?.size / 1024).toFixed(1)} KB
                    </Typography>
                  </div>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Create Member
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
                setDetailPreviewUrl('');
                setImage(null);
                setDetailImage(null);
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
