const sortProduct = (sortBy, orderBy) => {
    const sortByAllowed = ["name", "price"]
    const orderByAllowed = ["asc", "desc"]

    const sort = sortByAllowed.includes(String(sortBy).toLowerCase()) ? String(sortBy).toLowerCase() : "name";
    const order = orderByAllowed.includes(String(orderBy).toLowerCase()) ? String(orderBy).toLowerCase() : "asc"

    return { [sort]: order };
}

const searchProduct = (search) => {
    if (!search) return {}

    return {
        name: {
            contains: search
        }
    }
}

export {
    sortProduct,
    searchProduct
}