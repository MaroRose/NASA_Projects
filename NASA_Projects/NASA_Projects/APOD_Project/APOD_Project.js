
     const apiKey = "cfriGOTqNd3Xu2tGEdkqZHSh2srC07xXrjwl2QfZ";

    document.getElementById("fetchButton").addEventListener("click", () => {
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
      
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("apodImage").src = data.url;
          document.getElementById("apodImage").alt = data.title;

          document.getElementById("explaination").textContent = data.explanation;


           console.log(data);

        })
        .catch((error) => {
          console.error("Fetch failed:", error);
        });
    });