const sortDistrict = (
    districts:
        { 
            id: string,
            full_name: string, 
            full_name_en: string, 
            name: string }[]
) => {

    const arrayDistrict = districts.sort((a, b) => a.full_name.localeCompare(b.full_name));

    const listDistrict = new Array()
    const listDistrictSort = new Array()
    const listCity = new Array()
    const listTown = new Array()
    const listFinal = new Array()

    for (const district of arrayDistrict) {
        // filter listDistrict and list city, town
        if (district.full_name_en.indexOf('District') !== -1) {
            listDistrict.push(district)
        } else
            if (district.full_name_en.indexOf("City") !== -1) {
                listCity.push(district)
            }
            else {
                listTown.push(district)
            }
    }
    //  filter list district number
    const listDistrictNumber = listDistrict.filter(dis => dis.name.length <= 2);
    // filter list district characters
    const listDistrictChar = listDistrict.filter(disChar => disChar.name.length > 2)

    if (listDistrictNumber.length > 0) {
        //sort
        listDistrictNumber.sort(
            (a, b) => parseInt(a.name) - parseInt(b.name));

        listDistrictSort.push(...listDistrictNumber);
        listDistrictSort.push(...listDistrictChar);

    } else {

        listDistrictSort.push(...listDistrictChar)
    }

    listFinal.push(...listCity)
    listFinal.push(...listTown)

    listFinal.push(...listDistrictSort)

    return listFinal
}
export { sortDistrict }