import React, { useState, useEffect, useLoadScript } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, IconButton, TextField, MenuItem, Box, Grid, Paper, Button, Link } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LayoutTempleAdmin from '../../Layout/LayoutTempleAdmin';
import map from '../../asset/map.png'
import axios from 'axios';
import { hostname } from '../../hostname';
import pagoda from '../../asset/pagoda.png'
import Snackbar from '../snackbar';
import { useHistory } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow, withScriptjs, withGoogleMap } from "react-google-maps"
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)


function ManageLocation() {
    const history = useHistory()
    const temple_id = localStorage.getItem("temple_id")
    const [templeData, setTempleData] = useState([])
    const [templeLat, setTempleLat] = useState("")
    const [templeLng, setTempleLng] = useState("")
    const [mapLat, setMapLat] = useState("")
    const [mapLng, setMapLng] = useState("")
    const [address, setAddress] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });

    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
        <GoogleMap defaultZoom={17} center={{ lat: mapLat, lng: mapLng }}>
            <Marker
                position={{ lat: mapLat, lng: mapLng }}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
            >
                <InfoWindow position={{ lat: mapLat, lng: mapLng }}>
                    <div>
                        <span style={{ padding: 0, margin: 0 }}>{address}</span>
                    </div>
                </InfoWindow>
            </Marker>

            <Autocomplete
                style={{
                    width: '100%',
                    height: '40px',
                    paddingLeft: '16px',
                    marginTop: '2px',
                    marginBottom: '2rem',
                    fontFamily: " Ubuntu,Kanit "

                }}
                options={{
                    componentRestrictions: { country: "th" },
                    fields: ["formatted_address", "geometry", "name"],
                    types: []
                }}

                onPlaceSelected={onPlaceSelected}
            />
        </GoogleMap>
    ));

    const onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat()
        let newLng = event.latLng.lng()

        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address
                setMapLat(newLat)
                setMapLng(newLng)
                setAddress(address)
            },
            error => {
                console.error(error);
            }
        );
    }

    const onPlaceSelected = (place) => {
        if (!place.geometry || !place.geometry.location) {
            setOpenSnackbar({ status: true, type: "error", msg: "ไม่มีตำแหน่งที่ตั้งนี้" });
        } else {
            let latValue = place.geometry.location.lat()
            let lngValue = place.geometry.location.lng();
            const address = place.name + "\n" + place.formatted_address
            setAddress(address)
            setMapLat(latValue)
            setMapLng(lngValue)
        }
    };

    const getCurrentLocation = () => {
        if (templeLat == null && templeLng == null) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(location => {
                    setMapLat(location.coords.latitude)
                    setMapLng(location.coords.longitude)

                    Geocode.fromLatLng(location.coords.latitude, location.coords.longitude).then(
                        response => {
                            const address = response.results[0].formatted_address
                            setAddress(address)
                        },
                        error => {
                            console.error(error);
                        }
                    );
                },
                    () => {
                        setOpenSnackbar({ status: true, type: "error", msg: "กรุณาเปิดตำแหน่งที่ตั้งก่อน" });
                    }
                )
            }

        } else {
            setMapLat(templeLat)
            setMapLng(templeLng)

            Geocode.fromLatLng(templeLat, templeLng).then(
                response => {
                    const address = response.results[0].formatted_address
                    setAddress(address)
                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    const getTempleByTempleId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleByTempleId`,
            data: {
                "temple_id": temple_id
            },
        });
        setTempleData(res.data.temple[0])
        setTempleLat(res.data.temple[0].temple_latitude)
        setTempleLng(res.data.temple[0].temple_longitude)
    }

    const handleUpdateTempleLocation = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleByTempleId`,
            data: {
                "temple_id": temple_id,
                "temple_latitude": mapLat,
                "temple_longitude": mapLng,
            },
        });



        setOpenSnackbar({ status: true, type: "success", msg: "อัพเดทตำแหน่งที่ตั้งสำเร็จ" });
        getTempleByTempleId()

    }

    useEffect(() => {
        if (temple_id) {
            getTempleByTempleId()
            getCurrentLocation()
        }
        if (!temple_id) {


            setOpenSnackbar({ status: true, type: "error", msg: "คุณยังไม่ได้เพิ่มวัด กรุณาเพิ่มวัดก่อน" });

        }
        if (templeData.temple_status === 0) {

            setOpenSnackbar({ status: true, type: "error", msg: "วัดของคุณยังไม่ได้อนุมัติ โปรดรอผู้ดูแลระบบอนุมัติก่อน" });
        }
    }, [templeLat, templeLng])

    return <>
        <LayoutTempleAdmin>
            {!temple_id || templeData.temple_status === 0 ? "" :
                <Grid container justifyContent="center" spacing={2} >
                    <Grid item md={10}>
                        <Paper sx={{ p: 2, textAlign: { md: "center" } }}>
                            <Typography variant="h6" style={{ padding: "2%" }}>
                                <b>จัดการตำแหน่งที่ตั้งของวัด</b>
                                <Box
                                    component="img"
                                    sx={{ width: { xs: "10%", sm: "6%", md: "3%" }, ml: { md: 1, xs: "2px" } }}
                                    alt="logo"
                                    src={map}
                                />
                            </Typography>
                            <Grid container justifyContent="flex-start">
                                <Grid item xs={12}>
                                    <Typography variant="h6" style={{ textAlign: "left", padding: "2%" }}>
                                        <Box
                                            component="img"
                                            sx={{ width: { xs: "10%", sm: "6%", md: "3%" }, mr: { md: 1, xs: "3px" } }}
                                            alt="logo"
                                            src={pagoda}
                                        />
                                        {templeData.temple_name}
                                    </Typography>
                                </Grid>

                                <Typography variant="h6" style={{ textAlign: "left", padding: "2%" }}>
                                    <Box
                                        component="img"
                                        sx={{ width: { xs: "10%", sm: "6%", md: "3%" }, mr: { md: 1, xs: "3px" } }}
                                        alt="logo"
                                        src={map}
                                    />
                                    Location
                                </Typography>

                                <div style={{ height: '100%', width: '100%' }}>
                                    <MapWithAMarker
                                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                                        loadingElement={<div style={{ height: `100%` }} />}
                                        containerElement={<div style={{ height: `400px` }} />}
                                        mapElement={<div style={{ height: `100%` }} />}
                                    />
                                </div>
                            </Grid>

                            <Grid container justifyContent="center" alignItems="center">
                                {templeLat == null && templeLat == null ?
                                    <Button variant="contained" size="medium" color="add" sx={{ marginTop: '60px' }}
                                        onClick={() => {
                                            handleUpdateTempleLocation()
                                        }}>
                                        เพิ่มตำแหน่งที่ตั้ง
                                    </Button>
                                    :
                                    <Button variant="contained" size="medium" color="save" sx={{ marginTop: '60px', }}
                                        onClick={() => {
                                            handleUpdateTempleLocation()
                                        }}>
                                        อัพเดทตำแหน่งที่ตั้ง
                                    </Button>
                                }
                            </Grid>


                        </Paper>
                    </Grid>
                </Grid>
            }
        </LayoutTempleAdmin >

        <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
    </>;
}

export default ManageLocation
