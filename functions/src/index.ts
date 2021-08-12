import * as functions from "firebase-functions";

import {app} from "./app";

export const widgets = functions.https.onRequest(app);
