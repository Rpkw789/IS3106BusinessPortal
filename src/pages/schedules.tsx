import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { SchedulesViewPage } from '../sections/schedules/view/schedules-view';

export default function Page() {

    return (
        <>
          <Helmet>
            <title> {`Schedules - ${CONFIG.appName}`}</title>
          </Helmet>

          <SchedulesViewPage />
        </>
    );
}