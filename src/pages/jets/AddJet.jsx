import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { getAircraftCategories } from '../../api/aircraftCategory.api';

const STATUS = [
  { name: 'For Sale', slug: 'for-sale' },
  { name: 'Sold', slug: 'sold' },
  { name: 'Wanted', slug: 'wanted' },
  { name: 'Coming Soon', slug: 'coming-soon' },
  { name: 'Sale Pending', slug: 'sale-pending' },
  { name: 'Off Market', slug: 'off-market' },
  { name: 'Acquired', slug: 'acquired' }
];

const SECTION_KEYS = ['airframe', 'engine', 'propeller', 'avionics', 'equipment', 'interior', 'exterior', 'inspection'];

const SECTION_LABELS = {
  airframe: 'Airframe',
  engine: 'Engine',
  propeller: 'Propeller',
  avionics: 'Avionics',
  equipment: 'Equipments',
  interior: 'Interior',
  exterior: 'Exterior',
  inspection: 'Inspection'
};

export default function AddJet() {
  const [activeTab, setActiveTab] = useState('airframe');
  const [images, setImages] = useState([]); // File[]
  const [featuredImage, setFeaturedImage] = useState(null); // File | null
  const featuredInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAircraftCategories();
        if (response?.success) {
          setCategories(response?.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchCategories();
  }, []);

  const defaultSectionState = useMemo(() => {
    const m = {};
    SECTION_KEYS.forEach((k) => (m[k] = ''));
    return m;
  }, []);

  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      year: '',
      price: '',
      status: 'for-sale',
      category: '',
      location: '',
      airframe: '',
      engine: '',
      engineTwo: '',
      propeller: '',
      propellerTwo: '',
      agentName: '',
      agentEmail: '',
      agentPhone: '',
      sections: defaultSectionState,
      overview: '',
      index: ''
    }
  });

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };
  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  // NEW: featured image handlers
  const onFeaturedChange = (e) => {
    const file = (e.target.files && e.target.files[0]) || null;
    setFeaturedImage(file || null);
  };
  const removeFeatured = () => {
    setFeaturedImage(null);
    if (featuredInputRef.current) featuredInputRef.current.value = '';
  };

  const onSubmit = async (values) => {
    try {
      setUploading(true);

      const description = {
        version: 1,
        sections: Object.fromEntries(
          SECTION_KEYS.map((k) => [k, { html: values.sections[k] || '' }])
        )
      };

      const contactAgent = {
        name: values.agentName || '',
        email: values.agentEmail || '',
        phone: values.agentPhone || ''
      };

      const fd = new FormData();
      fd.append('title', values.title);
      fd.append('year', String(values.year || ''));
      fd.append('price', String(values.price || ''));
      fd.append('status', values.status);
      fd.append('category', values.category);
      fd.append('location', values.location);
      fd.append('latitude', String(values.latitude || ''));
      fd.append('longitude', String(values.longitude || ''));
      if (values.airframe) fd.append('airframe', String(values.airframe));
      if (values.engine) fd.append('engine', String(values.engine));
      if (values.engineTwo) fd.append('engineTwo', String(values.engineTwo));
      if (values.propeller) fd.append('propeller', String(values.propeller));
      if (values.propellerTwo) fd.append('propellerTwo', String(values.propellerTwo));
      fd.append('contactAgent', JSON.stringify(contactAgent));
      fd.append('description', JSON.stringify(description));
      fd.append('overview', values.overview);
      fd.append('index', String(values.index || ''));

      // gallery images
      images.forEach((f) => fd.append('images', f));

      // NEW: featured image (single)
      if (featuredImage) {
        fd.append('featuredImage', featuredImage);
      }

      if (values.index == null || values.index < 1) {
        setSnack({ open: true, severity: 'error', msg: 'List Index must be greater than 0' });
        return;
      }

      const resp = await fetch('https://skynet-jet-dashboard-server.onrender.com/api/aircrafts', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd
      });

      const data = await resp.json();
      if (!resp.ok || data?.success === false) {
        throw new Error(data?.message || 'Upload failed');
      }

      setSnack({ open: true, severity: 'success', msg: 'Aircraft created successfully' });
      reset();
      setImages([]);
      removeFeatured();
      SECTION_KEYS.forEach((k) => setValue(`sections.${k}`, ''));
      navigate('/jets');
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
          Create Aircraft
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Title"
                fullWidth
                required
                {...register('title', { required: true })}
                error={!!errors.title}
                helperText={errors.title ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Status" fullWidth {...register('status')}>
                {STATUS?.map((s) => (
                  <MenuItem key={s.slug} value={s.slug}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Year" fullWidth {...register('year')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Price" fullWidth required {...register('price', { required: true })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Categories" fullWidth {...register('category')}>
                {categories?.map((s) => (
                  <MenuItem key={s?._id} value={s?._id}>
                    {s?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Location" fullWidth required {...register('location', { required: true })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Latitude" fullWidth required {...register('latitude', { required: true })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Longitude"  fullWidth required {...register('longitude', { required: true })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Airframe" type="number" fullWidth {...register('airframe')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Engine One" type="number" fullWidth {...register('engine')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Engine Two" type="number" fullWidth {...register('engineTwo')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Propeller" type="number" fullWidth {...register('propeller')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Propeller Two" type="number" fullWidth {...register('propellerTwo')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="List Index" type="number" fullWidth {...register('index', { required: true })} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" className="mb-3 font-semibold">
                Jet Overview
              </Typography>
              <Controller
                control={control}
                name={`overview`}
                render={({ field }) => (
                  <ReactQuill theme="snow" value={field.value || ''} onChange={field.onChange} placeholder={`Write Overview here...`} />
                )}
              />
            </Grid>
          </Grid>

          {/* Contact Agent */}
          <div className="rounded-xl">
            <Typography variant="subtitle1" className="mb-3 font-semibold">
              Contact Agent
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField label="Name" fullWidth {...register('agentName', { required: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Email" type="email" fullWidth {...register('agentEmail', { required: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Phone" fullWidth {...register('agentPhone', { required: true })} />
              </Grid>
            </Grid>
          </div>

          {/* Description Editors (tabs) */}
          <div>
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Description
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              className="rounded-lg"
            >
              {SECTION_KEYS.map((k) => (
                <Tab key={k} value={k} label={SECTION_LABELS[k]} />
              ))}
            </Tabs>

            <Box className="mt-4">
              {SECTION_KEYS.map((k) => (
                <div key={k} hidden={activeTab !== k}>
                  <Controller
                    control={control}
                    name={`sections.${k}`}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder={`Write ${SECTION_LABELS[k]} details here...`}
                      />
                    )}
                  />
                </div>
              ))}
            </Box>
          </div>

          <Grid item xs={12}>
            <Typography variant="subtitle1" className="mb-4 font-semibold">
              Video URL
            </Typography>
            <TextField label="Video URL" type="text" fullWidth {...register('videoUrl')} />
          </Grid>

          {/* Featured Image (NEW) */}
          <div>
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Featured Image
            </Typography>
            <div className="flex items-center gap-3">
              <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                Select Featured
                <input
                  ref={featuredInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={onFeaturedChange}
                />
              </Button>
              <Chip label={featuredImage ? '1 selected' : '0 selected'} />
            </div>

            {featuredImage && (
              <Grid container spacing={2} className="mt-2">
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Paper className="relative border border-zinc-800 rounded-xl overflow-hidden">
                    <img
                      src={URL.createObjectURL(featuredImage)}
                      alt={featuredImage.name}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <Box className="absolute top-1 right-1 bg-black group hover:bg-[#111218] rounded-md">
                      <IconButton size="small" onClick={removeFeatured}>
                        <DeleteIcon fontSize="small" className="text-red-600 group-hover:text-red-800" />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" className="block p-2 truncate">
                      {featuredImage.name}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </div>

          {/* Gallery Images */}
          <div>
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Gallery Images
            </Typography>
            <div className="flex items-center gap-3">
              <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                Select Images
                <input hidden accept="image/*" type="file" multiple onChange={onImagesChange} />
              </Button>
              <Chip label={`${images.length} selected`} />
            </div>

            {images.length > 0 && (
              <Grid container spacing={2} className="mt-2">
                {images.map((f, idx) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
                    <Paper className="relative border border-zinc-800 rounded-xl overflow-hidden">
                      <img src={URL.createObjectURL(f)} alt={f.name} style={{ maxWidth: '100%' }} />
                      <Box className="absolute top-1 right-1 bg-black group hover:bg-[#111218] rounded-md">
                        <IconButton size="small" onClick={() => removeImage(idx)}>
                          <DeleteIcon fontSize="small" className="text-red-600 group-hover:text-red-800" />
                        </IconButton>
                      </Box>
                      <Typography variant="caption" className="block p-2 truncate">
                        {f.name}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
              Create Aircraft
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
                setImages([]);
                removeFeatured();
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
