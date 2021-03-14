import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';
import {action} from "@storybook/addon-actions";
import Task, {TaskPropsType} from "./Task";

export default {
    title: 'Todolists/Task',
    component: Task,
} as Meta;

const changeTaskStatusCallback = action("Status changed inside Task");
const changeTaskTitleCallback = action("Title changed inside Task");
const removeTaskCallback = action("Remove button inside Task clicked");

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArgs = {
    changeStatus: changeTaskStatusCallback,
    changeTaskTitle: changeTaskTitleCallback,
    removeTask: removeTaskCallback
}

// export const TaskIsDoneExample = Template.bind({});
// TaskIsDoneExample.args = {
//     ...baseArgs,
//     task: {id: '1', isDone: true, title: "JS"},
//     todolistId: "todolistId1"
// };
//
// export const TaskIsNotDoneExample = Template.bind({});
// TaskIsNotDoneExample.args = {
//     ...baseArgs,
//     task: {id: '1', isDone: false, title: "JS"},
//     todolistId: "todolistId1"
// };

