const { default: axios } = require("axios");
const {
  FreeAppTokenModel,
  JobNimbusDataModel,
  TriggersModel,
  jobNimbusStatusModel,
} = require("../../model");
const { sendTrigger, upsertContact } = require("../../_utils/GhlHandler");
const sendJobUpdatedTrigger = async (triggerData, ghl, data) => {
  for (let i = 0; i < triggerData.length; i++) {
    var element = triggerData[i];
    var config = {};
    config = {
      method: "post",
      maxBodyLength: Infinity,
      url: element.triggerData.targetUrl,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ghl?.access_token}`,
        Version: "2021-04-15",
        "Content-Type": "application/json",
      },
      data: data,
    };
    const filters = element.triggerData.filters;

    let condition = false;

    if (filters.length === 0) {
      condition = true;
    } else {
      filters.forEach((filter) => {
        if (filter.id == "job_id" && filter.value === data.status_name) {
          condition = true;
        }
      });
    }
    if (condition) {
      await axios
        .request(config)
        .then((response) => {
          // console.log(
          //   JSON.stringify(
          //     response.data,
          //     "responseresponseresponseresponseresponseresponseresponseresponseresponseresponse"
          //   )
          // );
        })
        .catch((error) => {
          // console.log(error, 'errorerrorerrorerrorerror')
        });
    } else {
      // console.log("filter not match");
    }
  }
};

const getContacts = async (app_token) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://app.jobnimbus.com/api1/contacts`,
    headers: {
      Authorization: `bearer ${app_token?.credentials?.apiKey}`,
      "Content-Type": "application/json",
    },
  };

  const result = await axios
    .request(config)
    .then(async function (response) {
      //   console.log("contacts get success");
      const existingContacts = await JobNimbusDataModel.find({
        app_id: app_token.app_id,
        type: "contact",
        location_id: app_token.location_id,
      });
      const currentContactIds = new Set(
        response.data.results.map((contact) => contact.jnid)
      );

      // Check for updates and insert new records
      for (let index = 0; index < response.data.results.length; index++) {
        const element = response.data.results[index];
        const find = await JobNimbusDataModel.findOne({
          app_id: app_token.app_id,
          location_id: app_token.location_id,
          type: "contact",
          id: element.jnid,
        });

        const save_data = {
          type: "contact",
          data: element,
          id: element.jnid,
          app_id: app_token.app_id,
          company_id: app_token?.company_id,
          location_id: app_token.location_id,
        };

        if (find) {
          // console.log("contact updated");
          const triggerData = await TriggersModel.find({
            "extras.locationId": app_token?.location_id,
            "triggerData.key": "updatecontactt___",
          });
          // console.log(triggerData, "triggerData");
          const trigger = await sendTrigger(triggerData, app_token, element);

          // Compare and update if needed
          if (element?.date_status_change != find.data?.date_status_change) {
            await JobNimbusDataModel.updateOne({ id: element.jnid }, save_data);
          }
        } else {
          // Create new entry
          //   console.log("contact created");
          const triggerData = await TriggersModel.find({
            "extras.locationId": app_token?.location_id,
            "triggerData.key": "create_contactt_",
          });
          // console.log(triggerData, "triggerData");
          const trigger = await sendTrigger(triggerData, app_token, element);

          await JobNimbusDataModel.create(save_data).catch(function (error) {
            // console.log(error);
          });
        }
        // const contact_data = {
        //   name: `${element?.first_name} ${element?.last_name}`,
        //   email: element?.email,
        //   tags: ["jobnimbus"],
        //   locationId: app_token?.location_id,
        // };
        // const GhlContact = await upsertContact(app_token, contact_data);
      }

      // Check for deleted records
      for (const existingContact of existingContacts) {
        if (!currentContactIds.has(existingContact.id)) {
          const triggerData = await TriggersModel.find({
            "extras.locationId": app_token?.location_id,
            "triggerData.key": "delete_contactt_",
          });
          // console.log(triggerData, "triggerData");
          const trigger = await sendTrigger(
            triggerData,
            app_token,
            existingContact
          );
          await JobNimbusDataModel.deleteOne({ id: existingContact.id });
          //   console.log(`contact Deleted: ${existingContact.id}`);
        }
      }

      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // console.log(error, 'contacts error');
      return {
        status: 400,
        success: false,
      };
    });
};

const getJobs = async (app_token) => {
  const status = await jobNimbusStatusModel.find({
    app_id: app_token.app_id,
    location_id: app_token.location_id,
  });
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://app.jobnimbus.com/api1/jobs`,
    headers: {
      Authorization: `bearer ${app_token?.credentials?.apiKey}`,
      "Content-Type": "application/json",
    },
  };

  const result = await axios
    .request(config)
    .then(async function (response) {
      // console.log("jobs get success");
      const existingJobs = await JobNimbusDataModel.find({
        app_id: app_token.app_id,
        type: "job",
        location_id: app_token.location_id,
      });
      const currentJobIds = new Set(
        response.data.results.map((job) => job.jnid)
      );

      // Check for updates and insert new records
      for (let index = 0; index < response.data.results.length; index++) {
        const element = response.data.results[index];
        // const existingJob = existingJobs.find(job => job.id === element.jnid);
        const find = await JobNimbusDataModel.findOne({
          app_id: app_token.app_id,
          location_id: app_token.location_id,
          type: "job",
          id: element.jnid,
        });
        const save_data = {
          type: "job",
          data: element,
          id: element.jnid,
          app_id: app_token.app_id,
          company_id: app_token?.company_id,
          location_id: app_token.location_id,
        };

        if (find) {
          // Compare and update if needed
          // console.log(element?.date_status_change, 'element?.date_status_change')
          // console.log(find.data?.date_status_change, 'find.data?.date_status_change')
          if (element?.date_status_change != find.data?.date_status_change) {
            // console.log("job updated");
            const triggerData = await TriggersModel.find({
              "extras.locationId": app_token?.location_id,
              "triggerData.key": "create__jobb__",
            });
            // console.log(triggerData, "triggerData")
            const trigger = await sendJobUpdatedTrigger(
              triggerData,
              app_token,
              element
            );

            await JobNimbusDataModel.updateOne({ id: element.jnid }, save_data);
          }
        } else {
          // Create new entry
          //   console.log("job created");
          const triggerData = await TriggersModel.find({
            "extras.locationId": app_token?.location_id,
            "triggerData.key": "create__job__",
          });
          // console.log(triggerData, "triggerData")

          const trigger = await sendTrigger(triggerData, app_token, element);

          await JobNimbusDataModel.create(save_data).catch(function (error) {
            // console.log(error);
          });
        }
        const status_name = status.find(
          (item) => app_token?.credentials?.stage_status?.value == item._id
        );
        if (element?.status_name == status_name?.name) {
          const find_contact = await JobNimbusDataModel.findOne({
            app_id: app_token.app_id,
            type: "contact",
            "data.jnid": element.primary.id,
          });
          if (find_contact) {
            const contact_data = {
              name: `${find_contact?.data?.first_name} ${find_contact?.data?.last_name}`,
              email: find_contact?.data?.email,
              tags: [app_token?.credentials?.contact_tag],
              locationId: app_token?.location_id,
            };
            const GhlContact = await upsertContact(app_token, contact_data);
          }
        }
      }

      // Check for deleted records
      for (const existingJob of existingJobs) {
        if (!currentJobIds.has(existingJob.id)) {
          const triggerData = await TriggersModel.find({
            "extras.locationId": app_token?.location_id,
            "triggerData.key": "job_deleted",
          });
          // console.log(triggerData, "triggerData")
          const trigger = await sendTrigger(
            triggerData,
            app_token,
            existingJob
          );

          await JobNimbusDataModel.deleteOne({ id: existingJob.id });
          // console.log(`job Deleted: ${existingJob.id}`);
        }
      }

      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // console.log(error, 'jobs error');
      return {
        status: 400,
        success: false,
      };
    });
};

const GetJobNimbusData = async () => {
  const app_token = await FreeAppTokenModel.find({
    location_id: { $exists: true },
    "credentials.apiKey": { $exists: true },
    app_id: "66bf580ace2089d8d24758cd",
  });
  // console.log(app_token.length, "app_token.length");

  for (let index = 0; index < app_token.length; index++) {
    const element = app_token[index];
    getContacts(element);
    getJobs(element);
  }
};

module.exports = {
  GetJobNimbusData,
};
