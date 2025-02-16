import fs from 'fs';
import Papa from 'papaparse';
// import * as tf from '@tensorflow/tfjs'; // Ensure you're using @tensorflow/tfjs-node
import * as tf from '@tensorflow/tfjs-node';
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Construct the absolute path to the CSV file
const csvFilePath = path.resolve(__dirname, 'crop_yield_data.csv');


function oneHotEncode(value, categories) {
    return categories.map(cat => (cat === value ? 1 : 0));
}
function labelEncode(value, categories) {
    return categories.indexOf(value); // Assign an integer based on the index in the list
}

// Function to read CSV and prepare the dataset
async function prepareData() {
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV data
    const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    // Extract unique categories
    const cropTypes = [...new Set(parsedData.data.map(row => row['crop_type']))];
    const irrigationMethods = [...new Set(parsedData.data.map(row => row['irrigation_method']))];
    const fertilizerTypes = [...new Set(parsedData.data.map(row => row['fertilizer_type']))];
    const fertilizerMethods = [...new Set(parsedData.data.map(row => row['fertilizer_method']))];

    // Convert data with label encoding
    const data = parsedData.data.map(row => ({
        cropType: labelEncode(row['crop_type'], cropTypes),
        cropArea: parseFloat(row['crop_area']),
        soilPH: parseFloat(row['soil_ph']),
        soilNPK: parseFloat(row['soil_npk']),
        soilOrganicMatter: parseFloat(row['soil_organic_matter']),
        irrigationMethod: labelEncode(row['irrigation_method'], irrigationMethods),
        fertilizerType: labelEncode(row['fertilizer_type'], fertilizerTypes),
        fertilizerMethod: labelEncode(row['fertilizer_method'], fertilizerMethods),
        density: parseFloat(row['density']),
        yield: parseFloat(row['predicted_yield_kg_m2'])
    }));

    // Prepare feature matrix
    const X = data.map(item => [
        item.cropType,  // Encoded as an integer
        item.cropArea,
        item.soilPH,
        item.soilNPK,
        item.soilOrganicMatter,
        item.irrigationMethod, // Encoded as an integer
        item.fertilizerType,   // Encoded as an integer
        item.fertilizerMethod, // Encoded as an integer
        item.density
    ]);

    console.log("Sample processed data:", X.slice(0, 5));

    const Y = data.map(item => item.yield);

    const X_tensor = tf.tensor2d(X);
    const Y_tensor = tf.tensor2d(Y, [Y.length, 1]);

    return { X_tensor, Y_tensor };
}

// Function to create a simple neural network model
function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.dense({
        units: 64,
        inputShape: [9],
        activation: 'relu'
    }));

    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu'
    }));

    model.add(tf.layers.dense({
        units: 1
    }));

    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });

    return model;
}

// Train the model and save it
async function trainModel(X_tensor, Y_tensor) {
    const model = createModel();

    await model.fit(X_tensor, Y_tensor, {
        epochs: 100,
        batchSize: 32,
        shuffle: true
    });

    const modelDir = path.dirname(csvFilePath); // This gets the directory of the CSV file
    const modelPath = path.join(modelDir, 'model'); // No `.json` extension needed

    console.log("before saving");
    await model.save(`file://${modelPath}`);
    console.log("after saving");
    console.log('Model trained and saved!');
}

// Load the trained model
async function loadModel() {
    const model = await tf.loadLayersModel(`file://${path.dirname(csvFilePath)}/model.json`);
    console.log('Model loaded successfully!');
    return model;
}

// Predict the crop yield using the trained model
async function predict(model, inputData) {
    const prediction = model.predict(tf.tensor2d([inputData]));
    prediction.print();
}

// Main function to execute training and prediction
async function main() {
    const { X_tensor, Y_tensor } = await prepareData();

    await trainModel(X_tensor, Y_tensor);

    const model = await loadModel();

    const exampleInput = [1, 100, 6.5, 40, 3.5, 0, 0, 0, 200]; // Example input
    await predict(model, exampleInput);
}

// // Run the main function
// main().catch(err => console.error(err));

export default {
    prepareData,
    createModel,
    trainModel,
    loadModel,
    predict,
    main
};
