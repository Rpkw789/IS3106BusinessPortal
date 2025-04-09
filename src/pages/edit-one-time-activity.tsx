import { Helmet } from 'react-helmet-async';
import {EditNewOneTimeActivityPage} from 'src/sections/product/view/edit-one-time-activity';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
          <Helmet>
            <title> {`Edit New One Time Activity - ${CONFIG.appName}`}</title>
          </Helmet>
    
          <EditNewOneTimeActivityPage />
        </>
      );
}