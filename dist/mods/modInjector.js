"use strict";
module.exports = () => {
    if (oaConfig.injectShelter === true)
        require("./shelter/injector")();
};
