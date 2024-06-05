import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/dashboard.css';

function Dashboard() {
    const [sections, setSecionts] = useState([]);
    const [sectionPages, setSectionPages] = useState([]);

    const getSections = async () => {
        const { data } = await axios.get("http://localhost:1818/api/sections");
        setSecionts(data.sections);
    }

    const setupSectionPages = (section) => {
        console.log(section)
        const totalPages = Math.ceil(section.itemIds.length / 8);
        const pages = [];

        for (let i = 0; i < totalPages; i++) {
            const startOffset = i * 8;
            pages.push(`http://localhost:3000/${section.id}/${startOffset}/${startOffset + 8}/1`);
        }

        setSectionPages(pages);
    }

    const openAllPages = () => {
        sectionPages.forEach((url) => {
            window.open(url, '_blank');
        })
    }

    useEffect(() => {
        getSections();
    }, [])

    return (
        <div className="dashboard">
            <div className="sections">
                {
                    sections && sections.length > 0 ? (
                        sections.map((section) => (
                            <div key={section.id} className="section">
                                <button onClick={() => { setupSectionPages(section) }}>View Pages of {section.name}</button>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )
                }
            </div>
            <div className="pages">
                {
                    sectionPages && sectionPages.length > 0 ? (
                        sectionPages.map((pageUrl, index) => (
                            <a color="black" target="_blank" href={pageUrl} key={index}>{pageUrl}</a>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )
                }
            </div>

            <div className="open-pages">
                {
                    sectionPages && sectionPages.length > 0 ? (
                        <button onClick={() => { openAllPages() }}>Open Section Pages</button>
                    ) : (
                        <p>Loading...</p>
                    )
                }
            </div>
        </div>
    )
}

export default Dashboard;