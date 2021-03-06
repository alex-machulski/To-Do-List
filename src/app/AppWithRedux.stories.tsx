import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';
import AppWithRedux from "./AppWithRedux";

import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";

export default {
    title: 'Todolists/AppWithRedux',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator],
    argTypes: {},
} as Meta;

const Template: Story = (args) => <AppWithRedux demo={true} {...args} />;

export const AppWithReduxExample = Template.bind({});
AppWithReduxExample.args = {};
