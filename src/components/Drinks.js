import { useState, useEffect } from "react";
import '../styles/drinks.css';

function Drinks({ items }) {
    const [drinks, setDrinks] = useState([]);

    // Sync props to state
    useEffect(() => {
        if (items && items.length > 0) {
            setDrinks(items);
        }
    }, [items]);

    return (
        <div className="drinks">
            {
                drinks && drinks.length > 0 ? (
                    drinks.map((drink) => (
                        <div className="drink-box-padding" key={drink.id}>
                            <div className="drink-box">
                                <p className="drink-name">{drink.name}</p>
                                <p className="drink-price">{parseFloat(drink.price).toFixed(2)}€</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No drinks available</p>
                )}
        </div>
    )
}

export default Drinks;