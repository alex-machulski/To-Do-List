import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";
import {RequestStatusType} from "../../state/app-reducer";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    entityStatus?: RequestStatusType
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null)

    const addItem = () => {
        const itemTitle = title.trim();
        if (itemTitle) {
            props.addItem(itemTitle);
        } else {
            setError("Title is required!");
        }
        setTitle("");
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) setError(null);
        if (e.key === "Enter") addItem();
    }

    return (
        <div>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                helperText={error}
                label={"New Title"}
                disabled={props.entityStatus === 'loading'}
            />
            <IconButton color={"primary"} onClick={addItem} disabled={props.entityStatus === 'loading'}>
                <AddBox/>
            </IconButton>
        </div>
    )
})

export default AddItemForm;