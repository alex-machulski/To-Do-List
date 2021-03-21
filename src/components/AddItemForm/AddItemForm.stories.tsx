import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { AddItemForm, AddItemFormPropsType } from "./AddItemForm"
import {action} from "@storybook/addon-actions";

export default {
    title: 'Todolists/AddItemForm',
    component: AddItemForm,
} as Meta;

const Template: Story<AddItemFormPropsType> = (args) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
    addItem: action("Button inside clicked"),
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormDisabledExample.args = {entityStatus: 'loading'};
