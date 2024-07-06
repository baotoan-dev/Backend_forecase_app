import readAllProvinces from "./controller.location.readAllProvinces";
import readDistrictByProvince from "./controller.location.readDistrictsByProvince";
import readAllLocationsController from "./controller.location.readAll";
import readWardsByDistrictController from "./controller.location.readWardsByDistrict";

const locationController = {
    readAllProvinces: readAllProvinces,
    readDistrictsByProvince: readDistrictByProvince,
    readAllLocations: readAllLocationsController,
    readWardsByDistrict: readWardsByDistrictController,
};

export default locationController;
