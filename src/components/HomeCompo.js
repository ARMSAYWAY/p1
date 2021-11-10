import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@mui/styles';
import { Button, Typography, Grid, Card, Paper, Hidden, Link, Box, CardActionArea, CardActions, CardContent, CardMedia, TextField, MenuItem } from "@mui/material";
import bg from '../asset/bg.jpeg'
import LinesEllipsis from 'react-lines-ellipsis'
import { hostname } from "../hostname";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Snackbar from './snackbar';
import search from '../asset/search.png'
import ReactPaginate from 'react-paginate';
import './../Pagination.css'

const useStyles = makeStyles((theme) => ({
    mainFeaturedPost: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
}));

function HomeCompo() {
    const history = useHistory();
    const [allTemple, setAllTemple] = useState([])
    const [templeName, setTempleName] = useState("")
    const [templeType, setTempleType] = useState("0");
    const [pageNumber, setPageNumber] = useState(0);
    const templePerPage = 6;
    const pagesVisited = pageNumber * templePerPage;
    const pageCount = Math.ceil(allTemple.length / templePerPage);
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });

    const searchTempleWithAllTempleType = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/searchTempleWithAllTempleType/`,
            data: { temple_name: templeName },
        });

        setAllTemple(res.data)

        if (res.data.status == "no_data") {
            setOpenSnackbar({ status: true, type: "error", msg: res.data.data });
        }
    }

    const searchTempleWithTempleTypeId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/searchTempleWithTempleTypeId/`,
            data: {
                temple_name: templeName,
                temple_type_id: templeType
            },
        });

        setAllTemple(res.data)

        if (res.data.status == "no_data") {
            setOpenSnackbar({ status: true, type: "error", msg: res.data.data });
        }
    }

    const handleClickSearch = () => {
        if (templeType == 0) {
            searchTempleWithAllTempleType()
        } else {
            searchTempleWithTempleTypeId()
        }
    }

    useEffect(() => {
        handleClickSearch()
    }, [])

    return (
        <>
            <Paper sx={{
                color: "white",
                marginBottom: 4,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${bg})`, height: "500px", display: 'flex'
            }}>
                <Grid container>
                    <Grid item md={7}>
                        <Box sx={{ position: 'relative', padding: { md: 6, xs: 3 } }}>
                            <Typography variant="h3" color="inherit" gutterBottom>
                                Temple Tourism System In Esan
                            </Typography>
                            <Typography variant="h5" color="inherit" paragraph>
                                ค้นหาวัดในภาคอีสานตามความต้องการของคุณ
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container justify="center" alignItems="center" direction="column">
                <Grid item md={12} sx={{ boxShadow: '3px 3px 4px silver', padding: 2 }}>
                    <Grid item xs={12} justify="flex-start">
                        <Typography variant="h5">
                            ค้นหาวัดที่คุณต้องการ <img src={search} width="4%" />
                        </Typography>
                        <TextField
                            fullWidth
                            margin="normal"
                            value={templeName}
                            label={"ชื่อวัด..."}
                            variant="outlined"
                            onChange={(e) => {
                                setTempleName(e.target.value)
                            }}
                        />
                    </Grid>

                    <Grid container columnSpacing={1} sx={{ mt: 2 }}>
                        <Grid item xs={7}>
                            <TextField
                                id="standard-select-currency"
                                select
                                fullWidth
                                size="large"
                                label="ประเภทของวัด"
                                variant="outlined"
                                value={templeType}
                                onChange={(e) => {
                                    setTempleType(e.target.value)
                                }}
                            >
                                <MenuItem value={'0'}>วัดทั้งหมด</MenuItem>
                                <MenuItem value={'1'}>วัดทั่วไป</MenuItem>
                                <MenuItem value={'2'}>วัดป่า</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={5} sx={{ mt: "6px" }}>
                            <Box textAlign='center'>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    textAlign="center"
                                    onClick={handleClickSearch}
                                >
                                    ค้นหา
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: { xs: "10%", md: "2%" } }}
            >
                {
                    allTemple.status == "no_data" ?
                        <Grid style={{ marginBottom: '8%' }} />
                        :
                        allTemple.slice(pagesVisited, pagesVisited + templePerPage).map((data) => (

                            <Card sx={{ maxWidth: 345, m: { md: '1%' }, mb: { xs: "5%" }, mx: { xs: "1%" } }}>
                                <CardActionArea onClick={() => {
                                    {
                                        history.push('/templeDetail?temple_id=' + data.temple_id)
                                    }
                                }}>
                                    {data.temple_pic_url == null || data.temple_pic_url == "" ?
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image="https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
                                        />
                                        :
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image={data.temple_pic_url}
                                        />
                                    }
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">
                                            {data.temple_name}
                                        </Typography>

                                        <p style={{ fontFamily: "Ubuntu,Kanit", fontSize: '14px' }}>
                                            <LinesEllipsis
                                                text={data.temple_description}
                                                maxLine='3'
                                                ellipsis='...'
                                                trimRight
                                                basedOn='letters'
                                            />
                                        </p>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button size="small" color="primary" style={{ marginLeft: "65%" }} onClick={() => {
                                        {
                                            history.push('/templeDetail?temple_id=' + data.temple_id)
                                        }
                                    }}>
                                        รายละเอียดเพิ่มเติม
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                }
            </Grid>

            <ReactPaginate
                previousLabel={"ก่อนหน้า"}
                nextLabel={"ถัดไป"}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={6}
                onPageChange={({ selected }) => setPageNumber(selected)}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                disabledClassName={"page-item disabled"}
                activeClassName={"page-item active"}
            />


            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
        </>
    )
}

export default HomeCompo
