import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ScheduleProp = {
    _id: string;
    activityName: string;
    startDate: string;
    endDate: string;
    frequencyDay: string;
    frequencyTime: string;
    businessId: string;
};

type SchedulesTableRowProps = {
  row: ScheduleProp;
  selected: boolean;
  onSelectRow: () => void;
};

export function ScheduleTableRow({ row, selected, onSelectRow }: SchedulesTableRowProps) {
  console.log(row);
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.activityName}
          </Box>
        </TableCell>

        <TableCell>{row.startDate}</TableCell>
        <TableCell>{row.endDate}</TableCell>

        <TableCell>{row.frequencyDay}</TableCell>

        <TableCell>{row.frequencyTime}</TableCell>

        {/* <TableCell>
          <Label color={(row.status === 'Cancelled' && 'error') || 'success'}>{row.status}</Label>
        </TableCell> */}
      </TableRow>
    </>
  );
}
