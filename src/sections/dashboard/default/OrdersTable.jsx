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
import { Avatar } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

// third-party
import { NumericFormat } from 'react-number-format';

import { useState } from 'react';
import { useEffect } from 'react';
import { getLatestAircraft } from '../../../api/aircraft.api';

// =============== helpers =============== //
function createRow(
  tail,
  image,
  seller,
  sn,
  dom,
  price,
  offPct,
  originalPrice,
  year,
  airframe,
  engine1,
  g1000,
  pilotDoor,
  elite,
  blade5,
  highlight = false
) {
  return {
    tail,
    image,
    seller,
    sn,
    dom,
    price,
    offPct,
    originalPrice,
    year,
    airframe,
    engine1,
    g1000,
    pilotDoor,
    elite,
    blade5,
    highlight
  };
}

const headCells = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'airframe', label: 'Airframe', align: 'left' },
  { id: 'engine', label: 'Engine', align: 'left' },
  { id: 'propeller', label: 'Propeller', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' }
];

// ==============================|| HEADER ||============================== //
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((h) => (
          <TableCell key={h.id} align={h.id === 'image' || h.id === 'id' ? 'left' : 'center'} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {h.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Yes = () => <CheckCircle sx={{ fontSize: 18, verticalAlign: 'middle', color: 'success.main' }} />;

// ==============================|| TABLE ||============================== //
export default function OrderTable() {
  const [rows, setRows] = useState([]);

  const fetchLatestAircrafts = async () => {
    try {
      const response = await getLatestAircraft();

      if (response.success) {
        console.log('working....');
        setRows(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatestAircrafts();
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
            {rows?.map((row) => (
              <TableRow
                key={row.tail}
                hover
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  ...(row.highlight && { '& td:first-of-type': { color: 'success.main', fontWeight: 700 } })
                }}
              >
                <TableCell align="left">
                  <Link color={'secondary'} underline="hover">
                    {row._id}
                  </Link>
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <img src={row.images[0]} loading="lazy" style={{ width: 56, height: 36, borderRadius: 1 }} alt="" />
                  </Stack>
                </TableCell>

                <TableCell align="center">{row?.airframe}</TableCell>
                <TableCell align="center">{row?.engine}</TableCell>
                <TableCell align="center">{row?.propeller}</TableCell>
                <TableCell align="center">{row?.category?.name}</TableCell>
                <TableCell align="center">{row?.status?.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = {};
