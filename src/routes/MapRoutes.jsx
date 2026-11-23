import { Route } from "react-router-dom";

import SujeongMap from "../pages/SujeongMap/SujeongMap";

const MapRoutes = (
  <>
    <Route path="/map" element={<SujeongMap />} />
  </>
);

export default MapRoutes;
