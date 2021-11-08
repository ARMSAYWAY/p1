import { Button, Grid, Paper, Typography, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from "react-router-dom";
import Layout from '../../Layout/Layout'
import comment from '../../asset/comment.png'
import document from '../../asset/document.png'
import sign from '../../asset/sign.png'
import reviews from '../../asset/reviews.png'
import planner from '../../asset/planner.png'
import pagoda from '../../asset/pagoda.png'
import map from '../../asset/map.png'
import img1 from '../../asset/img1.jpeg'
import { Gif } from '@mui/icons-material';
import axios from 'axios';
import { hostname } from '../../hostname';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

function TempleDetail() {
    const queryParams = new URLSearchParams(window.location.search);
    const temple_id = queryParams.get('temple_id');
    const history = useHistory();
    const [templeData, setTempleData] = useState([])
    const [templePicData, setTemplePicData] = useState([])


    const getTempleByTempleId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleByTempleId`,
            data: {
                "temple_id": temple_id
            },
        });
        setTempleData(res.data.temple)
        setTemplePicData(res.data.temple_pic)
    }


    useEffect(() => {
        getTempleByTempleId()
    }, [])

    return <>
        <Layout>
            {templeData.map((data) => (
                <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
                    <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                        <Typography variant="h5" sx={{ textAlign: "center", padding: "2%", mt: 2 }}>
                            {`รายละเอียด `}
                            <Box
                                component="img"
                                sx={{ width: { xs: "9%", md: "5%" }, ml: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={comment}
                            />
                        </Typography>

                        <Typography sx={{ display: { md: "block", xs: "none" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                            _____________________________________________________________
                        </Typography>

                        <Typography sx={{ display: { md: "none", xs: "block" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                            _______________________________
                        </Typography>

                        <Typography variant="h5" sx={{ mt: "3%" }}>
                            <Box
                                component="img"
                                sx={{ width: { xs: "9%", md: "5%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={pagoda}
                            />
                            {` ${data.temple_name}`}
                        </Typography>

                        <Grid container style={{ padding: "2%" }} textAlign="center" justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                {templePicData == "" ?
                                    <Box
                                        component="img"
                                        sx={{ width: { xs: "100%", md: "50%" } }}
                                        alt="logo"
                                        src={"https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"}
                                    />
                                    :
                                    <Carousel showArrows={true} autoPlay={true} interval={3000}>

                                        {templePicData.map((data) => (
                                            <div>
                                                <img src={data.temple_pic_url} width="100%" />
                                            </div>
                                        ))}
                                    </Carousel>
                                }
                            </Grid>
                        </Grid>

                        <Typography variant="h5">
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "3%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={document}
                            />
                            {` รายละเอียด`}
                        </Typography>

                        <Grid container style={{}}>
                            <Grid item xs={12} style={{}}>
                                <Typography style={{ padding: "1%", marginLeft: "2%", fontSize: "16px", marginTop: "3px", }}>ประเภท : {data.temple_type_name}</Typography>
                                <Grid item xs={12} >
                                    <p style={{ textIndent: '2.5em', marginLeft: "3%", marginRight: "3%", fontSize: "16px", marginTop: "1%", }}>
                                        {data.temple_description}
                                    </p>
                                    <br />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Typography variant="h5">
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "3%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={sign}
                            />
                            {` ที่ตั้ง`}
                        </Typography>

                        <Grid container style={{}}>
                            <Grid item xs={12} style={{ marginTop: "3%", fontSize: "16px", marginLeft: "3%", marginBottom: '3%' }}>
                                {data.temple_address}
                            </Grid>
                        </Grid>

                        <Typography variant="h5" sx={{ mt: 2 }}>
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "3%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={map}
                            />
                            {` Location`}
                        </Typography>

                        <Grid container justifyContent="center" style={{}}>
                            <Grid item xs={12} md={9} sx={{ my: "2%" }}>
                                {data.temple_latitude ?
                                    <iframe
                                        style={{ width: "100%", height: "450px", border: 2, }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${data.temple_latitude},${data.temple_longitude}&zoom=18`}
                                    >
                                    </iframe>
                                    :
                                    <Typography sx={{ textAlign: "center", py: 2 }}>ยังไม่มีตำแหน่งที่ตั้งของวัดนี้</Typography>
                                }
                            </Grid>

                        </Grid>
                    </Grid>


                    <Grid item xs={12} md={8} style={{ background: "white", border: "1px solid #F2F3F4", borderRadius: "5px", padding: "3%", marginTop: "2%", boxShadow: "2px 3px 3px gray" }}>
                        <Grid container justifyContent="center" spacing={3} >
                            <Grid item xs={6}>
                                <Paper style={{ width: "100%", height: "150px" }}>
                                    <Button fullWidth variant="contained" style={{ height: "100%", background: "white" }} onClick={() => history.push("/templeEvent?temple_id=" + data.temple_id)} >
                                        <Box>
                                            <Box
                                                component="img"
                                                sx={{ width: { xs: "50%", md: "25%" } }}
                                                alt="logo"
                                                src={planner}
                                            />

                                            <Typography>กิจกรรม</Typography>
                                        </Box>
                                    </Button>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper style={{ width: "100%", height: "150px" }}>
                                    <Button fullWidth variant="contained" style={{ height: "100%", background: "white" }} onClick={() => history.push("/templeReview?temple_id=" + data.temple_id)}>
                                        <Typography>
                                            <Box
                                                component="img"
                                                sx={{ width: { xs: "50%", md: "25%" } }}
                                                alt="logo"
                                                src={reviews}
                                            />
                                            <Typography>รีวิว</Typography></Typography>
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            ))}



        </Layout>
    </>;
}

export default TempleDetail
