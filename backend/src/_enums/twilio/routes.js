const express = require("express");
const router = express.Router();

const { ReqMethods } = require("../../_enums/enums");

const { ApiErrorHandler } = require("../../_utils/handler");

const services = require("./services");

const Route = () => {
  const routes = [
    {
      method: ReqMethods.POST,
      url: "/send-message/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.SendSMS),
    },
    {
      method: ReqMethods.POST,
      url: "/send-voicecall/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.SendVoiceCall),
    },
    {
      method: ReqMethods.POST,
      url: "/send-whatsappsms/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.SendWhatsappSMS),
    },
    {
      method: ReqMethods.POST,
      url: "/listsms/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.ListSMS),
    },
    {
      method: ReqMethods.POST,
      url: "/getsms/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.GetSMS),
    },
    {
      method: ReqMethods.POST,
      url: "/deletesms/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.DeleteSMS),
    },
    {
      method: ReqMethods.POST,
      url: "/message-media/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.MessageMedia),
    },
    {
      method: ReqMethods.POST,
      url: "/create-call/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.CreateCall),
    },
    {
      method: ReqMethods.POST,
      url: "/list-call/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.ListCall),
    },
    {
      method: ReqMethods.POST,
      url: "/get-call/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.GetCall),
    },
    {
      method: ReqMethods.POST,
      url: "/delete-call/:app_id",
      middlewares: [],
      fn: ApiErrorHandler(services.DeleteCall),
    },
  ];

  for (var route of routes) {
    const { method, url, middlewares, fn } = route;

    router[method](url, ...middlewares, fn);
  }

  return router;
};

module.exports = Route();
