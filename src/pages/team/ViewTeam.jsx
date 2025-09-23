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
import { getTeamLists, deleteTeam, deleteTeamsByBulk } from "../../api/team.api";
import GridLinearLoader from "../../GridLinearLoader";

const numberFmt = new Intl.NumberFormat("en-US");

// ✅ HTML → plain text
const stripHtml = (html) => {
  if (!html) return "";
  try {
    // browser-safe: decodes entities too
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.replace(/\s+/g, " ").trim();
  } catch {
    // fallback (SSR or any issue)
    return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
};

const ViewTeam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState([]);
  const [data, setData] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, mode: "", ids: [], title: "" });
  const [deleting, setDeleting] = useState(false);

  const openConfirmSingle = (row) =>
    setConfirm({ open: true, mode: "single", ids: [row.id], title: row.name || "" });

  const openConfirmBulk = () =>
    setConfirm({ open: true, mode: "bulk", ids: selection, title: "" });

  const closeConfirm = () =>
    setConfirm({ open: false, mode: "", ids: [], title: "" });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getTeamLists();
      if (response?.success) setData(response.data || []);
    } catch (e) {
      console.error("Error fetching teams:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  // ✅ Build grid rows: description stripped to plain text
  const rows = useMemo(
    () =>
      (data || []).map((d) => ({
        id: d._id || d.id,
        profile_picture: d.profile_picture,
        team_member_picture: d.team_member_picture,
        name: d.name,
        email: d.email,
        phone: d.phone,
        address: d.address,
        description: stripHtml(d.description), // 👈 plain text
        designation: d.designation,
        facebook: d.facebook,
        instagram: d.instagram,
        linkedin: d.linkedin,
        youtube: d.youtube,
        _raw: d, // keep original if needed elsewhere
      })),
    [data]
  );

  const handleConfirmDelete = async () => {
    if (!confirm.ids.length) return;
    setDeleting(true);
    setData((prev) => prev.filter((d) => !confirm.ids.includes(d._id || d.id)));
    try {
      if (confirm.mode === "single") {
        await deleteTeam(confirm.ids[0]);
      } else {
        await deleteTeamsByBulk(confirm.ids);
        setSelection([]);
      }
      fetchTeams();
    } catch (e) {
      console.error(e);
      fetchTeams();
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
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "profile_picture",
      headerName: "Profile Image",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <img
          src={params.row.profile_picture}
          alt="Profile"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    {
      field: "team_member_picture",
      headerName: "Team Member Image",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <img
          src={params.row.team_member_picture}
          alt="Profile"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 220 },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 220,
      // value is already plain text from rows, but ensure nice truncation
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", marginTop: 2 }}
          title={params.value || ""} // show full text on hover
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "designation", headerName: "Designation", flex: 1, minWidth: 220 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 220 },
    { field: "address", headerName: "Address", flex: 1, minWidth: 220 },
    { field: "facebook", headerName: "Facebook", flex: 1, minWidth: 220 },
    { field: "instagram", headerName: "Instagram", flex: 1, minWidth: 220 },
    { field: "linkedin", headerName: "Linked In", flex: 1, minWidth: 220 },
    { field: "youtube", headerName: "Youtube", flex: 1, minWidth: 220 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => navigate(`/teams/edit/${params.row.id}`)}>
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
          <Typography variant="h6" className="font-bold">Teams</Typography>
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/teams/add")}>
            Add Teams
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
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10]}
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

export default ViewTeam;
