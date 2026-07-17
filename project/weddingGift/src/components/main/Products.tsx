import buildProducts from "../../controllers/products";

export default function Products() {
    const data = buildProducts();

    return (
        <>
            <div className="products">
                {data}
            </div>
        </>
    )
}