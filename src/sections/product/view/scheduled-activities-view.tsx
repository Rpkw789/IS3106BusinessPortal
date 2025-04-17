import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';

import { useParams } from 'react-router-dom';

import { ScheduledActivityItem } from '../scheduled-activity-item';
import { ProductSort } from '../product-sort';
import { ProductFilters } from '../product-filters';

import type { FiltersProps } from '../product-filters';

// ----------------------------------------------------------------------

const RATING_OPTIONS: number[] = [4, 3, 2, 1];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

const defaultFilters = {
  rating: 0,
  creditRange: [0, 15],
  status: STATUS_OPTIONS[0].value,
  vacanciesRange: [0, 100],
};

export function ScheduledActivitiesView() {

  const router = useRouter();

  const [sortBy, setSortBy] = useState('featured');

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchScheduledActivities = async () => {
      const { creditRange, vacanciesRange, rating, status } = filters;
      const queryParams = new URLSearchParams({
        isOneTime: 'false',
        minCredit: String(creditRange[0]),
        maxCredit: String(creditRange[1]),
        minVacancy: String(vacanciesRange[0]),
        maxVacancy: String(vacanciesRange[1]),
        rating: String(rating),
        status,
        sortBy,
      });

      try {
        const response = await fetch(`http://localhost:3000/api/activities/all-business-activities?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const result = await response.json();
        setActivities(result);
        console.log('hi Activities:', result);
      } catch (error) {
        console.error('Error fetching scheduled activities:', error);
      }
    };
  
    fetchScheduledActivities();
  }, [ filters, sortBy ]);

  return (
    <DashboardContent>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Scheduled Activities
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => {router.push("/add-scheduled-activity");}}>
          Add Scheduled Activity
        </Button> 
      </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              ratings: RATING_OPTIONS,
              creditRange: [0, 15],
              status: STATUS_OPTIONS,
              vacanciesRange: [0, 100],
              // dateRange: [null, null],
            }}
          />

          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
            ]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
      {activities.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4, ml: 2 }}>
          No scheduled activities yet.
        </Typography>
      ) : (
        activities.map((activity: any) => (
          <Grid key={activity._id} xs={12} sm={6} md={3}>
            <ScheduledActivityItem activity={activity} />
          </Grid>
        ))
      )}
      </Grid>

      {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
