// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const NUMBER_OF_WORKERS = 4;

export const handler = async (event) => {
    // For storing spawned workers
    const workers = [];

    // For handling partial batch processing errors
    const batchItemFailures = [];

    // Simulating messages polled from an SQS queue
    event.Records = [];
    for (let i=0; i<100; i++){
        event.Records.push({messageId: i, body: 'foobar'});
    }
        
    const messages = event.Records;

    for (let i=0; i<NUMBER_OF_WORKERS;i++){
        // No await here! The waiting will happen later
        const worker = spawnWorker(i, messages, batchItemFailures);
        workers.push(worker);
    }
    
    // This line is crucial. This is where the handler
    // waits for all workers to complete their tasks
    await Promise.all(workers);
    console.log('All done!');

    // Return messageIds of all messages that failed 
    // to process in order to retry
    return {batchItemFailures};
};

async function spawnWorker(id, messages, batchItemFailures){
    console.log(`worker.id=${id} spawning`);
    while (messages.length>0){
        const msg = messages.shift();
        console.log(`worker.id=${id} processing message`);
        try {
            // A blocking, but not CPU-intensive operation 
            await processMessage(msg);
        } catch (err){
            // If message processing failed, add it to 
            // the list of batch item failures
            batchItemFailures.push({ itemIdentifier: msg.messageId});
        }
    }
}

// A blocking, but not CPU-intensive operation 
async function processMessage(){
    return await new Promise(r=>setTimeout(r, 200));
}