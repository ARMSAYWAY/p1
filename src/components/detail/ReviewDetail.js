import React, { useState, useEffect } from 'react'
import makeStyles from '@mui/styles/makeStyles';
import Layout from '../../Layout/Layout'
import { Button, Grid, Paper, Typography, TextField, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import axios from 'axios';
import { hostname } from '../../hostname';
import comment from '../../asset/comments.png'
import commentUser from '../../asset/comment.png'
import SendIcon from '@mui/icons-material/Send';
import pagoda from '../../asset/pagoda.png'
import user from '../../asset/user.png'
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import pin from '../../asset/pin.png'
import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '../snackbar';


function ReviewDetail() {
    const queryParams = new URLSearchParams(window.location.search);
    const temple_review_id = queryParams.get('temple_review_id');
    const [reviewData, setReviewData] = useState([])
    const [reviewPicData, setReviewPicData] = useState([])
    const user_id = localStorage.getItem("user_id")
    const [commentData, setCommentData] = useState([])
    const [detailComment, setDetailComment] = useState("")
    const [commentId, setCommentId] = useState("")
    const [openEditComment, setOpenEditComment] = useState(false)
    const [descriptionComment, setDescriptionComment] = useState("")
    const [idRemove, setIdRemove] = useState([])
    const [openDialogRemoveComment, setOpenDialogRemoveComment] = useState(false)
    const [resData, setResData] = useState([])
    const [templeId, setTempleId] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });


    const CloseEditComment = () => {
        setOpenEditComment(false);
    };

    const handleOpenRemoveComment = (temple_review_comment_id) => {
        setOpenDialogRemoveComment(true)
        setIdRemove(temple_review_comment_id)
    }
    const handleCloseRemoveComment = () => {
        setOpenDialogRemoveComment(false);
    };


    const handleOpenCommentDialog = async (temple_review_comment_id) => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewCommentByTempleReviewCommentId`,
            data: {
                "temple_review_comment_id": temple_review_comment_id
            },
        });
        let resData = res.data

        setDescriptionComment(resData[0].temple_review_comment_detail)
        setCommentId(resData[0].temple_review_comment_id)
        setResData(resData)
        setOpenEditComment(true);
    };

    const getTempleReviewByTempleReviewId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewByTempleReviewId`,
            data: {
                "temple_review_id": temple_review_id
            },
        });
        setReviewData(res.data.temple_review)
        setReviewPicData(res.data.temple_review_pic)
        setCommentData(res.data.temple_review_comment)
        setTempleId(res.data.temple_review[0].temple_id)
    }

    const addComment = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleReviewComment`,
            data: {
                "temple_review_id": temple_review_id,
                "temple_review_comment_detail": detailComment,
                "temple_review_comment_by": user_id,
                "temple_id": templeId
            },
        });


        if (res.data.status == "add_success") {
            resetInputField();
            setOpenSnackbar({ status: true, type: "warning", msg: "เพิ่มคอมเมนต์สำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
        }
        getTempleReviewByTempleReviewId()

    }

    const editComment = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleReviewCommentByTempleReviewCommentId`,
            data: {
                "temple_review_comment_id": commentId,
                "temple_review_comment_detail": descriptionComment,
                "temple_review_comment_by": user_id,
                "temple_review_comment_status": 2
            },
        });

        if (res.data.status == "update_success") {
            resetInputField();
            setOpenEditComment(false)
            setOpenSnackbar({ status: true, type: "warning", msg: "แก้ไขคอมเมนต์สำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });

        }
        getTempleReviewByTempleReviewId()
    }

    const deleteComment = async () => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewCommentByTempleReviewCommentId`,
            data: {
                temple_review_comment_id: idRemove
            },
        });
        setOpenDialogRemoveComment(false);
        setOpenSnackbar({ status: true, type: "warning", msg: "ลบคอมเมนต์สำเร็จ" });
        getTempleReviewByTempleReviewId()
    }

    const resetInputField = () => {
        setDetailComment("");
        setDescriptionComment("")
    };

    useEffect(() => {
        getTempleReviewByTempleReviewId()
    }, [])

    return <>
        <Layout>
            {reviewData.map((data) => (
                <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
                    <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                        <Typography variant="h5" sx={{ textAlign: "center", padding: "2%", mt: 2 }}>
                            {`รายละเอียดรีวิว `}
                            <Box
                                component="img"
                                sx={{ width: { xs: "8%", md: "4%" }, ml: { md: 1, xs: "2px" } }}
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

                        <Grid container style={{ marginTop: "3%" }}>
                            <Typography variant="h6">
                                <Box
                                    component="img"
                                    sx={{ width: { xs: "9%", md: "5%" }, mr: { md: 1, xs: "2px" } }}
                                    alt="logo"
                                    src={pagoda}
                                />
                                {` ${data.temple_name}`}
                            </Typography>
                            <Typography sx={{ mt: { md: "3%", xs: "4%" } }}>
                                <Box
                                    component="img"
                                    sx={{ width: { xs: "9%", md: "5%" }, mr: { md: 1, xs: "2px" } }}
                                    alt="logo"
                                    src={user}
                                />
                                {` โดย : ${data.user_firstname} ${data.user_lastname}`}
                            </Typography>
                        </Grid>

                        <Grid container justifyContent="center" sx={{ mt: { md: "3%", xs: "5%" } }}>
                            <Grid item md={8} xs={12}>
                                {reviewPicData == "" ?
                                    <img src="https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg" width="100%" />
                                    :
                                    <Carousel showArrows={true} autoPlay={true} interval={3000} infiniteLoop={true}>

                                        {reviewPicData.map((data) => (
                                            <div>
                                                <img src={data.temple_review_pic_url} width="100%" />
                                            </div>
                                        ))}
                                    </Carousel>
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <Box
                                    component="img"
                                    sx={{ width: { xs: "5%", md: "2.5%" }, mr: { md: 1, xs: "2px" } }}
                                    alt="logo"
                                    src={pin}
                                />
                                {data.temple_review_topic}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ padding: "3%" }}>
                            <Typography>
                                {data.temple_review_description}
                            </Typography>
                        </Grid>
                        <Typography sx={{ display: { md: "block", xs: "none" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                            _____________________________________________________________
                        </Typography>

                        <Typography sx={{ display: { md: "none", xs: "block" }, color: "#ffa000ff", fontWeight: "bold", textAlign: "center" }}>
                            __________________________________________
                        </Typography>
                        <Typography sx={{ mt: 3 }}>
                            <Box
                                component="img"
                                sx={{ width: { xs: "6%", md: "3%" }, mr: { md: 1, xs: "2px" } }}
                                alt="logo"
                                src={commentUser}
                            />
                            {` คอมเมนต์`}
                        </Typography>

                        {!user_id ? "" :
                            <Grid container justifyContent="center" style={{ marginTop: "2%" }} spacing={3}>
                                <Grid item md={9} xs={12}>
                                    <TextField
                                        label="รายละเอียด"
                                        size="small"
                                        fullWidth
                                        value={detailComment}
                                        variant="outlined"
                                        onChange={(e) => {
                                            setDetailComment(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Button
                                        color="save"
                                        fullWidth
                                        variant="contained"
                                        disabled={detailComment == "" ? true : false}
                                        onClick={() => addComment()}
                                    >
                                        เพิ่มคอมเมนต์
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                        {commentData.length == 0 ?
                            <Grid item xs={12} align="center" style={{ marginTop: "7%", marginBottom: "5%" }}>
                                <Typography>ยังไม่มีคอมเมนต์ของรีวิวนี้</Typography>
                            </Grid>
                            :
                            commentData.map((data) => (
                                <Paper>
                                    <Grid container item xs={12} justifyContent="center" sx={{ mt: { md: '3%', xs: '7%' }, marginBottom: '3%' }}>
                                        <Grid xs={10}>
                                            <div style={{ background: "white", padding: "3%" }}>

                                                <Typography style={{ color: "purple" }}><b>{data.user_firstname + " " + data.user_lastname}</b></Typography>
                                                <p> {data.temple_review_comment_detail}</p>
                                                {data.temple_review_comment_time}
                                            </div>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <div style={{ textAlign: "right" }}>
                                                {user_id == data.user_id ?
                                                    <>
                                                        <IconButton
                                                            onClick={() => handleOpenCommentDialog(data.temple_review_comment_id)}
                                                            size="large">
                                                            <Edit style={{ color: "orange" }} />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleOpenRemoveComment(data.temple_review_comment_id)}
                                                            size="large">
                                                            <DeleteIcon style={{ color: "red" }} />
                                                        </IconButton>

                                                    </>
                                                    :
                                                    ""

                                                }
                                            </div>
                                        </Grid>

                                    </Grid>
                                </Paper>

                            ))}

                        <br />
                    </Grid>
                </Grid>
            ))}

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />


            <Dialog
                open={openEditComment}
                onClose={CloseEditComment}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle >แก้ไขคอมเมนต์</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <TextField
                            fullWidth
                            value={descriptionComment}
                            variant="outlined"
                            onChange={(e) => {
                                setDescriptionComment(e.target.value)
                            }}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                    <Button onClick={CloseEditComment} style={{ color: "#636363" }}>
                        ยกเลิก
                    </Button>
                    <Button onClick={editComment} variant="contained" color="save" disabled={descriptionComment == "" ? true : false}>
                        บันทึก
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={openDialogRemoveComment}
                onClose={handleCloseRemoveComment}

            >
                <DialogTitle >ลบคอมเมนต์</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบคอมเมนต์นี้ ?</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRemoveComment} style={{ color: "gray" }}>
                        ยกเลิก
                    </Button>
                    <Button onClick={deleteComment} style={{ color: "red" }}>
                        ลบ
                    </Button>
                </DialogActions>
            </Dialog>

        </Layout>
    </>;
}

export default ReviewDetail
