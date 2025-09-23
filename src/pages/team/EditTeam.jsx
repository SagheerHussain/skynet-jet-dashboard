// src/pages/team/EditTeam.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Grid, TextField, Button, Typography, LinearProgress, Snackbar, Alert, Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTeam, getTeamById } from '../../api/team.api';

// ── React Quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const tf = { variant: 'outlined', InputLabelProps: { shrink: true } };

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'blockquote', 'code-block',
  'link', 'image',
];

export default function EditTeam() {
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  // Separate states for each image
  const [image, setImage] = useState(null);                  // profile picture file
  const [previewUrl, setPreviewUrl] = useState('');          // profile picture preview
  const [detailImage, setDetailImage] = useState(null);      // team member picture file
  const [detailPreviewUrl, setDetailPreviewUrl] = useState(''); // team member preview

  const [team, setTeam] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      designation: '',
      phone: '',
      email: '',
      address: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getTeamById(id);
        if (res?.success && res.data) {
          const t = res.data;
          setTeam(t);

          reset({
            name: t.name || '',
            description: t.description || '',
            designation: t.designation || '',
            phone: t.phone || '',
            email: t.email || '',
            address: t.address || '',
            facebook: t.facebook || '',
            instagram: t.instagram || '',
            linkedin: t.linkedin || '',
            youtube: t.youtube || '',
          });

          // Show existing images
          if (t.profile_picture) setPreviewUrl(t.profile_picture);
          if (t.team_member_picture) setDetailPreviewUrl(t.team_member_picture);
        }
      } catch (e) {
        setSnack({ open: true, severity: 'error', msg: 'Failed to load member' });
      }
    })();
  }, [id, reset]);

  // cleanup blob urls
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (detailPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(detailPreviewUrl);
    };
  }, [previewUrl, detailPreviewUrl]);

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  // ❌ Old: one handler setting both images
  // ✅ New: two dedicated handlers

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setSnack({ open: true, severity: 'error', msg: 'Please select a PNG/JPEG/WEBP/GIF image.' });
      e.target.value = '';
      return;
    }
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = ''; // allow re-selecting same file
  };

  const handleTeamMemberImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setSnack({ open: true, severity: 'error', msg: 'Please select a PNG/JPEG/WEBP/GIF image.' });
      e.target.value = '';
      return;
    }
    if (detailPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(detailPreviewUrl);
    setDetailImage(file);
    setDetailPreviewUrl(URL.createObjectURL(file));
    e.target.value = ''; // allow re-selecting same file
  };

  const onSubmit = async (values) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v ?? ''));

      // Append only what changed
      if (image) formData.append('profile_picture', image, image.name);
      if (detailImage) formData.append('team_member_picture', detailImage, detailImage.name);

      const res = await updateTeam(id, formData);

      if (res?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Team member updated successfully' });
        navigate('/teams');
      } else {
        setSnack({ open: true, severity: 'error', msg: res?.message || 'Update failed' });
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
        <Typography variant="h5" className="mb-6 font-bold">Update Team Member</Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message || ''}
                {...tf}
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
                {...tf}
              />
            </Grid>

            {/* React Quill (HTML) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Short Bio / Description <span style={{ color: '#d32f2f' }}>*</span>
              </Typography>

              <Controller
                name="description"
                control={control}
                rules={{
                  validate: (v) => {
                    const clean = (v || '').replace(/<(.|\n)*?>/g, '').trim();
                    return clean.length > 0 || 'Description is required';
                  },
                }}
                render={({ field }) => (
                  <>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write a short bio..."
                      style={{ background: '#fff', borderRadius: 8 }}
                    />
                    {errors.description && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.description.message}
                      </Typography>
                    )}
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
                  pattern: { value: /^[0-9+()\-\s]{7,20}$/, message: 'Enter a valid phone' },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message || ''}
                {...tf}
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
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                error={!!errors.email}
                helperText={errors.email?.message || ''}
                {...tf}
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
                {...tf}
              />
            </Grid>

            {/* Socials */}
            <Grid item xs={12} md={6}><TextField label="Facebook (URL)" fullWidth {...register('facebook')} {...tf} /></Grid>
            <Grid item xs={12} md={6}><TextField label="Instagram (URL)" fullWidth {...register('instagram')} {...tf} /></Grid>
            <Grid item xs={12} md={6}><TextField label="LinkedIn (URL)" fullWidth {...register('linkedin')} {...tf} /></Grid>
            <Grid item xs={12} md={6}><TextField label="YouTube (URL)" fullWidth {...register('youtube')} {...tf} /></Grid>

            {/* Profile picture upload + preview */}
            <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth sx={{ mb: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  name="profile_picture"
                  hidden
                  onChange={handleProfileImageChange}
                />
                {image ? 'Change Profile Picture' : 'Upload / Replace Profile Picture'}
              </Button>

              {previewUrl && (
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }}
                  />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {image?.name || 'Current image'}
                    </Typography>
                    {image && (
                      <Typography variant="body2" color="text.secondary">
                        {(image.size / 1024).toFixed(1)} KB
                      </Typography>
                    )}
                  </div>
                </Paper>
              )}
            </Grid>

            {/* Team member picture upload + preview */}
            <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth sx={{ mb: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  name="team_member_picture"
                  hidden
                  onChange={handleTeamMemberImageChange}
                />
                {detailImage ? 'Change Team Member Picture' : 'Upload / Replace Team Member Picture'}
              </Button>

              {detailPreviewUrl && (
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <img
                    src={detailPreviewUrl}
                    alt="Team Member Preview"
                    style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }}
                  />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {detailImage?.name || 'Current image'}
                    </Typography>
                    {detailImage && (
                      <Typography variant="body2" color="text.secondary">
                        {(detailImage.size / 1024).toFixed(1)} KB
                      </Typography>
                    )}
                  </div>
                </Paper>
              )}
            </Grid>
          </Grid>

          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Update Member
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
                if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                if (detailPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(detailPreviewUrl);
                setPreviewUrl(team?.profile_picture || '');
                setDetailPreviewUrl(team?.team_member_picture || '');
                setImage(null);
                setDetailImage(null);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
