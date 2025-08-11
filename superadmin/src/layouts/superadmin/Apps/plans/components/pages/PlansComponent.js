import { Grid } from "@mui/material";
import PlansModal from "../Modals/Plans";
import MUIDataTable from 'mui-datatables'

export default function PlansComponent({ Conjo, onLoad, columns, options, plans }) {
    return (
        <>
            <Grid container>
                <Grid item xs={12} mb={3} display={"flex"} justifyContent={"flex-end"}>
                    <PlansModal handleChange={onLoad} plans={plans} />
                </Grid>

                <Grid item xs={12}>
                    <MUIDataTable title={'Plans'} data={Conjo} columns={columns} options={options} />
                </Grid>
            </Grid>
        </>
    )
}