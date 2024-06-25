// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { Stack, Duration } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');

class LambdaWithMultithreadingStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new lambda.Function(this, 'NodejsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./lambdas/nodejs'),
      timeout: Duration.seconds(10)
    });
  }
}

module.exports = { LambdaWithMultithreadingStack }
