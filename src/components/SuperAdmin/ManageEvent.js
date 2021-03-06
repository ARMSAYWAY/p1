import React, { useState, useEffect } from 'react'
import { Button, Grid, TextField, Chip, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material'
import LayoutSuperAdmin from '../../Layout/LayoutSuperAdmin';
import axios from "axios";
import { hostname } from "../../hostname";
import Snackbar from '../snackbar';
import TextTruncate from 'react-text-truncate';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import TruncateMarkup from 'react-truncate-markup';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MUIDataTable from "mui-datatables";

function ManageEvent() {
    const [allEventData, setAllEventData] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [eventDialog, setEventDialog] = useState([])
    const [open, setOpen] = useState(false)
    const [approveEventDialog, setApproveEventDialog] = useState(false)
    const [editEventData, setEditEventData] = useState("")

    const [deleteTempleEventDialog, setDeleteTempleEventDialog] = useState(false)
    const [deleteTempleEventData, setDeleteTempleEventData] = useState("")


    const handleOpenEventDetail = (rowData) => {
        setOpen(true);
        setEventDialog(rowData)
    };

    const handleCloseEventDetail = () => {
        setOpen(false);
    };

    const handleApproveEvent = async (rowData) => {
        setApproveEventDialog(true);
        setEditEventData(rowData)
    }

    const approveEvent = async () => {
        let temple_event_status = editEventData.temple_event_status;
        if (temple_event_status == 0 || temple_event_status == 2) {
            temple_event_status = 1
        }
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleEventByTempleEventId`,
            data: {
                "temple_event_id": editEventData.temple_event_id,
                "temple_event_status": temple_event_status,
            },
        });
        setApproveEventDialog(false)
        setOpenSnackbar({ status: true, type: "success", msg: "????????????????????????????????????????????????????????????" });
        getAllEventData()
    }


    const getAllEventData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTempleEventAdmin`,
            data: {},
        });

        res.data.map((item) => {
            item.fullname =
                item.user_firstname + " " + item.user_lastname

            item.filter_status =
                item.temple_event_status === 0 ? '???????????????????????????'
                    : item.temple_event_status === 1 ? '?????????????????????????????????'
                        : item.temple_event_status === 2 ? '??????????????????????????????????????????'
                            : ''
        })
        setAllEventData(res.data)
    }

    const handleDeleteTempleEvent = async (rowData) => {
        setDeleteTempleEventDialog(true);
        setDeleteTempleEventData(rowData)
    }

    const deleteEvent = async (temple_event_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleEventByTempleEventId`,
            data: { temple_event_id: temple_event_id },
        });
        setOpenSnackbar({ status: true, type: "success", msg: "?????????????????????????????????????????????" });
        getAllEventData()
    }

    const columnStyleWithWidth = {
        top: "0px",
        left: "0px",
        zIndex: "100",
        position: "sticky",
        backgroundColor: "#fff",
        width: "300px"
    }

    useEffect(() => {
        getAllEventData()
    }, [])

    return <>
        <LayoutSuperAdmin>
            <Box justify="center" sx={{ p: { md: '20px' } }} >
                <MUIDataTable
                    title={"??????????????????????????????????????????????????????"}
                    data={allEventData}
                    options={{
                        viewColumns: false,
                        filter: false,
                        print: false,
                        download: false,
                        selectableRows: false,
                        textLabels: {
                            body: {
                                noMatch: "?????????????????????????????????",
                            },
                        },
                    }}
                    columns={[
                        {
                            name: "temple_event_id",
                            label: "???????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    return (<div>{dataIndex + 1}</div>)
                                }
                            },
                        },
                        {
                            name: "temple_event_name",
                            label: "???????????????????????????????????????",
                        },
                        {
                            name: "temple_event_description",
                            label: "??????????????????????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allEventData[dataIndex];
                                    return (
                                        <TruncateMarkup
                                            lines={2}
                                            ellipsis={
                                                <span>
                                                    ...
                                                    {
                                                        <IconButton
                                                            style={{ padding: '0px', marginLeft: '5px' }}
                                                            onClick={() => handleOpenEventDetail(rowData)}
                                                            size="large">
                                                            <Visibility color='gray' />
                                                        </IconButton>
                                                    }
                                                </span>
                                            }
                                        >
                                            <div>
                                                {rowData.temple_event_description}
                                            </div>
                                        </TruncateMarkup>
                                    );
                                }
                            }
                        },
                        {
                            name: "",
                            label: "??????????????????????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allEventData[dataIndex];
                                    return (
                                        rowData.temple_event_pic_url == null ? "-" :
                                            <img style={{ display: 'block', width: "100%" }} src={rowData.temple_event_pic_url} />
                                    )
                                }
                            },
                        },
                        {
                            name: "temple_event_start_time",
                            label: "?????????????????????????????????",
                        },
                        {
                            name: "temple_event_end_time",
                            label: "???????????????????????????????????????",
                        },
                        {
                            name: "temple_name",
                            label: "?????????????????????",
                        },
                        {
                            name: "fullname",
                            label: "????????????????????????",
                        },
                        {
                            name: "temple_event_create_time",
                            label: "?????????????????????????????????",
                        },
                        {
                            name: "filter_status",
                            label: "???????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allEventData[dataIndex];
                                    return <>
                                        <Chip
                                            label={rowData.filter_status}
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    rowData.temple_event_status === 0 ? '#EC7063'
                                                        : rowData.temple_event_status === 1 ? '#58D68D'
                                                            : rowData.temple_event_status === 2 ? '#ffca28'
                                                                : ''
                                                ,
                                                color: 'white',
                                            }}
                                        />
                                        {
                                            rowData.temple_event_status == 0 || rowData.temple_event_status == 2 ?
                                                <IconButton
                                                    onClick={() => {
                                                        handleApproveEvent(rowData)
                                                    }}
                                                    size="large">
                                                    <AssignmentTurnedInOutlinedIcon fontSize="small" style={{ color: "" }} />
                                                </IconButton>
                                                : ""
                                        }
                                    </>;
                                }
                            }
                        },
                        {
                            name: "",
                            label: "??????????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allEventData[dataIndex];
                                    return <>
                                        <IconButton
                                            onClick={() => {
                                                handleDeleteTempleEvent(rowData)
                                            }}
                                            size="large">
                                            <Delete fontSize="medium" style={{ color: "#f50057" }} />
                                        </IconButton>
                                    </>;
                                }
                            }
                        },
                    ]}
                />
            </Box>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />

            <Dialog
                open={open}
                onClose={handleCloseEventDetail}
                maxWidth='lg'
            >
                <DialogTitle >???????????????????????????????????????????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <p style={{ textIndent: '2.5em', color: 'black' }}>
                            {eventDialog.temple_event_description}
                        </p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button variant="contained" onClick={handleCloseEventDetail} color="primary" autoFocus>
                        ?????????
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={approveEventDialog}
                onClose={() => { setApproveEventDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >????????????????????????????????????????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setApproveEventDialog(false) }} variant="outlined">
                        ?????????
                    </Button>
                    <Button
                        style={{ margin: "8px" }}
                        color="save"
                        onClick={() => {
                            approveEvent(editEventData.temple_event_id)
                        }}
                        variant="contained">
                        ????????????
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteTempleEventDialog}
                onClose={() => { setDeleteTempleEventDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >???????????????????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>??????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleEventDialog(false) }} variant="outlined">
                        ?????????
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deleteEvent(deleteTempleEventData.temple_event_id)
                        }}
                        variant="contained">
                        ????????????
                    </Button>

                </DialogActions>
            </Dialog>

        </LayoutSuperAdmin>
    </>;
}

export default ManageEvent
