import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Paper, Typography, Box, Button, Stack, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://skynet-jet-dashboard-server.onrender.com/api/aircrafts';
const BULK_DELETE_URL = `${API_BASE}/bulkDelete`;

const numberFmt = new Intl.NumberFormat('en-US');
const moneyFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const SECTION_KEYS = ['airframe', 'engine', 'propeller', 'avionics', 'equipment', 'interior', 'exterior', 'inspection'];

const stripHtml = (html = '') => String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const pickDescriptionText = (doc) => {
  const sections = doc?.description?.sections || {};
  const firstHtml = SECTION_KEYS.map(k => sections?.[k]?.html).find(Boolean);
  const full = stripHtml(firstHtml || '');
  const short = full.length > 120 ? full.slice(0, 120) + '…' : full;
  return { full, short };
};

export default function AircraftTable() {
  const [loading, setLoading] = React.useState(true);
  const [aircrafts, setAircrafts] = React.useState([]);
  const [selection, setSelection] = React.useState([]); // selected ids

  // confirmation dialog state
  const [confirm, setConfirm] = React.useState({
    open: false,
    mode: null,    // 'single' | 'bulk'
    ids: [],
    title: ''
  });
  const [deleting, setDeleting] = React.useState(false);

  const navigate = useNavigate();

  const fetchRows = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/lists?page=1&pageSize=100`);
      const json = await res.json();
      setAircrafts(json.data || []);
      console.log(json.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { fetchRows(); }, [fetchRows]);

  const rows = React.useMemo(() => {
    return (aircrafts || []).map((d) => {
      const { full, short } = pickDescriptionText(d);
      const toNum = (v) => (v === undefined || v === null || v === '' ? null : Number(v));
      return {
        id: d._id || d.id,
        title: d.title ?? '',
        year: toNum(d.year),
        price: toNum(d.price),
        video: d.videoUrl ?? '',
        status: d.status ?? '',
        category: d.category?.name,
        airframe: toNum(d.airframe),
        engine: toNum(d.engine),
        propeller: toNum(d.propeller),
        desc: short,
        descFull: full,
        location: d.location ?? '',
        agent: d.contactAgent?.name || d.contactAgent?.email || '',
        _agent: {
          name: d.contactAgent?.name || '',
          phone: d.contactAgent?.phone || '',
          email: d.contactAgent?.email || ''
        },
        _raw: d
      };
    });
  }, [aircrafts]);

  // open dialogs
  const openConfirmSingle = (row) =>
    setConfirm({ open: true, mode: 'single', ids: [row.id], title: row.title || '' });

  const openConfirmBulk = () =>
    setConfirm({ open: true, mode: 'bulk', ids: selection, title: `${selection.length} items` });

  const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }));

  // perform delete after user confirms
  const handleConfirmDelete = async () => {
    if (!confirm.ids.length) return;
    setDeleting(true);
    try {
      if (confirm.mode === 'single') {
        await fetch(`${API_BASE}/delete/${confirm.ids[0]}`, { method: 'DELETE' });
      } else {
        await fetch(BULK_DELETE_URL, {
          method: 'POST', // body-safe
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: confirm.ids })
        });
        setSelection([]);
      }
      await fetchRows();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      closeConfirm();
    }
  };

  const columns = React.useMemo(() => [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 220 },
    { field: 'year', headerName: 'Year', width: 90, type: 'number' },
    {
      field: 'price', headerName: 'Price', width: 120, type: 'number',
      // valueFormatter: ({ value }) => (value == null ? '' : '$' + moneyFmt.format(Number(value)))
    },
    { field: 'video', headerName: 'Video', width: 120, type: 'number' },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'airframe', headerName: 'Airframe', width: 150, type: 'number' },
    { field: 'engine', headerName: 'Engine', width: 150, type: 'number' },
    {
      field: 'desc', headerName: 'Description', flex: 1.2, minWidth: 240,
      renderCell: (params) => (
        <span title={params?.row?.descFull} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params?.value}
        </span>
      )
    },
    { field: 'location', headerName: 'Location', flex: 0.8, minWidth: 150 },
    {
      field: 'agent', headerName: 'Contact Agent', width: 220,
      renderCell: (params) => {
        const a = params?.row?._agent || {};
        const tooltip = [a?.name, a?.phone, a?.email].filter(Boolean).join(' | ');
        return (
          <div title={tooltip} style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>{a?.name || '-'}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{a?.phone || ''}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{a?.email || ''}</div>
          </div>
        );
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => navigate(`/jets/edit/${params.row.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => openConfirmSingle(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ], [navigate]);

  return (
    <Box className="w-full">
      <Paper elevation={0} sx={{ minHeight: '75vh' }} className="rounded-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Typography variant="h6" className="font-bold">Aircrafts</Typography>
            <span className="text-xs text-zinc-500">{numberFmt.format(rows.length)} items</span>
          </div>
          <div className="flex items-center gap-2">
            {selection.length > 0 && (
              <Button
                color="error"
                variant="outlined"
                onClick={openConfirmBulk}
                startIcon={<DeleteIcon />}
              >
                Delete Selected ({selection.length})
              </Button>
            )}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/jets/add')}>
              Add Aircraft
            </Button>
          </div>
        </div>

        <div style={{ width: '100%' }} className="p-2">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(m) => setSelection(m)} // keep uncontrolled to avoid crash
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
            sx={{ minHeight: '75vh', backgroundColor: '#f4f4f4' }}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10]}
          />
        </div>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirm.open} onClose={deleting ? undefined : closeConfirm}>
        <DialogTitle>
          {confirm.mode === 'single'
            ? `Delete "${confirm.title}"?`
            : `Delete ${confirm.ids.length} selected item(s)?`}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete {confirm.mode === 'single' ? 'this item' : 'these items'}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={deleting} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} disabled={deleting} color="error" variant="contained">
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

