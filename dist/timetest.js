"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const today = (0, date_fns_1.startOfDay)(new Date('2023-01-14T11:06:17.267Z'));
const tomorrow = (0, date_fns_1.endOfDay)(new Date('2023-01-13T11:06:17.267Z'));
console.log(today);
