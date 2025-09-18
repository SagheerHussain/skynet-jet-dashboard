import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Tabs,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { createContact } from '../../api/contact.api';


export default function AddContact() {
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      address: '',
      phone: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    }
  });

  const onSubmit = async (values) => {
    setUploading(true);
    try {
      const response = await createContact(values);
      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Contact created successfully' });
        reset();
        navigate('/contact');
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
          Create Contact
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic fields */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                required
                {...register('email', { required: true })}
                error={!!errors.email}
                helperText={errors.email ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                required
                {...register('address', { required: true })}
                error={!!errors.address}
                helperText={errors.address ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                fullWidth
                required
                {...register('phone', { required: true })}
                error={!!errors.phone}
                helperText={errors.phone ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Facebook"
                fullWidth
                required
                {...register('facebook', { required: true })}
                error={!!errors.facebook}
                helperText={errors.facebook ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Instagram"
                fullWidth
                required
                {...register('instagram', { required: true })}
                error={!!errors.instagram}
                helperText={errors.instagram ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="LinkedIn"
                fullWidth
                required
                {...register('linkedin', { required: true })}
                error={!!errors.linkedin}
                helperText={errors.linkedin ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Youtube"
                fullWidth
                required
                {...register('youtube', { required: true })}
                error={!!errors.youtube}
                helperText={errors.youtube ? 'Required' : ''}
              />
            </Grid>
            
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Create Contact
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
                setImages([]);
                SECTION_KEYS.forEach((k) => setValue(`sections.${k}`, ''));
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