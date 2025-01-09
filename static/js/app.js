// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // get the metadata field
    // Xpert Assistant helped me to navigate this process
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    })
  });
}

buildMetadata(940);

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    // Xpert assistant corrected my first attempt
    const otuIds = result.otu_ids;
    const otuLabels = result.otu_labels;
    const sampleValues = result.sample_values;

    // console.log("Ids:", otuIds);
    // console.log("Labels:", otuLabels);
    // console.log("Sample Values:", sampleValues);

    // Build a Bubble Chart
    let trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
      },
      text: otuLabels
      };
   
    let data1 = [trace1];

    let layout1 = {
      title: `Bacteria Cultures Per Example`,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      showlegend: false
    };

    // Render the Bubble Chart
    Plotly.newPlot("plot", data1, layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otuIdsString = otuIds.map(id => id.toString());

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Xpert Assistant made some corrections to my initital attempt
    
    let topTen = otuIds.map((id,index) => index).slice(0,10);
    let topTenSorted = topTen
    .sort((firstNum, secondNum) => sampleValues[secondNum]-sampleValues[firstNum]);

    let trace2 = {
      x: topTenSorted.map(index => sampleValues[index]),
      y: topTenSorted.map(index => otuIds[index]),
      text: topTenSorted.map(index => otuLabels[index]),
      orientation: 'h',
      hovertemplate: '<b>%{text}</b> : %{x} <extra></extra>'
      };
   
    let data2 = [trace2];

    let layout2 = {
      title: `Top 10 Bacteria Cultures Found`,
      xaxis: {title: 'Number of Bacteria'},
      yaxis: {title: 'OTU IDs'},
      showlegend: false
    };


    // Render the Bar Chart
    Plotly.newPlot("plot", data2, layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdownMenu // Xpert Assistant correction
      .append("option") // Xpert Assistant  
      .text(names[i]) //Xpert Assistant  
      .attr("value", names[i]); // Xpert Assistant 

    }

    // Get the first sample from the list
    const firstSample = data.names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
