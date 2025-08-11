const { default: axios } = require("axios");
const {
  ServiceTitanModel,
  ServiceTitanTriggerHandlerModel,
  ServiceTitanTokensModel,
} = require("../../model");

const GetJobs = async () => {
  // console.log('jobs called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/jpm/v2/tenant/${element?.appCred?.tenant_id}/jobs`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });
    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length');
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.jobs) {
        var jobs = [...servicetitan_trigger_handler?.jobs];
      } else {
        var jobs = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.jobs?.includes(element.id)) {
        } else {
          jobs.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_job_created",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        jobs: jobs,
      };
      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          jobs: jobs,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetCustomers = async () => {
  // console.log('customers called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/crm/v2/tenant/${element?.appCred?.tenant_id}/customers`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.customers) {
        var customers = [...servicetitan_trigger_handler?.customers];
      } else {
        var customers = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.customers?.includes(element.id)) {
        } else {
          customers.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_customer",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        customers: customers,
      };
      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          customers: customers,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetAppointments = async () => {
  // console.log('leads called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/jpm/v2/tenant/${element?.appCred?.tenant_id}/appointments`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.appointments) {
        var appointments = [...servicetitan_trigger_handler?.appointments];
      } else {
        var appointments = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.appointments?.includes(element.id)) {
        } else {
          appointments.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_appointment",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        appointments: appointments,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          appointments: appointments,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetLeads = async () => {
  // console.log('leads called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/crm/v2/tenant/${element?.appCred?.tenant_id}/leads`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.leads) {
        var leads = [...servicetitan_trigger_handler?.leads];
      } else {
        var leads = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.leads?.includes(element.id)) {
        } else {
          leads.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_lead",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        leads: leads,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          leads: leads,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetBooings = async () => {
  // console.log('bookings called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/crm/v2/tenant/${element?.appCred?.tenant_id}/bookings`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.bookings) {
        var bookings = [...servicetitan_trigger_handler?.bookings];
      } else {
        var bookings = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.bookings?.includes(element.id)) {
        } else {
          bookings.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_booking",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        bookings: bookings,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          bookings: bookings,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetEstimates = async () => {
  // console.log('estimates called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/sales/v2/tenant/${element?.appCred?.tenant_id}/estimates`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.estimates) {
        var estimates = [...servicetitan_trigger_handler?.estimates];
      } else {
        var estimates = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.estimates?.includes(element.id)) {
        } else {
          estimates.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_estimate",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        estimates: estimates,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          estimates: estimates,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetInvoices = async () => {
  // console.log('invoices called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/accounting/v2/tenant/${element?.appCred?.tenant_id}/invoices`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.invoices) {
        var invoices = [...servicetitan_trigger_handler?.invoices];
      } else {
        var invoices = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.invoices?.includes(element.id)) {
        } else {
          invoices.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_invoice",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        invoices: invoices,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          invoices: invoices,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};

const GetFormSubmissions = async () => {
  // console.log('submissions called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/forms/v2/tenant/${element?.appCred?.tenant_id}/submissions`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.submissions) {
        var submissions = [...servicetitan_trigger_handler?.submissions];
      } else {
        var submissions = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.submissions?.includes(element.id)) {
        } else {
          submissions.push(element.id);
          const datawithoutarray = {
            id: element.id,
            formId: element.formId,
            formName: element.formName,
            submittedOn: element.submittedOn,
            createdById: element.createdById,
            status: element.status,
          };
          const data = {
            ...datawithoutarray,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_form_submission",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        submissions: submissions,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          submissions: submissions,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetPayments = async () => {
  // console.log('payments called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/accounting/v2/tenant/${element?.appCred?.tenant_id}/payments`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.payments) {
        var payments = [...servicetitan_trigger_handler?.payments];
      } else {
        var payments = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (servicetitan_trigger_handler?.payments?.includes(element.id)) {
        } else {
          payments.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_payment",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        payments: payments,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          payments: payments,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const GetPurchaseOrders = async () => {
  // console.log('purchase_orders called')
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });

  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];
    let data = "";
    const servicetitan_trigger_handler =
      await ServiceTitanTriggerHandlerModel.findOne({
        tenant_id: element?.appCred?.tenant_id,
      });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.servicetitan.io/inventory/v2/tenant/${element?.appCred?.tenant_id}/purchase-orders`,
      headers: {
        Authorization: element?.appCred?.access_token,
        "ST-App-Key": "ak1.aqg59oxbyokfwnkxymdjqqem4",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    // console.log(result?.data?.data?.length, 'result?.data?.data?.length')
    if (result?.data?.data) {
      if (servicetitan_trigger_handler?.purchase_orders) {
        var purchase_orders = [
          ...servicetitan_trigger_handler?.purchase_orders,
        ];
      } else {
        var purchase_orders = [];
      }
      for (let index = 0; index < result?.data?.data.length; index++) {
        const element = result?.data?.data[index];
        if (
          servicetitan_trigger_handler?.purchase_orders?.includes(element.id)
        ) {
        } else {
          purchase_orders.push(element.id);
          const data = {
            ...element,
            tenant_id: element?.appCred?.tenant_id,
            triggerKey: "service_titan_new_purchase_order",
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webhook.ghl.store/v1/servicetitantrigger/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
          const result = await axios.request(config);
        }
      }
      const payload = {
        purchase_orders: purchase_orders,
      };

      if (servicetitan_trigger_handler) {
        const update = await ServiceTitanTriggerHandlerModel.findOneAndUpdate(
          servicetitan_trigger_handler._id,
          payload
        );
      } else {
        const create_data = {
          tenant_id: element?.appCred?.tenant_id,
          purchase_orders: purchase_orders,
        };
        const create = await ServiceTitanTriggerHandlerModel.create(
          create_data
        );
      }
    }
  }
};
const TriggerHandler = async (type) => {
  // console.log(type, 'type')
  const events = {
    jobs: GetJobs,
    customers: GetCustomers,
    appointments: GetAppointments,
    leads: GetLeads,
    bookings: GetBooings,
    estimates: GetEstimates,
    invoices: GetInvoices,
    submissions: GetFormSubmissions,
    payments: GetPayments,
    purchase_orders: GetPurchaseOrders,
  };
  events[type]();
};
module.exports = {
  TriggerHandler,
};
