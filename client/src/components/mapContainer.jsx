
import { withScriptjs } from "react-google-maps";

import Map from './maps';

function MapBox() {

    const MapLoader = withScriptjs(Map);

    return (

        <div >

            <MapLoader
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBBdLwgq654sdECkOB5f-kSTtnr-do941U"
                loadingElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}

export default MapBox;