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
import { createAircraftCategory } from '../../api/aircraftCategory.api';


export default function AddAircraftCategory() {
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
      name: ''
    }
  });

  const onSubmit = async (values) => {
    setUploading(true);
    try {
      const response = await createAircraftCategory(values);
      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Aircraft Category created successfully' });
        reset();
        navigate('/jets-categories');
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
          Create Aircraft Category
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
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Create Aircraft Category
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
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