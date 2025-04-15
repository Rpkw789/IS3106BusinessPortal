import { useCallback, useState } from "react";
import { Card, TableBody, TableContainer, TablePagination, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import { Scrollbar } from "src/components/scrollbar";
import { TableEmptyRows } from "src/sections/Bookings/table-empty-rows";
import { TableNoData } from "src/sections/Bookings/table-no-data";
import { SchedulesHeader } from "../schedules-header";
import { ScheduleTableHead } from "../schedule-table-head";
import { ScheduleProp, ScheduleTableRow } from "../schedules-table-row";
import { SchedulesTableToolbar } from "../schedules-table-toolbar";
import { emptyRows, applyFilter, getComparator } from '../utils';

// --------------------------------------------------------------------------

export function SchedulesViewPage() {

    const table = useTable();
    
    const [filterName, setFilterName] = useState('');
    const [status, filterStatus] = useState('all');
    const [schedules, setSchedules] = useState<ScheduleProp[]>([]);

    const dataFiltered: ScheduleProp[] = applyFilter({
        inputData: schedules,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
        status
    });

    const notFound = !dataFiltered.length && !!filterName;
    
    return (
        <>
        <SchedulesHeader />

        <Card sx={{ ml : 2, mr : 2, mb: 5}}>
            <SchedulesTableToolbar
                selected={table.selected}
                filterName={filterName}
                onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFilterName(event.target.value);
                table.onResetPage();
                }}
                onFilterStatus={(value) => {
                filterStatus(value);
                table.onResetPage();
                }}
            />

            <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    <ScheduleTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={schedules.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                        checked,
                        schedules.map((schedule) => schedule._id)
                        )
                    }
                    headLabel={[
                        { id: 'activityName', label: 'Activity' },
                        { id: 'startDate', label: 'Start Date' },
                        { id: 'endDate', label: 'End Date' },
                        { id: 'frequencyDay', label: 'Day of Week' },
                        { id: 'frequencyTime', label: 'Start Time of Activity' },
                        { id: 'actions', label: 'Actions' }
                    ]}
                    />
                    <TableBody>
                    {dataFiltered
                        .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                        <ScheduleTableRow
                            key={row._id}
                            row={row}
                            selected={table.selected.includes(row._id)}
                            onSelectRow={() => table.onSelectRow(row._id)}
                        />
                        ))}
    
                    <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, schedules.length)}
                    />
    
                    {notFound && <TableNoData searchQuery={filterName} />}
                    </TableBody>
                </Table>
                </TableContainer>
            </Scrollbar>
            
        </Card>

        <TablePagination
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
        />
        </>
    )
}

// ---------------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
