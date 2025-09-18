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
import { createReview } from '../../api/review.api';


export default function AddReview() {
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
      name: '',
      location: '',
      review: '',
    }
  });

  const onSubmit = async (values) => {
    setUploading(true);
    try {
      const response = await createReview(values);
      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Review created successfully' });
        reset();
        navigate('/testimonials');
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
          Create Review
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic fields */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                required
                {...register('name', { required: true })}
                error={!!errors.name}
                helperText={errors.name ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                fullWidth
                required
                {...register('location', { required: true })}
                error={!!errors.location}
                helperText={errors.location ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Review"
                fullWidth
                required
                {...register('review', { required: true })}
                error={!!errors.review}
                helperText={errors.review ? 'Required' : ''}
              />
            </Grid>
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Create Review
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