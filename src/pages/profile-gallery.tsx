
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ProductCustomerPage } from 'src/sections/product/view/product-customers-page';
import { ProfileGalleryView } from 'src/sections/profileGallery';

// ----------------------------------------------------------------------

export default function GalleryPage() {
    return (
        <>
            <Helmet>
                <title> {`Gallery - ${CONFIG.appName}`}</title>
            </Helmet>

            <ProfileGalleryView />
        </>
    );
}