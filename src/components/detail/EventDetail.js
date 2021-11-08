import { Paper, Grid, Typography, Button, Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Layout from '../../Layout/Layout'
import image from '../../asset/image.jpeg'
import sign from '../../asset/sign.png'
import event from '../../asset/event.png'
import map from '../../asset/map.png'
import temple from '../../asset/temple.png'
import schedule from '../../asset/schedule.png'
import pagoda from '../../asset/pagoda.png'
import axios from 'axios'
import { hostname } from '../../hostname'
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import moment from "moment";
import planner from '../../asset/planner.png'

function EventDetail() {

    const queryParams = new URLSearchParams(window.location.search);
    const temple_event_id = queryParams.get('temple_event_id');
    const [eventDetail, setEventDetail] = useState([])
    const [eventPicData, setEventPicData] = useState([])

    const getTempleEventByTempleEventId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleEventByTempleEventId`,
            data: {
                "temple_event_id": temple_event_id
            },
        });
        setEventDetail(res.data.temple_event)
        setEventPicData(res.data.temple_event_pic)
    }

    useEffect(() => {
        getTempleEventByTempleEventId()
    }, [])

    return <>
        <Layout>
            {eventDetail.map((data) => (
                <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
                    <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                        <Typography variant="h5" style={{ textAlign: "center", padding: "2%", marginTop: "2%" }}>
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "4%" }, ml: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={pagoda}
                            />
                            {` รายละเอียดกิจกรรม`}
                        </Typography>

                        <Typography sx={{ display: { md: "block", xs: "none" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                            _____________________________________________________________
                        </Typography>

                        <Typography sx={{ display: { md: "none", xs: "block" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                            _______________________________
                        </Typography>

                        <Typography variant="h6" style={{ padding: "2%", marginLeft: "2%", marginBottom: "2%" }}>
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "4%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={temple}
                            />
                            {` ${data.temple_name}`}
                        </Typography>
                        <Typography variant="h6" style={{ marginLeft: "4%", marginBottom: "1%" }}>
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "4%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={planner}
                            />
                            {` ${data.temple_event_name}`}
                        </Typography>
                        <Typography style={{ marginLeft: "4%", marginBottom: "2%" }}>
                            โดย : {data.user_firstname} {data.user_lastname}
                        </Typography>

                        <Grid container style={{ padding: "3%", marginBottom: "2%" }}>
                            <Grid item xs={12} md={6}>
                                {eventPicData == "" ?
                                    <img src="https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg" width="100%" />
                                    :
                                    <Carousel showArrows={true} autoPlay={true} interval={3000} infiniteLoop={true}>

                                        {eventPicData.map((data) => (
                                            <div>
                                                <img src={data.temple_event_pic_url} width="100%" />
                                            </div>
                                        ))}
                                    </Carousel>
                                }
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ padding: "2%", fontSize: "16px" }}>
                                {data.temple_event_description}
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={4} >
                                <Typography variant="h6" style={{ padding: "2%", fontWeight: "bold" }}>
                                    <Box
                                        component="img"
                                        sx={{ width: { xs: "18%", md: "8%" }, mr: { md: 1, xs: "2px" } }}
                                        alt="logo"
                                        src={sign}
                                    />
                                    {` ที่ตั้ง`}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} >
                                <Typography variant="h6" style={{ padding: "2%", fontWeight: "bold" }}>
                                    <Box
                                        component="img"
                                        sx={{ width: { xs: "18%", md: "8%" }, mr: { md: 1, xs: "2px" } }}
                                        alt="logo"
                                        src={schedule}
                                    />
                                    {` วันที่เริ่ม`}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} >
                                <Typography variant="h6" style={{ padding: "2%", fontWeight: "bold" }}>
                                    <Box
                                        component="img"
                                        sx={{ width: { xs: "18%", md: "8%" }, mr: { md: 1, xs: "2px" } }}
                                        alt="logo"
                                        src={schedule}
                                    />
                                    {` วันที่สิ้นสุด`}
                                </Typography>
                            </Grid>

                            <Grid item xs={4} >
                                <Typography style={{ padding: "2%", marginBottom: "10%" }}>
                                    {data.temple_address}
                                </Typography>
                            </Grid>

                            <Grid item xs={4} >
                                <Typography style={{ padding: "2%", marginLeft: "17%" }}>
                                    {data.temple_event_start_time == "Invalid date" ?
                                        `-`
                                        :

                                        `${moment(data.temple_event_start_time).format("DD/MM/YYYY")}`}
                                </Typography>
                            </Grid>

                            <Grid item xs={4} >
                                <Typography style={{ padding: "2%", marginLeft: "17%" }}>
                                    {data.temple_event_end_time == "Invalid date" ?
                                        `-`
                                        :
                                        `${moment(data.temple_event_end_time).format("DD/MM/YYYY")}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Layout>
    </>;
}

export default EventDetail
