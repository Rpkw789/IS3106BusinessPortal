import { useState, useCallback } from 'react';
import { Toolbar } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import type { ActivityProp } from './view/util';
import { visuallyHidden } from '../Bookings/utils';

import { useRouter } from '../../routes/hooks';

type ActivityTableToolbarProps = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TodayActivities({ filterName, onFilterName }: ActivityTableToolbarProps) {

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <OutlinedInput
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search activity..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: 320 }}
      />
    </Toolbar>
  )
};

// ----------------------------------------------------------------------

export type ActivityTableHeadProps = {
  orderBy: string;
  order: 'asc' | 'desc';
  onSort: (id: string) => void;
  headLabel: Record<string, any>[];
};

export function ActivityTableHead({
  order,
  onSort,
  orderBy,
  headLabel,
}: ActivityTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ----------------------------------------------------------------------

export function ActivityTableRow({ row }: { row: ActivityProp }) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  // Convert start time (HH:MM) to a Date object
  const [hours, minutes] = row.frequencyTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0); // Set time to the start time

  // Calculate the duration in milliseconds
  const durationInMilliseconds = parseFloat(row.duration) * 60 * 60 * 1000; // 1.5 hours * 60 minutes * 60 seconds * 1000 milliseconds

  // Add the duration to the start time
  const endDate = new Date(startDate.getTime() + durationInMilliseconds);

  // Get the end time in HH:MM format
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  const endTime = `${endHours}:${endMinutes}`;

  return (
    <>
      <TableRow hover tabIndex={-1}>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.frequencyTime}</TableCell>

        <TableCell>{endTime}</TableCell>
        <TableCell>{row.signUps}</TableCell>

        <TableCell>
          <Button variant="contained" onClick={() => router.push(`/activities/${row._id}`)}>View Activity</Button>
        </TableCell>
      </TableRow>
    </>
  );
}
