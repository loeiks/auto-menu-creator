import { useState, useEffect } from "react";
import '../styles/body.css';
import '../styles/labels.css';
import '../styles/variants.css';

const variantIds = {
    "04810665-4267-461b-9ccb-b831b76299b0": "piece",
    "8944abb8-7525-454c-b691-5bd3b6719360": "portion",
    "8b379da6-ea6b-4493-a0c1-3d6c15bf74a9": "kg",
}

function Body({ items }) {
    const [products, setProducts] = useState([]);

    // Sync props to state
    useEffect(() => {
        if (items && items.length > 0) {
            setProducts(items.slice(2, 10));
        }
    }, [items]);

    const getProductPrice = (product) => {
        if (product.price) {
            return parseFloat(product.price).toFixed(2);
        } else if (product.priceVariants) {
            if (product.priceVariants.variants) {
                const portion = product.priceVariants.variants.filter((variant) => {
                    return variant.variantId === "8944abb8-7525-454c-b691-5bd3b6719360";
                })

                if (portion.length > 0) {
                    return parseFloat(portion[0].price).toFixed(2);
                } else {
                    return "undefined!";
                }
            } else {
                return "undefined!";
            }
        } else {
            return "undefined!";
        }
    }

    return (
        <div className="products">
            {products && products.length > 0 ? (
                products.map((product) => (
                    <div className="product-box" style={{ backgroundImage: `url(${product.image.url})` }} key={product.id}>
                        <FeatureLabels labels={product.labels} />
                        <ProductLabels labels={product.labels} />
                        <CustomPricing variants={product.priceVariants} />
                        <div className="info-box-padding">
                            <div className="product-info-box">
                                <p className="product-name">{product.name}</p>
                                <div className="divider"></div>
                                <p className="product-description">{product.description}</p>
                                <p className="product-price">{getProductPrice(product)}€</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
}

function CustomPricing({ variants }) {
    let content = [];

    if (variants) {
        console.log(variants);
        for (const { variantId, price } of variants["variants"]) {
            if (variantIds[variantId] === "piece") {
                content.push(
                    <div className="piece-pricing pricing-box">
                        <p>{"Piece Price: " + parseFloat(price).toFixed(2) + "€"}</p>
                    </div>
                )
            } else if (variantIds[variantId] === "kg") {
                content.push(
                    <div className="kg-pricing pricing-box">
                        <p>{"KG Price: " + parseFloat(price).toFixed(2) + "€"}</p>
                    </div>
                )
            }
        }
    }

    return (
        <div className="product-custom-pricing">{content.map((child, index) => <div key={index}>{child}</div>)}</div>
    )
}

function FeatureLabels({ labels }) {
    let content = [];

    for (const label of labels) {
        if (label.name === "NEW") {
            content.push(<div className="new-label feature-label">
                <p>NEW</p>
            </div>);
        } else if (label.name === "S") {
            content.push(
                <div className="special-label feature-label">
                    <img src={label.icon.url}></img>
                </div>
            )
        } else if (label.name === "P") {
            content.push(
                <div className="premium-label feature-label">
                    <p>Premium</p>
                </div>
            )
        }
    }

    return (
        <div className="feature-labels">{content.map((child, index) => <div key={index}>{child}</div>)}</div>
    )
}

function ProductLabels({ labels }) {
    let content = [];

    const filteredLabels = labels.filter((label) => {
        return label.name !== "NEW" && label.name !== "S" && label.name !== "P";
    });

    for (const label of filteredLabels) {
        content.push(
            <div className="product-label">
                <img src={label.icon.url}></img>
            </div>
        )
    }

    return (
        <div className="product-labels">{content.map((child, index) => <div key={index}>{child}</div>)}</div>
    )
}

export default Body;
