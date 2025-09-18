import React, { useEffect, useMemo, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { createAircraftCategory, getAircraftCategoryById, updateAircraftCategory } from '../../api/aircraftCategory.api';

export default function EditJetCategory() {
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [name, setName] = useState("");

  const {id} = useParams();

  useEffect(() => {
    (async () => {
        const response = await getAircraftCategoryById(id);
        if (response?.success) {
            setValue('name', response.data.name);
        }
    })()
  }, [])

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
    console.log(values);
    setUploading(true);
    try {
      const response = await updateAircraftCategory(id, values);
      if (response?.success) {
        setSnack({ open: true, severity: 'success', msg: 'Aircraft Category updated successfully' });
        reset();
        navigate('/jets-categories');
      }
    } catch (e) {
      setSnack({ open: true, severity: 'error', msg: e.message });
    } finally {
      setUploading(false);
    }
  };

  const tf = { variant: 'outlined', InputLabelProps: { shrink: true } };

  return (
    <Box className="min-h-screen text-[#111218]">
      {uploading && <LinearProgress className="mb-4" />}

      <div className="border rounded-2xl p-6 mx-auto">
        <Typography variant="h5" className="mb-6 font-bold">
          Edit Aircraft Category
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic fields */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                defaultValue={name}
                onChange={(e) => setValue('name', e.target.value)}
                {...register('name', { required: true })}
                {...tf}
              />
            </Grid> 
          </Grid>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Edit Aircraft Category
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