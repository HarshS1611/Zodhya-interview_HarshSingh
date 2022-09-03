/*global google*/
import React, { Component } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    DirectionsRenderer
} from "react-google-maps";
class Map extends Component {
    state = {
        directions: null,
        currCity: JSON.parse(localStorage.getItem("fromCity")),
        toCity: JSON.parse(localStorage.getItem("toCity"))

    };

    componentDidMount() {
        const directionsService = new google.maps.DirectionsService();
        console.log(this.state.currCity.location);
        const origin = { lat: this.state.currCity.location.lat, lng: this.state.currCity.location.lon };
        const destination = { lat: this.state.toCity.location.lat, lng: this.state.toCity.location.lon };

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: [
                    {
                        location: new google.maps.LatLng(this.state.currCity.location.lat, this.state.currCity.location.lon)
                    },
                    {
                        location: new google.maps.LatLng(this.state.toCity.location.lat, this.state.toCity.location.lon)
                    }
                ]
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    console.log(result)
                    this.setState({
                        directions: result
                    });
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }

    render() {
        const GoogleMapExample = withGoogleMap(props => (
            <GoogleMap
                defaultCenter={{ lat: 28.625941995627766, lng: 77.20821014842399 }}
                defaultZoom={13}
            >
                <DirectionsRenderer
                    directions={this.state.directions}
                />
            </GoogleMap>
        ));

        return (
            <div>
                <GoogleMapExample
                    containerElement={<div style={{ height: `400px`, width: "100%" }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>


        );
    }
}

export default Map;