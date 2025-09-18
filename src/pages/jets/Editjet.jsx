// import React, { useMemo, useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Paper,
//   TextField,
//   MenuItem,
//   Button,
//   Typography,
//   Tabs,
//   Tab,
//   Chip,
//   IconButton,
//   LinearProgress,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
// import { Controller, useForm } from 'react-hook-form';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import SendIcon from '@mui/icons-material/Send';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { getAircraftCategories } from '../../api/aircraftCategory.api';

// const API_READ_BASE = 'http://localhost:5000/api/aircrafts'; // GET detail
// const API_WRITE_BASE = `http://localhost:5000/api/aircrafts`; // PUT update

// const STATUS = ['for-sale', 'sold', 'wanted', 'coming-soon', 'sale-pending', 'off-market', 'acquired'];
// const SECTION_KEYS = ['airframe', 'engine', 'propeller', 'avionics', 'equipment', 'interior', 'exterior', 'inspection'];
// const SECTION_LABELS = {
//   airframe: 'Airframe',
//   engine: 'Engine',
//   propeller: 'Propeller',
//   avionics: 'Avionics',
//   equipment: 'Equipments',
//   interior: 'Interior',
//   exterior: 'Exterior',
//   inspection: 'Inspection'
// };

// // helpers
// const safeSecHtml = (doc, key) => String(doc?.description?.sections?.[key]?.html ?? '');
// const docToFormDefaults = (doc = {}) => ({
//   title: doc.title ?? '',
//   year: doc.year ?? '',
//   price: doc.price ?? '',
//   status: doc.status ?? 'for-sale',
//   category: typeof doc.category === 'object' && doc.category?._id ? doc.category._id : (doc.category ?? ''),
//   location: doc.location ?? '',
//   airframe: doc.airframe ?? '',
//   engine: doc.engine ?? '',
//   propeller: doc.propeller ?? '',
//   agentName: doc.contactAgent?.name ?? '',
//   agentEmail: doc.contactAgent?.email ?? '',
//   agentPhone: doc.contactAgent?.phone ?? '',
//   videoUrl: doc.videoUrl ?? '',
//   overview: doc.overview ?? '',
//   sections: SECTION_KEYS.reduce((m, k) => {
//     m[k] = safeSecHtml(doc, k);
//     return m;
//   }, {})
// });

// // safe parse of server response
// async function parseBody(resp) {
//   const ct = resp.headers.get('content-type') || '';
//   if (ct.includes('application/json')) return await resp.json();
//   return await resp.text();
// }

// export default function EditJet() {
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState('airframe');
//   const [imagesLocal, setImagesLocal] = useState([]); // File[]
//   const [imagesExisting, setImagesExisting] = useState([]); // string[] (URLs in DB)
//   const [uploading, setUploading] = useState(false);
//   const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
//   const [categories, setCategories] = useState([]);

//   const defaultSectionState = useMemo(() => {
//     const m = {};
//     SECTION_KEYS.forEach((k) => (m[k] = ''));
//     return m;
//   }, []);

//   const {
//     control,
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       title: '',
//       year: '',
//       price: '',
//       status: 'for-sale',
//       category: '',
//       overview: '',
//       location: '',
//       airframe: '',
//       engine: '',
//       propeller: '',
//       agentName: '',
//       agentEmail: '',
//       videoUrl: '',
//       agentPhone: '',
//       sections: defaultSectionState
//     }
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getAircraftCategories();
//         if (response?.success) {
//           setCategories(response?.data);
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch detail + prefill
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const resp = await fetch(`${API_READ_BASE}/lists/${id}`);
//         const json = await resp.json();
//         if (!resp.ok || json?.success === false) throw new Error(json?.message || 'Failed to fetch aircraft');
//         const doc = json.data || {};
//         if (!alive) return;
//         reset(docToFormDefaults(doc));
//         setImagesExisting(Array.isArray(doc.images) ? doc.images : []);
//       } catch (e) {
//         if (alive) setSnack({ open: true, severity: 'error', msg: e.message });
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [id, reset]);

//   // navigate
//   const navigate = useNavigate();

//   // file selection
//   const onImagesChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setImagesLocal((prev) => [...prev, ...files]);
//   };
//   const removeLocalImage = (idx) => setImagesLocal((prev) => prev.filter((_, i) => i !== idx));
//   const removeExistingImage = (idx) => setImagesExisting((prev) => prev.filter((_, i) => i !== idx));

//   // Submit → UPDATE
//   const onSubmit = async (values) => {
//     try {
//       setUploading(true);

//       const description = {
//         version: 1,
//         sections: Object.fromEntries(SECTION_KEYS.map((k) => [k, { html: values.sections[k] || '' }]))
//       };
//       const contactAgent = {
//         name: values.agentName || '',
//         email: values.agentEmail || '',
//         phone: values.agentPhone || ''
//       };

//       const fd = new FormData();
//       fd.append('title', values.title);
//       fd.append('year', String(values.year || ''));
//       fd.append('price', String(values.price || ''));
//       fd.append('status', values.status);
//       fd.append('category', values.category);
//       fd.append('location', values.location);
//       fd.append('overview', values.overview);
//       fd.append('videoUrl', values.videoUrl);
//       if (values.airframe) fd.append('airframe', String(values.airframe));
//       if (values.engine) fd.append('engine', String(values.engine));
//       if (values.propeller) fd.append('propeller', String(values.propeller));
//       fd.append('contactAgent', JSON.stringify(contactAgent));
//       fd.append('description', JSON.stringify(description));
//       fd.append('keepImages', JSON.stringify(imagesExisting)); // preserve these
//       imagesLocal.forEach((f) => fd.append('images', f));

//       const resp = await fetch(`${API_WRITE_BASE}/update/${id}`, {
//         method: 'PUT',
//         headers: { Accept: 'application/json' }, // don't set Content-Type for FormData
//         body: fd
//       });

//       const body = await parseBody(resp);
//       if (!resp.ok) {
//         const msg = typeof body === 'string' ? body.slice(0, 300) : body?.message || JSON.stringify(body);
//         throw new Error(msg || `Request failed (${resp.status})`);
//       }

//       setSnack({ open: true, severity: 'success', msg: 'Aircraft updated successfully' });
//       // optional: after update, clear new files
//       setImagesLocal([]);
//       setTimeout(() => {
//         navigate('/jets');
//       }, 700);
//     } catch (e) {
//       setSnack({ open: true, severity: 'error', msg: e.message });
//     } finally {
//       setUploading(false);
//     }
//   };

//   // label overlap fix
//   const tf = { variant: 'outlined', InputLabelProps: { shrink: true } };

//   return (
//     <Box className="min-h-screen text-[#111218]">
//       {uploading && <LinearProgress className="mb-4" />}

//       <div className="border rounded-2xl p-6 mx-auto">
//         <Typography variant="h5" className="mb-6 font-bold">
//           Edit Aircraft
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//           {/* Basic fields */}
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={8}>
//               <TextField
//                 label="Title"
//                 fullWidth
//                 required
//                 {...tf}
//                 {...register('title', { required: true })}
//                 error={!!errors.title}
//                 helperText={errors.title ? 'Required' : ''}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField select label="Status" fullWidth defaultValue="for-sale" {...tf} {...register('status')}>
//                 {STATUS.map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <TextField label="Year" type="number" fullWidth {...tf} {...register('year')} />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <TextField label="Price" type="number" fullWidth required {...tf} {...register('price', { required: true })} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField select label="Categories" fullWidth {...register('category')}>
//                 {categories?.map((s) => (
//                   <MenuItem key={s?._id} value={s?._id}>
//                     {s?.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <TextField label="Location" fullWidth required {...tf} {...register('location', { required: true })} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField label="Airframe" type="number" fullWidth {...tf} {...register('airframe')} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField label="Engine" type="number" fullWidth {...tf} {...register('engine')} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField label="Propeller" type="number" fullWidth {...tf} {...register('propeller')} />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" className="mb-3 font-semibold">
//                 Jet Overview
//               </Typography>
//               <Controller
//                 control={control}
//                 name={`overview`}
//                 // defaultValue={doc?.overview || ''}
//                 render={({ field }) => (
//                   <ReactQuill theme="snow" value={field.value || ''} onChange={field.onChange} placeholder={`Write Overview here...`} />
//                 )}
//               />
//             </Grid>
//           </Grid>

//           {/* Contact Agent */}
//           <div className="rounded-xl">
//             <Typography variant="subtitle1" className="mb-3 font-semibold">
//               Contact Agent
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField label="Name" fullWidth {...tf} {...register('agentName')} />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField label="Email" type="email" fullWidth {...tf} {...register('agentEmail')} />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField label="Phone" fullWidth {...tf} {...register('agentPhone')} />
//               </Grid>
//             </Grid>
//           </div>

//           {/* Description */}
//           <div>
//             <Typography variant="subtitle1" className="mb-2 font-semibold">
//               Description
//             </Typography>
//             <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
//               {SECTION_KEYS.map((k) => (
//                 <Tab key={k} value={k} label={SECTION_LABELS[k]} />
//               ))}
//             </Tabs>

//             <Box className="mt-4">
//               {SECTION_KEYS.map((k) => (
//                 <div key={k} hidden={activeTab !== k}>
//                   <Controller
//                     control={control}
//                     name={`sections.${k}`}
//                     render={({ field }) => (
//                       <ReactQuill
//                         theme="snow"
//                         value={field.value || ''}
//                         onChange={field.onChange}
//                         placeholder={`Write ${SECTION_LABELS[k]} details here...`}
//                       />
//                     )}
//                   />
//                 </div>
//               ))}
//             </Box>
//           </div>

//           <Grid item xs={12}>
//             <Typography variant="subtitle1" className="mb-4 font-semibold">
//               Video URL
//             </Typography>
//             <TextField label="Video URL" type="text" fullWidth {...tf} {...register('videoUrl')} />
//           </Grid>

//           {/* Images */}
//           <div>
//             <Typography variant="subtitle1" className="mb-2 font-semibold">
//               Images
//             </Typography>

//             {imagesExisting.length > 0 && (
//               <>
//                 <Typography variant="body2" className="mb-1">
//                   Existing (kept unless removed):
//                 </Typography>
//                 <Grid container spacing={2} className="mb-2">
//                   {imagesExisting.map((url, idx) => (
//                     <Grid item xs={6} sm={4} md={3} lg={2} key={url + idx}>
//                       <Paper className="relative border rounded-xl overflow-hidden">
//                         <img src={url} alt={`img-${idx}`} style={{ maxWidth: '100%' }} />
//                         <Box className="absolute top-1 right-1 bg-black/60 rounded-md">
//                           <IconButton size="small" onClick={() => removeExistingImage(idx)}>
//                             <DeleteIcon fontSize="small" className="text-red-500" />
//                           </IconButton>
//                         </Box>
//                       </Paper>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </>
//             )}

//             <div className="flex items-center gap-3">
//               <Button variant="contained" component="label" startIcon={<UploadIcon />}>
//                 Add Images
//                 <input hidden accept="image/*" type="file" multiple onChange={onImagesChange} />
//               </Button>
//               <Chip label={`${imagesLocal.length} new selected`} />
//             </div>

//             {imagesLocal.length > 0 && (
//               <Grid container spacing={2} className="mt-2">
//                 {imagesLocal.map((f, idx) => (
//                   <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
//                     <Paper className="relative border rounded-xl overflow-hidden">
//                       <img src={URL.createObjectURL(f)} alt={f.name} style={{ maxWidth: '100%' }} />
//                       <Box className="absolute top-1 right-1 bg-black/60 rounded-md">
//                         <IconButton size="small" onClick={() => removeLocalImage(idx)}>
//                           <DeleteIcon fontSize="small" className="text-red-600" />
//                         </IconButton>
//                       </Box>
//                       <Typography variant="caption" className="block p-2 truncate">
//                         {f.name}
//                       </Typography>
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
//             <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={uploading}>
//               Update Aircraft
//             </Button>
//             <Button
//               type="button"
//               variant="outlined"
//               onClick={() => {
//                 /* keep edits or implement a hard reset if needed */
//               }}
//             >
//               Reset
//             </Button>
//           </div>
//         </form>
//       </div>

//       <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
//         <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
//           {snack.msg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }




import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import { getAircraftCategories } from '../../api/aircraftCategory.api';

const API_READ_BASE = 'http://localhost:5000/api/aircrafts'; // GET detail
const API_WRITE_BASE = `http://localhost:5000/api/aircrafts`; // PUT update

const STATUS = ['for-sale', 'sold', 'wanted', 'coming-soon', 'sale-pending', 'off-market', 'acquired'];
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

// helpers
const safeSecHtml = (doc, key) => String(doc?.description?.sections?.[key]?.html ?? '');
const docToFormDefaults = (doc = {}) => ({
  title: doc.title ?? '',
  year: doc.year ?? '',
  price: doc.price ?? '',
  status: doc.status ?? 'for-sale',
  category: typeof doc.category === 'object' && doc.category?._id ? doc.category._id : (doc.category ?? ''),
  location: doc.location ?? '',
  airframe: doc.airframe ?? '',
  engine: doc.engine ?? '',
  propeller: doc.propeller ?? '',
  agentName: doc.contactAgent?.name ?? '',
  agentEmail: doc.contactAgent?.email ?? '',
  agentPhone: doc.contactAgent?.phone ?? '',
  videoUrl: doc.videoUrl ?? '',
  overview: doc.overview ?? '',
  sections: SECTION_KEYS.reduce((m, k) => {
    m[k] = safeSecHtml(doc, k);
    return m;
  }, {})
});

// safe parse of server response
async function parseBody(resp) {
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await resp.json();
  return await resp.text();
}

export default function EditJet() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('airframe');

  // gallery images
  const [imagesLocal, setImagesLocal] = useState([]); // File[]
  const [imagesExisting, setImagesExisting] = useState([]); // string[] (URLs in DB)

  // featured image
  const [featuredExisting, setFeaturedExisting] = useState(null); // string | null
  const [featuredLocal, setFeaturedLocal] = useState(null); // File | null
  const featuredInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [categories, setCategories] = useState([]);

  const defaultSectionState = useMemo(() => {
    const m = {};
    SECTION_KEYS.forEach((k) => (m[k] = ''));
    return m;
  }, []);

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
      overview: '',
      location: '',
      airframe: '',
      engine: '',
      propeller: '',
      agentName: '',
      agentEmail: '',
      videoUrl: '',
      agentPhone: '',
      sections: defaultSectionState
    }
  });

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

  // Fetch detail + prefill
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const resp = await fetch(`${API_READ_BASE}/lists/${id}`);
        const json = await resp.json();
        if (!resp.ok || json?.success === false) throw new Error(json?.message || 'Failed to fetch aircraft');
        const doc = json.data || {};
        if (!alive) return;
        reset(docToFormDefaults(doc));
        setImagesExisting(Array.isArray(doc.images) ? doc.images : []);
        setFeaturedExisting(doc?.featuredImage || null);
      } catch (e) {
        if (alive) setSnack({ open: true, severity: 'error', msg: e.message });
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, reset]);

  // navigate
  const navigate = useNavigate();

  // gallery file selection
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImagesLocal((prev) => [...prev, ...files]);
  };
  const removeLocalImage = (idx) => setImagesLocal((prev) => prev.filter((_, i) => i !== idx));
  const removeExistingImage = (idx) => setImagesExisting((prev) => prev.filter((_, i) => i !== idx));

  // featured handlers
  const onFeaturedChange = (e) => {
    const file = (e.target.files && e.target.files[0]) || null;
    setFeaturedLocal(file || null); // selecting a new one will REPLACE on server
  };
  const clearFeaturedLocal = () => {
    setFeaturedLocal(null);
    if (featuredInputRef.current) featuredInputRef.current.value = '';
  };

  // Submit → UPDATE
  const onSubmit = async (values) => {
    try {
      setUploading(true);

      const description = {
        version: 1,
        sections: Object.fromEntries(SECTION_KEYS.map((k) => [k, { html: values.sections[k] || '' }]))
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
      fd.append('overview', values.overview);
      fd.append('videoUrl', values.videoUrl);
      if (values.airframe) fd.append('airframe', String(values.airframe));
      if (values.engine) fd.append('engine', String(values.engine));
      if (values.propeller) fd.append('propeller', String(values.propeller));
      fd.append('contactAgent', JSON.stringify(contactAgent));
      fd.append('description', JSON.stringify(description));

      // gallery images
      fd.append('keepImages', JSON.stringify(imagesExisting)); // preserve these on backend
      imagesLocal.forEach((f) => fd.append('images', f));

      // featured image (replace only if a new one is chosen)
      if (featuredLocal) {
        fd.append('featuredImage', featuredLocal);
      }
      // Note: to fully REMOVE featured image without replacement, backend needs a flag like:
      // fd.append('removeFeaturedImage', 'true')  // only if your backend supports this

      const resp = await fetch(`${API_WRITE_BASE}/update/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: fd
      });

      const body = await parseBody(resp);
      if (!resp.ok) {
        const msg = typeof body === 'string' ? body.slice(0, 300) : body?.message || JSON.stringify(body);
        throw new Error(msg || `Request failed (${resp.status})`);
      }

      setSnack({ open: true, severity: 'success', msg: 'Aircraft updated successfully' });
      setImagesLocal([]);
      clearFeaturedLocal();
      setTimeout(() => {
        navigate('/jets');
      }, 700);
    } catch (e) {
      setSnack({ open: true, severity: 'error', msg: e.message });
    } finally {
      setUploading(false);
    }
  };

  // label overlap fix
  const tf = { variant: 'outlined', InputLabelProps: { shrink: true } };

  return (
    <Box className="min-h-screen text-[#111218]">
      {uploading && <LinearProgress className="mb-4" />}

      <div className="border rounded-2xl p-6 mx-auto">
        <Typography variant="h5" className="mb-6 font-bold">
          Edit Aircraft
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Title"
                fullWidth
                required
                {...tf}
                {...register('title', { required: true })}
                error={!!errors.title}
                helperText={errors.title ? 'Required' : ''}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Status" fullWidth defaultValue="for-sale" {...tf} {...register('status')}>
                {STATUS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Year" type="number" fullWidth {...tf} {...register('year')} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Price" type="number" fullWidth required {...tf} {...register('price', { required: true })} />
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
            <Grid item xs={12} md={3}>
              <TextField label="Location" fullWidth required {...tf} {...register('location', { required: true })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Airframe" type="number" fullWidth {...tf} {...register('airframe')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Engine" type="number" fullWidth {...tf} {...register('engine')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Propeller" type="number" fullWidth {...tf} {...register('propeller')} />
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
                <TextField label="Name" fullWidth {...tf} {...register('agentName')} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Email" type="email" fullWidth {...tf} {...register('agentEmail')} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Phone" fullWidth {...tf} {...register('agentPhone')} />
              </Grid>
            </Grid>
          </div>

          {/* Description */}
          <div>
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Description
            </Typography>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons allowScrollButtonsMobile>
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
            <TextField label="Video URL" type="text" fullWidth {...tf} {...register('videoUrl')} />
          </Grid>

          {/* Featured Image */}
          <div>
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Featured Image
            </Typography>

            <div className="flex items-center gap-3">
              <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                {featuredLocal ? 'Change Featured' : 'Select Featured'}
                <input
                  ref={featuredInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={onFeaturedChange}
                />
              </Button>
              <Chip label={featuredLocal ? '1 new selected' : (featuredExisting ? 'Using existing' : 'None')} />
              {featuredLocal && (
                <Button size="small" variant="text" color="error" onClick={clearFeaturedLocal} startIcon={<DeleteIcon />}>
                  Remove New
                </Button>
              )}
            </div>

            {/* Preview: new takes precedence, else show existing */}
            <Grid container spacing={2} className="mt-2">
              {featuredLocal ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Paper className="relative border rounded-xl overflow-hidden">
                    <img
                      src={URL.createObjectURL(featuredLocal)}
                      alt={featuredLocal.name}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <Typography variant="caption" className="block p-2 truncate">
                      {featuredLocal.name}
                    </Typography>
                  </Paper>
                </Grid>
              ) : featuredExisting ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Paper className="relative border rounded-xl overflow-hidden">
                    <img src={featuredExisting} alt="featured" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    <Typography variant="caption" className="block p-2 truncate">
                      Existing featured
                    </Typography>
                  </Paper>
                </Grid>
              ) : null}
            </Grid>
          </div>

          {/* Gallery Images */}
          <div>
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Images
            </Typography>

            {imagesExisting.length > 0 && (
              <>
                <Typography variant="body2" className="mb-1">
                  Existing (kept unless removed):
                </Typography>
                <Grid container spacing={2} className="mb-2">
                  {imagesExisting.map((url, idx) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={url + idx}>
                      <Paper className="relative border rounded-xl overflow-hidden">
                        <img src={url} alt={`img-${idx}`} style={{ maxWidth: '100%' }} />
                        <Box className="absolute top-1 right-1 bg-black/60 rounded-md">
                          <IconButton size="small" onClick={() => removeExistingImage(idx)}>
                            <DeleteIcon fontSize="small" className="text-red-500" />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            <div className="flex items-center gap-3">
              <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                Add Images
                <input hidden accept="image/*" type="file" multiple onChange={onImagesChange} />
              </Button>
              <Chip label={`${imagesLocal.length} new selected`} />
            </div>

            {imagesLocal.length > 0 && (
              <Grid container spacing={2} className="mt-2">
                {imagesLocal.map((f, idx) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
                    <Paper className="relative border rounded-xl overflow-hidden">
                      <img src={URL.createObjectURL(f)} alt={f.name} style={{ maxWidth: '100%' }} />
                      <Box className="absolute top-1 right-1 bg-black/60 rounded-md">
                        <IconButton size="small" onClick={() => removeLocalImage(idx)}>
                          <DeleteIcon fontSize="small" className="text-red-600" />
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
              Update Aircraft
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                /* keep edits or implement a hard reset if needed */
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
