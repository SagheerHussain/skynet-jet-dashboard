import PropTypes from 'prop-types';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';

// api
import { useEffect, useState } from 'react';
import { getLatestAircraft } from '../../../api/aircraft.api';

// ---------------- helpers ----------------
const headCells = [
  { id: 'no', label: 'S.No', align: 'left' },
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'year', label: 'Year', align: 'center' },
  { id: 'price', label: 'Price', align: 'center' },
  { id: 'category', label: 'Category', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'airframe', label: 'Airframe', align: 'center' },
  { id: 'engine', label: 'Engine', align: 'center' },
  { id: 'propeller', label: 'Propeller', align: 'center' },
];

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((h) => (
          <TableCell
            key={h.id}
            align={h.align || 'center'}
            sx={{ fontWeight: 700, color: 'text.secondary' }}
          >
            {h.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ------ Status Pill ------
function StatusPill({ value }) {
  const theme = useTheme();
  const slug = String(value || '').toLowerCase();

  // label: "for-sale" -> "For Sale"
  const label = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const pal = theme.palette;
  const tone = (key) => ({
    bg: alpha(pal[key].main, 0.12),
    fg: pal[key].dark,
    bd: alpha(pal[key].main, 0.24)
  });

  const colors = (() => {
    switch (slug) {
      case 'for-sale':
        return tone('success');
      case 'sold':
        return tone('error');
      case 'wanted':
        return tone('info');
      case 'coming-soon':
        return tone('warning');
      case 'sale-pending':
        return tone('secondary');
      case 'off-market':
        return {
          bg: alpha(pal.grey[500], 0.18),
          fg: pal.grey[800],
          bd: alpha(pal.grey[600], 0.26)
        };
      case 'acquired':
        return tone('primary');
      default:
        return {
          bg: alpha(pal.grey[400], 0.18),
          fg: pal.text.primary,
          bd: alpha(pal.grey[500], 0.26)
        };
    }
  })();

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        bgcolor: colors.bg,
        color: colors.fg,
        border: '1px solid',
        borderColor: colors.bd,
        borderRadius: '999px',
        fontWeight: 600,
        px: 1.25,
        height: 26
      }}
    />
  );
}

StatusPill.propTypes = { value: PropTypes.string };

// ---------------- Table ----------------
export default function OrderTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getLatestAircraft();
        if (response.success) setRows(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' },
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Table aria-labelledby="tableTitle" size="small" stickyHeader>
          <OrderTableHead />
          <TableBody>
            {rows?.map((row, index) => (
              <TableRow
                key={row._id}
                hover
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' }
                }}
              >
                <TableCell align="left">
                  <Link color="secondary" underline="hover">
                    {index + 1}
                  </Link>
                </TableCell>

                <TableCell align="center">
                  {row?.images?.[0] ? (
                    <img
                      src={row.images[0]}
                      loading="lazy"
                      style={{ width: 100, height: 60, borderRadius: 6, objectFit: 'cover' }}
                      alt=""
                    />
                  ) : (
                    <Box sx={{ width: 56, height: 36, borderRadius: 1, bgcolor: 'action.selected' }} />
                  )}
                </TableCell>

                <TableCell align="left">
                  {row?.title ?? '—'}
                </TableCell>


                <TableCell align="center">{row?.year ?? '—'}</TableCell>
                <TableCell align="center">{row?.price ? row.price : 'Call'}</TableCell>
                <TableCell align="center">{row?.category?.name ?? '—'}</TableCell>

                <TableCell align="center">
                  <StatusPill value={row?.status} />
                </TableCell>

                <TableCell align="center">{row?.airframe ?? '—'}</TableCell>
                <TableCell align="center">{row?.engineTwo ? row.engine + ' / ' + row.engineTwo : row.engine}</TableCell>
                <TableCell align="center">{row?.propellerTwo ? row.propeller + ' / ' + row.propellerTwo : row.propeller}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
