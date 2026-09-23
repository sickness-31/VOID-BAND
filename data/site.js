/*
  ====================================================================
  SITE SETTINGS
  data/site.js

  Band-specific values used by more than one page. Edit these and the
  whole site follows.

    name         shown in order emails and file names
    email        where merch orders are sent
    orderPrefix  order references look like VOID-8F3K
    currency     symbol shown before prices
    shipping     estimated postage added when someone picks Shipping.
                 Set the numbers once you've weighed a packed mailer.
                   canada / unitedStates  a number, or null to quote by email
                   other                  null = "we'll quote you"
                   freeOver               subtotal above which shipping is
                                          free. null = never free.
                 These are ESTIMATES — you confirm the real cost in your
                 reply, before anyone pays.
  ====================================================================
*/

window.SITE = {
  name: "VO!D",
  email: "void.empr@gmail.com",
  orderPrefix: "VOID",
  currency: "$",

  shipping: {
    canada: 15,
    unitedStates: 25,
    other: null,
    freeOver: null
  }
};
