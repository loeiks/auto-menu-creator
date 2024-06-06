import { useParams } from "react-router-dom";
import '../styles/breakfastPage.css';

function BreakfastPage() {
    const { breakfastNo } = useParams();

    const getDetails = () => {
        if (breakfastNo === "1") {
            return `Black olives, green olives, feta cheese, cheddar cheese, butter, honey, nutella, boiled egg, french fries, tomato, cucumber, parsley, pencil pastry, 2 black tea.`;
        } else if (breakfastNo === "2") {
            return `Black olives, green olives, cheddar cheese, feta cheese, tomato, cucumber, parsley, spring rolls, french fries, string cheese, tomato puree, fried pepper, molasses, tahini, orange, jam, honey, nutella, 1 thermos tea. (at least for two person)`
        } else {
            return `Black olives, green olives, cheddar cheese, feta cheese, tomato, cucumber, parsley, spring rolls, french fries, string cheese, tomato puree, fried pepper, molasses, tahini, orange, jam, honey, nutella, halloumi cheese, American salad , cream cheese, pastry, extra hot menu, unlimited tea. (at least for three person)`
        }
    }

    return (
        <div className="menu-page">
            {
                breakfastNo === "1" ? (
                    <Page title="Classic Breakfast" price={9} details={getDetails()} backgroundImg="https://static.wixstatic.com/media/510eca_45fccd7255114f2bb5f6d7c168c01a97~mv2.jpg" />
                ) : breakfastNo === "2" ? (
                    <Page title="Serpme Breakfast" price={12.5} details={getDetails()} backgroundImg="https://static.wixstatic.com/media/510eca_d3f12659a1524667b398a2025ebe816b~mv2.jpg" />
                ) : breakfastNo === "3" ? (
                    <Page title="Seyidoglu Breakfast" price={16} details={getDetails()} backgroundImg="https://static.wixstatic.com/media/510eca_138993adfb834f33bd10d6d6a1a33b8a~mv2.jpg" />
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    )
}

function Page({ title, details, backgroundImg, price }) {
    return (
        <div className="breakfast-background" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.08), rgba(0,0,0,0.03), rgba(0,0,0,0.01), rgba(0,0,0,0)), url(${backgroundImg}) no-repeat center center / 101%` }}>
            <div className="page-border"></div>
            <div className="page-title-box">
                <h1 className="page-title">{title}</h1>
            </div>
            <div className="page-price-box">
                <p className="breakfast-price">*{price.toFixed(2)}€</p>
            </div>
            <div className="breakfast-details">
                <p>{details}</p>
            </div>
            <div className="price-details-box">
                <p className="person-details">Prices are for single person if you order for more price will change accordingly.</p>
            </div>
        </div>
    )
}

export default BreakfastPage;