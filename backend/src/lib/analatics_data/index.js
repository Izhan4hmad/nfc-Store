const { GhlUserModel, AgencyModel, GHlLocationsModel, LoginActivityModel } = require("../../model");

const getUsers = async (company_id) => {
    return GhlUserModel.find({ company_id: company_id }).exec();
}
const getLocations = async (company_id) => {
    return GHlLocationsModel.find({ company_id: company_id }).exec();
}
const getLoginActivity = (agency_id) => {
    return LoginActivityModel.find({ agency_id: agency_id }).exec();
}
const getStripeData = async (agency_id) => {
    const agency_data = await AgencyModel.findById(agency_id);
    const stripe_key = agency_data?.stripe.key;
    const stripe = require("stripe")(stripe_key);
    const stripe_customers = await stripe.customers.list({
        limit: 100,
    })
    // Get current year
    const currentYear = new Date().getFullYear();

    // Get the first and last date of the current year
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const lastDayOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const stripe_subscriptions = await stripe.subscriptions.list({
        limit: 100,
        // status: 'active',
        created: {
            gte: Math.floor(firstDayOfYear.getTime() / 1000), // start of the year in seconds
            lte: Math.floor(lastDayOfYear.getTime() / 1000), // end of the year in seconds
        }
    });

    const stripe_charges = await stripe.charges.list({
        limit: 100,
        created: {
            gte: Math.floor(firstDayOfYear.getTime() / 1000), // start of the year in seconds
            lte: Math.floor(lastDayOfYear.getTime() / 1000), // end of the year in seconds
        }
    });

    let totalRevenue = 0;
    let recuring_revenue = 0
    const revenueByMonth = new Array(12).fill(0); // Initialize revenue for each month to 0

    // Calculate revenue from subscriptions
    stripe_subscriptions.data.forEach(subscription => {
        totalRevenue += subscription.plan.amount / 100;
        const subscriptionDate = new Date(subscription.created * 1000);
        const monthIndex = subscriptionDate.getMonth();
        revenueByMonth[monthIndex] += subscription.plan.amount / 100;
        recuring_revenue += subscription.plan.amount / 100;
    });

    // Calculate revenue from charges
    stripe_charges.data.forEach(charge => {
        if (charge.status === 'succeeded') {
            totalRevenue += charge.amount / 100;
            const chargeDate = new Date(charge.created * 1000);
            const monthIndex = chargeDate.getMonth();
            revenueByMonth[monthIndex] += charge.amount / 100;
        }
    });
    const stripe_data = {
        stripe_customers: stripe_customers,
        stripe_subscriptions: stripe_subscriptions,
        stripe_charges: stripe_charges,
        totalRevenue: totalRevenue,
        revenueByMonth: revenueByMonth,
        recuring_revenue: recuring_revenue,
    }
    return stripe_data
};
const AllData = async (agency_id, company_id) => {
    const data = {
        users: await getUsers(company_id),
        locations: await getLocations(company_id),
        login_activity: await getLoginActivity(agency_id),
        stripe_data: await getStripeData(agency_id),
    }
    return data
}
module.exports = {
    AllData
};