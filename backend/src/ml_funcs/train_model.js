import fs from 'fs';
import Papa from 'papaparse';
import * as tf from '@tensorflow/tfjs'; // Ensure you're using @tensorflow/tfjs-node
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Construct the absolute path to the CSV file
const csvFilePath = path.resolve(__dirname, 'crop_yield_data.csv');

// Function to read CSV and prepare the dataset
async function prepareData() {
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV data to JSON
    const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
    });

    const data = parsedData.data.map(row => {
        return {
            cropType: parseInt(row['crop_type']),
            cropArea: parseFloat(row['crop_area']),
            soilPH: parseFloat(row['soil_ph']),
            soilNPK: parseFloat(row['soil_npk']),
            soilOrganicMatter: parseFloat(row['soil_organic_matter']),
            irrigationMethod: parseInt(row['irrigation_method']),
            fertilizerType: parseInt(row['fertilizer_type']),
            fertilizerMethod: parseInt(row['fertilizer_method']),
            density: parseFloat(row['density']),
            yield: parseFloat(row['yield'])
        };
    });

    const X = data.map(item => [
        item.cropType,
        item.cropArea,
        item.soilPH,
        item.soilNPK,
        item.soilOrganicMatter,
        item.irrigationMethod,
        item.fertilizerType,
        item.fertilizerMethod,
        item.density
    ]);

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
    await model.save(`file:/${modelPath}`);

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
