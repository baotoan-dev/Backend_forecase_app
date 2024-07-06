// Description: Sort children category by name alphabetically (unicode, vietnamese)

const sortChildrenCategory = (listChildrenCategory: {name: string, id: number}[]) => {
    let newList = listChildrenCategory.sort((a, b) => a.name.localeCompare(b.name));

    // move "Khác" to the end of list
    for (let i = 0; i < newList.length; i++) {
        if (newList[i].name === "Khác" || newList[i].name === "Others" || newList[i].name === "기타") {
            newList.push(newList[i]);
            newList.splice(i, 1);
            break;
        }
    }

    return newList;
}

export { sortChildrenCategory };