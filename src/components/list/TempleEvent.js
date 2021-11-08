import React, { useState, useEffect } from 'react'
import Layout from '../../Layout/Layout'
import { Button, Grid, Paper, Typography, Table, TableRow, TableCell, Card, Box, CardActionArea, CardMedia, CardContent } from '@mui/material'
import PropTypes from 'prop-types';
import Hidden from '@mui/material/Hidden';
import image from '../../asset/image.jpeg'
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { hostname } from '../../hostname';
import festival from '../../asset/festival.png'
import LinesEllipsis from 'react-lines-ellipsis'
import Snackbar from '../snackbar';

const useStyles = makeStyles({
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 160,
    },
});

function TempleEvent() {
    const history = useHistory()
    const classes = useStyles();

    const queryParams = new URLSearchParams(window.location.search);
    const temple_id = queryParams.get('temple_id');
    const [eventData, setEventData] = useState([])
    const [templeName, setTempleName] = useState("")

    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });

    const getTempleEventByTempleId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleEventByTempleId`,
            data: {
                "temple_id": temple_id
            },
        });
        let resData = res.data
        if (resData.length !== 0 && resData.length > 0) {
            setEventData(resData)
            setTempleName(resData[0].temple_name)
        } else {
            setOpenSnackbar({ status: true, type: "error", msg: "ยังไม่มีข้อมูลกิจกรรมของวัดนี้" });
        }

    }


    useEffect(() => {
        getTempleEventByTempleId()
    }, [])

    return <>
        <Layout>
            <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
                <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                    <Typography variant="h5" sx={{ textAlign: { md: "center", xs: "left" }, padding: "2%", mt: 2, mb: 4 }}>
                        {templeName !== "" ?
                            `งานกิจกรรมของ ${templeName} `
                            :
                            `งานกิจกรรม `
                        }
                        <Box
                            component="img"
                            sx={{ width: { xs: "8%", md: "5%" }, ml: { md: 1, xs: "2px" } }}
                            alt="logo"
                            src={festival}
                        />
                    </Typography>

                    {eventData !== 0 && eventData > 0 ? ""
                        :
                        eventData.map((data) => (
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
                        ))
                    }
                </Grid>
            </Grid>
            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
        </Layout>
    </>;
}

export default TempleEvent
