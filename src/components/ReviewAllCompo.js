import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, Grid, Paper, IconButton, Box, Typography, TextField } from '@mui/material'
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { hostname } from '../hostname';
import comment from '../asset/comment.png'
import pagoda from '../asset/pagoda.png'
import image from '../asset/image.jpeg'
import img from '../asset/img1.jpeg'
import bg from '../asset/bg.jpeg'
import { useHistory } from "react-router-dom";
import CardActionArea from '@mui/material/CardActionArea';
import MaterialTable from "material-table";
import Snackbar from './snackbar';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageUploading from 'react-images-uploading';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import MUIDataTable from "mui-datatables";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function ReviewAllCompo() {
    const theme = useTheme();
    const history = useHistory();
    const [reviewAllData, setReviewAllData] = useState([])
    const user_id = localStorage.getItem("user_id")
    const [IdReview, setIdReview] = useState("")
    const [TopicReview, setTopicReview] = useState("")
    const [DescriptionReview, setDescriptionReview] = useState("")
    const [openEditReviewDialog, setOpenEditReviewDialog] = useState(false);
    const [openDialogRemove, setOpenDialogRemove] = useState(false);
    const [idRemove, setIdRemove] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [templeReviewPicData, setTempleReviewPicData] = useState(false)
    const [openImagePickDialog, setOpenImagePickDialog] = useState(false);
    const [images, setImages] = useState([])
    const [templeId, setTempleId] = useState("")

    const [deleteTempleReviewPicDialog, setDeleteTempleReviewPicDialog] = useState(false)
    const [deleteTempleReviewPicData, setDeleteTempleReviewPicData] = useState("")

    const handleDeleteTempleReviewPic = async (rowData) => {
        setDeleteTempleReviewPicDialog(true);
        setDeleteTempleReviewPicData(rowData)
    }

    const onChangeImagePick = (imageList) => {
        setImages(imageList);
    };

    const uploadPic = async () => {
        let res = axios({
            method: "post",
            url: `${hostname}/temple/addTempleReviewPic`,
            data: {
                "temple_review_id": IdReview,
                "temple_id": templeId,
                "temple_review_pic_url": images
            },
        });

        setOpenImagePickDialog(false)
        await setImages([])
        getTempleReviewPicByTempleReviewId(IdReview)
        getAllTempleReview()
        setOpenSnackbar({ status: true, type: "success", msg: "เพิ่มรูปภาพสำเร็จ" });


    }

    const deletePic = async (temple_review_pic_id, temple_review_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewPicByTempleReviewPicId`,
            data: { temple_review_pic_id: temple_review_pic_id }
        });
        if (res.data) {
            getTempleReviewPicByTempleReviewId(temple_review_id)
            getAllTempleReview()
            setOpenSnackbar({ status: true, type: "success", msg: "ลบรูปภาพสำเร็จ" });
        }

    }

    const getAllTempleReview = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTempleReview`,
            data: {},
        });
        let resData = res.data
        setReviewAllData(resData)

    }

    const handleOpenEditReviewDialog = async (temple_review_id) => {
        let resTempleReview = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewByTempleReviewId`,
            data: {
                temple_review_id: temple_review_id
            },
        });

        const resTempleReviewData = resTempleReview.data.temple_review
        getTempleReviewPicByTempleReviewId(resTempleReviewData[0].temple_review_id)
        setIdReview(resTempleReviewData[0].temple_review_id)
        setTempleId(resTempleReviewData[0].temple_id)
        setTopicReview(resTempleReviewData[0].temple_review_topic)
        setDescriptionReview(resTempleReviewData[0].temple_review_description)
        setOpenEditReviewDialog(true);

        getAllTempleReview()

    };

    const getTempleReviewPicByTempleReviewId = async (temple_review_id) => {
        let resTempleReviewPic = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewPicByTempleReviewId`,
            data: {
                "temple_review_id": temple_review_id
            },
        });

        setTempleReviewPicData(resTempleReviewPic.data)
    }

    const editReview = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleReviewByTempleReviewId`,
            data: {
                "temple_review_id": IdReview,
                "temple_review_topic": TopicReview,
                "temple_review_description": DescriptionReview,
                "temple_review_status": 2
            },
        });

        if (res.data.status == "update_success") {
            setOpenEditReviewDialog(false)
            setOpenSnackbar({ status: true, type: "warning", msg: "แก้ไขรีวิวสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
        }
        getAllTempleReview()
    }


    const handleClickOpenRemove = (temple_review_id) => {
        setOpenDialogRemove(true);
        setIdRemove(temple_review_id)
    };

    const deleteReview = async () => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewByTempleReviewId`,
            data: { temple_review_id: idRemove },
        });
        setOpenDialogRemove(false);
        setOpenSnackbar({ status: true, type: "success", msg: "ลบรีวิวสำเร็จ" });
    }


    useEffect(() => {
        getAllTempleReview()

    }, [])


    return <>
        <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
            <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                <Typography variant="h5" sx={{ textAlign: "center", padding: "2%", mt: 2 }}>
                    {`รีวิวทั้งหมด `}
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

                {reviewAllData.map((data) => (
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
                        <Card sx={{ width: "100%", mb: 2 }}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" sx={{ backgroundColor: red[500], }}>
                                        {data.user_firstname}
                                    </Avatar>
                                }
                                title={data.user_firstname + "  " + data.user_lastname}
                                subheader={data.temple_review_create_time}
                                action={
                                    <>
                                        {user_id == data.user_id ?
                                            <>
                                                <Grid container >
                                                    <Grid item xs={5}>
                                                        <IconButton
                                                            onClick={() => handleOpenEditReviewDialog(data.temple_review_id)}
                                                            style={{ marginRight: "10%" }}
                                                            size="large">
                                                            <EditIcon style={{ color: "orange" }} />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <IconButton onClick={() => handleClickOpenRemove(data.temple_review_id)} size="large">
                                                            <DeleteIcon color="cancel" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </>
                                            :
                                            ""
                                        }
                                    </>
                                }
                            />
                            <CardActionArea onClick={() => {
                                {
                                    history.push('/reviewDetail?temple_review_id=' + data.temple_review_id);
                                }
                            }}>
                                <Grid container justifyContent="center">
                                    <Grid item xs={12}>
                                        {data.temple_review_pic_url == undefined ?
                                            <CardMedia
                                                sx={{ height: '250px' }}
                                                image={"https://doozypos.com/assets/no-image.png"}
                                                title="Paella dish"
                                            />
                                            :
                                            <CardMedia
                                                sx={{ height: '250px' }}
                                                image={data.temple_review_pic_url}
                                                title="Paella dish"
                                            />

                                        }
                                    </Grid>
                                </Grid>
                                <CardContent>
                                    <Typography variant="body2" style={{ fontSize: '16px' }} color="TextSecondary" component="p">
                                        <b> {data.temple_review_topic}</b>
                                    </Typography>
                                    <Typography variant="body2" style={{ fontSize: '16px' }} color="TextSecondary" component="p">
                                        {data.temple_review_description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions >
                                <Grid container justifyContent="flex-end" alignItems="flex-end">
                                    <Button size="small" color="primary" onClick={() => {
                                        {
                                            history.push('/reviewDetail?temple_review_id=' + data.temple_review_id);
                                        }
                                    }}>
                                        <Typography>อ่านรีวิวเพิ่มเติม</Typography>
                                    </Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </>
                ))}
            </Grid>
        </Grid>

        <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />

        <Dialog
            open={openEditReviewDialog}
            onClose={() => setOpenEditReviewDialog(false)}
            fullWidth
            maxWidth="md"
            fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                แก้ไขรีวิว
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Grid container >
                        <Grid item xs={12}>
                            <Typography>หัวข้อรีวิว</Typography>
                            <TextField
                                fullWidth
                                value={TopicReview}
                                variant="outlined"
                                onChange={(e) => {
                                    setTopicReview(e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "3%" }}>
                            <Typography>เนื้อหา</Typography>
                            <TextField
                                multiline
                                rows={6}
                                fullWidth
                                value={DescriptionReview}
                                variant="outlined"
                                onChange={(e) => {
                                    setDescriptionReview(e.target.value)
                                }}
                            />

                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "3%" }}>
                        <Grid item xs={5} md={3}>
                            <Typography>จัดการรูปภาพ</Typography>

                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    setOpenImagePickDialog(true);
                                }}
                                style={{ marginTop: "10%", marginBottom: "10%" }}
                            >
                                <PhotoLibraryIcon style={{ color: "white", marginRight: "5px" }} />
                                เพิ่มรูปภาพ
                            </Button>
                        </Grid>

                        {!templeReviewPicData ? "" :
                            <Box sx={{ mt: 2, px: { md: 2 } }}>
                                <MUIDataTable
                                    title={"ตารางรูปภาพ"}
                                    data={templeReviewPicData}
                                    options={{
                                        viewColumns: false,
                                        filter: false,
                                        print: false,
                                        download: false,
                                        selectableRows: false,
                                        textLabels: {
                                            body: {
                                                noMatch: "ไม่พบข้อมูล",
                                            },
                                        },
                                    }}
                                    columns={[
                                        {
                                            name: "temple_review_pic_id",
                                            label: "ลำดับ",
                                            options: {
                                                customBodyRenderLite: (dataIndex) => {
                                                    return (<div>{dataIndex + 1}</div>)
                                                }
                                            },
                                        },
                                        {
                                            name: "",
                                            label: "รูปภาพ",
                                            options: {
                                                customBodyRenderLite: (dataIndex) => {
                                                    let rowData = templeReviewPicData[dataIndex];
                                                    return rowData.temple_review_pic_url == null ? "-" :
                                                        <img style={{ display: 'block', width: "80%" }} src={rowData.temple_review_pic_url} />
                                                }
                                            },
                                        },
                                        {
                                            name: "temple_review_pic_create_time",
                                            label: "วันที่สร้าง",
                                        },
                                        {
                                            name: "",
                                            label: "จัดการ",
                                            options: {
                                                customBodyRenderLite: (dataIndex) => {
                                                    let rowData = templeReviewPicData[dataIndex];
                                                    return (
                                                        <IconButton
                                                            onClick={() => {
                                                                handleDeleteTempleReviewPic(rowData)
                                                            }}
                                                            size="large">
                                                            <Delete fontSize="medium" style={{ color: "#D9534F" }} />
                                                        </IconButton>
                                                    );
                                                }
                                            }
                                        },
                                    ]}
                                />
                            </Box>
                        }
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                <Button autoFocus onClick={() => setOpenEditReviewDialog(false)} style={{ color: "#636363" }}>
                    ยกเลิก
                </Button>
                <Button
                    variant="contained"
                    onClick={() => editReview()}
                    color="save"
                    disabled={
                        TopicReview == "" ? true :
                            DescriptionReview == "" ? true : false

                    }
                >
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={openImagePickDialog}
            onClose={() => setOpenImagePickDialog(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle >{"เพิ่มรูปภาพ"}</DialogTitle>
            <DialogContent>
                <DialogContentText >
                    <Grid container style={{ marginTop: "2%" }}>
                        <Grid item xs={12}></Grid>

                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChangeImagePick}
                            maxNumber='10'
                            dataURLKey="data_url"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageUpdate,
                                onImageRemove
                            }) => (
                                <>
                                    <Grid container>
                                        <Grid item>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="secondary"
                                                onClick={onImageUpload}
                                            >
                                                <CloudUploadIcon style={{ color: "white", marginRight: "5px" }} />
                                                เลือกรูปภาพ
                                            </Button>
                                        </Grid>
                                        <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 20 }}>
                                            <Grid item xs={12}>
                                                <Grid container justifyContent="flex-start" spacing={1} style={{ textAlign: "left" }}>

                                                    {imageList.map((image, index) => (
                                                        <div key={index}>
                                                            <Grid container justifyContent="flex-end" style={{ marginTop: '30px' }} spacing={1}>
                                                                <CancelIcon style={{ color: "#eb3434" }} onClick={() => onImageRemove(index)}></CancelIcon>

                                                            </Grid>
                                                            <Grid container justifyContent="center" spacing={1} style={{ marginRight: '20px' }} s>
                                                                <Grid item xs={12} justifyContent="center">
                                                                    <img src={image['data_url']} alt="" width="100" />

                                                                </Grid>


                                                            </Grid>

                                                        </div>

                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>

                            )}
                        </ImageUploading>

                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                <Button onClick={() => setOpenImagePickDialog(false)} style={{ color: "#636363" }}>
                    ยกเลิก
                </Button>
                {images.length == 0 ? "" :
                    <Button
                        variant="contained"
                        color="save"
                        onClick={() => {
                            uploadPic()
                        }}

                    >
                        อัพโหลด
                    </Button>
                }
            </DialogActions>
        </Dialog >

        <Dialog
            open={openDialogRemove}
            onClose={() => setOpenDialogRemove(false)}

        >
            <DialogTitle >ลบรีวิว</DialogTitle>
            <DialogContent>
                <DialogContentText >
                    <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้ ?</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialogRemove(false)} style={{ color: "gray" }}>
                    ยกเลิก
                </Button>
                <Button onClick={deleteReview} variant="contained" color="cancel" >
                    ตกลง
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={deleteTempleReviewPicDialog}
            onClose={() => { setDeleteTempleReviewPicDialog(false) }}
            maxWidth='xl'
        >
            <DialogTitle >ลบรูปภาพ</DialogTitle>
            <DialogContent>
                <DialogContentText >
                    <Typography>คุณแน่ใจหรือไม่ว่าต้องการรูปภาพนี้ ?</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleReviewPicDialog(false) }} variant="outlined">
                    ปิด
                </Button>
                <Button
                    style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                    onClick={() => {
                        deletePic(deleteTempleReviewPicData.temple_review_pic_id)
                    }}
                    variant="contained">
                    ตกลง
                </Button>

            </DialogActions>
        </Dialog>

    </>;
}

export default ReviewAllCompo

