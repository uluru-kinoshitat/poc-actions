import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import PocActions = require('../lib/poc-actions-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PocActions.CdkIamStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});