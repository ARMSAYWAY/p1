import React, { useState, useEffect } from 'react'
import { Button, Grid, TextField, Chip, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel } from '@mui/material'
import LayoutSuperAdmin from '../../Layout/LayoutSuperAdmin';
import axios from "axios";
import { hostname } from "../../hostname";
import Snackbar from '../snackbar';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import TruncateMarkup from 'react-truncate-markup';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import Box from '@mui/material/Box';
import MUIDataTable from "mui-datatables";

function ManageTemple() {
    const [allTempleData, setAllTempleData] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [open, setOpen] = useState(false);
    const [templeDialog, setTempleDialog] = useState([])
    const [approveTempleDialog, setApproveTempleDialog] = useState(false)
    const [approveTempleData, setApproveTempleData] = useState("")

    const [deleteTempleDialog, setDeleteTempleDialog] = useState(false)
    const [deleteTempleData, setDeleteTempleData] = useState("")

    const handleOpenTempleDetail = (rowData) => {
        setOpen(true);
        setTempleDialog(rowData)
    };

    const handleCloseTempleDetail = () => {
        setOpen(false);
    };


    const handleApproveTemple = async (rowData) => {
        setApproveTempleDialog(true);
        setApproveTempleData(rowData)
    }

    const approveTemple = async () => {
        let temple_status = approveTempleData.temple_status;
        if (temple_status == 0 || temple_status == 2) {
            temple_status = 1
        }
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleByTempleId`,
            data: {
                "temple_id": approveTempleData.temple_id,
                "temple_status": temple_status,
            },
        });
        setApproveTempleDialog(false)
        setOpenSnackbar({ status: true, type: "success", msg: "????????????????????????????????????????????????" });
        getAllTempleData()
    }

    const getAllTempleData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTemple`,
            data: {},
        });

        res.data.map((item) => {
            item.fullname =
                item.user_firstname + " " + item.user_lastname

            item.filter_status =
                item.temple_status === 0 ? '???????????????????????????'
                    : item.temple_status === 1 ? '?????????????????????????????????'
                        : item.temple_status === 2 ? '??????????????????????????????????????????'
                            : ''
        })
        setAllTempleData(res.data)
    }

    const handleDeleteTemple = async (rowData) => {
        setDeleteTempleDialog(true);
        setDeleteTempleData(rowData)
    }

    const deleteTemple = async (temple_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleByTempleId`,
            data: { temple_id: temple_id },
        });
        setDeleteTempleDialog(false)
        setOpenSnackbar({ status: true, type: "success", msg: "?????????????????????????????????" });
        getAllTempleData()
    }

    useEffect(() => {
        getAllTempleData()
    }, [])

    return <>
        <LayoutSuperAdmin>
            <Box justify="center" sx={{ p: { md: '20px' } }} >
                <MUIDataTable
                    title={"????????????????????????????????????????????????????????????"}
                    data={allTempleData}
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
                            name: "temple_id",
                            label: "???????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    return (<div>{dataIndex + 1}</div>)
                                }
                            },
                        },
                        {
                            name: "temple_name",
                            label: "?????????????????????",
                        },
                        {
                            name: "temple_type_name",
                            label: "??????????????????",
                        },
                        {
                            name: "temple_address",
                            label: "?????????????????????",
                        },
                        {
                            name: "fullname",
                            label: "????????????????????????",
                        },
                        {
                            name: "temple_create_time",
                            label: "?????????????????????????????????",
                        },
                        {
                            name: "temple_description",
                            label: "??????????????????????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allTempleData[dataIndex];
                                    return (
                                        <TruncateMarkup
                                            lines={2}
                                            ellipsis={
                                                <span>
                                                    ...
                                                    {
                                                        <IconButton
                                                            style={{ padding: '0px', marginLeft: '5px' }}
                                                            onClick={() => handleOpenTempleDetail(rowData)}
                                                            size="large">
                                                            <Visibility color='gray' />
                                                        </IconButton>
                                                    }
                                                </span>
                                            }
                                        >
                                            <div>
                                                {rowData.temple_description}
                                            </div>
                                        </TruncateMarkup>
                                    );
                                }
                            }
                        },
                        {
                            name: "filter_status",
                            label: "???????????????",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allTempleData[dataIndex];
                                    return <>
                                        <Chip
                                            label={rowData.filter_status}
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    rowData.temple_status === 0 ? '#EC7063'
                                                        : rowData.temple_status === 1 ? '#58D68D'
                                                            : rowData.temple_status === 2 ? '#ffca28'
                                                                : ''
                                                ,
                                                color: 'white',
                                            }}
                                        />
                                        {
                                            rowData.temple_status == 0 || rowData.temple_status == 2 ?
                                                <IconButton
                                                    onClick={() => {
                                                        handleApproveTemple(rowData)
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
                                    let rowData = allTempleData[dataIndex];
                                    return (
                                        <IconButton
                                            onClick={() => {
                                                handleDeleteTemple(rowData)
                                            }}
                                            size="large">
                                            <Delete fontSize="medium" style={{ color: "#f50057" }} />
                                        </IconButton>
                                    );
                                }
                            }
                        },
                    ]}
                />
            </Box>

            <Dialog
                open={open}
                onClose={handleCloseTempleDetail}
                maxWidth='lg'
            >
                <DialogTitle >???????????????????????????????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <p style={{ textIndent: '2.5em', color: 'black' }}>
                            {templeDialog.temple_description}
                        </p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button variant="contained" onClick={handleCloseTempleDetail} color="primary" autoFocus>
                        ?????????
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={approveTempleDialog}
                onClose={() => { setApproveTempleDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >????????????????????????????????????????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setApproveTempleDialog(false) }} variant="outlined">
                        ?????????
                    </Button>
                    <Button
                        style={{ margin: "8px" }}
                        color="save"
                        onClick={() => {
                            approveTemple(approveTempleData.temple_id)
                        }}
                        variant="contained">
                        ????????????
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteTempleDialog}
                onClose={() => { setDeleteTempleDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >???????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>??????????????????????????????????????????????????????????????????????????????????????????????????? ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleDialog(false) }} variant="outlined">
                        ?????????
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deleteTemple(deleteTempleData.temple_id)
                        }}
                        variant="contained">
                        ????????????
                    </Button>

                </DialogActions>
            </Dialog>


            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
        </LayoutSuperAdmin>
    </>;
}

export default ManageTemple
