import React, { useState, useEffect } from 'react'
import { Button, Grid, Paper, Typography, Box, Card, CardActionArea, CardMedia, CardContent } from '@mui/material'
import Hidden from '@mui/material/Hidden';
import image from '../asset/image.jpeg'
import { Link, useHistory } from "react-router-dom";
import planner from '../asset/planner.png'
import pagoda from '../asset/pagoda.png'
import axios from 'axios';
import { hostname } from '../hostname';
import LinesEllipsis from 'react-lines-ellipsis'

function EventAllCompo() {
    const history = useHistory();
    const [eventAllData, setEventAllData] = useState([])
    const [templeName, setTempleName] = useState("")

    const getAllTempleEvent = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTempleEvent`,
            data: {},
        });
        let resData = res.data
        setEventAllData(resData)
        // setTempleName(res.data.temple_name)
    }

    useEffect(() => {
        getAllTempleEvent()

    }, [])

    return <>
        <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
            <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                <Typography variant="h5" sx={{ textAlign: "center", padding: "2%", mt: 2 }}>
                    {`งานกิจกรรมทั้งหมด `}
                    <Box
                        component="img"
                        sx={{ width: { xs: "9%", md: "5%" }, ml: { md: 1, xs: "2px" } }}
                        alt="logo"
                        src={planner}
                    />
                </Typography>

                <Typography sx={{ display: { md: "block", xs: "none" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                    _____________________________________________________________
                </Typography>

                <Typography sx={{ display: { md: "none", xs: "block" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                    _______________________________
                </Typography>

                {eventAllData.map((data) => (
                    <>
                        <Grid container style={{ padding: "2%" }}>
                            <Typography variant="h6" style={{ marginTop: "2%" }}>
                                <Box
                                    component="img"
                                    sx={{ width: { xs: "8%", md: "6%" }, mr: { md: 1, xs: "2px" } }}
                                    alt="logo"
                                    src={pagoda}
                                />
                                {` ${data.temple_name}`}
                            </Typography>
                        </Grid>

                        <CardActionArea onClick={() => {
                            {
                                history.push('/eventDetail?temple_event_id=' + data.temple_event_id)
                            }
                        }}>
                            <Card sx={{ marginBottom: 2, display: 'flex', }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 160, display: { xs: 'none', md: 'flex' } }}
                                    image={
                                        !data.temple_event_pic_url ? "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg" :
                                            data.temple_event_pic_url
                                    }
                                />
                                <Box sx={{ flex: 1 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ display: { xs: 'flex', md: 'none' } }}
                                        image={
                                            !data.temple_event_pic_url ? "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg" :
                                                data.temple_event_pic_url
                                        }
                                    />
                                    <CardContent>
                                        <Typography component="h2" variant="h6">
                                            {data.temple_event_name}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {
                                                data.temple_event_start_time == "Invalid date" ?
                                                    `วันที่เริ่มต้น : -`
                                                    :
                                                    `วันที่เริ่มต้น : ${data.temple_event_start_time}`

                                            }
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {
                                                data.temple_event_end_time == "Invalid date" ?
                                                    `วันที่สิ้นสุด : -`
                                                    :
                                                    `วันที่สิ้นสุด : ${data.temple_event_end_time}`

                                            }
                                        </Typography>
                                        <Typography variant="subtitle1" paragraph>
                                            <LinesEllipsis
                                                text={`รายละเอียด : ${data.temple_event_description}`}
                                                maxLine='2'
                                                ellipsis='...'
                                                trimRight
                                                basedOn='letters'
                                            />
                                        </Typography>
                                        <Typography variant="subtitle1" color="primary" style={{ textAlign: "right" }}>
                                            รายละเอียดเพิ่มเติม
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Card>
                        </CardActionArea>
                    </>
                ))}
            </Grid>
        </Grid>
    </>;
}

export default EventAllCompo
