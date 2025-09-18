import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  IconButton, Tooltip, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import GridLinearLoader from "../../GridLinearLoader";
import { getContactsLists, deleteContact, bulkDeleteContact } from "../../api/contact.api";

const numberFmt = new Intl.NumberFormat("en-US");

const ContactInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState([]);         // array of row ids
  const [data, setData] = useState([]);                   // raw server data
  const [confirm, setConfirm] = useState({ open: false, mode: "", ids: [], title: "" });
  const [deleting, setDeleting] = useState(false);

  const openConfirmSingle = (row) =>
    setConfirm({ open: true, mode: "single", ids: [row.id], title: row.name || "" });

  const openConfirmBulk = () =>
    setConfirm({ open: true, mode: "bulk", ids: selection, title: "" });

  const closeConfirm = () =>
    setConfirm({ open: false, mode: "", ids: [], title: "" });

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await getContactsLists();
      if (response?.success) setData(response.data || []);
    } catch (e) {
      console.error("Error fetching contact info:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContactInfo(); }, []);

  // Build grid rows from raw data
  const rows = useMemo(
    () =>
      (data || []).map((d) => ({
        id: d._id || d.id,       // IMPORTANT: stable unique id
        email: d.email,
        address: d.address,
        phone: d.phone,
        facebook: d.facebook,
        instagram: d.instagram,
        linkedin: d.linkedin,
        youtube: d.youtube,
        _raw: d,
      })),
    [data]
  );

  const handleConfirmDelete = async () => {
    if (!confirm.ids.length) return;
    setDeleting(true);

    // --- Optimistic UI: remove from local state immediately ---
    setData((prev) => prev.filter((d) => !confirm.ids.includes(d._id || d.id)));

    try {
      if (confirm.mode === "single") {
        await deleteContact(confirm.ids[0]);
      } else {
        await deleteContactsByBulk(confirm.ids);
        setSelection([]);
      }
      // Re-sync with server (optional but recommended)
      fetchContactInfo();
    } catch (e) {
      console.error(e);
      // If something failed, reload to restore truth
      fetchContactInfo();
    } finally {
      setDeleting(false);
      closeConfirm();
    }
  };

  const columns = [
    {
      field: "serial",
      headerName: "#",
      width: 80,
      sortable: false,
      renderCell: (params) =>
        // correct index even when paginated/sorted/filtered
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "facebook",
      headerName: "Facebook",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "instagram",
      headerName: "Instagram",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "linkedin",
      headerName: "LinkedIn",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "youtube",
      headerName: "Youtube",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => navigate(`/contact/edit/${params.row.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => openConfirmSingle(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <Typography variant="h6" className="font-bold">Contact Info</Typography>
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/contact/add")}>
            Add Contact Info
          </Button>
        </div>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection
        slots={{ toolbar: GridToolbar, loadingOverlay: GridLinearLoader }}
        slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
        onRowSelectionModelChange={(m) => setSelection(m)}
        sx={{ minHeight: "75vh", backgroundColor: "#f4f4f4" }}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        pageSizeOptions={[5]}
      />

      <Dialog open={confirm.open} onClose={deleting ? undefined : closeConfirm}>
        <DialogTitle>
          {confirm.mode === "single"
            ? `Delete ${confirm.title ? `"${confirm.title}"` : "this item"}?`
            : `Delete ${confirm.ids.length} selected item(s)?`}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete {confirm.mode === "single" ? "this item" : "these items"}? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={deleting} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} disabled={deleting} color="error" variant="contained">
            {deleting ? "Deleting…" : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContactInfo;
