import React from 'react'
import DashboardLayout from './components/AgencyDashboardLayout/index'
// import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import SidenavRoot from './components/SidenavRoot'
import { useMaterialUIController } from 'context'
import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import ComplexStatisticsCard from './components/ComplexStatisticsCard'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import CloseIcon from '@mui/icons-material/Close'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import localforage from 'localforage'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import MDButton from 'components/MDButton'
import ThemeModal from './components/ThemeModal'
import Loader from 'examples/Loader'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useFormik } from 'formik'
import MDTypography from 'components/MDTypography'
import './components/style.css'
import { useState } from 'react'
import Sidnav from './components/Sidnav'
import Card from './components/card'
import DashboardNavbar from './components/DashboardNavbar'
import Navbar from './Navbar'
import Body from './components/Body'
import env from 'config'
import { useParams } from 'react-router-dom'
const Demo = () => {
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller
  const [openCollapse, setopenCollapse] = React.useState(false)
  const [processing, setProcessing] = useState(false)
  const [agency_data, setagency_data] = useState([])
  const [loader, setloader] = useState(true)
  const [button, setbutton] = useState(false)
  const [refresh, setrefresh] = useState(false)
  const [editname, seteditname] = useState('')
  const [handleopen, sethandleOpen] = useState({
    sidnav: false,
    cards: false,
    navbar: false,
    body: false,
  })
  let { id } = useParams()
  const navigate = useNavigate()
  const iframeStyles = {
    width: '102.5%',
    height: 'calc(100vh - 100px)',
    marginLeft: '-17px',
    marginBottom: '-27px',
    border: 'none',
  }
  const BASE_URL = `${env.API_URL}/v1`
  const [initState, setinitState] = React.useState({
    sideNavColor: 'linear-gradient(195deg, #49a3f1, #1A73E8)',
    cardsboxshadow: '',
    CategriesDropdown: false,
    GridView: false,
    bodyColor: '#fff',
    cardsBodyColor: '#fff',
    Filter: false,
    Categries: false,
    PurchaseButton: '#e91e63',
    SnapshotButton: '#1A73E8',
    cardsBodyText: '#90809A',
    cardsBodyHeading: '#7B809A',
    cardsTitle: '#334666',
    cardsFontFamily: '',
    sidnavFontFamily: '',
    ThemesidnavBg: 'linear-gradient(195deg, #42424a, #191919)',
    sideNavText: '#fff',
    sideNavCard: 'linear-gradient(195deg, #49a3f1, #1A73E8)',
  })
  const handleClick = () => {
    setopenCollapse(!openCollapse)
  }
  // const [Navbar, setNavbar] = useState({
  //   Categries: false,
  //   filter: false,
  //   GridView: false,

  // });

  const [open, setOpen] = useState({
    sidnav: false,
    cards: false,
    features: false,
    navbar: false,
    defeult_settings: false,
  })
  React.useEffect(async () => {
    var axios = require('axios')
    if (id == undefined) {
      document.documentElement.style.setProperty('--ThemesidnavBg', initState.ThemesidnavBg)
      document.documentElement.style.setProperty('--sideNavCard', initState.sideNavCard)
      document.documentElement.style.setProperty('--sideNavColor', initState.sideNavColor)
      document.documentElement.style.setProperty('--sideNavText', initState.sideNavText)
      document.documentElement.style.setProperty('--ThemeBackground', initState.bodyColor)
      document.documentElement.style.setProperty('--cardsBodyText', initState.cardsBodyText)
      document.documentElement.style.setProperty('--cardsBodyHeading', initState.cardsBodyHeading)
      document.documentElement.style.setProperty('--cardsFontFamily', initState.cardsFontFamily)
      document.documentElement.style.setProperty('--sidnavFontFamily', initState.sidnavFontFamily)
      document.documentElement.style.setProperty('--cardsTitle', initState.cardsTitle)
      document.documentElement.style.setProperty('--cardsBodyColor', initState.cardsBodyColor)
    } else {
      await axios
        .get(BASE_URL + '/snapshot/theme/filter/' + id)
        .then(async function (response) {
          // console.log(response.data.data, 'res')
          seteditname(response.data.data.name)
          document.documentElement.style.setProperty(
            '--ThemesidnavBg',
            response.data.data?.Sidnav?.sideNavType || 'linear-gradient(195deg, #42424a, #191919)'
          )
          document.documentElement.style.setProperty(
            '--sideNavCard',
            response.data.data.Cards?.background || 'linear-gradient(195deg, #49a3f1, #1A73E8)'
          )
          document.documentElement.style.setProperty(
            '--sideNavColor',
            response.data.data?.Sidnav?.sideNavColor || 'linear-gradient(195deg, #EC407A, #D81B60)'
          )
          document.documentElement.style.setProperty(
            '--sideNavText',
            response.data.data?.Sidnav?.sideNavText || '#fff'
          )
          document.documentElement.style.setProperty(
            '--ThemeBackground',
            response.data.data?.Body?.background
          )
          document.documentElement.style.setProperty(
            '--cardsBodyText',
            response.data.data?.Cards?.disTextColor
          )
          document.documentElement.style.setProperty(
            '--cardsBodyHeading',
            response.data.data?.Cards?.disHeadingColor
          )
          document.documentElement.style.setProperty(
            '--cardsFontFamily',
            response.data.data?.Cards?.FontFamily
          )
          document.documentElement.style.setProperty(
            '--sidnavFontFamily',
            response.data.data?.Sidnav?.FontFamily
          )
          document.documentElement.style.setProperty(
            '--cardsTitle',
            response.data.data?.Cards?.titleColor
          )
          document.documentElement.style.setProperty(
            '--cardsBodyColor',
            response.data.data?.Cards?.bodyColor
          )
          setinitState({
            sideNavColor:
              response.data.data?.Sidnav?.sideNavColor ||
              'linear-gradient(195deg, #EC407A, #D81B60)',
            cardsboxshadow: initState.cardsboxshadow,
            CategriesDropdown: response.data.data?.FeaturesButton?.CategriesDropdown,
            GridView: response.data.data?.FeaturesButton?.GridView,
            Filter: response.data.data?.FeaturesButton?.Filter,
            Categries: response.data.data?.navbar?.Categries,
            ThemesidnavBg:
              response.data.data?.Sidnav?.sideNavType ||
              'linear-gradient(195deg, #42424a, #191919)',
            sideNavText: response.data.data?.Sidnav?.sideNavText || '#fff',
            sideNavCard:
              response.data.data.Cards?.background || 'linear-gradient(195deg, #49a3f1, #1A73E8)',
            bodyColor: response.data.data?.Body?.background,
            PurchaseButton: initState.PurchaseButton,
            SnapshotButton: initState.SnapshotButton,
            cardsBodyText: response.data.data?.Cards?.disTextColor,
            cardsBodyHeading: response.data.data?.Cards?.disHeadingColor,
            cardsTitle: response.data.data?.Cards?.titleColor,
            cardsFontFamily: response.data.data?.Cards?.FontFamily,
            sidnavFontFamily: response.data.data?.Sidnav?.FontFamily,
            cardsBodyColor: response.data.data?.Cards?.bodyColor,
          })
        })
        .catch(function (error) {
          // console.log(error)
        })
    }
  }, [refresh])

  const handleChange = ({ key, value }) => {
    // console.log(key, value, 'change')
    var setvalue = value
    const primary = 'linear-gradient(195deg, #EC407A, #D81B60)'
    const dark = 'linear-gradient(195deg, #42424a, #191919)'
    const info = 'linear-gradient(195deg, #49a3f1, #1A73E8)'
    const success = 'linear-gradient(195deg, #66BB6A, #43A047)'
    const warning = 'linear-gradient(195deg, #FFA726, #FB8C00)'
    const error = 'linear-gradient(195deg, #EF5350, #E53935)'
    if (key == 'sideNavColor' || key == 'sidnavBg' || key == 'ThemeBackground') {
      if (value == 'primary') {
        setvalue = primary
      } else if (value == 'dark') {
        setvalue = dark
      } else if (value == 'info') {
        setvalue = info
      } else if (value == 'success') {
        setvalue = success
      } else if (value == 'warning') {
        setvalue = warning
      } else if (value == 'error') {
        setvalue = error
      } else {
        setvalue = value
      }
    } else {
      if (value == 'primary') {
        setvalue = '#D81B60'
      } else if (value == 'dark') {
        setvalue = '#191919'
      } else if (value == 'info') {
        setvalue = '#1A73E8'
      } else if (value == 'success') {
        setvalue = '#43A047'
      } else if (value == 'warning') {
        setvalue = '#FB8C00'
      } else if (value == 'error') {
        setvalue = '#E53935'
      } else {
        setvalue = value
      }
    }
    setbutton(true)
    // alert('work')
    document.documentElement.style.setProperty(`--${key}`, setvalue)

    const intial_values = {
      CategriesDropdown: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: setvalue,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      sideNavColor: () => {
        setinitState({
          sideNavColor: setvalue,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      cardsboxshadow: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: setvalue,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      ThemesidnavBg: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: setvalue,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      sideNavText: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: setvalue,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      sideNavCard: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: setvalue,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      Categries: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: setvalue,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      Filter: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: setvalue,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      GridView: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: setvalue,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      PurchaseButton: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: setvalue,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      SnapshotButton: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: setvalue,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      cardsBodyText: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: setvalue,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      cardsBodyHeading: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: setvalue,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      cardsTitle: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: setvalue,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      sidnavFontFamily: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: setvalue,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
      cardsBodyColor: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: initState.bodyColor,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: setvalue,
        })
      },
      ThemeBackground: () => {
        setinitState({
          sideNavColor: initState.sideNavColor,
          cardsboxshadow: initState.cardsboxshadow,
          CategriesDropdown: initState.CategriesDropdown,
          GridView: initState.GridView,
          Filter: initState.Filter,
          Categries: initState.Categries,
          ThemesidnavBg: initState.ThemesidnavBg,
          sideNavText: initState.sideNavText,
          sideNavCard: initState.sideNavCard,
          bodyColor: setvalue,
          PurchaseButton: initState.PurchaseButton,
          SnapshotButton: initState.SnapshotButton,
          cardsBodyText: initState.cardsBodyText,
          cardsBodyHeading: initState.cardsBodyHeading,
          cardsTitle: initState.cardsTitle,
          cardsFontFamily: initState.cardsFontFamily,
          sidnavFontFamily: initState.sidnavFontFamily,
          cardsBodyColor: initState.cardsBodyColor,
        })
      },
    }
    intial_values[key]()
    // console.log(initState, 'change')

    // update({ ...formik.values })
  }
  const handleRightbar = (type, name) => {
    var names = name
    if (type == 'open') {
      // console.log(name + type)
      document.documentElement.style.setProperty('--rightsidebar-width', '400px')
      const statedata = {
        sidnav: () => {
          sethandleOpen({ sidnav: true })
        },
        cards: () => {
          sethandleOpen({ cards: true })
        },
        navbar: () => {
          sethandleOpen({ navbar: true })
        },
        body: () => {
          sethandleOpen({ body: true })
        },
      }
      statedata[names]()
    } else {
      document.documentElement.style.setProperty('--rightsidebar-width', '0px')
    }
  }
  const handleSubmit = async (name) => {
    setProcessing(true)
    var axios = require('axios')

    const localBrand = await localforage.getItem('user')
    // const temp_data = {
    //     _id: localBrand._id,
    //     CategriesDropdown: categriesdropdown,
    //     Filter: filter,
    //     GridView: gridview,
    //     ...form
    // }
    const Sidnav = {
      TextColor: initState.sideNavText,
      FontFamily: initState.sidnavFontFamily,
      sideNavType: initState.ThemesidnavBg,
      sideNavColor: initState.sideNavColor,
    }
    const Cards = {
      background: initState.sideNavCard,
      boxShadow: initState.cardsboxshadow,
      FontFamily: initState.cardsFontFamily,
      bodyColor: initState.cardsBodyColor,
      titleColor: initState.cardsTitle,
      disHeadingColor: initState.cardsBodyHeading,
      disTextColor: initState.cardsBodyText,
      PurchaseButton: initState.PurchaseButton,
      SnapshotButton: initState.SnapshotButton,

      // boxShadow      : { type: String },
    }
    const Buttons = {
      // TextColor              : { type: String },
      // background              : { type: String },
      // borderRadius    : { type: String },
      // boxShadow      : { type: String },
    }
    const navbar = {
      Categries: initState.Categries,
    }
    const Body = {
      background: initState.bodyColor,
    }
    const FeaturesButton = {
      GridView: initState.GridView,
      Filter: initState.Filter,
      CategriesDropdown: initState.CategriesDropdown,
    }
    const data = {
      name: name,
      Sidnav: Sidnav,
      Cards: Cards,
      Buttons: Buttons,
      FeaturesButton: FeaturesButton,
      navbar: navbar,
      Body: Body,
    }

    // console.log(data, 'data')
    if (id == undefined) {
      axios
        .post(BASE_URL + '/snapshot/theme/submit', { data })
        .then(async function (response) {
          // console.log(response.data)
          setProcessing(false)
          navigate('/superadmin/selectetheme')
          setrefresh(!refresh)
        })
        .catch(function (error) {
          setProcessing(false)
        })
    } else {
      axios
        .post(BASE_URL + '/snapshot/theme/update/' + id, { data })
        .then(async function (response) {
          // console.log(response.data)
          setProcessing(false)
          navigate('/superadmin/selectetheme')

          setrefresh(!refresh)
        })
        .catch(function (error) {
          setProcessing(false)
        })
    }
  }
  return (
    <>
      <DashboardLayout handleRightbar={handleRightbar}>
        {initState.Categries == false ? (
          <>
            <MDBox>
              <SidenavRoot
                variant="permanent"
                ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
                className="demo-sidnav"
              >
                <BorderColorIcon
                  className="hover-icon-sidnav"
                  onClick={() => handleRightbar('open', 'sidnav')}
                />

                <NavLink key={'category'} to={'#'}>
                  <MDBox sx={{ display: 'flex', justifyContent: 'center', marginTop: '2.2rem' }}>
                    <ListItem
                      component="li"
                      mt={1}
                      sx={{ width: '90%', borderRadius: '0.375rem', padding: '0.5rem 0.625rem' }}
                      className="demo-sidnav-active"
                    >
                      <MDBox mt={1}>
                        <ListItemText
                          sx={{ marginLeft: '3.2rem' }}
                          primary={
                            <div
                              className="demo-sidnav-text"
                              style={{
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#fff',
                                textAlign: 'center',
                              }}
                            >
                              Everything
                            </div>
                          }
                        />
                      </MDBox>
                    </ListItem>
                  </MDBox>
                </NavLink>
                {initState.CategriesDropdown == false ? (
                  <>
                    <NavLink key={'category'} to={'#'}>
                      <MDBox
                        sx={{ display: 'flex', justifyContent: 'center', marginTop: '0.2rem' }}
                      >
                        <ListItem
                          component="li"
                          mt={1}
                          sx={{
                            width: '90%',
                            borderRadius: '0.375rem',
                            padding: '0.5rem 0.625rem',
                          }}
                          className="demo-sidnav"
                        >
                          <MDBox mt={1}>
                            <ListItemText
                              sx={{ marginLeft: '3.2rem' }}
                              primary={
                                <div
                                  className="demo-sidnav-text"
                                  style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '370',
                                    color: '#fff',
                                    textAlign: 'center',
                                  }}
                                >
                                  FB Adds
                                </div>
                              }
                            />
                          </MDBox>
                        </ListItem>
                      </MDBox>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <MDBox sx={{ display: 'flex', justifyContent: 'center', marginTop: '0.3rem' }}>
                      <ListItemButton onClick={handleClick}>
                        <ListItemText
                          primary="Categories"
                          sx={{ marginLeft: '2.5rem' }}
                          className="demo-sidnav-text"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        {openCollapse ? (
                          <ExpandLess
                            style={{ color: 'white', fontWeight: '200', fontSize: '15px' }}
                            className="demo-sidnav-text"
                          />
                        ) : (
                          <ExpandMore
                            style={{ color: 'white', fontWeight: '200', fontSize: '15px' }}
                            className="demo-sidnav-text"
                          />
                        )}
                      </ListItemButton>
                    </MDBox>

                    <Collapse
                      in={openCollapse}
                      timeout="auto"
                      unmountOnExit
                      style={{ width: '100%' }}
                    >
                      <NavLink key={'category'} to={'#'}>
                        <MDBox
                          sx={{ display: 'flex', justifyContent: 'center', marginTop: '0.2rem' }}
                        >
                          <ListItem
                            component="li"
                            mt={1}
                            sx={{
                              width: '90%',
                              borderRadius: '0.375rem',
                              padding: '0.5rem 0.625rem',
                            }}
                            className="demo-sidnav"
                          >
                            <MDBox mt={1}>
                              <ListItemText
                                sx={{ marginLeft: '3.2rem' }}
                                primary={
                                  <div
                                    className="demo-sidnav-text"
                                    style={{
                                      fontSize: '0.9rem',
                                      fontWeight: '370',
                                      color: '#fff',
                                      textAlign: 'center',
                                    }}
                                  >
                                    FB Adds
                                  </div>
                                }
                              />
                            </MDBox>
                          </ListItem>
                        </MDBox>
                      </NavLink>
                    </Collapse>
                  </>
                )}

                <NavLink
                  key={'category'}
                  to={'#'}
                  style={{ marginTop: 'auto', width: '100%', marginBottom: '15px' }}
                >
                  <MDBox sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ListItem
                      component="li"
                      mt={1}
                      sx={{
                        width: '90%',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 0.625rem',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      className="demo-sidnav-active"
                    >
                      <MDBox mt={1}>
                        <ListItemText
                          primary={
                            <div
                              className="demo-sidnav-text"
                              style={{
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#fff',
                                textAlign: 'center',
                              }}
                            >
                              Settings
                            </div>
                          }
                        />
                      </MDBox>
                    </ListItem>
                  </MDBox>
                </NavLink>
              </SidenavRoot>
            </MDBox>
          </>
        ) : (
          <></>
        )}
        <MDBox sx={{ marginLeft: initState.Categries == false ? '270px' : '0px' }}>
          <MDBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <MDButton
                      variant="gradient"
                      color="info"
                      className={button ? 'button' : ''}
                      type="submit"
                      sx={{ mt: 1, mb: 2 }}
                      loading={processing}
                      disabled={processing}
                      onClick={handleSubmit}
                    >
                      Click to {id==undefined ? 'save': 'update'} 
                    </MDButton> */}
            <ThemeModal
              handleChange={handleChange}
              id={id}
              button={button}
              handleSubmit={handleSubmit}
              processing={processing}
              editname={editname}
            />
          </MDBox>
          <DashboardNavbar
            handleOpen={() => handleRightbar('open', 'navbar')}
            initState={initState}
            handleChange={handleChange}
          />

          <Grid container>
            <Grid item xs={12} className="card-hover">
              <BorderColorIcon
                className="hover-icon-card"
                onClick={() => handleRightbar('open', 'cards')}
              />
              <MDBox mb={3} className="demo-cards">
                <ComplexStatisticsCard color="info" icon="weekend" Category="test" />
              </MDBox>
            </Grid>
          </Grid>
          <div className="superadmin-right-sidebar ">
            <div className="toogle_btn">
              <CloseIcon
                className="close-icon"
                sx={{ cursor: 'pointer' }}
                onClick={() => handleRightbar('close')}
              />
            </div>
            <MDBox sx={{ padding: 4 }}>
              {handleopen.cards == true ? <Card handleChange={handleChange} /> : <></>}
              {handleopen.body == true ? <Body handleChange={handleChange} /> : <></>}
              {handleopen.sidnav == true ? (
                <Sidnav handleChange={handleChange} agency_data={agency_data} />
              ) : (
                <></>
              )}
              {handleopen.navbar == true ? (
                <Navbar handleChange={handleChange} agency_data={agency_data} />
              ) : (
                <></>
              )}
            </MDBox>
          </div>
        </MDBox>
      </DashboardLayout>
    </>
  )
}

export default Demo
