

// Create a Program to display the latest Astronomy Picture of the Day (APOD) from NASA's API using p5.js

const apiKey = 'mUfFYCdv7xWGWqyrZsco9Bs8YSpvvRCilJ6zNxmi'; // Replace with your own NASA API key if you have one
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

function gotData(data) {
    // Reuse the container so refreshing replaces the current APOD.
    const apodDiv = select('#apod-content');
    apodDiv.html('');
    apodDiv.style('text-align', 'center');
    apodDiv.style('margin-top', '20px');
    apodDiv.style('padding', '20px');

    // Create an h1 element for the title
    const title = createElement('h1', data.title);
    title.parent(apodDiv);

    // APOD can be either an image or a video.
    const media = data.media_type === 'video'
        ? createElement('video')
        : createImg(data.url, 'Astronomy Picture of the Day');
    media.parent(apodDiv);
    media.style('max-width', '100%');
    media.style('height', 'auto');
    media.style('margin-top', '20px');
    if (data.media_type === 'video') {
        media.attribute('src', data.url);
        media.attribute('controls', '');
        media.attribute('playsinline', '');
    }

    // Create a p element for the explanation
    const explanation = createP(data.explanation);
    explanation.parent(apodDiv);
    explanation.style('margin-top', '20px');
    explanation.style('font-size', '16px');
    explanation.style('line-height', '1.5');
}

function refreshAPOD() {
    // Fetch the APOD data again
    loadJSON(apiUrl, gotData);
}


function setup() {
    noCanvas(); // We don't need a canvas for this project

    // Create the container before the asynchronous API response arrives.
    const apodDiv = createDiv();
    apodDiv.id('apod-content');

    // Fetch the APOD data when the page loads
    loadJSON(apiUrl, gotData);

    // Display 

    // Create a button to refresh the APOD
    const refreshButton = createButton('Refresh APOD');
    refreshButton.parent(document.body);
    refreshButton.style('margin-top', '20px');
    refreshButton.mousePressed(refreshAPOD);
}




