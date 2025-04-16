import { useCallback, useEffect, useState } from "react";
import { Card, TableBody, TableContainer, 
  TablePagination, Typography, TableRow, TableCell } from "@mui/material";
import { DashboardContent } from 'src/layouts/dashboard';
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
  const [dayName, setDayName] = useState('all');
  const [schedules, setSchedules] = useState<ScheduleProp[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/schedules/all-business-schedules", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    }).then((data) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const updated = data.schedules.map((schedule: ScheduleProp) => ({
          ...schedule,
          startDate: new Date(schedule.startDate).toISOString().split('T')[0],
          frequencyDay: daysOfWeek[parseInt(schedule.frequencyDay, 10)]
        }));
      setSchedules(updated);
    }
    ).catch((error) => {
      console.error("Error fetching schedules:", error);
    });
  }, []);
  console.log(schedules);

  const dataFiltered: ScheduleProp[] = applyFilter({
    inputData: schedules,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    dayName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  return (
    <>
      <DashboardContent>
        <SchedulesHeader />

        <Card>
          <SchedulesTableToolbar
            selected={table.selected}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
            onFilterStatus={(value) => {
              setDayName(value);
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
                    { id: 'frequencyTime', label: 'Start Time' },
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
                  {dataFiltered.length === 0 && !filterName && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="subtitle1" sx={{ py: 3 }}>
                          No schedules found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />

        </Card>
      </DashboardContent>
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
