import { Component } from "preact";
import "globals";

console.log(Component);

import("dynamic").then(module => {
    console.log("Dynamic import", module);
});
