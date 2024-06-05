const imagesBySectionId = {
    "25a2bd15-8349-46cc-a32d-e7560cdfeed4": "https://static.wixstatic.com/media/510eca_f5c9d4a061ed4a82a3ee7189b7509c42~mv2.jpg",
    "ed334ed7-f315-4911-8b0d-53b8c795ba22": "https://static.wixstatic.com/media/510eca_60b75913c68241bcbf24882101d5f113~mv2.png"
}

export function getImageBySectionId(sectionId) {
    return imagesBySectionId[sectionId];
}