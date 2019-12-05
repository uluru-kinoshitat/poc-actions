import { SynthUtils } from '@aws-cdk/assert'
import { Stack, App } from '@aws-cdk/core'  
 
import { CdkIamStack } from '../lib/poc-actions-stack'
 
test('IAM Resource Stack', () => {
    const app = new App();
    const stack = new CdkIamStack(app, 'IAMTestStack');
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});