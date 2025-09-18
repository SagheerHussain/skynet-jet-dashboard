import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { updateReview, getReviewById } from '../../api/review.api';
import { useParams } from 'react-router-dom';

const tf = { variant: 'outlined', InputLabelProps: { shrink: true } };

export default function EditReview() {
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [review, setReview] = useState({});

  const navigate = useNavigate();

  const { id } = useParams();

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

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await getReviewById(id);
        if (response?.success) {
          setReview(response.data);
          reset(response.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchReview();
  }, [id]);

  const onSubmit = async (values) => {
    setUploading(true);
    try {
      const response = await updateReview(id, values);
      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Review updated successfully' });
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
                defaultValue={review.name}
                required
                {...register('name', { required: true })}
                error={!!errors.name}
                helperText={errors.name ? 'Required' : ''}
                {...tf}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                fullWidth
                defaultValue={review.location}
                required
                {...register('location', { required: true })}
                error={!!errors.location}
                helperText={errors.location ? 'Required' : ''}
                {...tf}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Review"
                defaultValue={review.review}
                fullWidth
                required
                {...register('review', { required: true })}
                error={!!errors.review}
                helperText={errors.review ? 'Required' : ''}
                {...tf}
              />
            </Grid>
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Update Review
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