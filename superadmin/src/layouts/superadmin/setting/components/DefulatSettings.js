import { Card, Divider, Grid, IconButton, Switch } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import { useAgencyInfo } from 'context/agency'
import { useMaterialUIController } from 'context'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useAppServices } from 'hook/services'

const DefulatSettings = () => {
    const [agency, update] = useAgencyInfo()
    const [controller] = useMaterialUIController()
    const AppService = useAppServices()

    const [processing, setProcessing] = useState(false)
    const {
        darkMode,
    } = controller

    const SidenavColors = ['primary', 'dark', 'info', 'success', 'warning', 'error']

    const initState = {
        sideNavColor: agency.sideNavColor,
        sideNavType: agency.sideNavType,
        navbarFixed: agency.navbarFixed,
        light: agency.light,
        domain: agency.domain || ''
    }
    const handleChange = ({ key, value }) => {
        formik.values[key] = value
        formik.setValues({ ...formik.values })
        update({ ...formik.values })
    }
    var axios = require('axios');
    React.useEffect(async () => {


    }, [])

    const handleSubmit = async form => {
        setProcessing(true)
        const payload = {
            _id: agency._id,
            ...form
        }

        if (form.domain != agency.domain)
            payload.domainUpdate = true

        const { response } = await AppService.agency.update({ toaster: true, payload })
        response && update({ ...payload })
        setProcessing(false)
    }

    const formik = useFormik({
        initialValues: { ...initState },
        onSubmit: handleSubmit
    })

    // sidenav type buttons styles
    const sidenavTypeButtonsStyles = ({
        functions: { pxToRem },
        palette: { white, dark, background },
        borders: { borderWidth },
    }) => ({
        height: pxToRem(39),
        background: darkMode ? background.sidenav : white.main,
        color: darkMode ? white.main : dark.main,
        border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,

        '&:hover, &:focus, &:focus:not(:hover)': {
            background: darkMode ? background.sidenav : white.main,
            color: darkMode ? white.main : dark.main,
            border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
        },
    })

    // sidenav type active button styles
    const sidenavTypeActiveButtonStyles = ({
        functions: { pxToRem, linearGradient },
        palette: { white, gradients, background },
    }) => ({
        height: pxToRem(39),
        background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
        color: darkMode ? background.sidenav : white.main,

        '&:hover, &:focus, &:focus:not(:hover)': {
            background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
            color: darkMode ? background.sidenav : white.main,
        },
    })
    return (
        <>

            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                            <Grid container mt={5} mb={5} justifyContent="center">
                                <Grid item xs={5}>
                                    <MDBox pt={4} pb={3} px={3}>
                                        <MDBox component="form" role="form" onSubmit={formik.handleSubmit} justifyContent="center" alignItems="center">
                                            <MDBox mb={2}>
                                                <MDInput
                                                    type="text"
                                                    label="Name"
                                                    name="name"
                                                    inputProps={{ readOnly: true }}
                                                    value={agency.name}
                                                    fullWidth
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDInput
                                                    type="text"
                                                    label="Domain"
                                                    name="domain"
                                                    onChange={formik.handleChange}
                                                    inputProps={{ onFocus: formik.handleBlur }}
                                                    value={formik.values.domain}
                                                    error={formik.touched.domain && formik.errors.domain}
                                                    helperText={formik.touched.domain && formik.errors.domain ? formik.errors.domain : ''}
                                                    success={formik.touched.domain && !formik.errors.domain}
                                                    fullWidth
                                                />
                                            </MDBox>
                                            <MDBox>
                                                <MDBox mb={0.5}>
                                                    <MDTypography variant="h6">Sidenav Colors</MDTypography>
                                                    {SidenavColors.map((color) => (
                                                        <IconButton
                                                            key={color}
                                                            sx={({
                                                                borders: { borderWidth },
                                                                palette: { white, dark, background },
                                                                transitions,
                                                            }) => ({
                                                                width: '24px',
                                                                height: '24px',
                                                                padding: 0,
                                                                border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
                                                                borderColor: () => {
                                                                    let borderColorValue = formik.values.sideNavColor === color && dark.main

                                                                    if (darkMode && formik.values.sideNavColor === color) {
                                                                        borderColorValue = white.main
                                                                    }

                                                                    return borderColorValue
                                                                },
                                                                transition: transitions.create('border-color', {
                                                                    easing: transitions.easing.sharp,
                                                                    duration: transitions.duration.shorter,
                                                                }),
                                                                backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                                                                    linearGradient(gradients[color].main, gradients[color].state),

                                                                '&:not(:last-child)': {
                                                                    mr: 1,
                                                                },

                                                                '&:hover, &:focus, &:active': {
                                                                    borderColor: darkMode ? white.main : dark.main,
                                                                },
                                                            })}
                                                            onClick={() => handleChange({ value: color, key: 'sideNavColor' })}
                                                        />
                                                    ))}
                                                </MDBox>
                                            </MDBox>
                                            <MDBox mt={3} lineHeight={1}>
                                                <MDTypography variant="h6">Sidenav Type</MDTypography>
                                                <MDTypography variant="button" color="text">
                                                    Choose between different sidenav types.
                                                </MDTypography>

                                                <MDBox
                                                    sx={{
                                                        display: 'flex',
                                                        mt: 2,
                                                        mr: 1,
                                                    }}
                                                >
                                                    <MDButton
                                                        color="dark"
                                                        variant="gradient"
                                                        onClick={() => handleChange({ value: 'dark', key: 'sideNavType' })}
                                                        // disabled={disabled}
                                                        fullWidth
                                                        sx={
                                                            formik.values.sideNavType == 'dark'
                                                                ? sidenavTypeActiveButtonStyles
                                                                : sidenavTypeButtonsStyles
                                                        }
                                                    >
                                                        Dark
                                                    </MDButton>
                                                    <MDBox sx={{ mx: 1, width: '8rem', minWidth: '8rem' }}>
                                                        <MDButton
                                                            color="dark"
                                                            variant="gradient"
                                                            onClick={() => handleChange({ value: 'transparent', key: 'sideNavType' })}
                                                            // disabled={disabled}
                                                            fullWidth
                                                            sx={
                                                                formik.values.sideNavType == 'transparent'
                                                                    ? sidenavTypeActiveButtonStyles
                                                                    : sidenavTypeButtonsStyles
                                                            }
                                                        >
                                                            Transparent
                                                        </MDButton>
                                                    </MDBox>
                                                    <MDButton
                                                        color="dark"
                                                        variant="gradient"
                                                        onClick={() => handleChange({ value: 'white', key: 'sideNavType' })}
                                                        // disabled={disabled}
                                                        fullWidth
                                                        sx={
                                                            formik.values.sideNavType == 'white'
                                                                ? sidenavTypeActiveButtonStyles
                                                                : sidenavTypeButtonsStyles
                                                        }
                                                    >
                                                        White
                                                    </MDButton>
                                                </MDBox>
                                            </MDBox>
                                            <MDBox
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                mt={3}
                                                lineHeight={1}
                                            >
                                                <MDTypography variant="h6">Navbar Fixed</MDTypography>

                                                <Switch
                                                    checked={formik.values.navbarFixed}
                                                    onChange={() => handleChange({ key: 'navbarFixed', value: !formik.values.navbarFixed })}
                                                />
                                            </MDBox>
                                            <Divider />
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
                                                <MDTypography variant="h6">Light / Dark</MDTypography>

                                                <Switch
                                                    checked={!formik.values.light}
                                                    onChange={() => handleChange({ key: 'light', value: !formik.values.light })}
                                                />
                                            </MDBox>
                                            <Divider />
                                            <MDBox>
                                                <MDButton
                                                    variant="gradient"
                                                    color="info"
                                                    type="submit"
                                                    sx={{ mt: 4, mb: 1 }}
                                                    loading={processing}
                                                    disabled={processing || !formik.isValid}
                                                    fullWidth
                                                >
                                                    Update
                                                </MDButton>

                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </Grid>
                            </Grid>
                     
                    </Grid>
                </Grid>
            </MDBox>
        </>
    )
}

export default DefulatSettings